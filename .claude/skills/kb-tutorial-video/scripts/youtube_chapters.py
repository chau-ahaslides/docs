#!/usr/bin/env python3
"""YouTube chapter list validator and uploader for KB tutorial videos.

YouTube's chapter requirements (all must pass before uploading):
  1. First chapter MUST start at 0:00.
  2. At least 3 chapters required.
  3. Each chapter MUST be >= 10 seconds long (gap to next chapter must be >= 10s;
     last chapter gap is measured to video_duration_sec).
  4. Timestamps must be strictly ascending.
  5. Format: M:SS Title  OR  H:MM:SS Title  (no zero-padding on hours/minutes).

This script has three modes:

  VALIDATE — check a chapter list file against YouTube rules:
    python3 youtube_chapters.py validate chapters.txt [--video-duration 46.62]

  DERIVE — auto-generate a compliant chapter list from a voiceover JSON by
  merging too-short adjacent steps until every chapter is >= MIN_CHAPTER_SEC:
    python3 youtube_chapters.py derive scenarios/foo-voiceover.json

  UPLOAD — update a video's description with a chapter block, preserving any
  existing text above it (uses YouTube Data API v3 videos.update):
    python3 youtube_chapters.py upload --video-id PeAS2yPtA_0 \
        --chapters chapters.txt --access-token ya29.xxx

Exit codes:
  0  — success / validation passed
  1  — validation failure or API error
  2  — usage / file error

Chapter list file format (one per line, blank lines and #-comments ignored):
  0:00 Introduction
  0:10 Build your slide
  0:36 Present and results

When using UPLOAD without --chapters, the script reads from stdin.

Dependencies (stdlib only for validate/derive; requests for upload):
  pip install requests   # only needed for the UPLOAD command
"""

import argparse
import json
import re
import sys
from typing import NamedTuple

# --------------------------------------------------------------------------
# Constants
# --------------------------------------------------------------------------

MIN_CHAPTER_SEC = 10  # YouTube enforces >= 10s per chapter
MIN_CHAPTERS = 3      # YouTube requires at least 3

TIMESTAMP_RE = re.compile(
    r"^(?:(?P<hours>\d+):)?(?P<minutes>\d{1,2}):(?P<seconds>\d{2})$"
)

# --------------------------------------------------------------------------
# Data types
# --------------------------------------------------------------------------


class Chapter(NamedTuple):
    ts_str: str    # "0:00", "1:23", "1:23:45"
    title: str
    seconds: float  # parsed total seconds


# --------------------------------------------------------------------------
# Parsing
# --------------------------------------------------------------------------


def parse_timestamp(ts: str) -> float:
    """Parse 'M:SS' or 'H:MM:SS' into total seconds. Raises ValueError on bad format."""
    m = TIMESTAMP_RE.match(ts.strip())
    if not m:
        raise ValueError(f"Invalid timestamp format: '{ts}' — expected M:SS or H:MM:SS")
    hours = int(m.group("hours") or 0)
    minutes = int(m.group("minutes"))
    seconds = int(m.group("seconds"))
    if minutes >= 60:
        raise ValueError(f"Minutes must be < 60, got {minutes} in '{ts}'")
    if seconds >= 60:
        raise ValueError(f"Seconds must be < 60, got {seconds} in '{ts}'")
    return hours * 3600 + minutes * 60 + seconds


def format_timestamp(total_seconds: float) -> str:
    """Format total seconds into YouTube chapter timestamp string (M:SS or H:MM:SS)."""
    ts = int(total_seconds)
    h = ts // 3600
    m = (ts % 3600) // 60
    s = ts % 60
    if h > 0:
        return f"{h}:{m:02d}:{s:02d}"
    return f"{m}:{s:02d}"


def parse_chapter_file(lines: list[str]) -> list[Chapter]:
    """Parse a list of text lines into Chapter objects. Ignores blanks and #-comments."""
    chapters = []
    for raw_line in lines:
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split(None, 1)
        if len(parts) < 2:
            raise ValueError(
                f"Bad chapter line: '{line}' — expected '<timestamp> <title>'"
            )
        ts_str, title = parts[0], parts[1].strip()
        if not title:
            raise ValueError(f"Chapter at {ts_str} has no title")
        seconds = parse_timestamp(ts_str)
        chapters.append(Chapter(ts_str=ts_str, title=title, seconds=seconds))
    return chapters


def load_chapter_file(path: str) -> list[Chapter]:
    try:
        with open(path) as fh:
            return parse_chapter_file(fh.readlines())
    except FileNotFoundError:
        sys.exit(f"ERROR: chapter file not found: {path}")
    except ValueError as exc:
        sys.exit(f"ERROR parsing chapter file: {exc}")


# --------------------------------------------------------------------------
# Validation
# --------------------------------------------------------------------------


def validate_chapters(
    chapters: list[Chapter],
    video_duration_sec: float | None = None,
) -> list[str]:
    """Return a list of violation strings. Empty list = pass."""
    errors = []

    if len(chapters) < MIN_CHAPTERS:
        errors.append(
            f"Too few chapters: {len(chapters)} (YouTube requires >= {MIN_CHAPTERS})"
        )
        # No further checks make sense without enough chapters
        return errors

    # Rule 1: first timestamp must be 0:00
    if chapters[0].seconds != 0.0:
        errors.append(
            f"First chapter must start at 0:00, got '{chapters[0].ts_str}'"
        )

    # Rule 2: strictly ascending
    for i in range(len(chapters) - 1):
        if chapters[i + 1].seconds <= chapters[i].seconds:
            errors.append(
                f"Chapter {i + 1} ('{chapters[i + 1].ts_str}') is not after "
                f"chapter {i} ('{chapters[i].ts_str}') — timestamps must be strictly ascending"
            )

    # Rule 3: each chapter >= MIN_CHAPTER_SEC
    for i, ch in enumerate(chapters):
        if i < len(chapters) - 1:
            gap = chapters[i + 1].seconds - ch.seconds
            if gap < MIN_CHAPTER_SEC:
                errors.append(
                    f"Chapter {i} '{ch.title}' is only {gap:.1f}s long "
                    f"(YouTube requires >= {MIN_CHAPTER_SEC}s per chapter)"
                )
        else:
            # Last chapter: check against video duration if provided
            if video_duration_sec is not None:
                gap = video_duration_sec - ch.seconds
                if gap < MIN_CHAPTER_SEC:
                    errors.append(
                        f"Last chapter '{ch.title}' is only {gap:.1f}s long "
                        f"(YouTube requires >= {MIN_CHAPTER_SEC}s; video ends at {video_duration_sec}s)"
                    )

    return errors


def cmd_validate(args: argparse.Namespace) -> int:
    if args.chapter_file == "-":
        lines = sys.stdin.readlines()
        try:
            chapters = parse_chapter_file(lines)
        except ValueError as exc:
            print(f"ERROR: {exc}", file=sys.stderr)
            return 2
    else:
        chapters = load_chapter_file(args.chapter_file)

    print(f"Loaded {len(chapters)} chapter(s):")
    for i, ch in enumerate(chapters):
        print(f"  {i:2d}. {ch.ts_str:10s} {ch.title}")

    errors = validate_chapters(chapters, video_duration_sec=args.video_duration)

    if errors:
        print(f"\nFAIL — {len(errors)} violation(s):")
        for err in errors:
            print(f"  - {err}")
        return 1
    else:
        print("\nPASS — chapter list meets YouTube requirements.")
        return 0


# --------------------------------------------------------------------------
# Derive from voiceover JSON
# --------------------------------------------------------------------------


def derive_chapters_from_voiceover(
    manifest: dict,
    min_sec: int = MIN_CHAPTER_SEC,
) -> list[Chapter]:
    """Merge steps into groups where each group is >= min_sec, returning Chapters.

    Strategy: iterate steps in order. Start a new group at step 0. For each
    subsequent step, if the current group's duration is < min_sec, extend it
    (merge this step in). When the group hits >= min_sec, close it and start
    a new group. After all steps, check the last group: if it's < min_sec,
    merge it back into the prior group. Name each group after the LAST step
    merged into it (that step's VO text or id).
    """
    steps = manifest.get("steps", [])
    video_dur = manifest.get("video_duration_sec")
    if not steps:
        sys.exit("ERROR: manifest has no 'steps' array")

    # Build (start_sec, end_sec, label) for each step
    step_spans = []
    for s in steps:
        start = float(s["start_sec"])
        end = start + float(s["audio_duration_sec"])
        # Use voiceover text if available, otherwise the id
        label = s.get("display_text") or s.get("text") or s.get("id", f"step-{len(step_spans)}")
        step_spans.append((start, end, label))

    total_dur = video_dur or step_spans[-1][1]

    # Greedy merge: keep growing the current group until it hits min_sec
    groups = []  # list of (group_start, group_end, last_step_label)
    group_start = step_spans[0][0]
    group_end = step_spans[0][1]
    group_label = step_spans[0][2]

    for start, end, label in step_spans[1:]:
        group_dur = group_end - group_start
        if group_dur < min_sec:
            # Not long enough yet — extend the group
            group_end = end
            group_label = label
        else:
            # Close the current group, start a new one
            groups.append((group_start, group_end, group_label))
            group_start = start
            group_end = end
            group_label = label

    # Flush the last group
    groups.append((group_start, group_end, group_label))

    # If the last group is < min_sec AND there's a prior group, merge back
    if len(groups) >= 2:
        last_start, last_end, last_label = groups[-1]
        last_dur = total_dur - last_start
        if last_dur < min_sec:
            prev_start, prev_end, prev_label = groups[-2]
            groups[-2] = (prev_start, last_end, last_label)
            groups.pop()

    # Convert to Chapters
    chapters = []
    for i, (gstart, gend, label) in enumerate(groups):
        ts_str = format_timestamp(gstart)
        # Truncate long labels
        title = label[:60].strip()
        if not title:
            title = f"Part {i + 1}"
        chapters.append(Chapter(ts_str=ts_str, title=title, seconds=gstart))

    return chapters


def cmd_derive(args: argparse.Namespace) -> int:
    try:
        with open(args.manifest) as fh:
            manifest = json.load(fh)
    except FileNotFoundError:
        print(f"ERROR: manifest not found: {args.manifest}", file=sys.stderr)
        return 2
    except json.JSONDecodeError as exc:
        print(f"ERROR: invalid JSON: {exc}", file=sys.stderr)
        return 2

    video_dur = manifest.get("video_duration_sec")
    print(f"Deriving chapters from: {args.manifest}")
    print(f"  Steps: {len(manifest.get('steps', []))}, video_duration_sec: {video_dur}")

    chapters = derive_chapters_from_voiceover(manifest, min_sec=args.min_chapter_sec)

    print(f"\nDerived {len(chapters)} chapter(s) (min {args.min_chapter_sec}s each):")
    for i, ch in enumerate(chapters):
        next_sec = chapters[i + 1].seconds if i + 1 < len(chapters) else (video_dur or 0)
        dur = next_sec - ch.seconds
        print(f"  {ch.ts_str:10s} {ch.title}  [{dur:.1f}s]")

    errors = validate_chapters(chapters, video_duration_sec=video_dur)
    if errors:
        print(f"\nWARNING — derived chapters still have violations:")
        for err in errors:
            print(f"  - {err}")
    else:
        print(f"\nPASS — all derived chapters meet YouTube requirements.")

    if args.output:
        with open(args.output, "w") as fh:
            for ch in chapters:
                fh.write(f"{ch.ts_str} {ch.title}\n")
        print(f"\nWritten to: {args.output}")
    else:
        print("\nChapter list (paste into --chapters file or video description):")
        for ch in chapters:
            print(f"{ch.ts_str} {ch.title}")

    return 0 if not errors else 1


# --------------------------------------------------------------------------
# Upload (videos.update)
# --------------------------------------------------------------------------


CHAPTER_BLOCK_MARKER = "--- chapters ---"
CHAPTER_BLOCK_END = "--- end chapters ---"


def build_description_with_chapters(
    existing_description: str,
    chapters: list[Chapter],
) -> str:
    """Replace or append a chapter block in the video description.

    The chapter block is delimited by CHAPTER_BLOCK_MARKER / CHAPTER_BLOCK_END
    comment lines (so we can find and replace it cleanly on re-runs). If no
    block is found, the chapter list is appended at the end.

    YouTube reads chapter timestamps from the description body — they don't need
    to be in a special section. The markers just help us locate our own block.
    """
    # Build the replacement block
    chapter_lines = "\n".join(f"{ch.ts_str} {ch.title}" for ch in chapters)
    new_block = f"{CHAPTER_BLOCK_MARKER}\n{chapter_lines}\n{CHAPTER_BLOCK_END}"

    # Replace existing block if present
    pattern = re.compile(
        rf"{re.escape(CHAPTER_BLOCK_MARKER)}.*?{re.escape(CHAPTER_BLOCK_END)}",
        re.DOTALL,
    )
    if pattern.search(existing_description):
        return pattern.sub(new_block, existing_description)

    # Append
    if existing_description.strip():
        return existing_description.rstrip() + "\n\n" + new_block
    return new_block


def youtube_videos_get(video_id: str, access_token: str) -> dict:
    """GET videos?part=snippet for video_id. Returns the video resource."""
    try:
        import requests
    except ImportError:
        sys.exit("ERROR: 'requests' library required for upload. Run: pip install requests")

    resp = requests.get(
        "https://www.googleapis.com/youtube/v3/videos",
        params={"part": "snippet", "id": video_id},
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=30,
    )
    if resp.status_code == 401:
        sys.exit(
            "ERROR 401 Unauthorized — access token is expired or missing youtube.force-ssl scope.\n"
            "Re-authenticate via the youtube-uploader MCP's 'authenticate' tool with scopes:\n"
            "  https://www.googleapis.com/auth/youtube.force-ssl\n"
            "  https://www.googleapis.com/auth/youtube.upload\n"
            "  https://www.googleapis.com/auth/youtube.readonly"
        )
    if not resp.ok:
        sys.exit(f"ERROR {resp.status_code} fetching video: {resp.text}")

    data = resp.json()
    items = data.get("items", [])
    if not items:
        sys.exit(f"ERROR: video {video_id!r} not found or not accessible")
    return items[0]


def youtube_videos_update(video_id: str, snippet: dict, access_token: str) -> dict:
    """PUT videos?part=snippet with the updated snippet. Returns the updated resource."""
    try:
        import requests
    except ImportError:
        sys.exit("ERROR: 'requests' library required for upload. Run: pip install requests")

    resp = requests.put(
        "https://www.googleapis.com/youtube/v3/videos",
        params={"part": "snippet"},
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
        json={"id": video_id, "snippet": snippet},
        timeout=30,
    )
    if resp.status_code == 401:
        sys.exit(
            "ERROR 401 Unauthorized — access token is expired or missing youtube.force-ssl scope.\n"
            "The videos.update endpoint requires the youtube.force-ssl scope.\n"
            "Re-authenticate via the youtube-uploader MCP's 'authenticate' tool."
        )
    if resp.status_code == 403:
        body = resp.json()
        reason = body.get("error", {}).get("errors", [{}])[0].get("reason", "")
        if reason == "forbidden":
            sys.exit(
                "ERROR 403 Forbidden — youtube.force-ssl scope is missing from this token.\n"
                "Current token only has youtube.upload + youtube.readonly.\n"
                "Re-authenticate to add youtube.force-ssl, then retry."
            )
        sys.exit(f"ERROR 403: {resp.text}")
    if not resp.ok:
        sys.exit(f"ERROR {resp.status_code} updating video: {resp.text}")
    return resp.json()


def cmd_upload(args: argparse.Namespace) -> int:
    # Load and validate chapters
    if args.chapter_file == "-":
        lines = sys.stdin.readlines()
        try:
            chapters = parse_chapter_file(lines)
        except ValueError as exc:
            print(f"ERROR: {exc}", file=sys.stderr)
            return 2
    else:
        chapters = load_chapter_file(args.chapter_file)

    errors = validate_chapters(chapters, video_duration_sec=args.video_duration)
    if errors:
        print(f"FAIL — chapter list has {len(errors)} violation(s):")
        for err in errors:
            print(f"  - {err}")
        print("Fix the chapter list before uploading.")
        return 1

    print(f"Chapter list: {len(chapters)} chapters — PASS")

    # Fetch current description
    print(f"Fetching current description for video: {args.video_id}")
    video = youtube_videos_get(args.video_id, args.access_token)
    snippet = video["snippet"]
    old_desc = snippet.get("description", "")
    print(f"  Current description ({len(old_desc)} chars):")
    for line in old_desc.splitlines()[:10]:
        print(f"    {line}")
    if len(old_desc.splitlines()) > 10:
        print(f"    ... ({len(old_desc.splitlines())} lines total)")

    # Build new description
    new_desc = build_description_with_chapters(old_desc, chapters)

    if args.dry_run:
        print("\n[DRY RUN] Would update description to:")
        for line in new_desc.splitlines():
            print(f"  {line}")
        return 0

    # Update
    snippet["description"] = new_desc
    print("\nUpdating description via YouTube videos.update...")
    updated = youtube_videos_update(args.video_id, snippet, args.access_token)
    updated_desc = updated.get("snippet", {}).get("description", "")
    print(f"  Updated description ({len(updated_desc)} chars) — OK")
    print("\nChapters now live:")
    for ch in chapters:
        print(f"  {ch.ts_str} {ch.title}")
    return 0


# --------------------------------------------------------------------------
# Entry point
# --------------------------------------------------------------------------


def main() -> None:
    ap = argparse.ArgumentParser(
        description="Validate, derive, and upload YouTube chapter lists for KB tutorial videos.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    sub = ap.add_subparsers(dest="command", required=True)

    # --- validate ---
    p_val = sub.add_parser(
        "validate",
        help="Check a chapter list file against YouTube rules.",
    )
    p_val.add_argument(
        "chapter_file",
        help="Path to chapter list file (or '-' for stdin)",
    )
    p_val.add_argument(
        "--video-duration",
        type=float,
        default=None,
        metavar="SEC",
        help="Video duration in seconds — used to check the last chapter's length",
    )

    # --- derive ---
    p_der = sub.add_parser(
        "derive",
        help="Auto-generate a compliant chapter list from a voiceover JSON manifest.",
    )
    p_der.add_argument(
        "manifest",
        help="Path to <slug>-voiceover.json",
    )
    p_der.add_argument(
        "--min-chapter-sec",
        type=int,
        default=MIN_CHAPTER_SEC,
        metavar="SEC",
        help=f"Minimum seconds per chapter (default: {MIN_CHAPTER_SEC})",
    )
    p_der.add_argument(
        "--output",
        "-o",
        default=None,
        metavar="FILE",
        help="Write derived chapter list to this file",
    )

    # --- upload ---
    p_up = sub.add_parser(
        "upload",
        help="Update a YouTube video's description with a chapter block.",
    )
    p_up.add_argument(
        "--video-id",
        required=True,
        metavar="ID",
        help="YouTube video ID (e.g. PeAS2yPtA_0)",
    )
    p_up.add_argument(
        "--chapters",
        dest="chapter_file",
        required=True,
        metavar="FILE",
        help="Path to chapter list file (or '-' for stdin)",
    )
    p_up.add_argument(
        "--access-token",
        required=True,
        metavar="TOKEN",
        help="YouTube OAuth2 access token with youtube.force-ssl scope",
    )
    p_up.add_argument(
        "--video-duration",
        type=float,
        default=None,
        metavar="SEC",
        help="Video duration in seconds — enables last-chapter length check",
    )
    p_up.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be written without calling the API",
    )

    args = ap.parse_args()

    if args.command == "validate":
        sys.exit(cmd_validate(args))
    elif args.command == "derive":
        sys.exit(cmd_derive(args))
    elif args.command == "upload":
        sys.exit(cmd_upload(args))
    else:
        ap.print_help()
        sys.exit(2)


if __name__ == "__main__":
    main()
