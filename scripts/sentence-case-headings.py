#!/usr/bin/env python3
"""
sentence-case-headings.py — Convert H2 and H3 headings to sentence case.

Rules:
  - Only touch lines starting with `## ` or `### ` (not H1, not H4+)
  - Do NOT touch lines inside fenced code blocks (```)
  - Do NOT touch YAML frontmatter (between --- delimiters at start of file)
  - Do NOT touch headings whose text is a kebab-case slug (e.g. ### some-article-slug)
  - First word of heading: always capitalize
  - Tokens in the PROPER_NOUNS allowlist: preserve their exact casing
  - ALL-CAPS tokens (e.g. FAQ, QR, AI, API): preserve as-is
  - Everything else: lowercase
  - Preserve inline code, markdown link URLs, emoji, and punctuation
  - Numbered headings like "## 1. Some Title" — the text after "N. " is sentence-cased
    (the word immediately after the number+dot is NOT automatically capitalized —
     sentence case means only first word of the full heading is capitalized)
"""

import re
import sys
import glob
import os

# ---------------------------------------------------------------------------
# PROPER-NOUN ALLOWLIST
# Multi-word phrases must appear BEFORE their component words so the
# longest-match wins. The script matches case-insensitively, then restores
# the exact canonical casing listed here.
# ---------------------------------------------------------------------------

PROPER_NOUNS = [
    # Multi-word brands / product names (longest first)
    "Google Slides",
    "Microsoft Teams",
    "Word Cloud",
    "Spinner Wheel",
    "Match Pairs",
    "Correct Order",
    "Pin on Image",
    "Rating Scale",
    "Idea Board",
    "Content slide",    # slide type reference (guards against bare "content")
    "Open-ended",       # hyphenated form
    "Open Ended",       # spaced form
    # Single-word brands
    "AhaSlides",
    "Google",
    "PowerPoint",
    "Microsoft",
    "Teams",
    "RingCentral",
    "YouTube",
    "Slack",
    "GitBook",
    "Mentimeter",
    "PayPal",
    "Zoom",
    "Excel",
    # Slide types / feature proper nouns (AKB-3 capitalisation rule)
    # "Content" and "Heading" omitted — too ambiguous as common nouns
    "Categorise",
    "Brainstorm",
    "Ranking",
    "Quiz",
    "Poll",
    "Leaderboard",
    "Survey",
    "Surveys",
    # Acronyms that ALLCAPS pattern won't catch (mixed case / special chars)
    "Q&A",    # only 1 uppercase letter before & so ALLCAPS pattern misses it
    # The pronoun I (as a standalone word)
    "I",
]

# Sort by descending length so multi-word matches are tried first
PROPER_NOUNS_SORTED = sorted(PROPER_NOUNS, key=lambda x: -len(x))

# Pattern to detect kebab-case slugs (INDEX.md article reference headings)
SLUG_PATTERN = re.compile(r'^[a-z0-9][a-z0-9-]+$')

# Protected inline patterns — extracted and restored verbatim
# Order matters: URLs in markdown links, then bare URLs, then inline code
MARKDOWN_LINK_PATTERN = re.compile(r'\[([^\]]*)\]\(([^)]*)\)')
BARE_URL_PATTERN = re.compile(r'https?://\S+')
INLINE_CODE_PATTERN = re.compile(r'`[^`]*`')

# ALL-CAPS acronym pattern (2+ consecutive uppercase letters).
# Lookbehind excludes letters AND digits to avoid matching e.g. "5S" in "5s Countdown".
ALLCAPS_PATTERN = re.compile(r'(?<![A-Za-z0-9])([A-Z]{2,}(?:[&/-][A-Z]+)*)(?![A-Za-z])')


def build_noun_pattern():
    """Build a regex matching all proper nouns as whole words/phrases."""
    parts = []
    for noun in PROPER_NOUNS_SORTED:
        escaped = re.escape(noun)
        # Word boundaries via lookbehind/lookahead (not \b — avoids hyphen issues)
        parts.append(r'(?<![A-Za-z])' + escaped + r'(?![A-Za-z])')
    return re.compile('(' + '|'.join(parts) + ')', re.IGNORECASE)


NOUN_PATTERN = build_noun_pattern()


def find_canonical(matched_text):
    """Return the canonical-case form of a matched proper noun."""
    lower = matched_text.lower()
    for noun in PROPER_NOUNS_SORTED:
        if noun.lower() == lower:
            return noun
    return matched_text


def sentence_case_heading(heading_text):
    """
    Convert heading_text (the text portion after '## ' or '### ') to sentence case.
    Returns the converted text, or the original if no change is needed.
    """
    # --- Guard: skip pure kebab-case slugs (INDEX.md article entries) ---
    stripped = heading_text.strip()
    # Remove leading emoji + whitespace for the slug check
    core = re.sub(r'^[^\w]+', '', stripped)
    if SLUG_PATTERN.match(core):
        return heading_text

    text = heading_text

    # -----------------------------------------------------------------------
    # Phase 1: Extract protected spans that must not be touched.
    # Each replacement is a NUL-delimited placeholder so we never lose content.
    # -----------------------------------------------------------------------
    protected_items = []

    def stash(content):
        idx = len(protected_items)
        protected_items.append(content)
        return f'\x00PROT{idx}\x00'

    # 1a. Markdown links: protect the URL part, but sentence-case the label
    # We replace the whole link `[Label](URL)` with a placeholder, then later
    # re-inject it with the label sentence-cased and the URL unchanged.
    # We'll handle label sentence-casing as part of normal processing.
    # Actually: simplest approach — protect the entire link syntax verbatim.
    # The link label text is already part of the heading and will be processed
    # as regular words, BUT if we protect the whole `[...](...)` then the label
    # won't be sentence-cased either.
    # Decision: sentence-case the label (it's visible text) but protect the URL.
    # Implementation: replace `(URL)` part with placeholder, leaving `[label]` free.

    def replace_url_in_link(m):
        label = m.group(1)
        url = m.group(2)
        url_placeholder = stash('(' + url + ')')
        return '[' + label + ']' + url_placeholder

    text = MARKDOWN_LINK_PATTERN.sub(replace_url_in_link, text)

    # 1b. Bare URLs (https://... not inside a markdown link)
    text = BARE_URL_PATTERN.sub(lambda m: stash(m.group(0)), text)

    # 1c. Inline code `...`
    text = INLINE_CODE_PATTERN.sub(lambda m: stash(m.group(0)), text)

    # -----------------------------------------------------------------------
    # Phase 2: Identify proper nouns and ALL-CAPS tokens (protected from lowercasing)
    # -----------------------------------------------------------------------
    protected_spans = []  # list of (start, end, canonical_replacement)

    # Find proper nouns
    for m in NOUN_PATTERN.finditer(text):
        canon = find_canonical(m.group(0))
        protected_spans.append((m.start(), m.end(), canon))

    # Find ALL-CAPS tokens not already protected
    for m in ALLCAPS_PATTERN.finditer(text):
        s, e = m.start(), m.end()
        overlap = any(not (e <= ps or s >= pe) for ps, pe, _ in protected_spans)
        if not overlap:
            protected_spans.append((s, e, m.group(0)))

    protected_spans.sort(key=lambda x: x[0])

    # -----------------------------------------------------------------------
    # Phase 3: Build the sentence-cased result
    # -----------------------------------------------------------------------
    result = []
    prev = 0
    first_alpha_done = False  # track whether we've capitalized the first alpha

    def process_plain(segment, is_first):
        """Lowercase a text segment. If is_first, capitalize the first WORD-STARTING alpha char.

        A word-starting alpha is one NOT immediately preceded by a digit.
        If the very first alpha char IS digit-preceded (e.g. 's' in '5s'), we do NOT
        capitalize anything — the digit-token was the first word, just not uppercaseable.
        """
        if not segment:
            return segment
        if is_first:
            # Find the first alpha char in the segment
            for i, ch in enumerate(segment):
                if ch.isalpha():
                    # If this alpha char is immediately preceded by a digit, it's part
                    # of a digit+letter token (like '5s'). Don't capitalize — lowercase all.
                    if i > 0 and segment[i-1].isdigit():
                        return segment.lower()
                    # Otherwise, capitalize this char and lowercase the rest
                    return segment[:i] + ch.upper() + segment[i+1:].lower()
            return segment.lower()
        else:
            return segment.lower()

    for start, end, canon in protected_spans:
        seg = text[prev:start]
        if not first_alpha_done:
            result.append(process_plain(seg, is_first=True))
            first_alpha_done = True
        else:
            result.append(seg.lower())
        result.append(canon)
        prev = end

    # Remaining text after the last protected span
    seg = text[prev:]
    if not first_alpha_done:
        result.append(process_plain(seg, is_first=True))
    else:
        result.append(seg.lower())

    text = ''.join(result)

    # -----------------------------------------------------------------------
    # Phase 4: Restore protected placeholders
    # -----------------------------------------------------------------------
    for i, content in enumerate(protected_items):
        text = text.replace(f'\x00PROT{i}\x00', content)

    # -----------------------------------------------------------------------
    # Phase 5: Final safety — ensure the very first word-starting alpha char
    # is uppercase (handles edge cases like emoji/number prefixes).
    # Only fires if process_plain didn't already handle it (e.g. first protected
    # span was first in text with no leading plain segment).
    # If the first alpha char is digit-preceded, leave it alone.
    # -----------------------------------------------------------------------
    for i, ch in enumerate(text):
        if ch.isalpha():
            # Skip digit-preceded alpha chars (part of tokens like '5s')
            if i > 0 and text[i-1].isdigit():
                break  # first alpha is digit-preceded — don't capitalize
            if not ch.isupper():
                text = text[:i] + ch.upper() + text[i+1:]
            break

    return text


# ---------------------------------------------------------------------------
# File processing
# ---------------------------------------------------------------------------

def process_file(filepath, dry_run=False):
    """
    Process a single .md file.
    Returns (changed_count, original_lines, new_lines, change_log).
    change_log is a list of (lineno, old_text, new_text).
    """
    with open(filepath, encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    in_frontmatter = False
    in_code_block = False
    changed_count = 0
    change_log = []

    for i, line in enumerate(lines):
        stripped = line.rstrip('\n')

        # --- YAML frontmatter detection ---
        if i == 0 and stripped == '---':
            in_frontmatter = True
            new_lines.append(line)
            continue
        if in_frontmatter:
            new_lines.append(line)
            if stripped == '---' and i > 0:
                in_frontmatter = False
            continue

        # --- Fenced code block detection ---
        if re.match(r'^(`{3,}|~{3,})', stripped):
            in_code_block = not in_code_block
            new_lines.append(line)
            continue
        if in_code_block:
            new_lines.append(line)
            continue

        # --- H2 and H3 heading detection (not H1, not H4+) ---
        m2 = re.match(r'^(## )(.+?)(\n?)$', line)
        m3 = re.match(r'^(### )(.+?)(\n?)$', line)
        m = m2 or m3

        if m:
            prefix = m.group(1)
            heading = m.group(2)
            newline_char = m.group(3)

            new_heading = sentence_case_heading(heading)

            if new_heading != heading:
                changed_count += 1
                change_log.append((i + 1, heading, new_heading))
                new_lines.append(prefix + new_heading + newline_char)
                continue

        new_lines.append(line)

    return changed_count, lines, new_lines, change_log


def main():
    import argparse
    parser = argparse.ArgumentParser(
        description='Convert H2/H3 headings in Markdown files to sentence case.'
    )
    parser.add_argument('files', nargs='*',
                        help='Markdown files to process (default: all *.md in cwd)')
    parser.add_argument('--dry-run', action='store_true',
                        help='Print changes without writing files')
    args = parser.parse_args()

    if args.files:
        files = []
        for a in args.files:
            expanded = glob.glob(a)
            files.extend(expanded if expanded else [a])
    else:
        files = sorted(glob.glob('*.md'))

    files = sorted(set(f for f in files if os.path.isfile(f) and f.endswith('.md')))

    total_changed = 0
    files_changed = 0

    for filepath in files:
        changed, orig, new_lines, changes = process_file(filepath, dry_run=args.dry_run)
        if changed > 0:
            files_changed += 1
            total_changed += changed
            basename = os.path.basename(filepath)
            if args.dry_run:
                print(f'\n{basename}: {changed} heading(s) to change')
                for lineno, old, new in changes:
                    print(f'  L{lineno}: {old!r}')
                    print(f'        → {new!r}')
            else:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.writelines(new_lines)
                print(f'{basename}: {changed} heading(s) changed')
                for lineno, old, new in changes:
                    print(f'  L{lineno}: {old!r} → {new!r}')

    action = 'to change' if args.dry_run else 'changed'
    print(f'\nTotal: {total_changed} heading(s) {action} across {files_changed} file(s)')


if __name__ == '__main__':
    main()
