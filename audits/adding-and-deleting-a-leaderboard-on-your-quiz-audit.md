# Audit — adding-and-deleting-a-leaderboard-on-your-quiz
**File:** `adding-and-deleting-a-leaderboard-on-your-quiz.md`
**URL:** https://help.ahaslides.com/portal/en/kb/articles/adding-and-deleting-a-leaderboard-on-your-quiz
**Date:** 2026-06-22
**Audited against:** kb-article-writer / kb-article-auditor SKILL.md (installed in `.claude/skills/`)

This is the first "Features and functions" category sample, rewritten per the KB writing standard and audited below.

## Frontmatter

| Check | Status |
|-------|--------|
| `description` present and accurate (1–2 sentences, complete) | OK |
| `questions_answered` has 3+ natural-language questions | OK — 8 questions |
| `user_intents` describes what user is trying to do | OK — 3 intents |
| `plan_required` field set | OK — `All` |
| `tags` include feature name and synonyms | OK — quiz, leaderboard, leader board, pop-up leaderboard, scores, rankings |
| `related` links to companion articles | OK — `how-to-make-and-run-a-quiz` |
| `zoho_id` present (required during migration period) | OK — preserved as `zoho_id` and legacy `id` |

## Structure

| Check | Status |
|-------|--------|
| Opening sentence answers the core question without preamble | OK — "A leaderboard displays the rankings and scores of participants in an AhaSlides quiz." |
| Every heading is descriptive and makes sense out of context | OK |
| Every heading uses sentence case (first word + proper nouns only) | OK — repo `sentence-case-headings.py` treats "Leaderboard" as a proper noun and enforces "The Leaderboard slide" / "The pop-up Leaderboard"; script passes |
| Paragraphs are ≤4 lines | OK |
| Steps are numbered and each step contains exactly one action | N/A — conceptual/reference article, no numbered procedure needed |
| Article covers one user intent | OK — leaderboard add/delete/view only |

## Agent readability

| Check | Status |
|-------|--------|
| Self-contained paragraphs | OK |
| Plan requirement stated inline in body (not only in frontmatter) | OK — `All` plan; the binding constraint (quiz-slide-only) is stated inline in a hint block |
| All conditions explicit ("only on Pro", "only when X is enabled") | OK — "works only with quiz slide types", "except the Spinner Wheel" |
| Named entities spelled out in full | OK — "AhaSlides quiz", "Content tab", "Trophy icon", "control bar" |
| No ambiguous conditionals | OK |
| Causal language explicit | OK — "because it is designed for live presentations" |

## Voice and tone

| Check | Status |
|-------|--------|
| Answer-first opening | OK |
| No filler sentences | OK — removed "Below is an interactive demo, which will help you experience this function" |
| No corporate jargon or noun stacks | OK |
| No AI filler words | OK |
| No em dashes (—) anywhere in the body | OK — verified by grep, zero em dashes |
| No hype or over-the-top claims | OK |
| Audience-centric framing | OK — "lets a presenter check live scores at any point" |
| No hedging | OK |

## Content

| Check | Status |
|-------|--------|
| No draft or internal notes in the published article | OK |
| Video links use watchable URLs (not embed URLs) | OK — Navattic interactive demo is a watchable capture URL |
| External links resolve correctly (spot check) | OK — internal KB link verified by `scripts/lint-kb-links.sh` |
| Related articles linked where relevant | OK — links to `how-to-make-and-run-a-quiz.md` |

## NOT OK — summary of issues to fix

None. All checks pass.

## Notes for the batch rollout

1. Frontmatter migration pattern used here: keep legacy fields (`id`, `permalink`, `category_id`, `permission`, `portal_url`, `mcp_actions`) and ADD the writer-standard fields (`description`, `questions_answered`, `user_intents`, `related`, `tags` as a list, `zoho_id`). This preserves Zoho traceability and MCP action hints while satisfying the new standard.
2. Category renamed in frontmatter from "Using Slide Types on AhaSlides" to "Features and functions" to match `SUMMARY.md`.
3. Run all four repo lints on every rewritten article before commit: `lint-kb-links.sh`, `lint-slide-names.sh`, `lint-zoho-refs.sh`, and `sentence-case-headings.py`. The heading script treats slide/feature names ("Leaderboard", "Spinner Wheel") as proper nouns — defer to it rather than the generic sentence-case rule.
4. Old caveat blockquotes were converted to GitBook `{% hint style="info" %}` blocks per the writing standard.
