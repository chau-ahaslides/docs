---
name: kb-article-writer
description: >
  End-to-end guide for writing AhaSlides Knowledge Base articles that work well for
  both human readers and AI agents. Articles live in a git repo and sync to GitBook.
  Use this skill whenever someone asks to write, draft, rewrite, or improve a KB article
  for the AhaSlides Help Centre.
  Trigger on: "write a KB article", "draft a help article", "write up how to use X",
  "create a KB for Y", "help me write a knowledge base article", "migrate this article to GitBook".
  For auditing existing articles, use the kb-article-auditor skill instead.
---

# KB Article Writer — AhaSlides Help Centre (GitBook)

You are writing or updating a Knowledge Base article for the AhaSlides Help Centre.
Articles live as Markdown files in a **git repo** that syncs to GitBook.
The local `.md` file is the **source of truth** — what's in git is what publishes.

The article must serve two audiences simultaneously:
- **Human readers** who scan for quick answers
- **AI agents** that retrieve and chunk the content to answer support queries

These goals are compatible. Writing clearly for humans also makes content reliable for agents.
The only extra work is the semantic metadata layer (frontmatter fields), which humans never
see in GitBook but agents depend on for retrieval precision.

---

## File format

Each article is a single `.md` file. Filename = the article slug (kebab-case).

```
how-to-use-word-cloud.md
billing-address.md
cancelling-your-subscription.md
```

---

## Article structure

Every article follows this layout, in order:

### 1. Frontmatter (YAML — not visible to GitBook readers)

```yaml
---
title: "[Full title — verb-led for how-tos, e.g. 'Using the Word Cloud Slide']"
description: "[1–2 sentences. What this article covers. Written so an AI can decide whether to retrieve it.]"
category: "[Category name, e.g. 'Slide Types', 'Billing', 'Account']"
plan_required: "Free | Pro | Enterprise | All"
last_updated: "YYYY-MM-DD"
tags:
  - [feature name]
  - [synonym or related term]
questions_answered:
  - "[Exact natural-language question this article answers — #1]"
  - "[Question #2]"
  - "[Question #3]"
user_intents:
  - "[What the user is trying to do, e.g. 'set up a live word cloud for audience responses']"
  - "[Secondary intent if any]"
related:
  - "[slug of related article]"
zoho_id: "[Zoho article ID — keep during migration for traceability, can remove later]"
---
```

**The `questions_answered` and `user_intents` fields are the most important for AI retrieval.**
These are the semantic metadata that let agents match natural-language queries to the right article.
Write them as real questions a user would type, not keyword lists.

Minimum 3 entries in `questions_answered`. Think about:
- The obvious question ("How do I set up a word cloud?")
- The problem-framing question ("Why isn't my word cloud showing responses?")
- The what-is question ("What is a word cloud slide?")

### 2. Opening answer (1–2 sentences, no heading)

State what the feature does or what problem it solves. The core answer goes here —
don't build up to it. A user (or agent) who reads only this will understand what the article is about.

> ❌ "In this article, we'll walk you through everything you need to know about Word Cloud..."
> ✅ "A word cloud lets participants submit short responses to a question, displayed live on screen with the most popular answers appearing largest."

### 3. Body — structured for scanning and chunking

Use the appropriate structure for the article type:

#### How-to articles (step-by-step)

```markdown
## [Main task heading — verb-led, e.g. "Setting up your Word Cloud"]

[One sentence of context — when or why you'd do this. Optional if obvious.]

### Step 1: [Verb-led step name]

[What to do. One action per step. Name the button, tab, or menu item explicitly.]

![Alt text describing the screenshot](image-url)

### Step 2: [Next action]

[Content...]
```

Rules for steps:
- Each step must make sense standalone — agents retrieve chunks, not full articles
- Number steps; never use "next" or "then" as a substitute for a step number
- State conditions explicitly: "Only if X is enabled", "Pro plan only"
- One action per step — don't combine two actions in one numbered step

#### Troubleshooting articles

```markdown
## [Problem statement — written as the user would describe it]

[One sentence: what causes this.]

**Solution:**

1. [First thing to try]
2. [Second thing to try]
3. [Escalation path if neither works]

{% hint style="info" %}
[Any important caveat — plan requirement, known edge case]
{% endhint %}
```

#### Conceptual / reference articles

```markdown
## What is [feature]?

[2–3 sentence explanation. Define the thing plainly.]

## How it works

[Short explanation of the mechanism, if non-obvious.]

## [Key sub-topic or option]

[Keep each section self-contained — it may be the only chunk retrieved.]
```

#### FAQ articles

Use when multiple short, related questions share a topic but don't warrant separate articles.
Good candidates: billing questions, plan comparison questions, participant-facing questions,
account questions.

**Step 1 — Source the questions before writing**

Gather real user questions in this priority order:

1. **Slack support channels** — the best source of verbatim user language. Search for the
   feature name in support/customer-facing channels and look for messages starting with
   "how do I", "why can't I", "does X support", "what happens when".
   ```
   slack_search_public_and_private(query: "[feature name]", ...)
   ```
   Note: the Zoho Desk MCP does **not** have ticket search — KB articles only.
   Slack is the only way to mine real support questions programmatically.

2. **Existing Zoho article** — fetch the live article and invert every section heading into
   a question. "Setting up your Word Cloud" → "How do I set up a Word Cloud?"
   ```
   ZohoDesk_getArticle(orgId: "736517000000000000", articleId: "[ID]", locale: "en")
   ```

3. **Existing `questions_answered` frontmatter** — the local `.md` file may already have
   user-intent phrasing worth reusing verbatim.

4. **Inference from the feature** — settings, plan restrictions, and edge cases generate
   predictable questions. For each plan restriction: "what does a Free user hit when they
   try this?" For each setting: "what's the most confusing default?"

Aim for 5–10 questions per FAQ article. Fewer than 5 → fold into the parent how-to article.
More than 10 → split by sub-topic.

**Step 2 — Write the FAQ**

```markdown
## Frequently asked questions — [Topic]

### [Most common question, written exactly as a user would ask it?]

[Direct answer in 1–3 sentences. Self-contained — no "as mentioned above".]

### [Second question?]

[Answer. State any conditions explicitly: "only on Pro plan", "only if X is enabled".]

### [Third question?]

[Answer. If the answer needs steps, keep it to 3 or fewer — otherwise it's its own how-to.]
```

**FAQ rules:**
- Each question is a `###` heading — not bold text or a bullet. This makes each Q&A a
  discrete retrievable chunk for agents, and gives GitBook anchor links for free.
- Write questions exactly as a user would type them, not as a documentation author would
  frame them. "Can I switch from monthly to annual mid-subscription?" not "Subscription changes."
- Each answer must be fully self-contained. An agent may retrieve only one Q&A pair.
- Put the most common or highest-stakes question first.
- Keep answers short — if an answer needs more than 4–5 sentences or more than 3 steps,
  it belongs in its own how-to article. Link to it from the FAQ answer instead.
- Copy the FAQ questions verbatim into `questions_answered` frontmatter — they're already
  perfectly formatted for agent retrieval, no extra work needed.

**When NOT to use FAQ format:**
- Questions are sequential (user needs all answers in order) → use How-to instead
- Only one real question → use a focused how-to or troubleshooting article
- Questions span multiple unrelated topics → split into separate FAQ articles per topic

### 4. Notes, tips, and warnings

GitBook uses hint blocks for callouts:

```markdown
{% hint style="info" %}
[Useful context or tip]
{% endhint %}

{% hint style="warning" %}
[Something that could go wrong or cause data loss]
{% endhint %}

{% hint style="success" %}
[Confirmation that something is working as expected]
{% endhint %}
```

Use plain blockquotes for inline tips that don't warrant a full hint block:
```markdown
> **Tip:** [Optional shortcut or best practice]
```

Put plan restrictions in a hint block when they apply mid-article:
```markdown
{% hint style="info" %}
This setting is only available on **Pro** and **Enterprise** plans.
{% endhint %}
```

---

## Writing rules

### For human readers

- **Answer first.** Never open with background or "in this article we'll cover..."
- **Short paragraphs.** 3–4 lines maximum. Each paragraph = one idea.
- **Descriptive headings.** "Reset your word cloud results" not "Step 3" or "Results"
- **Active voice.** "Click Save" not "The Save button should be clicked"
- **Consistent tone.** Warm, direct, professional. Not formal, not snarky.
  - ❌ "export options that don't make you want to cry"
  - ✅ "export your results as a CSV or PDF from the Results tab"
- **No filler.** Every sentence answers something. Cut anything that doesn't.

### For AI agents

- **Self-contained paragraphs.** A paragraph retrieved without surrounding context should still make sense.
- **Explicit conditions.** Write "only when the timer is active" not "when it's on".
  Write "only on Pro plan" not "on higher plans". Agents don't infer context.
- **Spell out named entities fully.** "Word Cloud slide" not "it" or "the slide".
  "AhaSlides editor" not "the editor". "Pro plan" not "your plan".
- **Explicit causal language.** Use "because", "therefore", "which means", "only when", "unless".
  If X causes Y, say so — don't leave the relationship implicit.
- **One topic per article.** If an article covers two distinct user intents, split it.
  A chunk retrieved for the wrong intent actively degrades AI answers.
- **No ambiguous conditionals.** "This may vary" is useless to an agent. Specify what it varies by:
  "This varies by plan — Free accounts get X, Pro accounts get Y."

---

## Tone — AhaSlides brand voice

KB articles carry the same brand DNA as all AhaSlides content. Three non-negotiable pillars:

### Brand spices

**Playful** — energetic, witty, conversational. Speak like a friendly expert, not a boring manual.
Use light humor and plain language. Never at the expense of clarity.

**Scientific** — clear, grounded, backed by evidence. When making a claim about how a feature
works, state it precisely. Don't make vague promises or assumptions.

**Above and beyond** — warm, intentional, thoughtful. Make the user feel supported, not
processed. That extra sentence of context that saves them a follow-up question — that's it.

### Voice rules

- **Warm but efficient.** Not cold, not chatty.
- **Direct.** Say what to do. Trust the user.
- **Concrete.** Name the button. Name the tab. Name the plan.
- **No hype.** Don't call features "amazing", "powerful", or "game-changing".
- **No hedging.** Don't say "you might want to", "feel free to", "you can go ahead and".
  Say "click", "select", "open".
- **Audience-centric framing.** Shift from "this feature does X" to "you can now do Y".
  Name the actual outcome for the user.
- **Sentence case headings.** Capitalize only the first word and proper nouns.
  ❌ "How To Reset Your Password" ✅ "How to reset your password"
- **No em dashes (—).** Use a comma, colon, or rewrite the sentence instead.

### What to avoid

| Pattern | ❌ Avoid | ✅ Instead |
|---------|---------|-----------|
| Corporate jargon | "leverage best-in-class synergies" | "use polls and quizzes together" |
| Complex vocabulary | "utilize multifaceted modalities" | "use polls, quizzes, and word clouds" |
| Over-the-top claims | "REVOLUTIONIZE everything!!!" | "your audience will remember more" |
| Lifeless noun stacks | "end-to-end engagement enablement platform" | "Add a poll. Ask a question. Run a quiz." |
| Dry procedural tone | "This document outlines the framework for..." | "Want your training to stick? Start here." |
| AI filler words | "actually", "genuinely", "it's worth remembering", "it's not X but Y" | Cut or rephrase |

### KB tone vs. blog tone

KB articles are **direct and efficient** — the user has a problem and needs an answer.
Keep the brand warmth, but don't add storytelling, analogies, or marketing framing.
Save the Playful brand voice for intros and tips; keep the body precise and scannable.

| | KB article | Blog post |
|--|-----------|-----------|
| Opens with | The answer | The audience's pain point |
| Tone | Direct, warm, efficient | Energetic, narrative, persona-aware |
| Features | Named precisely, in context | Woven into a use-case story |
| Length | As short as possible | As long as the topic needs |

---

## Article types at a glance

| Type | When to use | Opening pattern |
|------|-------------|-----------------|
| **How-to** | User wants to complete a task | Lead with what the feature does, then numbered steps |
| **Troubleshooting** | User has an error or something isn't working | Lead with the problem and its cause |
| **Conceptual** | User wants to understand what something is | Lead with a plain definition |
| **Reference** | User needs a list of options, limits, or specs | Lead with what the reference covers |
| **FAQ** | Multiple short, related questions about one topic | Lead with the most common question |

---

## GitBook-specific notes

- GitBook renders standard Markdown plus its own hint/tab/embed blocks (`{% hint %}`, etc.)
- Images: use relative paths if images are in the repo, or absolute URLs for externally hosted images
- The GitBook sidebar structure (page order, nesting) is controlled by `SUMMARY.md` — update it when adding new articles
- GitBook ignores YAML frontmatter in the reader UI, but it's available to integrations and agents that read the raw files
- Do not put navigation instructions ("see also", "next up") in the article body — GitBook handles prev/next automatically

