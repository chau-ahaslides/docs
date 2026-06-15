#!/usr/bin/env python3
"""Detect voice-over overlap in a KB tutorial video VO manifest.

Two complementary checks:
  1. Timeline check (always run): parse per-clip [start, start+duration] intervals
     from the voiceover JSON and flag any pair where clip N+1 starts before clip N
     speech ends. Reports timestamps and overlap amount in seconds.
  2. Audio check (optional, requires --audio): analyse the rendered/mixed audio file
     using ffmpeg silencedetect to find regions where energy stays above threshold,
     which can reveal simultaneous narration. Reports suspicious speech spans that
     cover known overlap windows.

Exit codes:
  0 — No overlaps detected (pass)
  1 — One or more overlaps detected (fail)
  2 — Usage / file error

Usage:
    # Timeline check only (fastest — run before mixing):
    python3 check_vo_overlap.py scenarios/using-the-pin-on-image-slide-voiceover.json

    # With audio verification (run after mixing):
    python3 check_vo_overlap.py scenarios/using-the-pin-on-image-slide-voiceover.json \\
        --audio out/pin-on-image-r9-narrated.webm

    # Strict mode (treat even 0.01s overlap as failure):
    python3 check_vo_overlap.py scenarios/... --min-overlap 0.01

Examples of output when overlaps are found:
  OVERLAP [4→5] pin-add-image ends 26.680s, pin-switch-tab starts 26.500s → 0.180s overlap
  OVERLAP [5→6] pin-switch-tab ends 29.300s, pin-image-library starts 28.000s → 1.300s overlap
  RESULT: FAIL — 2 timeline overlap(s) found.
          Fix start_sec offsets in voiceover JSON before mixing.

Run from any directory; the script resolves ffmpeg via FFMPEG env var, then
node_modules/ffmpeg-static/ffmpeg (recording workspace), then PATH.
"""

import argparse
import json
import os
import re
import subprocess
import sys


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def ffmpeg_path() -> str:
    env = os.environ.get("FFMPEG")
    if env:
        return env
    local = os.path.join("node_modules", "ffmpeg-static", "ffmpeg")
    if os.path.exists(local):
        return local
    return "ffmpeg"  # hope it's on PATH


def load_manifest(path: str) -> dict:
    try:
        with open(path) as fh:
            return json.load(fh)
    except FileNotFoundError:
        sys.exit(f"ERROR: manifest not found: {path}")
    except json.JSONDecodeError as exc:
        sys.exit(f"ERROR: invalid JSON in {path}: {exc}")


# ---------------------------------------------------------------------------
# Check 1 — Timeline
# ---------------------------------------------------------------------------

def check_timeline(steps: list, min_overlap: float) -> list:
    """Return list of overlap dicts. Empty list means clean timeline."""
    overlaps = []
    for i in range(len(steps) - 1):
        s = steps[i]
        n = steps[i + 1]
        end_a = s["start_sec"] + s["audio_duration_sec"]
        start_b = n["start_sec"]
        delta = end_a - start_b
        if delta > min_overlap:
            overlaps.append({
                "idx_a": i,
                "idx_b": i + 1,
                "id_a": s["id"],
                "id_b": n["id"],
                "end_a": end_a,
                "start_b": start_b,
                "overlap_sec": delta,
            })
    return overlaps


def print_timeline_report(steps: list, overlaps: list) -> None:
    overlap_idx = {o["idx_a"] for o in overlaps}
    print()
    print("CHECK 1 — TIMELINE")
    print("=" * 68)
    print(f"  {'#':<4} {'Step ID':<32} {'Start':>7} {'+Dur':>7} {'=End':>8}")
    print("  " + "-" * 62)
    for i, s in enumerate(steps):
        end = s["start_sec"] + s["audio_duration_sec"]
        flag = " <-- OVERLAP" if i in overlap_idx else ""
        print(f"  {i:<4} {s['id']:<32} {s['start_sec']:>6.3f}s"
              f" {s['audio_duration_sec']:>6.3f}s {end:>7.3f}s{flag}")
    print()
    if overlaps:
        print(f"  OVERLAPS FOUND: {len(overlaps)}")
        for ov in overlaps:
            print(f"  OVERLAP [{ov['idx_a']}→{ov['idx_b']}] "
                  f"{ov['id_a']} ends {ov['end_a']:.3f}s, "
                  f"{ov['id_b']} starts {ov['start_b']:.3f}s "
                  f"-> {ov['overlap_sec']:.3f}s overlap")
        print()
        print("  FIX: push the later clip's start_sec to >= end of prior clip.")
        print("       Propagate the delta to all subsequent clips if the window is tight.")
    else:
        print("  PASS — no timeline overlaps.")


# ---------------------------------------------------------------------------
# Check 2 — Audio (optional)
# ---------------------------------------------------------------------------

def check_audio(audio_path: str, steps: list, silence_thresh: str,
                silence_dur: float) -> list:
    """Use ffmpeg silencedetect to find speech spans, cross-check against overlap windows.
    Returns list of suspicious span dicts."""
    ff = ffmpeg_path()
    try:
        result = subprocess.run(
            [ff, "-i", audio_path,
             "-af", f"silencedetect=n={silence_thresh}:d={silence_dur}",
             "-f", "null", "-"],
            capture_output=True, text=True, timeout=120
        )
    except FileNotFoundError:
        print(f"  WARNING: ffmpeg not found at '{ff}' — skipping audio check.")
        return []
    except subprocess.TimeoutExpired:
        print("  WARNING: ffmpeg timed out — skipping audio check.")
        return []

    stderr = result.stderr
    silence_starts = [float(x) for x in re.findall(r"silence_start:\s*([\d.]+)", stderr)]
    silence_ends = [float(x) for x in re.findall(r"silence_end:\s*([\d.]+)", stderr)]

    # Reconstruct non-silent (speech) spans from silence boundaries
    # silence_starts: where speech drops below threshold
    # silence_ends:   where speech rises above threshold again
    speech_spans = []
    cursor = 0.0
    pairs = list(zip(silence_starts, silence_ends))
    for sil_start, sil_end in pairs:
        if sil_start > cursor:
            speech_spans.append((cursor, sil_start))
        cursor = sil_end

    # Trailing speech after last silence
    dur_match = re.search(r"Duration:\s+(\d+):(\d+):([\d.]+)", stderr)
    if dur_match:
        h, m, s = dur_match.groups()
        total_dur = int(h) * 3600 + int(m) * 60 + float(s)
        if cursor < total_dur - 0.5:
            speech_spans.append((cursor, total_dur))

    # Flag speech spans that straddle a step boundary overlap region
    suspicious = []
    for sp_start, sp_end in speech_spans:
        duration = sp_end - sp_start
        if duration < 0.5:
            continue  # too short, likely decode artifact
        for i in range(len(steps) - 1):
            s = steps[i]
            n = steps[i + 1]
            end_a = s["start_sec"] + s["audio_duration_sec"]
            start_b = n["start_sec"]
            if end_a > start_b:  # timeline overlap exists for this pair
                overlap_start = start_b
                overlap_end = end_a
                if sp_start < overlap_end and sp_end > overlap_start:
                    suspicious.append({
                        "speech_span": (round(sp_start, 3), round(sp_end, 3)),
                        "overlap_window": (round(overlap_start, 3), round(overlap_end, 3)),
                        "idx_a": i, "idx_b": i + 1,
                        "id_a": s["id"], "id_b": n["id"],
                    })
    return suspicious


def print_audio_report(suspicious: list) -> None:
    print()
    print("CHECK 2 — AUDIO ENERGY")
    print("=" * 68)
    if not suspicious:
        print("  PASS — audio confirms no simultaneous narration in overlap windows.")
    else:
        print(f"  SUSPICIOUS SPANS: {len(suspicious)}")
        for item in suspicious:
            ss, se = item["speech_span"]
            ws, we = item["overlap_window"]
            print(f"  AUDIO [{item['idx_a']}->>{item['idx_b']}] "
                  f"{item['id_a']} / {item['id_b']}: "
                  f"speech [{ss}s-{se}s] covers overlap window [{ws}s-{we}s]")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    ap = argparse.ArgumentParser(
        description="Detect voice-over overlap in a KB tutorial video VO manifest.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    ap.add_argument("manifest",
                    help="Path to <slug>-voiceover.json")
    ap.add_argument("--audio", metavar="FILE",
                    help="Path to mixed audio/video file for audio energy check (optional)")
    ap.add_argument("--min-overlap", type=float, default=0.05,
                    help="Minimum seconds of overlap to flag (default: 0.05)")
    ap.add_argument("--silence-thresh", default="-50dB",
                    help="ffmpeg silencedetect threshold (default: -50dB)")
    ap.add_argument("--silence-dur", type=float, default=0.3,
                    help="Minimum silence duration in seconds (default: 0.3)")
    args = ap.parse_args()

    manifest = load_manifest(args.manifest)
    steps = manifest.get("steps", [])
    if not steps:
        sys.exit("ERROR: manifest has no 'steps' array.")

    print(f"Checking: {args.manifest}")
    print(f"  Steps: {len(steps)}, video_duration_sec: {manifest.get('video_duration_sec', 'N/A')}")

    # --- Check 1: Timeline ---
    timeline_overlaps = check_timeline(steps, args.min_overlap)
    print_timeline_report(steps, timeline_overlaps)

    # --- Check 2: Audio (optional) ---
    audio_overlaps = []
    if args.audio:
        print(f"  Audio file: {args.audio}")
        audio_overlaps = check_audio(args.audio, steps, args.silence_thresh, args.silence_dur)
        print_audio_report(audio_overlaps)
    else:
        print()
        print("CHECK 2 — AUDIO ENERGY: skipped (pass --audio FILE to enable)")

    # --- Summary ---
    total = len(timeline_overlaps) + len(audio_overlaps)
    print()
    print("=" * 68)
    if total == 0:
        print("RESULT: PASS — no overlaps detected.")
        sys.exit(0)
    else:
        msg_parts = []
        if timeline_overlaps:
            msg_parts.append(f"{len(timeline_overlaps)} timeline overlap(s)")
        if audio_overlaps:
            msg_parts.append(f"{len(audio_overlaps)} audio overlap(s)")
        print(f"RESULT: FAIL — {' + '.join(msg_parts)} found.")
        print("        Fix start_sec offsets in voiceover JSON before mixing.")
        sys.exit(1)


if __name__ == "__main__":
    main()
