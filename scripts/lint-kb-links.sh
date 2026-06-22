#!/usr/bin/env bash
# lint-kb-links.sh — enforces that KB-to-KB links are RELATIVE, never absolute.
#
# CONVENTION (authoritative):
#   KB-to-KB links MUST be relative `<article>.md`, never an absolute
#   `docs.ahaslides.com/...` URL or a github/gitbook `.md` source URL.
#   Relative .md links are the canonical internal-link form — GitBook's Git-Sync
#   renders them as internal pages, and they don't rot when an article is renamed
#   or the public URL structure changes.
#     Wrong:  [Importing a PowerPoint](https://docs.ahaslides.com/features-and-functions/importing-a-powerpoint-presentation-or-pdf-file)
#     Wrong:  [Importing a PowerPoint](https://github.com/AhaSlides-Product/ahaslides-kb/blob/master/importing-a-powerpoint-presentation-or-pdf-file.md)
#     Correct:[Importing a PowerPoint](importing-a-powerpoint-presentation-or-pdf-file.md)
#
# What this lint FLAGS (exit 1):
#   (a) any `https://docs.ahaslides.com/<section>/<slug>` URL in article body, and
#   (b) any `github.com/.../<...>.md` or `raw.githubusercontent.com/.../<...>.md`
#       URL that points at THIS repo (AhaSlides-Product/ahaslides-kb) — i.e. a
#       KB article served as a github .md source.
#
# What this lint does NOT flag (legitimate links):
#   - relative `<article>.md` cross-links (the correct form),
#   - `presenter.ahaslides.com` app/demo/share/register CTAs,
#   - `help.ahaslides.com` portal links,
#   - genuine external github tool repos (e.g. github.com/anwerj/youtube-uploader-mcp),
#   - `.gitbook/assets/...` image paths,
#   - frontmatter metadata fields: portal_url, zoho_url, permalink, related_articles.
#
# Scope: KB article *.md at the repo ROOT (and compare/ if present).
#   Excludes .claude/**, .git/**, and the infra doc CLAUDE.md (its github URLs
#   are legitimate examples).
#
# Usage:
#   ./scripts/lint-kb-links.sh [<file-or-dir> ...]
#   Defaults to root + compare/ .md files if no args given.
#   Exits 0 if no violations found; 1 otherwise.
#
# Pre-commit hook usage (add to .git/hooks/pre-commit):
#   ./scripts/lint-kb-links.sh && echo "kb-links OK"

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ $# -eq 0 ]; then
  # Root articles + compare/ articles. Pass glob PATTERNS (not pre-expanded)
  # as separate args; Python's glob.glob expands them. Quoting each element
  # keeps behaviour identical under bash and zsh (zsh doesn't word-split
  # unquoted vars, which would otherwise collapse both patterns into one arg).
  SEARCH_ARGS=("$REPO_ROOT/*.md" "$REPO_ROOT/compare/*.md")
else
  SEARCH_ARGS=("$@")
fi

python3 - "${SEARCH_ARGS[@]}" <<'PYEOF'
import sys, re, glob, os

args = sys.argv[1:]
files = []
for a in args:
    expanded = glob.glob(a)
    if expanded:
        files.extend(expanded)
    elif os.path.isfile(a):
        files.append(a)

# Exclude the infra doc and anything under .claude/ or .git/.
def excluded(path):
    norm = os.path.normpath(path)
    if os.path.basename(norm) == 'CLAUDE.md':
        return True
    parts = norm.split(os.sep)
    return '.claude' in parts or '.git' in parts

files = sorted(set(
    f for f in files
    if f.endswith('.md') and os.path.isfile(f) and not excluded(f)
))

# Frontmatter metadata fields that legitimately carry absolute URLs.
FRONTMATTER_FIELD = re.compile(r'^\s*(portal_url|zoho_url|permalink|related_articles)\s*:')

# (a) absolute docs.ahaslides.com KB-page URL.
DOCS_URL = re.compile(r'https?://docs\.ahaslides\.com/\S+')

# (b) github / raw.githubusercontent .md URL pointing at THIS repo.
#     Matches the KB repo slug specifically so external tool repos (e.g.
#     github.com/anwerj/youtube-uploader-mcp/.../foo.md) are NOT flagged.
KB_REPO = r'AhaSlides-Product/ahaslides-kb'
GH_MD_URL = re.compile(
    r'https?://(?:github\.com|raw\.githubusercontent\.com)/' + KB_REPO + r'/\S+\.md\b'
)

violations = 0

for filepath in files:
    try:
        with open(filepath, encoding='utf-8') as fh:
            for lineno, line in enumerate(fh, 1):
                if FRONTMATTER_FIELD.match(line):
                    continue
                for pat in (DOCS_URL, GH_MD_URL):
                    m = pat.search(line)
                    if m:
                        violations += 1
                        print(f'{filepath}:{lineno}: {m.group(0)}')
                        break  # one report per line
    except (IOError, UnicodeDecodeError):
        pass

if violations == 0:
    print(f'lint-kb-links: OK — no violations in {len(files)} file(s) checked')
    sys.exit(0)
else:
    print()
    print(f'lint-kb-links: FAIL — {violations} violation(s) found.')
    print('  KB-to-KB links MUST be relative <article>.md, never an absolute')
    print('  docs.ahaslides.com URL or a github/gitbook .md source URL.')
    print("  Wrong:   [Importing a PowerPoint](https://docs.ahaslides.com/.../importing-a-powerpoint-presentation-or-pdf-file)")
    print("  Correct: [Importing a PowerPoint](importing-a-powerpoint-presentation-or-pdf-file.md)")
    sys.exit(1)
PYEOF
