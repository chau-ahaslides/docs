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

Name it `scenarios/<article-slug>.json` so scenarios map 1:1 to articles.
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

## Phase 3 — Trim (always; both passes)

ffmpeg is `node_modules/ffmpeg-static/ffmpeg` (Homebrew isn't writable on
this machine).

**Pass A — cut the boot loader.** The app's emoji loader runs anywhere from
3s to 20s+ at the start despite the recorder's warm-up. Find where the first
tooltip appears (1fps frames, Read them):

```bash
node_modules/ffmpeg-static/ffmpeg -i out/<take>.webm -t 25 -vf fps=1 /tmp/frames/f%02d.png
```

Then cut and re-encode — stream copy seeks badly on Playwright's
sparse-keyframe webms:

```bash
node_modules/ffmpeg-static/ffmpeg -ss <loader-end> -i out/<take>.webm \
  -c:v libvpx-vp9 -crf 32 -b:v 0 -cpu-used 4 -row-mt 1 -an -y out/<slug>-cut.webm
```

**Pass B — cap static stretches.** Heal gaps and loading waits leave long
fully-static runs (the poll take had 68s of frozen frames in a 98s video).
Detect strictly so typing/cursor still counts as motion:

```bash
node_modules/ffmpeg-static/ffmpeg -i out/<slug>-cut.webm -vf freezedetect=n=-55dB:d=1.8 \
  -map 0:v -f null - 2>&1 | grep -oE 'freeze_(start|end): [0-9.]+'
```

Merge spans separated by <0.3s, keep first 1.7s + last 0.3s of each (tooltips
stay readable), cut the middle via
`select='not(between(t,a,b)+…)',setpts=N/FRAME_RATE/TB` and re-encode with the
same VP9 flags. Verify: sample one frame every ~6s and Read them — every
step's tooltip must still appear. This took the poll video from 1:58 raw to
0:48 final with nothing meaningful lost.

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
