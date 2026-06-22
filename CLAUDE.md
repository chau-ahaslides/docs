# Agent instructions — ahaslides-kb

This repository contains the AhaSlides knowledge base: Markdown articles published to the Zoho Help Center. There is no live publication pipeline from this repo — Zoho is the public surface. Never guess or pattern-construct public article URLs.

## Repository conventions

- One Markdown file per KB article, named in `kebab-case`.
- `INDEX.md` and `SUMMARY.md` are navigation manifests; update both when adding or removing articles.
- `scripts/lint-slide-names.sh` validates article filenames. Run it before committing new articles.
- KB-to-KB links MUST be relative `<article>.md`, never an absolute `docs.ahaslides.com` URL or a github/gitbook `.md` source URL. `scripts/lint-kb-links.sh` enforces this (also runs in CI via `.github/workflows/lint-kb-links.yml`); run it before committing.
- `.env` contains secrets (never commit it — it is already in `.gitignore`).

## Researching AhaSlides features from source

When writing or verifying KB content you will sometimes need ground-truth product details — feature names, accepted values, UI labels, API shapes — that cannot be safely guessed. The motivating example is AKB-9 (the Diagram slide article), where critical details about node shapes, connection types, and template behaviour had to be sourced directly from code because no public documentation covered them reliably.

**Use the `GITHUB_PAT` in `.env` to access AhaSlides source repositories for authoritative answers.**

### How to use the token

```bash
# Load the token into your shell
source /path/to/repo/.env          # sets $GITHUB_PAT

# Authenticate the gh CLI with the token
export GH_TOKEN=$GITHUB_PAT        # gh CLI respects GH_TOKEN

# Now use gh or git to read the source
gh repo view ahaslides/ahaslides   # list repos in the org
gh api repos/ahaslides/ahaslides/contents/src/...   # browse files
git clone https://$GITHUB_PAT@github.com/ahaslides/<repo>.git /tmp/<repo>
```

Alternatively, pass the token directly to `curl` for GitHub REST API calls:

```bash
curl -H "Authorization: Bearer $GITHUB_PAT" \
     https://api.github.com/repos/ahaslides/<repo>/contents/<path>
```

### When to consult the source

- You need to enumerate exact options the product supports (shape types, interaction modes, export formats, etc.).
- You are writing a step-by-step procedure and must confirm exact UI label or field name.
- A feature is new or has recently changed and existing KB articles may be stale.
- The Zoho Help Center article or any public doc is absent or vague.

### What not to do

- **Never** echo, log, or commit the `$GITHUB_PAT` value.
- **Never** commit or stage `.env` — verify with `git status` before every commit.
- Treat cloned repos as temporary (`/tmp/`) scratch; do not push or modify them.
