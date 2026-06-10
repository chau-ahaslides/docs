#!/usr/bin/env bash
# lint-slide-names.sh — checks that slide type proper nouns are capitalised in prose.
#
# Rule: AhaSlides slide type names are proper nouns. When used in prose as the
# direct name of the slide type, the first letter must be capitalised.
#   Wrong:  "the poll slide", "a brainstorm slide", "the content slide"
#   Correct: "the Poll slide", "a Brainstorm slide", "the Content slide"
#
# Scope: the pattern "the <type> slide" / "a <type> slide" / "an <type> slide"
# where <type> is lowercase. This is conservative — it targets the construction
# most likely to be a direct slide-type reference. Generic category words like
# "quiz slide" (meaning any scored question) are NOT checked here because "quiz"
# is a category descriptor, not a unique slide-type name.
#
# Known slide types (derived from SUMMARY.md):
#   Poll, Brainstorm, Categorise, Content, Correct Order, Match Pairs,
#   Open Ended, Ranking, Rating Scale, Spinner Wheel, Word Cloud, Q&A,
#   Idea Board, Pick Answer, YouTube
#
# Usage:
#   ./scripts/lint-slide-names.sh [<file-or-dir> ...]
#   Defaults to all .md files in the repo root if no args given.
#   Exits 0 if no violations found; 1 otherwise.
#
# Pre-commit hook usage (add to .git/hooks/pre-commit):
#   ./scripts/lint-slide-names.sh && echo "slide-names OK"

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Default: scan all .md files in repo root (non-recursive — articles live at root)
if [ $# -eq 0 ]; then
  SEARCH_GLOB="$REPO_ROOT/*.md"
else
  SEARCH_GLOB="$@"
fi

# ---------------------------------------------------------------------------
# Lint is implemented entirely in Python for portability and correctness.
# The shell wrapper just handles arg defaults and exit code.
# ---------------------------------------------------------------------------
python3 - $SEARCH_GLOB <<'PYEOF'
import sys, re, glob, os

args = sys.argv[1:]
files = []
for a in args:
    expanded = glob.glob(a)
    if expanded:
        files.extend(expanded)
    elif os.path.isfile(a):
        files.append(a)

files = sorted(set(f for f in files if f.endswith('.md') and os.path.isfile(f)))

# Pattern: match "the/a/an <slide-type> slide/type" (case-insensitive)
# Only flag when the slide-type word starts lowercase (genuine violation).
SLIDE_TYPES = (
    r'poll',
    r'brainstorm',
    r'categoris[ez]',
    r'content',
    r'correct[\s-]+order',
    r'match[\s-]+pairs',
    r'open[\s-]+ended',
    r'ranking',
    r'rating[\s-]+scale',
    r'spinner[\s-]+wheel',
    r'word[\s-]+cloud',
    r'q&a',
    r'idea[\s-]+board',
    r'pick[\s-]+answer',
    r'youtube',
)
TYPE_ALT = '(' + '|'.join(SLIDE_TYPES) + ')'
PATTERN = re.compile(
    r'(?:the |a |an )' + TYPE_ALT + r'(?:[ -]slide|[ -]type)',
    re.IGNORECASE
)

violations = 0

for filepath in files:
    try:
        with open(filepath, encoding='utf-8') as fh:
            for lineno, line in enumerate(fh, 1):
                for m in PATTERN.finditer(line):
                    slide_word = m.group(1)
                    if slide_word[0].islower():
                        violations += 1
                        print(f'{filepath}:{lineno}: {line.rstrip()}')
                        break  # one report per line
    except (IOError, UnicodeDecodeError):
        pass

if violations == 0:
    print(f'lint-slide-names: OK — no violations in {len(files)} file(s) checked')
    sys.exit(0)
else:
    print()
    print(f'lint-slide-names: FAIL — {violations} violation(s) found.')
    print('  Slide type names are proper nouns: capitalise the first letter in prose.')
    print("  Wrong:   'the poll slide'     → Correct: 'the Poll slide'")
    print("  Wrong:   'a brainstorm slide' → Correct: 'a Brainstorm slide'")
    sys.exit(1)
PYEOF
