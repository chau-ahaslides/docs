#!/usr/bin/env bash
# lint-zoho-refs.sh — flags any article body containing a reference to "Zoho".
#
# CONVENTION (authoritative):
#   AhaSlides KB is now a standalone knowledge base. Zoho Help Center is no
#   longer the canonical public surface. Any reader-facing mention of Zoho
#   (e.g. "see the Zoho Help Center", links to desk.zoho.com, references to
#   Zoho as the canonical source) should be removed.
#
# What this lint FLAGS (exit 1):
#   Any occurrence of "zoho" (case-insensitive) in the ARTICLE BODY —
#   i.e., content AFTER the closing `---` of the YAML frontmatter block.
#
# What this lint does NOT flag (legitimate / internal uses):
#   - `zoho_url:` frontmatter field (historical ID tracking only)
#   - `warning:` frontmatter field (internal workflow notes)
#   - Any other YAML frontmatter field (between the two `---` delimiters)
#   - CLAUDE.md (repo instruction doc — may reference Zoho historically)
#   - INDEX.md (agent navigation manifest — maintained separately)
#   - scripts/ themselves
#
# Scope: KB article *.md at the repo ROOT and compare/ subdirectory.
#   Excludes .claude/**, .git/**, CLAUDE.md, and INDEX.md.
#
# Usage:
#   ./scripts/lint-zoho-refs.sh [<file-or-dir> ...]
#   Defaults to root + compare/ .md files if no args given.
#   Exits 0 if no violations found; 1 otherwise.
#
# Pre-commit hook usage (add to .git/hooks/pre-commit):
#   ./scripts/lint-zoho-refs.sh && echo "zoho-refs OK"
#
# CI: see .github/workflows/lint-zoho-refs.yml

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ $# -eq 0 ]; then
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

# Exclude infra/nav docs and anything under .claude/ or .git/.
EXCLUDED_BASENAMES = {'CLAUDE.md', 'INDEX.md'}

def excluded(path):
    norm = os.path.normpath(path)
    if os.path.basename(norm) in EXCLUDED_BASENAMES:
        return True
    parts = norm.split(os.sep)
    return '.claude' in parts or '.git' in parts

files = sorted(set(
    f for f in files
    if f.endswith('.md') and os.path.isfile(f) and not excluded(f)
))

ZOHO_PAT = re.compile(r'zoho', re.IGNORECASE)

violations = 0

for filepath in files:
    try:
        with open(filepath, encoding='utf-8') as fh:
            lines = fh.readlines()

        # Locate the frontmatter block (between the first two `---` delimiters).
        # Content before fm_end (exclusive) is frontmatter — skip it.
        fm_delimiters = []
        for i, line in enumerate(lines):
            if line.strip() == '---':
                fm_delimiters.append(i)
                if len(fm_delimiters) == 2:
                    break
        body_start = fm_delimiters[1] + 1 if len(fm_delimiters) >= 2 else 0

        for lineno, line in enumerate(lines[body_start:], start=body_start + 1):
            if ZOHO_PAT.search(line):
                violations += 1
                print(f'{filepath}:{lineno}: {line.rstrip()}')

    except (IOError, UnicodeDecodeError):
        pass

if violations == 0:
    print(f'lint-zoho-refs: OK — no violations in {len(files)} file(s) checked')
    sys.exit(0)
else:
    print()
    print(f'lint-zoho-refs: FAIL — {violations} Zoho reference(s) found in article bodies.')
    print('  AhaSlides KB is now a standalone knowledge base.')
    print('  Remove any reader-facing references to Zoho Help Center.')
    print('  (Frontmatter fields like zoho_url: are excluded from this check.)')
    sys.exit(1)
PYEOF
