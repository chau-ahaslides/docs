---
name: kb-tutorial-video
description: End-to-end pipeline for producing a KB tutorial video — record an AhaSlides product-tour webm from a JSON scenario, upload it to YouTube, and embed it as a playable block in a GitBook KB article. Use this whenever the user asks to make/record/generate a video for a KB article, create an onboarding or walkthrough video for a feature, upload a tutorial to YouTube, or add/embed a video in the knowledge base — even if they only mention one phase (recording, uploading, or embedding), since the phases share setup and gotchas documented here.
---

# KB Tutorial Video Pipeline

Three phases, proven end-to-end on `creating-a-poll-question-on-ahaslides.md`
(result: https://www.youtube.com/watch?v=jlrqgxLETTg). Run them in order; each
phase lists its non-obvious failure modes so you don't rediscover them.

## Phase 1 — Record the webm

Recording workspace: `~/AhaSlides/onboarding-videos/` (playwright + chromium
installed; recorder scripts copied from the `aha-onboarding-video` plugin —
they MUST run from this dir because ESM resolves `playwright` relative to the
script location). The local copy of `scripts/record-onboarding.mjs` carries two
patches the plugin lacks: a per-step `pauseMs` field (extra settle time, e.g.
waiting for preview iframes) and a sanitized healed-scenario filename for
remote mode.

1. Write a scenario JSON in `scenarios/<topic>.json` based on the steps the KB
   article teaches. Schema `{"steps":[...]}`; each step: `id`, `path` (route
   glob, `/presentation/*` inside the editor), `title`, `description` (tooltip
   copy shown in the video — write it for the viewer, on-brand), `targetSelector`,
   `action` (null = tooltip Next; `{"type":"click","selector":...}`;
   `{"type":"input"|"input-match","value":...}`). Optional `pauseMs` for steps
   that need loading time.
2. Record in REMOTE mode (the app fetches the scenario and renders YOUR tour):

   ```bash
   cd ~/AhaSlides/onboarding-videos && rm -rf out && \
   source /Users/claude/.claude/plugins/cache/aha-claude-plugins/aha-onboarding-video/*/skills/record-onboarding-video/test-env.sh && \
   SCENARIO_FILE=$PWD/scenarios/<topic>.json \
   WORKER_URL=https://aha-onboarding-scenario-host.ahaslides-game.workers.dev \
   BASE_URL='https://ab214fb69c15de4b3d300d0e323bc3a4d29327d6.presenter.sandbox.ahaslide.com/apps/presentations' \
   OUT_DIR=$PWD/out node scripts/record-onboarding.mjs # via record-remote-tour.mjs
   ```

   Use `scripts/record-remote-tour.mjs` (it uploads the scenario to R2 via
   wrangler and spawns the recorder). The Worker + `aha-onboarding-scenarios`
   R2 bucket are already deployed on the ahaslides-game Cloudflare account.
3. Verify before moving on: the log must say `walk finished — N/N step(s)
   executed`, and visually check `out/shots/step-*.png` with the Read tool.
   The webm lands in `out/*.webm`.
4. Trim the boot/loading segment before uploading — the app's emoji loader can
   run 20s+ at the start despite the recorder's warm-up. ffmpeg is available
   via the workspace's `ffmpeg-static` npm package (Homebrew is not writable
   on this machine). Find where the first tooltip appears (extract 1fps frames
   and Read them: `node_modules/ffmpeg-static/ffmpeg -i out/<take>.webm -t 25
   -vf fps=1 /tmp/frames/f%02d.png`), then cut and re-encode — stream copy
   seeks badly on Playwright's sparse-keyframe webms:

   ```bash
   node_modules/ffmpeg-static/ffmpeg -ss <loader-end> -i out/<take>.webm \
     -c:v libvpx-vp9 -crf 32 -b:v 0 -cpu-used 4 -row-mt 1 -an -y out/<topic>-final.webm
   ```

   Verify the new first frame (extract at 0.5s and Read it) before uploading.

Gotchas (each cost real debugging time):
- **Never use local mode** (`STEPS_FILE` + `onboarding=<key>` only): the app
  renders its built-in tour, not yours, and its overlay swallows clicks.
- **No explicit kickstart step.** After "create presentation" the editor shows
  a "Choose a slide" kickstart screen. An explicit click step for it advances
  the overlay but the click is swallowed. Go straight from the create step to
  clicking the slide type (e.g. `[aria-label="Poll"]`) — the recorder's
  auto-heal clicks through kickstart on its own.
- **Selector discovery**: write a probe script IN the workspace dir, fresh
  profile dir, `force: true` clicks (leftover onboarding panels intercept
  pointer events), no `?onboarding` param. Crib from `probe2.mjs`. Known
  selectors are in the plugin guide's table; header buttons follow
  `[data-testid="editor-*"]` (e.g. `editor-middle-preview-button`,
  `editor-middle-back-to-editor-button`).
- Tours create REAL presentations on the sandbox test account — accepted.
- New poll slides come with "This question has correct answer(s)" pre-ticked
  by the app; add an untick step only if the user complains.
- A Preview step (open → `pauseMs: 8000` hold → exit) is a good pattern: it
  shows presenters what to expect. Preview only adds `?preview=true`, so
  `path` stays `/presentation/*`.

## Phase 2 — Upload to YouTube

Use the `youtube-uploader` MCP server (registered at local scope for this
project; binary `~/.local/bin/youtube-uploader-mcp-darwin-arm64`, credentials
in `~/.config/youtube-uploader/`).

- If tokens exist: call `channels` to confirm, then `upload_video` with the
  webm path, `channel_id`, title ("How to ... on AhaSlides — Quick Tutorial"),
  description (1-2 sentences + link to the article's
  `https://help.ahaslides.com/portal/en/kb/articles/<slug>` + ahaslides.com),
  tags, `category_id: "27"` (Education), `status: "unlisted"`,
  `made_for_kids: false`.
- If auth is needed: call `authenticate` with
  `redirect_uri: "http://localhost"` — EXACTLY that. Server bug (v0.1.2): the
  token exchange always uses the redirect URI registered in
  client_secret.json (`http://localhost`); any other value → `invalid_grant`.
  The user opens the URL, approves, and pastes back the `localhost/?code=...`
  URL; pass only the `code` value to `accesstoken` immediately (codes are
  single-use and short-lived).
- Google Cloud project: `ahaslides-knowledge-base` (consent published, scopes
  youtube.upload + youtube.readonly).
- Channels: Chau's personal `UCtyKZFBUeqOmmW-B4E21Kdw` (@chauhoangahaslides)
  works today. The AhaSlides Brand Account needs Chau to hold Brand Account
  *Manager* (myaccount.google.com/brandaccounts) — YouTube Studio "Editor" is
  NOT enough for OAuth; re-auth and pick the brand channel once granted.
- If the upload lands as private despite `unlisted`: the project hasn't passed
  YouTube's API audit. The owner can flip visibility manually in Studio;
  submitting the audit form fixes it permanently.

## Phase 3 — Embed in the KB article and publish

Add a playable embed block (a plain markdown link would open a new tab):

```markdown
{% embed url="https://www.youtube.com/watch?v=<id>" %}
<caption for the reader>
{% endembed %}
```

Place it near the top of the article (after the intro paragraph) or beside the
section it demonstrates. Normalize any `youtube.com/embed/<id>` URLs to watch
URLs. Then commit and push `master` — GitBook (Git Sync from
github.com/AhaSlides-Product/ahaslides-kb, GitHub→GitBook one-way)
republishes automatically. Keep custom frontmatter intact; never edit
articles in the GitBook UI.
