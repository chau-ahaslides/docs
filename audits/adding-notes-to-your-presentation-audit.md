# Audit — adding-notes-to-your-presentation
**File:** `adding-notes-to-your-presentation.md`
**URL:** https://help.ahaslides.com/portal/en/kb/articles/adding-notes-to-your-presentation
**Date:** 2026-06-22
**Audited against:** kb-article-writer / kb-article-auditor SKILL.md (installed in `.claude/skills/`)

Part of the "Features and functions" batch rewrite (AKB-44). Rewritten per the KB writing standard and audited below.

## Frontmatter

| Check | Status |
|-------|--------|
| `description` present and accurate (1–2 sentences, complete) | OK |
| `questions_answered` has 3+ natural-language questions | OK — 5 questions |
| `user_intents` describes what user is trying to do | OK — 2 intents |
| `plan_required` field set | OK — `All` |
| `tags` include feature name and synonyms | OK — notes, speaker notes, remote control |
| `related` links to companion articles | OK — `presenter-role` |
| `zoho_id` present | OK — preserved as `zoho_id` and legacy `id` |

## Structure

| Check | Status |
|-------|--------|
| Opening sentence answers the core question without preamble | OK — "You can write private notes for each slide." |
| Every heading is descriptive and makes sense out of context | OK |
| Every heading uses sentence case | OK — `sentence-case-headings.py` passes |
| Paragraphs are ≤4 lines | OK |
| Steps numbered, one action each | N/A — short how-to, no multi-step procedure |
| Article covers one user intent | OK — adding and viewing notes only |

## Agent readability

| Check | Status |
|-------|--------|
| Self-contained paragraphs | OK |
| Plan requirement stated inline | OK — All plan; no gate to state |
| All conditions explicit | OK — "visible only on the Remote control window" |
| Named entities spelled out in full | OK — "Remote control", "AhaSlides editor" |
| No ambiguous conditionals | OK |
| Causal language explicit | OK |

## Voice and tone

| Check | Status |
|-------|--------|
| Answer-first opening | OK |
| No filler sentences | OK |
| No corporate jargon or noun stacks | OK |
| No AI filler words | OK |
| No em dashes (—) anywhere in the body | OK — verified by grep |
| No hype | OK |
| Audience-centric framing | OK |
| No hedging | OK |

## Content

| Check | Status |
|-------|--------|
| No draft or internal notes published | OK |
| Video links use watchable URLs | N/A — no video |
| External links resolve correctly | OK — no body links; `remote-control.md` absent locally, so no broken relative link added |
| Related articles linked where relevant | OK — `presenter-role` in frontmatter |

## NOT OK — summary of issues to fix

None. All checks pass.
