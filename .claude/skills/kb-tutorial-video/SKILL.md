---
name: kb-tutorial-video
description: End-to-end pipeline for producing a KB tutorial video and refreshing its article — record an AhaSlides product-tour webm from a JSON scenario, tighten it, append the standard branded outro, upload to YouTube, embed it as a playable block in the GitBook KB article, and update the article's steps against the recorded UI. Use this whenever the user asks to make/record/generate/refresh a video for a KB article, create an onboarding or walkthrough video for a feature, upload a tutorial to YouTube, or add/embed a video in the knowledge base — even if they only mention one phase (recording, trimming, uploading, embedding, or article updates), since the phases share setup and gotchas documented here. Designed to be run per-article across many articles.
---

# KB Tutorial Video Pipeline

Proven end-to-end on `using-the-word-cloud-slide.md` (approved r6/r7 quality
bar — see AKB-17). Also proven on `creating-a-poll-question-on-ahaslides.md`
(result: https://www.youtube.com/watch?v=GK6fQhHYybo, 0:48). Run the phases
in order, one article at a time.

Recording workspace: `~/AhaSlides/onboarding-videos/` (playwright + chromium +
`ffmpeg-static` installed; recorder scripts copied from the
`aha-onboarding-video` plugin — they MUST run from this dir because ESM
resolves `playwright` relative to the script location). The local
`scripts/record-onboarding.mjs` carries two patches the plugin lacks: a
per-step `pauseMs` field (extra settle time before acting) and a sanitized
healed-scenario filename for remote mode.

## Approved Quality Bar — Word Cloud Video (AKB-17)

The Word Cloud tutorial (AKB-17) established the approved quality standard.
Every new KB tutorial video must meet these same criteria before upload:

| Quality gate | Standard |
|---|---|
| Voice | Single narrator only — **Liam** (`VCgLBmBjldJmfphyB8sZ`) throughout. Do NOT alternate or mix voices in a single tutorial. |
| VO sync | Voiceover tightly synced to visuals. No freeze-padding to cover audio desync. Each clip's `start_sec` must place it at the matching visual beat. |
| Preview / results views | Slide Preview (audience view) must show populated, realistic results — not an empty blank frame. Use `previewInteractions` in the scenario to submit sample words/answers during recording. |
| Results view language | Participant-facing UI (audience view, results screen) must be in English — not Vietnamese or any other locale from a test account. Verify by sampling frames from the results-view step. |
| Ending | Scenario ends with a `prompt` step so the visual fades out on an intentional editor state (not a half-loaded page). Audio ends with 1–1.5s of silence after the last VO clip. |
| Audio tail | Visual duration must be ≥ audio end time + 0.3s. Use `tpad` freeze-last-frame if needed to add tail room. Target ≤1.5s tail. |
| Outro | Standard branded outro appended as the final ~3s — see Phase 3c below. Non-negotiable. |

These rules were hard-won across six re-records (AKB-17). Deviating from them
requires an explicit sign-off in the task note.

## Phase 1 — Author the scenario

Read `references/scenario-authoring.md` in this skill directory for the full
scenario JSON schema, step-type reference, SPA-navigation constraints,
selector discovery patterns, and the `previewInteractions` recipe (audience
participation in Preview). Keep this summary in mind:

- Scenarios live at `scenarios/<article-slug>.json` (1:1 with articles,
  version-controlled here — commit alongside the article).
- Derive steps from what the article teaches; write tooltip `description` copy
  in brand voice (load `aha-branding-tone-voice` when drafting it).
- **Key constraint:** a step's target must be on screen when the step starts,
  and must not unmount itself on click (causes tour stall — reproduced twice).
  See scenario-authoring.md for the full constraints list and workarounds.

## Phase 2 — Record (remote mode only)

```bash
cd ~/AhaSlides/onboarding-videos && rm -rf out && \
source /Users/claude/.claude/plugins/cache/aha-claude-plugins/aha-onboarding-video/*/skills/record-onboarding-video/test-env.sh && \
SCENARIO_FILE=$PWD/scenarios/<slug>.json \
WORKER_URL=https://aha-onboarding-scenario-host.ahaslides-game.workers.dev \
BASE_URL='https://ab214fb69c15de4b3d300d0e323bc3a4d29327d6.presenter.sandbox.ahaslide.com/apps/presentations' \
OUT_DIR=$PWD/out node scripts/record-remote-tour.mjs
```

Never use local mode (`STEPS_FILE` + `onboarding=<key>` only) — the app
renders its built-in tour, not yours, and everything desyncs.

Verify before moving on: the log must say `walk finished — N/N step(s)
executed`. Visually check `out/shots/step-*.png` with the Read tool.
Preserve good takes before re-running (`mv out out-<label>`) — each run
wipes `OUT_DIR`. Tours create REAL presentations on the sandbox test
account; accepted, don't clean up.

**Spotlight verification:** Read `references/spotlight-dialog-handling.md`
(or invoke the `kb-spotlight-dialog` sub-skill) before verifying any take
that involves a dialog or image upload. The checklist there covers the
`.aha-modal__content` vs `.modal-crop-image` distinction and the 3-step
dialog pattern — missing this caused real re-records (r4/r5 on Pin on Image).

Quick checklist before moving on:
- [ ] Every step's spotlight covers the key mouse action.
- [ ] No step's spotlight lands on background UI while a foreground dialog is open.
- [ ] `final URL` in the log has no `?presenting=true` (preview exit fluke, 1-in-3 occurrence).

## Phase 3 — Trim (always)

Use the bundled script — it does both passes in one re-encode:
`scripts/trim_video.py` (relative to this skill). Run it FROM the recording
workspace so it finds `node_modules/ffmpeg-static/ffmpeg`.

1. Find where the boot loader ends — the app's emoji loader runs anywhere
   from 3s to 20s+ at the start. CAUTION: the same loader appears a SECOND
   time mid-video (editor loading after "create presentation") — don't mistake
   it for the boot loader and over-cut the welcome/create steps. Extract 1fps
   frames to inspect with your eyes (pixel-variance heuristics misread the
   light dashboard UI as blank):

   ```bash
   node_modules/ffmpeg-static/ffmpeg -i out/<take>.webm -t 25 -vf fps=1 /tmp/frames/f%02d.png
   ```

2. Trim (use `--dry-run` first):

   ```bash
   python3 <skill-dir>/scripts/trim_video.py out/<take>.webm out/<slug>-final.webm \
     --boot-cut <loader-end>
   ```

   The script freeze-detects at a strict threshold, merges spans, keeps the
   first 1.7s + last 0.3s of each static stretch, folds in the boot cut, and
   re-encodes VP9 once (stream copy seeks badly on Playwright's
   sparse-keyframe webms).

3. Verify: sample one frame every ~6s — every step's tooltip must appear,
   and the first frame at 0.5s must show the WELCOME step on the dashboard
   (if it shows a later step, the boot cut ate the opening). If pacing feels
   rushed, re-trim with `--keep-head 2.5`.

On the poll take this went 1:58 raw → 0:48 final (68s was literally frozen
frames: heal gaps, loading waits, tooltip holds).

## Phase 3b — Voiceover (optional but recommended)

Invoke the `kb-video-voiceover` sub-skill for the full voiceover pipeline —
it is the single source of truth for approved voices, the render script, the
ffmpeg mix command, overlap checking, and the macOS `say` fallback.

Quick reference (see `kb-video-voiceover` SKILL.md for details):
- Use **Liam** (`VCgLBmBjldJmfphyB8sZ`) as the single narrator. Do NOT use Alice or any other voice — the approved bar (AKB-17) is single-voice Liam.
- API key: `ahaslides-kb/.env` → `ELEVENLABS_API_KEY` (never print/echo it).
- Run the overlap checker before mixing and again after — both passes must report `RESULT: PASS`.
- Overlap checker: `scripts/check_vo_overlap.py` in this skill's `scripts/` directory.

## Phase 3c — Append the standard branded outro (required)

Every KB tutorial video must end with the AhaSlides branded outro. This is
the Type D sign-off scene defined in the `aha-video-branding` skill —
Radical Purple background with AhaSlides logo and tagline.

### Outro asset

**Primary asset:** `public/outro/splash_intro_BD.webm` — the official Remotion-rendered
branded outro (VP9 WebM with alpha, 78 frames / 2.6s at 30fps). Source file on Google
Drive folder `1mcB3ekD6FPRJ73ofMeN6_4kDgfL2Ndii`. If this asset is available locally,
use it directly. It provides the animated blob/splash intro matching the Remotion brand spec.

**Fallback (if Drive file unavailable):** Generate a static branded outro with ffmpeg
using the assets in `.claude/plugins/marketplaces/aha-claude-plugins/plugins/aha-video-branding/skills/aha-video-branding/assets/`:

```python
# Step 1 — build the outro frame (run once; save to a shared path)
from PIL import Image
import subprocess, os

ASSETS = "/Users/claude/.claude/plugins/marketplaces/aha-claude-plugins/plugins/aha-video-branding/skills/aha-video-branding/assets"
VIDEO_W, VIDEO_H = <match tutorial resolution>   # e.g. 1440, 900

# Scale bg-alt-purple.png to match the tutorial's resolution
bg = Image.open(f"{ASSETS}/bg-alt-purple.png").convert("RGB").resize((VIDEO_W, VIDEO_H), Image.LANCZOS)

# Overlay the white logo at top-right, 24px from each edge, 62px tall
subprocess.run(["rsvg-convert", "-h", "62", f"{ASSETS}/Ahaslides-Logo-White.svg",
                "-o", "/tmp/aha-logo-white-62.png"])
logo = Image.open("/tmp/aha-logo-white-62.png").convert("RGBA")
bg.paste(logo, (VIDEO_W - logo.width - 24, 24), logo)
bg.save("/tmp/aha-outro-frame.png")
```

```bash
# Step 2 — render the outro clip (3s, matching tutorial fps)
FFMPEG=./node_modules/ffmpeg-static/ffmpeg
FONT_BOLD="/Users/claude/Library/Fonts/PlusJakartaSans-ExtraBold.ttf"
FONT_REG="/Users/claude/Library/Fonts/PlusJakartaSans-Regular.ttf"

$FFMPEG -y \
  -loop 1 -i /tmp/aha-outro-frame.png \
  -vf "drawtext=fontfile='$FONT_BOLD':text='Make every session count':fontsize=64:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2+40:alpha=0.95,\
       drawtext=fontfile='$FONT_REG':text='ahaslides.com':fontsize=26:fontcolor='white@0.65':x=(w-text_w)/2:y=(h-text_h)/2+120:alpha=0.9,\
       fade=t=in:st=0:d=0.4:alpha=0,fade=t=out:st=2.6:d=0.4" \
  -t 3.0 \
  -c:v libvpx-vp9 -b:v 0 -crf 33 -r <tutorial_fps> \
  -an \
  /tmp/aha-outro-video.webm
```

### Concatenating outro onto the tutorial

The outro must be the same resolution, fps, and pixel format as the tutorial
clip. Use `filter_complex` concat (not the `-f concat` demuxer) to normalize
format and add a silent audio track to the outro:

```bash
FFMPEG=./node_modules/ffmpeg-static/ffmpeg
TUTORIAL=out-<slug>/narrated.webm
OUTRO=/tmp/aha-outro-video.webm   # or splash_intro_BD.webm if available

$FFMPEG -y \
  -i "$TUTORIAL" \
  -i "$OUTRO" \
  -filter_complex \
    "[0:v]format=yuv420p[v0];[1:v]format=yuv420p[v1];\
     [v0][0:a][v1][1:a]concat=n=2:v=1:a=1[vout][aout]" \
  -map "[vout]" -map "[aout]" \
  -c:v libvpx-vp9 -b:v 0 -crf 33 -r <fps> \
  -c:a libopus -ar 48000 \
  out-<slug>/narrated-with-outro.webm
```

Note: `[1:a]` assumes the outro already has an audio stream. If the outro is
video-only, add `-f lavfi -i anullsrc=r=48000:cl=mono` as a third input and
use `[2:a]` for the outro audio track.

### Reusable outro asset path

A pre-rendered, reusable outro clip lives at (once produced):
`~/AhaSlides/onboarding-videos/aha-outro-reusable.webm`

If it does not exist yet, produce it once from the steps above and save it
there. All subsequent videos concat from this path. The resolution must be
re-matched to each tutorial (if tutorials vary in resolution, produce a 1440x900
and a 1280x720 variant and pick the right one).

## Phase 4 — Upload to YouTube

Read `references/upload-embed.md` for the full upload workflow, auth
quirks, channel IDs, and housekeeping notes.

### Chapters (required — YouTube rejects < 3 chapters or any chapter < 10s)

After upload, add compliant chapters to every video using the bundled script:
`scripts/youtube_chapters.py` in this skill's `scripts/` directory.

```bash
# VALIDATE a hand-crafted chapter file:
python3 <skill-dir>/scripts/youtube_chapters.py validate chapters.txt \
    --video-duration <total_seconds>

# DERIVE a compliant chapter list from the voiceover JSON (auto-merges short steps):
python3 <skill-dir>/scripts/youtube_chapters.py derive \
    scenarios/<slug>-voiceover.json

# DRY-RUN the description update (shows what would be written):
python3 <skill-dir>/scripts/youtube_chapters.py upload \
    --video-id <VIDEO_ID> --chapters chapters.txt \
    --access-token <TOKEN> --video-duration <seconds> --dry-run

# UPLOAD chapters to YouTube (requires youtube.force-ssl scope):
python3 <skill-dir>/scripts/youtube_chapters.py upload \
    --video-id <VIDEO_ID> --chapters chapters.txt \
    --access-token <TOKEN> --video-duration <seconds>
```

YouTube's rules enforced by the script:
- First chapter MUST be `0:00`.
- At least 3 chapters.
- Every chapter MUST be >= 10 seconds long.
- Timestamps must be strictly ascending.
- Format: `M:SS Title` or `H:MM:SS Title`.

The script's `derive` command reads `display_text` from each voiceover step and
greedy-merges adjacent steps until every group is >= 10s, producing a valid
baseline. Rename the chapter titles to human-readable labels before uploading.

**Auth note:** `videos.update` (used by the `upload` command) requires the
`youtube.force-ssl` scope. The `youtube-uploader` MCP's `authenticate` tool
hardcodes only `youtube.upload + youtube.readonly` — it CANNOT obtain
`force-ssl`. If chapters or captions fail with 403, Chau must open the
manual auth URL below and paste back the `code=` value to `accesstoken`:

```
https://accounts.google.com/o/oauth2/auth?client_id=246925459518-vgaado7j62ngu64amnfs27ji54bolanj.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.force-ssl+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly&access_type=offline&prompt=consent&state=force-ssl-reauth
```

## Phase 5 — Embed and refresh the article

Read `references/upload-embed.md` for embed block syntax, article refresh
rules (step copy, dead links, image stubs, frontmatter), commit/push flow,
and the Zoho divergence note.

## Article Writing Checklist

Apply these rules to every article you write or update.

### Slide type names are proper nouns — always capitalise

AhaSlides slide type names are proper nouns and must be capitalised in prose.

| Wrong | Correct |
|---|---|
| the poll slide | the Poll slide |
| a brainstorm slide | a Brainstorm slide |
| the content slide | the Content slide |
| the word cloud slide | the Word Cloud slide |
| rating scale slides | Rating Scale slides |

**Full list:** Poll, Brainstorm, Categorise, Content, Correct Order, Match
Pairs, Open Ended, Ranking, Rating Scale, Spinner Wheel, Word Cloud, Q&A,
Idea Board, Pick Answer, YouTube.

**Scope:** `<article> <type> slide` and `<article> <type> type` constructions.
Generic category descriptors like "quiz slide" are NOT slide-type names and
stay lowercase. The rule applies to prose, headings, `summary:`, and
`description:` — NOT to YAML `tags:`/`keywords:` arrays.

### Lint script — run before every commit

```bash
./scripts/lint-slide-names.sh
```

Exits 0 if clean; exits 1 with offending lines if violations found. To add
as a pre-commit hook:

```bash
echo '#!/bin/sh
cd "$(git rev-parse --show-toplevel)" && ./scripts/lint-slide-names.sh' \
  > .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
```
