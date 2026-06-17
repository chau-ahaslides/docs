---
name: kb-tutorial-video
description: "Unscored Interactive Slide video tutorial pipeline — end-to-end pipeline for producing KB tutorial videos covering UNSCORED interactive AhaSlides slide types (Word Cloud, Q&A, Brainstorm, Open-ended, Match Pairs, Correct Order, Spinner Wheel, Categorise, Pin on Image, Rating Scale, Ranking, Idea Board, and similar). Covers recording a product-tour webm from a JSON scenario, trimming, voiceover, branded outro, YouTube chapter markers, upload, embedding in the GitBook KB article, and article step refreshes. Use this whenever the user asks to make/record/generate/refresh a video for a KB article about any UNSCORED interactive slide, upload a tutorial to YouTube, or add/embed a video in the knowledge base. NOTE: SCORED quiz-style slides (Quiz / scored multiple-choice with leaderboard, points, timer) are a separate tutorial approach handled by a different skill (companion 'scored quiz tutorial' skill — future)."
---

# KB Tutorial Video Pipeline — Unscored Interactive Slides

## Scope: Unscored Interactive Slides only

This pipeline is for **unscored interactive** AhaSlides slide types. These are
slides where the audience participates freely — submitting words, answers,
rankings, or positions — with no points, no leaderboard, and no timer.

**In scope (this skill):**
Word Cloud, Q&A, Brainstorm, Open-ended, Match Pairs, Correct Order, Spinner
Wheel, Categorise, Pin on Image, Rating Scale, Ranking, Idea Board, Poll (when
used without scoring).

**Out of scope (separate skill — scored quiz tutorial, future):**
Quiz slides and any multiple-choice slide configured with scoring (points,
leaderboard, countdown timer). Scored tutorials follow a different structure
(score reveal, leaderboard animation, timer countdown) and require their own
pipeline documentation. A companion "scored quiz tutorial" skill is the intended
counterpart to this one — create it when the first scored-quiz video is
produced.

---

Proven end-to-end on `using-the-word-cloud-slide.md` (approved r8 quality
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
| Chapter markers | YouTube chapter markers derived and stored BEFORE upload — `<slug>.chapters.txt` + `youtube_chapters` field in voiceover JSON. ≥3 chapters, each ≥10s, first at `0:00`. See Phase 3d below. |

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
the official animated AhaSlides splash/blob scene — 2.6s at 25fps, Radical
Purple background, animated logo reveal.

### Outro asset

**Primary asset (committed to repo):** `.claude/skills/kb-tutorial-video/assets/splash_intro_BD.webm`

This is the canonical reusable outro for all KB tutorial videos. It is a
VP9 WebM at 1440x900 25fps, converted from the official Remotion-rendered
`splash_intro_BD.mov` (QuickTime qtrle, 1920x1080, 25fps, 2.6s) supplied
by Chau in AKB-17 r8. Committed file size: ~112 KB. It carries a real
**audio stream** (opus stereo 48kHz), so the normal concat keeps the VO intact.

> **❌ Do NOT substitute any other outro file.** Use ONLY this committed
> `splash_intro_BD.webm`. Earlier files such as `aha-outro-reusable-1440x900.webm`
> are NOT the brand outro and have **no audio stream** — substituting one both
> uses the wrong branding (reviewer caught it: *"you are using the wrong outro"*,
> AKB-15) and triggers the silent-tail truncation below. If for some reason this
> asset is missing, regenerate it per the last-resort fallback — never reach for
> a stray reusable webm.

Resolve the absolute path from the workspace root:

```bash
SKILL_ROOT="$(git rev-parse --show-toplevel)/.claude/skills/kb-tutorial-video"
OUTRO="$SKILL_ROOT/assets/splash_intro_BD.webm"
```

If the resolution of your tutorial differs from 1440x900, re-scale before
concat (see the `-vf scale=` note below).

### ⚠️ The outro has NO audio stream — guard against silent-tail truncation

**Incident (AKB-15 r10→r11):** the reusable outro webm carries **no audio
stream**. When you concat `tutorial (has audio) + outro (no audio)`, ffmpeg's
muxer caps the output audio track at the outro's audio duration — which is
**zero/short** — so the mixed VO is silently **truncated to ~the outro length**
and everything past the first few seconds goes mute. The intermediate
`...-narrated.webm` is fine and passes `check_vo_overlap.py`; the breakage
happens **in this concat step**, so a check that ran before the concat will not
catch it. Real reviewer report: *"There's no VO after 0:05."*

**Rule: never feed a no-audio outro straight into concat.** First probe the
outro, and if it lacks an audio stream, give it a matched-length **silent**
track (`anullsrc`). Then the `-c copy` fast path is unsafe (mismatched streams)
— use the concat *demuxer* with a normalized outro, or the `filter_complex`
path with `anullsrc`.

```bash
FFMPEG=/Users/claude/AhaSlides/onboarding-videos/node_modules/ffmpeg-static/ffmpeg
FFPROBE=/Users/claude/AhaSlides/onboarding-videos/node_modules/ffmpeg-static/../ffprobe-static/ffprobe
SKILL_ROOT="$(git rev-parse --show-toplevel)/.claude/skills/kb-tutorial-video"
OUTRO="$SKILL_ROOT/assets/splash_intro_BD.webm"
TUTORIAL=out-<slug>/word-cloud-narrated.webm

# 1. Does the outro have an audio stream?
HAS_AUDIO=$($FFMPEG -i "$OUTRO" 2>&1 | grep -c "Audio:")
# 2. If not, bake a silent audio track of the SAME duration into a normalized outro.
DUR=$($FFMPEG -i "$OUTRO" 2>&1 | sed -n 's/.*Duration: \([0-9:.]*\).*/\1/p')
if [ "$HAS_AUDIO" -eq 0 ]; then
  $FFMPEG -y -i "$OUTRO" -f lavfi -i anullsrc=r=48000:cl=mono \
    -shortest -c:v copy -c:a libopus -ar 48000 \
    out-<slug>/outro-with-silence.webm
  OUTRO=out-<slug>/outro-with-silence.webm
fi
```

Then concat (resolutions match → concat demuxer; differ → `filter_complex`):

```bash
# Same res/fps/codec — concat DEMUXER (re-mux; both inputs now carry audio)
printf "file '%s'\nfile '%s'\n" "$TUTORIAL" "$OUTRO" > /tmp/concat-<slug>.txt
$FFMPEG -y -f concat -safe 0 -i /tmp/concat-<slug>.txt \
  -c:v copy -c:a libopus -ar 48000 \
  out-<slug>/narrated-with-outro.webm
```

If resolutions differ, re-encode with `filter_complex` — and if the outro had
no audio, source its segment from `anullsrc` instead of `[1:a]`:

```bash
$FFMPEG -y \
  -i "$TUTORIAL" \
  -i "$OUTRO" \
  -f lavfi -t "$DUR" -i anullsrc=r=48000:cl=mono \
  -filter_complex \
    "[0:v]scale=1440:900,format=yuv420p[v0];\
     [1:v]scale=1440:900,format=yuv420p[v1];\
     [v0][0:a][v1][2:a]concat=n=2:v=1:a=1[vout][aout]" \
  -map "[vout]" -map "[aout]" \
  -c:v libvpx-vp9 -b:v 0 -crf 30 -r 25 \
  -c:a libopus -ar 48000 \
  out-<slug>/narrated-with-outro.webm
```
(Use `[1:a]` only if the probe confirmed the outro really has audio.)

### ⚠️ MANDATORY: energy-scan the FINAL delivered file, not the intermediate

After the concat, run an audio-energy scan over the **whole** final
`narrated-with-outro` file (the exact file you will upload/embed) and confirm a
speech segment exists at **every** VO timestamp — especially the clips that land
in the back half, after the truncation point. `check_vo_overlap.py` on the
pre-outro narrated file is **not** sufficient (it passed on the broken r10).
Cheap check:

```bash
$FFMPEG -i out-<slug>/narrated-with-outro.webm -af silencedetect=n=-40dB:d=0.5 -f null - 2>&1 \
  | grep silence_   # large silent spans after 0:05 = truncation bug is back
```
Do not report success on a final file you have not audio-scanned end-to-end.

### Last-resort fallback (only if committed asset is missing/corrupt)

If `assets/splash_intro_BD.webm` is unavailable for any reason, generate a
static branded outro with ffmpeg using the aha-video-branding plugin assets:

```python
# Step 1 — build a static outro frame
from PIL import Image
import subprocess

ASSETS = "/Users/claude/.claude/plugins/marketplaces/aha-claude-plugins/plugins/aha-video-branding/skills/aha-video-branding/assets"
VIDEO_W, VIDEO_H = 1440, 900
bg = Image.open(f"{ASSETS}/bg-alt-purple.png").convert("RGB").resize((VIDEO_W, VIDEO_H), Image.LANCZOS)
subprocess.run(["rsvg-convert", "-h", "62", f"{ASSETS}/Ahaslides-Logo-White.svg", "-o", "/tmp/aha-logo-white-62.png"])
logo = Image.open("/tmp/aha-logo-white-62.png").convert("RGBA")
bg.paste(logo, (VIDEO_W - logo.width - 24, 24), logo)
bg.save("/tmp/aha-outro-frame.png")
```

```bash
# Step 2 — render 3s static clip
FFMPEG=/Users/claude/AhaSlides/onboarding-videos/node_modules/ffmpeg-static/ffmpeg
FONT_BOLD="/Users/claude/Library/Fonts/PlusJakartaSans-ExtraBold.ttf"
$FFMPEG -y -loop 1 -i /tmp/aha-outro-frame.png \
  -vf "drawtext=fontfile='$FONT_BOLD':text='Make every session count':fontsize=64:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2+40" \
  -t 3.0 -c:v libvpx-vp9 -b:v 0 -crf 33 -r 25 -an /tmp/aha-outro-static.webm
```

Then concat using the `filter_complex` path above (the static clip has no audio,
so add `-f lavfi -i anullsrc=r=48000:cl=mono` as a third input and use `[2:a]`
for the outro audio).

## Phase 3d — Derive and store YouTube chapter markers (required, pre-upload)

Every tutorial video MUST have YouTube chapter markers. Prepare them BEFORE
uploading to YouTube so they can be pasted into the description immediately at
publish time. The chapter list is derived from the voiceover JSON step timings
and stored in two places so it survives across rounds and agents.

Use the bundled script: `scripts/youtube_chapters.py` in this skill's
`scripts/` directory (first proven on Word Cloud r8, AKB-17 Round 9).

### Step 1 — Derive the chapter list

```bash
SKILL_DIR="$(git rev-parse --show-toplevel)/.claude/skills/kb-tutorial-video"
python3 "$SKILL_DIR/scripts/youtube_chapters.py" derive \
    "$SKILL_DIR/scenarios/<slug>-voiceover.json"
```

The `derive` command reads each step's `display_text` and `start_sec`, then
greedy-merges adjacent short steps until every group is ≥ 10 seconds. It
prints a compliant chapter block — but the auto-generated titles are mechanical.
**Rename them to human-readable section labels** before saving (e.g. "Create
and configure the slide" not "A Word Cloud slide lets participants submit…").

### Step 2 — Validate the chapter list

```bash
# VALIDATE a hand-crafted or edited chapter file:
python3 "$SKILL_DIR/scripts/youtube_chapters.py" validate \
    "$SKILL_DIR/scenarios/<slug>.chapters.txt" \
    --video-duration <total_seconds_incl_outro>
```

YouTube's rules enforced by the script:
- First chapter MUST be `0:00`.
- At least 3 chapters.
- Every chapter MUST be ≥ 10 seconds long.
- Timestamps must be strictly ascending.
- Format: `M:SS Title` or `H:MM:SS Title`.

### Step 3 — Store the chapter list

Store the validated chapter list in two places so the next agent has it:

**a) `scenarios/<slug>.chapters.txt`** — a standalone file committed alongside
the voiceover JSON. Header comment documents the video path, total duration,
and per-group second counts. See `scenarios/using-the-word-cloud-slide.chapters.txt`
for the canonical example format.

**b) `youtube_chapters` field in `scenarios/<slug>-voiceover.json`** — store
the same chapter block as a newline-separated string in the voiceover JSON so
everything is in one record. Also add a `youtube_chapters_notes` field with a
one-liner validation summary (chapter count, duration, round). See
`using-the-word-cloud-slide-voiceover.json` for the reference example.

Commit both files together with the voiceover JSON. Chapters are pre-work, not
post-work — they must exist before the video is uploaded.

### Step 4 — Apply at publish time (requires force-ssl OAuth)

Chapters are pasted into the YouTube description as the first lines when the
video goes live. Alternatively, apply programmatically via the `upload` command:

```bash
# DRY-RUN (shows what would be written):
python3 "$SKILL_DIR/scripts/youtube_chapters.py" upload \
    --video-id <VIDEO_ID> --chapters "$SKILL_DIR/scenarios/<slug>.chapters.txt" \
    --access-token <TOKEN> --video-duration <seconds> --dry-run

# LIVE UPLOAD chapters to YouTube description:
python3 "$SKILL_DIR/scripts/youtube_chapters.py" upload \
    --video-id <VIDEO_ID> --chapters "$SKILL_DIR/scenarios/<slug>.chapters.txt" \
    --access-token <TOKEN> --video-duration <seconds>
```

**Auth dependency:** `videos.update` (used by the `upload` command) requires
`youtube.force-ssl` scope. The `youtube-uploader` MCP's `authenticate` tool
hardcodes only `youtube.upload + youtube.readonly` — it CANNOT obtain
`force-ssl`. Until Chau re-auths with the manual URL (see Phase 4 below), paste
the chapter block into the YouTube description manually via YouTube Studio. The
stored `.chapters.txt` is the source of truth for that paste.

## Phase 4 — Upload to YouTube

Read `references/upload-embed.md` for the full upload workflow, auth
quirks, channel IDs, and housekeeping notes.

### force-ssl OAuth URL (for chapters + captions)

`videos.update` requires `youtube.force-ssl`. The `youtube-uploader` MCP
cannot obtain this scope. If chapters or captions fail with 403, Chau must
open this URL and paste the `code=` value back to `accesstoken`:

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
