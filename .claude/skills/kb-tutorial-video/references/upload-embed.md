# Upload & Embed Reference (Phases 4–5)

Full reference for Phases 4 and 5 of the KB tutorial video pipeline.

## Phase 4 — Upload to YouTube

Use the `youtube-uploader` MCP server (local scope, this project; binary
`~/.local/bin/youtube-uploader-mcp-darwin-arm64`, credentials in
`~/.config/youtube-uploader/`).

### Upload call

- Tokens usually persist — call `channels` to confirm, then `upload_video`:
  - `title`: "How to \<verb\> … on AhaSlides — Quick Tutorial"
  - `description`: 1–2 sentences + `https://help.ahaslides.com/portal/en/kb/articles/<slug>` + ahaslides.com
  - `tags`, `category_id: "27"` (Education), `status: "unlisted"`, `made_for_kids: false`

### Auth (when needed)

Call `authenticate` with `redirect_uri: "http://localhost"` — EXACTLY that.
Server bug (v0.1.2): the token exchange always uses the URI registered in
`client_secret.json` (`http://localhost`); anything else → `invalid_grant`.
User opens the URL, pastes back the `localhost/?code=...`; pass only the
`code` value to `accesstoken` immediately (single-use, short-lived).

### Account details

- Google Cloud project: `ahaslides-knowledge-base` (consent published, scopes
  `youtube.upload` + `youtube.readonly`).
- Current channel: Chau's personal `UCtyKZFBUeqOmmW-B4E21Kdw`
  (@chauhoangahaslides) until Brand Account *Manager* access is granted
  (YouTube Studio "Editor" is NOT enough for OAuth —
  myaccount.google.com/brandaccounts). Re-auth and pick the AhaSlides channel
  once granted.

### Housekeeping

When a video supersedes an earlier upload for the same article, remind the
user to delete the old one in YouTube Studio — the API scope can't delete, and
stale duplicates accumulate fast at many-articles scale. If an upload lands
private despite `unlisted`, that's the API audit lock; owner can flip it in
Studio, audit form fixes it permanently.

## Phase 5 — Embed and refresh the article

### Embed block syntax

Add the playable embed near the top of the article (plain markdown links open
a new tab — always use the block):

```markdown
{% embed url="https://www.youtube.com/watch?v=<id>" %}
<caption for the reader>
{% endembed %}
```

### Article refresh rules

While in the article, update it to match the recording (ground truth for the
current UI). Load `aha-branding-tone-voice` for copy edits.

- Update step-by-step instructions to match what `out/shots/*.png` actually
  show (button labels, panel names, section names like "Unscored").
- Remove dangling image references — "Here is the X screen:" lines with
  nothing under them (all images were stripped from this KB); fold them into
  prose, pointing at the video where useful.
- Fix dead absolute links (`https://help.ahaslides.com/<old-slug>`) to
  relative `<article>.md` links so GitBook renders them as internal pages.
- Convert leftover `youtube.com/embed/<id>` plain links to embed blocks, and
  drop superseded "outdated tutorial" videos once the new one covers them.
- Bump `last_updated` in frontmatter; keep all other custom frontmatter intact.

### Commit and push

```bash
# Run lint first
./scripts/lint-slide-names.sh

git add <changed-article.md> scenarios/<slug>.json scenarios/<slug>-voiceover.json
git commit -m "Add tutorial video for <article>"
git push origin master
git push upstream master   # if second remote is configured
```

GitBook (Git Sync from github.com/AhaSlides-Product/ahaslides-kb,
GitHub→GitBook one-way) republishes automatically. **Never edit articles in
the GitBook UI.**

### Zoho divergence

These edits update the GitBook mirror only. The canonical Zoho article keeps
the old copy — tell the user the two have diverged so the fixes can be ported
to Zoho (per INDEX.md, never push local .md bodies to Zoho blindly; images
and videos live there).
