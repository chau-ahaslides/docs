---
name: kb-tutorial-video
description: End-to-end pipeline for producing a KB tutorial video and refreshing its article — record an AhaSlides product-tour webm from a JSON scenario, tighten it, upload to YouTube, embed it as a playable block in the GitBook KB article, and update the article's steps against the recorded UI. Use this whenever the user asks to make/record/generate/refresh a video for a KB article, create an onboarding or walkthrough video for a feature, upload a tutorial to YouTube, or add/embed a video in the knowledge base — even if they only mention one phase (recording, trimming, uploading, embedding, or article updates), since the phases share setup and gotchas documented here. Designed to be run per-article across many articles.
---

# KB Tutorial Video Pipeline

Proven end-to-end on `creating-a-poll-question-on-ahaslides.md`
(result: https://www.youtube.com/watch?v=GK6fQhHYybo, 0:48). Run the phases in
order, one article at a time. Each phase lists its non-obvious failure modes —
they each cost real debugging time once already.

Recording workspace: `~/AhaSlides/onboarding-videos/` (playwright + chromium +
`ffmpeg-static` installed; recorder scripts copied from the
`aha-onboarding-video` plugin — they MUST run from this dir because ESM
resolves `playwright` relative to the script location). The local
`scripts/record-onboarding.mjs` carries two patches the plugin lacks: a
per-step `pauseMs` field (extra settle time before acting) and a sanitized
healed-scenario filename for remote mode.

## Phase 1 — Author the scenario

Scenarios live IN THIS SKILL at `scenarios/<article-slug>.json` (1:1 with
articles, version-controlled with the KB — commit scenario changes alongside
the article). Point `SCENARIO_FILE` straight at the repo path when recording;
no copy into the workspace is needed.
Derive the steps from what the article teaches; write tooltip `description`
copy for the viewer in brand voice (load `aha-branding-tone-voice` when
drafting it). Schema `{"steps":[...]}`; each step: `id`, `path` (route glob,
`/presentation/*` inside the editor), `title`, `description`,
`targetSelector`, optional `pauseMs`, `action`:
- `null` — tooltip-only; the recorder clicks Next. Use for welcome/closing.
- `{"type":"click","selector":...}` — advance by clicking the spotlighted target.
- `{"type":"input"|"input-match","value":...}` — type into the target.

Constraints from how the app's onboarding overlay works:
- **A step's target must be on screen when the step starts** — the overlay
  cannot anchor to an element that doesn't exist yet.
- **Never add a step whose target unmounts itself on click** (e.g. the
  kickstart "Choose a slide" button — the picker replaces it). The click
  passes through and works, but the app misses the step completion and the
  tour stalls (reproduced twice, incl. with a 1.5s settle; app-side bug,
  reported). Instead, skip from the prior step straight to the gated target
  (e.g. `[aria-label="Poll"]`) and let the recorder's auto-heal click through
  the opener. The heal gap is silent dead time on screen — Phase 3's
  freeze-trim removes it.
- A Preview demonstration is a good closing pattern: click the header Preview
  button (`[data-testid="editor-middle-preview-button"]`), hold with
  `pauseMs: 8000` (preview iframes load slowly), exit via
  `[data-testid="editor-middle-back-to-editor-button"]`, then a final
  tooltip-only step on `.aha-button-present`. Preview only adds
  `?preview=true`, so `path` stays `/presentation/*`.
### Demonstrating audience participation in Preview (any slide type)

The participant pane in Preview is a cross-origin iframe
(`audience.sandbox.ahaslide.com`) which the overlay can't anchor to — so
in-audience actions can't be tour steps. Instead the recorder performs them
via a step's `previewInteractions` array (recorder-side feature, local
patch): it glides the visible cursor to the in-frame element (boundingBox is
in page coords) and dispatches the click inside the frame document, so the
overlay backdrop can't swallow it. Preview is sandboxed — submissions don't
go live.

Recipe for a NEW slide type:
1. Find a sandbox deck containing that slide — recording runs leave decks
   behind; deck ids are in the recorder's `navigated →` log lines (or create
   one via AhaSlides MCP `create_slides`).
2. Discover the audience-side selectors with the bundled probe:

   ```bash
   cd ~/AhaSlides/onboarding-videos && source <plugin>/test-env.sh && \
   node <skill-dir>/scripts/probe_preview_audience.mjs <deckId>
   ```

   It prints every interactive element in the audience iframe (testids/text)
   plus the host-side anchor wrappers, and drops /tmp/preview-probe.png.
3. Add the new type's testids to the table below so the next run skips
   discovery.

Known audience-app selectors (append as you discover more):

| Slide type | Interact with |
|---|---|
| Poll / quiz answers | `[data-testid="audience-quiz-option"]:has-text("<option>")`, then `[data-testid="audience-quiz-submit-button"]` |
| Any slide | reactions: `[data-testid="audience-reactions-v2-<like|heart|laugh|wow|sad>-button"]` |
| App tabs | `[data-testid="audience-tabs-<presentation|review|feedback|profile>-tab"]` |

**Use TWO anchored tooltip steps around preview interactions** so viewers'
eyes are directed before things happen (one tooltip-only step per pane —
the pane wrappers live in the host document, so the overlay CAN anchor to
them: `.iframe-wrapper-audience` and `.iframe-wrapper-presenter`):

  ```json
  { "id": "x-preview-vote", "title": "This is your audience's phone",
    "targetSelector": ".iframe-wrapper-audience", "pauseMs": 8000, "action": null,
    "previewInteractions": [
      { "frameMatch": "audience.", "selector": "[data-testid=\"audience-quiz-option\"]:has-text(\"Monday\")",
        "label": "pick Monday", "pauseAfterMs": 1800 },
      { "frameMatch": "audience.", "selector": "[data-testid=\"audience-quiz-submit-button\"]",
        "label": "submit", "pauseAfterMs": 2200 }
    ] },
  { "id": "x-preview-results", "title": "Results update live",
    "targetSelector": ".iframe-wrapper-presenter", "pauseMs": 3000, "action": null }
  ```

  Interactions run after the step's `pauseMs` (so the iframes are loaded),
  while that step's tooltip is up; the second step then spotlights the
  presenter pane to explain the chart reacting.
- **Flake to watch for:** occasionally the preview exit lands the app in
  Present mode instead of the editor — the final step's tooltip then floats
  unanchored over a fullscreen slide. Check the recorder's `final URL` line
  (no `?presenting=true`) and the step-10/99-final shots; if it happened,
  just re-record (1-in-3-ish occurrence, cause not yet pinned down).

Selector discovery when the guide's table doesn't cover a control: write a
probe script IN the workspace dir (crib from `probe2.mjs`), fresh profile dir,
`force: true` clicks (leftover onboarding panels intercept pointer events), no
`?onboarding` param. Header buttons follow `[data-testid="editor-*"]`; picker
items are `[aria-label="<Type>"][data-testid="editor-new-slide-type-item-v2-button"]`.

## Phase 2 — Record (remote mode only)

```bash
cd ~/AhaSlides/onboarding-videos && rm -rf out && \
source /Users/claude/.claude/plugins/cache/aha-claude-plugins/aha-onboarding-video/*/skills/record-onboarding-video/test-env.sh && \
SCENARIO_FILE=$PWD/scenarios/<slug>.json \
WORKER_URL=https://aha-onboarding-scenario-host.ahaslides-game.workers.dev \
BASE_URL='https://ab214fb69c15de4b3d300d0e323bc3a4d29327d6.presenter.sandbox.ahaslide.com/apps/presentations' \
OUT_DIR=$PWD/out node scripts/record-remote-tour.mjs
```

The Worker + `aha-onboarding-scenarios` R2 bucket are already deployed on the
ahaslides-game Cloudflare account. Never use local mode (`STEPS_FILE` +
`onboarding=<key>` only) — the app renders its built-in tour, not yours, and
everything desyncs.

Verify before moving on: the log must say `walk finished — N/N step(s)
executed`, and visually check `out/shots/step-*.png` with the Read tool.
Preserve good takes before re-running (`mv out out-<label>`) — each run wipes
`OUT_DIR`. Tours create REAL presentations on the sandbox test account;
accepted, don't clean up. Known quirk: new poll slides get "This question has
correct answer(s)" pre-ticked by the app itself.

## Phase 3 — Trim (always)

Use the bundled script — it does both passes in one re-encode:
`scripts/trim_video.py` (relative to this skill). Run it FROM the recording
workspace so it finds `node_modules/ffmpeg-static/ffmpeg` (Homebrew isn't
writable on this machine; set `FFMPEG=` to override).

1. Find where the boot loader ends — the app's emoji loader runs anywhere
   from 3s to 20s+ at the start despite the recorder's warm-up. CAUTION: the
   same loader appears a SECOND time mid-video (editor loading after "create
   presentation") — don't mistake it for the boot loader and over-cut the
   welcome/create steps. Read the frames with your eyes (pixel-variance
   heuristics misread the light dashboard UI as blank); the boot cut ends
   when the dashboard + welcome tooltip first appear. Extract 1fps frames:

   ```bash
   node_modules/ffmpeg-static/ffmpeg -i out/<take>.webm -t 25 -vf fps=1 /tmp/frames/f%02d.png
   ```

2. Trim (use `--dry-run` first to sanity-check the cut list):

   ```bash
   python3 <skill-dir>/scripts/trim_video.py out/<take>.webm out/<slug>-final.webm \
     --boot-cut <loader-end>
   ```

   The script freeze-detects at a strict threshold (typing/cursor still count
   as motion — only literally identical frames are flagged), merges spans,
   keeps the first 1.7s + last 0.3s of each static stretch (tooltips stay
   readable), folds in the boot cut, and re-encodes VP9 once (stream copy
   seeks badly on Playwright's sparse-keyframe webms).

3. Verify: sample one frame every ~6s and Read them — every step's tooltip
   must still appear, plus the first frame at 0.5s (it must show the WELCOME
   step on the dashboard — if it shows a later step, the boot cut ate the
   opening). If pacing feels rushed, re-trim with `--keep-head 2.5`.

On the poll take this went 1:58 raw → 0:48 final with nothing meaningful
lost (68s of the raw video was literally frozen frames: heal gaps, loading
waits, tooltip holds).

## Phase 4 — Upload to YouTube

Use the `youtube-uploader` MCP server (local scope, this project; binary
`~/.local/bin/youtube-uploader-mcp-darwin-arm64`, credentials in
`~/.config/youtube-uploader/`).

- Tokens usually persist — call `channels` to confirm, then `upload_video`:
  title "How to <verb> … on AhaSlides — Quick Tutorial", description = 1–2
  sentences + `https://help.ahaslides.com/portal/en/kb/articles/<slug>` +
  ahaslides.com, tags, `category_id: "27"` (Education),
  `status: "unlisted"`, `made_for_kids: false`.
- If auth is needed: `authenticate` with `redirect_uri: "http://localhost"` —
  EXACTLY that. Server bug (v0.1.2): the token exchange always uses the URI
  registered in client_secret.json (`http://localhost`); anything else →
  `invalid_grant`. User opens the URL, pastes back the `localhost/?code=...`;
  pass only the `code` value to `accesstoken` immediately (single-use,
  short-lived).
- Google Cloud project: `ahaslides-knowledge-base` (consent published, scopes
  youtube.upload + youtube.readonly).
- Channels: Chau's personal `UCtyKZFBUeqOmmW-B4E21Kdw` (@chauhoangahaslides)
  until Brand Account *Manager* access is granted (YouTube Studio "Editor" is
  NOT enough for OAuth — myaccount.google.com/brandaccounts). Re-auth and
  pick the AhaSlides channel once granted.
- **Housekeeping:** when a video supersedes an earlier upload for the same
  article, remind the user to delete the old one in YouTube Studio — the API
  scope can't delete, and stale duplicates accumulate fast at many-articles
  scale. If an upload lands private despite `unlisted`, that's the API audit
  lock; owner can flip it in Studio, audit form fixes it permanently.

## Phase 5 — Embed and refresh the article

Add the playable embed near the top of the article (plain markdown links open
a new tab — always use the block):

```markdown
{% embed url="https://www.youtube.com/watch?v=<id>" %}
<caption for the reader>
{% endembed %}
```

Then refresh the article while you're in it — the recording is ground truth
for the current UI (load `aha-branding-tone-voice` for copy edits):

- Update step-by-step instructions to match what `out/shots/*.png` actually
  show (button labels, panel names, section names like "Unscored").
- Remove dangling image references — "Here is the X screen:" lines with
  nothing under them (all images were stripped from this KB); fold them into
  prose, pointing at the video where useful.
- Fix dead absolute links (`https://help.ahaslides.com/<old-slug>`) to
  relative `<article>.md` links so GitBook renders them as internal pages.
- Convert leftover `youtube.com/embed/<id>` plain links to embed blocks, and
  drop superseded "outdated tutorial" videos once the new one covers them.
- Bump `last_updated` in frontmatter; keep all other custom frontmatter
  intact.

Commit and push `master` — GitBook (Git Sync from
github.com/AhaSlides-Product/ahaslides-kb, GitHub→GitBook one-way)
republishes automatically. Never edit articles in the GitBook UI.

**Zoho divergence:** these edits update the GitBook mirror only. The
canonical Zoho article keeps the old copy — tell the user the two have
diverged so the fixes can be ported to Zoho (per INDEX.md, never push local
.md bodies to Zoho blindly; images/videos live there).

## Article Writing Checklist

Apply these rules to every article you write or update.

### Slide type names are proper nouns — always capitalise

AhaSlides slide type names are proper nouns and must be capitalised in prose.
The first letter of the slide-type name is always upper-case when used as the
direct name of the slide.

| Wrong | Correct |
|---|---|
| the poll slide | the Poll slide |
| a brainstorm slide | a Brainstorm slide |
| the content slide | the Content slide |
| the word cloud slide | the Word Cloud slide |
| rating scale slides | Rating Scale slides |

**Full list of slide type proper nouns** (derived from SUMMARY.md):
Poll, Brainstorm, Categorise, Content, Correct Order, Match Pairs, Open Ended,
Ranking, Rating Scale, Spinner Wheel, Word Cloud, Q&A, Idea Board, Pick Answer,
YouTube.

**Scope of the rule:** the construction `<article> <type> slide` (e.g. "a Poll
slide", "the Brainstorm slide") and `<article> <type> type` (e.g. "the Word
Cloud type"). Generic category descriptors such as "quiz slide" (meaning any
scored question) are NOT slide-type names and remain lowercase.

The rule applies to all prose fields: article body, `summary:`, `description:`,
headings, and inline notes. It does NOT apply to YAML `tags:` / `keywords:`
arrays (those are lowercase by convention).

### Lint script — run before every commit

A lint script catches violations before they reach the repo:

```bash
./scripts/lint-slide-names.sh
```

Exits 0 if clean; exits 1 and prints offending lines if violations are found.
Run it on staged files before committing. To add it as a pre-commit hook:

```bash
echo '#!/bin/sh
cd "$(git rev-parse --show-toplevel)" && ./scripts/lint-slide-names.sh' \
  > .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
```

The script is conservative (low false-positive rate): it only flags the
`the/a/an <type> slide/type` construction and skips generic words like "quiz".
