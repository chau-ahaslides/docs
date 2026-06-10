#!/usr/bin/env python3
"""Tighten a recorded tour webm: cut the boot loader and cap static stretches.

Usage:
    python3 trim_video.py IN.webm OUT.webm [--boot-cut SECONDS]
                          [--keep-head 1.7] [--keep-tail 0.3]
                          [--noise -55dB] [--min-freeze 1.8] [--dry-run]

Run from the recording workspace (~/AhaSlides/onboarding-videos) so the
default ffmpeg path resolves, or set FFMPEG=/path/to/ffmpeg.

What it does (one re-encode total):
  1. freezedetect finds spans where frames are literally identical
     (default -55dB is strict on purpose: typing and cursor motion still
     count as movement, so only true dead time is flagged).
  2. Spans separated by <0.3s of "motion" (decoder noise) are merged.
  3. Each long span keeps its first --keep-head and last --keep-tail seconds
     (tooltips stay readable); the middle is cut. --boot-cut N also removes
     the first N seconds (the app's emoji loader).
  4. One ffmpeg pass applies all cuts via select= and re-encodes VP9
     (stream copy is not an option: Playwright webms have sparse keyframes).

Always verify the result: sample a frame every ~6s and check every step's
tooltip still appears.
"""
import argparse
import os
import re
import subprocess
import sys

VP9_FLAGS = ["-c:v", "libvpx-vp9", "-crf", "32", "-b:v", "0",
             "-cpu-used", "4", "-row-mt", "1", "-an"]


def ffmpeg_path():
    env = os.environ.get("FFMPEG")
    if env:
        return env
    local = os.path.join("node_modules", "ffmpeg-static", "ffmpeg")
    if os.path.exists(local):
        return local
    return "ffmpeg"  # hope it's on PATH


def duration_of(ff, path):
    out = subprocess.run([ff, "-i", path], capture_output=True, text=True).stderr
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", out)
    if not m:
        sys.exit(f"could not read duration of {path}")
    h, mnt, s = m.groups()
    return int(h) * 3600 + int(mnt) * 60 + float(s)


def detect_freezes(ff, path, noise, min_freeze):
    out = subprocess.run(
        [ff, "-i", path, "-vf", f"freezedetect=n={noise}:d={min_freeze}",
         "-map", "0:v", "-f", "null", "-"],
        capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"freeze_start: ([\d.]+)", out)]
    ends = [float(x) for x in re.findall(r"freeze_end: ([\d.]+)", out)]
    # an unclosed trailing freeze has a start but no end — close it at EOF
    if len(starts) == len(ends) + 1:
        ends.append(duration_of(ff, path))
    return list(zip(starts, ends))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("output")
    ap.add_argument("--boot-cut", type=float, default=0.0,
                    help="cut this many seconds off the start (app loader)")
    ap.add_argument("--keep-head", type=float, default=1.7)
    ap.add_argument("--keep-tail", type=float, default=0.3)
    ap.add_argument("--noise", default="-55dB")
    ap.add_argument("--min-freeze", type=float, default=1.8)
    ap.add_argument("--dry-run", action="store_true",
                    help="print the cut list and exit without encoding")
    args = ap.parse_args()

    ff = ffmpeg_path()
    spans = detect_freezes(ff, args.input, args.noise, args.min_freeze)

    merged = []
    for s, e in spans:
        if merged and s - merged[-1][1] < 0.3:
            merged[-1] = (merged[-1][0], e)
        else:
            merged.append((s, e))

    keep = args.keep_head + args.keep_tail
    cuts = [(s + args.keep_head, e - args.keep_tail)
            for s, e in merged if (e - s) > keep + 0.5]
    if args.boot_cut > 0:
        cuts.insert(0, (0.0, args.boot_cut))
    # merge overlapping cuts (the boot cut usually overlaps the loader's
    # own freeze span) so the estimate is honest and the expr stays small
    cuts.sort()
    flat = []
    for s, e in cuts:
        if flat and s <= flat[-1][1]:
            flat[-1] = (flat[-1][0], max(flat[-1][1], e))
        else:
            flat.append((s, e))
    cuts = flat

    total_cut = sum(e - s for s, e in cuts)
    src_dur = duration_of(ff, args.input)
    print(f"static spans: {[(round(s,1), round(e,1)) for s, e in merged]}")
    print(f"cuts:         {[(round(s,1), round(e,1)) for s, e in cuts]}")
    print(f"cutting {total_cut:.1f}s of {src_dur:.1f}s "
          f"-> ~{src_dur - total_cut:.1f}s")
    if args.dry_run:
        return
    if not cuts:
        print("nothing to cut; copying via re-encode anyway for consistency")

    expr = "+".join(f"between(t,{s:.2f},{e:.2f})" for s, e in cuts) or "0"
    vf = f"select='not({expr})',setpts=N/FRAME_RATE/TB"
    subprocess.run([ff, "-i", args.input, "-vf", vf, *VP9_FLAGS,
                    "-loglevel", "error", "-y", args.output], check=True)
    print(f"wrote {args.output} ({duration_of(ff, args.output):.1f}s)")


if __name__ == "__main__":
    main()
