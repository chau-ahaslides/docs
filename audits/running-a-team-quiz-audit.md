# Audit — running-a-team-quiz
**File:** `running-a-team-quiz.md`
**URL:** https://help.ahaslides.com/portal/en/kb/articles/running-a-team-quiz
**Date:** 2026-06-23
**Audited against:** kb-article-writer / kb-article-auditor SKILL.md

Re-audit of the "Features and functions" batch (AKB-51). Audited against the verbatim local `.md` file.

## Frontmatter

| Check | Status |
|-------|--------|
| `description` present and accurate | OK |
| `questions_answered` has 3+ questions | OK — 6 questions |
| `user_intents` present | OK — 2 intents |
| `plan_required` set | OK — `Pro` |
| `tags` include feature name and synonyms | OK — team quiz, teamplay, teams, quiz, trivia, scoring |
| `related` links to companion articles | OK — none applicable; left empty |
| `zoho_id` present | OK |

## Structure

| Check | Status |
|-------|--------|
| Opening answers the core question | OK |
| Headings descriptive and self-contained | OK |
| Sentence case headings | NOT OK — generic nouns are capitalised mid-heading: "How a team Quiz works", "How to set up your Teams", "How participants join Teams", "Step 3: Set the number of Teams and team size", "Step 4: Choose how Teams score points", "Step 5: Name your Teams", "Step 1: Open the Quiz settings", "Step 6: Hide the individual Leaderboard". "team quiz"/"teamplay" are lowercase common nouns in the body, so "Teams"/"Quiz" should be lowercase in the headings. Step 3 even mixes "Teams" and "team" in the same heading. |
| First word after a colon capitalised | OK — "Step 1: Open...", "Step 2: Turn...", "Step 3: Set...", "Step 4: Choose...", "Step 5: Name...", "Step 6: Hide..." |
| Paragraphs ≤4 lines | OK |
| Steps numbered, one action each | OK — six numbered setup steps |
| One user intent | OK — running a team quiz |
| FAQ section with 3+ `###` questions | OK — 5 questions |
| Slide-type media gate | N/A — not a slide-type article (scored quiz feature documentation, not an individual interactive slide-type article) |

## Agent readability

| Check | Status |
|-------|--------|
| Self-contained paragraphs | OK |
| Plan requirement inline | OK — "available only on the Edu Medium, Edu Large, Pro, and Enterprise plans" stated in body and FAQ |
| Conditions explicit | OK — three scoring rules described with their effects; team/size limits given (500 teams, 1200 per team) |
| Named entities in full | OK — General quiz settings, Play as team, Set up, Hide individual leaderboard, (change team), + Add a team, Show Individual Ranking |
| No ambiguous conditionals | OK |
| Causal language explicit | OK — explains why total-score handicaps smaller teams |

## Voice and tone

| Check | Status |
|-------|--------|
| Answer-first opening | OK |
| No filler | OK |
| No corporate jargon | OK |
| No AI filler words | OK |
| No em dashes | OK |
| No hype | OK |
| Audience-centric framing | OK |
| No hedging | OK |

## Content

| Check | Status |
|-------|--------|
| No draft/internal notes | OK |
| Video links watchable | N/A — no video |
| External links resolve | OK |
| Related articles linked | OK — none applicable |

## NOT OK — summary of issues to fix

1. **Sentence-case heading violations.** Several headings capitalise the common nouns "Teams" and "Quiz" mid-heading, which the body keeps lowercase ("team quiz", "teamplay"). Recase the following to sentence case: "How a team **quiz** works", "How to set up your **teams**", "How participants join **teams**", "Step 1: Open the **quiz** settings", "Step 3: Set the number of **teams** and team size", "Step 4: Choose how **teams** score points", "Step 5: Name your **teams**", "Step 6: Hide the individual **leaderboard**". Step 3 in particular is inconsistent within itself ("Teams" vs "team").
