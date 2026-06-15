---
name: kb-tutorial-video
description: End-to-end pipeline for producing a KB tutorial video and refreshing its article — record an AhaSlides product-tour webm from a JSON scenario, tighten it, upload to YouTube, embed it as a playable block in the GitBook KB article, and update the article's steps against the recorded UI. Use this whenever the user asks to make/record/generate/refresh a video for a KB article, create an onboarding or walkthrough video for a feature, upload a tutorial to YouTube, or add/embed a video in the knowledge base — even if they only mention one phase (recording, trimming, uploading, embedding, or article updates), since the phases share setup and gotchas documented here. Designed to be run per-article across many articles.
---

# KB Tutorial Video Pipeline

Proven end-to-end on `creating-a-poll-question-on-ahaslides.md`
(result: https://www.youtube.com/watch?v=GK6fQhHYybo, 0:48). Run the phases in
order, one article at a time.

Recording workspace: `~/AhaSlides/onboarding-videos/` (playwright + chromium +
`ffmpeg-static` installed; recorder scripts copied from the
`aha-onboarding-video` plugin — they MUST run from this dir because ESM
resolves `playwright` relative to the script location). The local
`scripts/record-onboarding.mjs` carries two patches the plugin lacks: a
per-step `pauseMs` field (extra settle time before acting) and a sanitized
healed-scenario filename for remote mode.

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
- Use ONLY **Liam** (`VCgLBmBjldJmfphyB8sZ`) or **Alice** (`Xb7hH8MSUJpSbSDYk0k2`) — no other voices.
- API key: `ahaslides-kb/.env` → `ELEVENLABS_API_KEY` (never print/echo it).
- Run the overlap checker before mixing and again after — both passes must report `RESULT: PASS`.
- Overlap checker: `scripts/check_vo_overlap.py` in this skill's `scripts/` directory.

## Phase 4 — Upload to YouTube

Read `references/upload-embed.md` for the full upload workflow, auth
quirks, channel IDs, and housekeeping notes.

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
