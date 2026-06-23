---
name: kb-article-auditor
description: >
  Audit an AhaSlides Knowledge Base article against the KB writing standard.
  Produces a structured OK / NOT OK report saved to audits/<slug>-audit.md.
  Use this skill whenever someone asks to audit, review, check, or inspect a KB article.
  Trigger on: "audit this article", "review this KB article", "check this article",
  "what's wrong with this article", paste of a docs.ahaslides.com URL with no other instruction.
---

# KB Article Auditor — AhaSlides Help Centre (GitBook)

You are auditing a published or draft KB article for the AhaSlides Help Centre against
the AhaSlides KB writing standard. Your job is to produce a structured pass/fail report
and save it so it can be acted on later.

---

## Step 0 — Fetch the article

If given a URL, fetch the raw Markdown version by appending `.md` to the path:

```
https://docs.ahaslides.com/[path].md
```

If the `.md` version is unavailable, fetch the HTML page and extract the full text.
Do not summarise — audit the verbatim content.

---

## Step 1 — Run the audit

Check every item below. Mark each as **OK** or **NOT OK**.
For every NOT OK, add a one-line note explaining what's wrong.
For frontmatter checks marked `?`, note that the raw file needs to be inspected.

### Frontmatter

| Check | Status |
|-------|--------|
| `description` present and accurate (1–2 sentences, complete) | |
| `questions_answered` has 3+ natural-language questions | |
| `user_intents` describes what user is trying to do | |
| `plan_required` field set | |
| `tags` include feature name and synonyms | |
| `related` links to companion articles | |
| `zoho_id` present (required during migration period) | |

### Structure

| Check | Status |
|-------|--------|
| Opening sentence answers the core question without preamble | |
| Every heading is descriptive and makes sense out of context | |
| Every heading uses sentence case (first word + proper nouns only) | |
| First word after a colon in a heading is capitalised (e.g. "Step 1: Log in...") — a lowercase first word after a colon is a FAIL | |
| Paragraphs are ≤4 lines | |
| Steps are numbered and each step contains exactly one action | |
| Article covers one user intent | |
| **A `## Frequently asked questions` section is present with 3+ `###` question headings** *(blocking — see below)* | |
| **(Slide-type articles only) Preview-mode screenshot + tutorial-video placement meet the slide-type standard** *(blocking — see below)* | |

{% hint style="warning" %}
**Missing FAQ is an automatic NOT OK.** Every KB article must include a `## Frequently asked questions`
section containing at least three `###` question headings (each written as a user would type it, with a
self-contained 1–3 sentence answer). If the article has no FAQ section, mark this check **NOT OK** and
**fail the whole audit** — the article cannot pass regardless of how every other check scores. A
dedicated FAQ-type article satisfies this inherently (its body *is* the FAQ); every other article type
(how-to, troubleshooting, conceptual, reference) must carry an FAQ section of its own.
{% endhint %}

{% hint style="warning" %}
**Slide-type articles must meet the slide-type media standard (two blocking gates).** A *slide-type
article* documents one interactive slide type (Categorise, Word Cloud, Q&A, Brainstorm, Open-ended,
Match Pairs, Correct Order, Spinner Wheel, Pin on Image, Rating Scale, Ranking, Idea Board, Quiz, Poll,
and similar). For these articles, both of the following are required, and **failing either one fails the
whole audit**:

1. **Preview-mode screenshot** at the top of the article (after the H1) — a screenshot of the slide type
   in preview mode showing **both the presenter screen and the audience screen** in one image, with
   **responses populated** (not an empty slide), exported at **1920 × 1080**.
2. **Product-tour tutorial video** embedded in its own `### Watch the tutorial` H3 **after the setup
   steps** (before "Previewing and presenting"), using a watchable YouTube URL in a `{% embed %}` block —
   **not** stacked at the top next to the hero image.

See the **kb-slide-type-standard** skill for the full spec, the canonical reference
(`using-the-categorise-slide.md`), and the audit checklist. Non-slide-type articles (account,
billing, general how-to, conceptual) are exempt from this gate — mark the check **OK** with a note that
it does not apply.
{% endhint %}

### Agent readability

| Check | Status |
|-------|--------|
| Self-contained paragraphs (make sense without surrounding context) | |
| Plan requirement stated inline in body (not only in frontmatter) | |
| All conditions explicit ("only on Pro", "only when X is enabled") | |
| Named entities spelled out in full (no "it", "the feature", "higher plans", "the system") | |
| No ambiguous conditionals ("this may vary" without specifying what it varies by) | |
| Causal language explicit where logic flows from one thing to another | |

### Voice and tone

| Check | Status |
|-------|--------|
| Answer-first opening (no "In this article we'll cover...") | |
| No filler sentences | |
| No corporate jargon or noun stacks | |
| No AI filler words ("actually", "genuinely", "it's worth remembering") | |
| No em dashes (—) anywhere in the body | |
| No hype or over-the-top claims ("powerful", "amazing", "game-changing") | |
| Audience-centric framing (what the user achieves, not what the feature does) | |
| No hedging ("feel free to", "you might want to", "you can go ahead and") | |

### Content

| Check | Status |
|-------|--------|
| No draft or internal notes in the published article | |
| Video links use watchable URLs (not embed URLs) | |
| External links resolve correctly (spot check) | |
| Related articles linked where relevant | |

---

## Step 2 — Save the report

Save the completed audit table to:

```
/Users/cheryl/workspaces/zoho/audits/[article-slug]-audit.md
```

Use this file header:

```markdown
# Audit — [article-slug]
**URL:** [full URL]
**Date:** [today's date]
```

Then paste the completed audit tables, followed by a **NOT OK — summary of issues to fix** section
that lists only the failures, numbered, with one clear action per item.

---

## What good looks like — OK benchmarks from real audits

Use these to calibrate your judgement. Each is a check that passed with a real example.

### Structure

**Opening answers the core question without preamble**
> "The Content v2 slide is a design canvas for creating polished, structured presentation slides."
> "An Idea Board slide lets your audience submit ideas and see them organized into themes, not just read a scattered list of responses."

**Headings descriptive and self-contained**
> "How to set up the Idea Board slide" / "Two ways to build your slide" / "How the grouping works"

**Sentence case headings**
> "How to add a Content v2 slide" ✅
> "How to set up your Teams" ✅ (proper noun capitalised)

**First word after a colon capitalised**
> "Step 1: Log in to your account" ✅ / "Option 2: Manual configuration" ✅
> "Step 1: log in to your account" ❌ FAIL (lowercase first word after the colon)
> Sentence case still applies to the rest of the heading — only the first word after the colon is forced to capital.

**Article covers one user intent**
All three audited articles stayed on topic — no scope creep into a second unrelated feature.

### Agent readability

**Self-contained paragraphs**
> "When the Groups setting is disabled, all answers will appear one after another in the canvas."

Works standalone — an agent retrieving only this sentence knows the context (Groups off) and the outcome (linear display).

**Explicit conditions**
> "When enabled, users can set the number of votes each participant can use, ranging from 1 to 20."

Conditions named before the outcome, not left implicit.

**Causal language explicit**
> "The act of deciding where each belongs forces them to understand what defines each category, not just memorize labels."

Shows cause and effect directly: what the user does → why it matters.

**Plan requirement stated in body**
> "Please note that this feature is only available on Edu Medium, Edu Large, Pro, and Enterprise plans"

Plan gate stated inline at first mention in a hint block, not only in frontmatter.

### Voice and tone

**No AI filler words**
None of the three baseline articles contained "actually", "genuinely", "it's worth remembering", or "it's not X but Y".

**No hype**
Features described by what they do, not how impressive they are. No "powerful", "amazing", "game-changing".

**No em dashes**
Zero em dashes in the Idea Board and Team Quiz articles. (Content v2 failed this.)

**No corporate jargon**
> "Type their ideas from their phones or devices" ✅
> "Watch as ideas get organized into groups" ✅

**Audience-centric framing**
> "Results are updated in real time, helping you spot patterns" (Idea Board)
> "you will be able to see which players have joined which teams" (Team Quiz)

**No draft notes published**
Idea Board and Team Quiz had no internal scaffolding or to-do notes visible in the published article.
