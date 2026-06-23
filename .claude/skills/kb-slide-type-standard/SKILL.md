---
name: kb-slide-type-standard
description: >
  The mandatory media standard for AhaSlides "slide type" Knowledge Base articles —
  the ones that document a single interactive slide type (Categorise, Word Cloud, Q&A,
  Brainstorm, Open-ended, Match Pairs, Correct Order, Spinner Wheel, Pin on Image,
  Rating Scale, Ranking, Idea Board, Quiz, Poll, and similar). Every slide-type KB
  article MUST have two media assets: (1) a preview-mode screenshot and (2) a product-tour
  tutorial video placed after the setup steps. An article missing either one is a FAIL.
  Use this skill whenever you write, audit, review, or refresh a KB article about a slide
  type, or when someone asks "does this slide-type article meet the standard", "what does a
  slide type KB need", "add the required screenshot/video to this slide article".
  Trigger on: "slide type KB", "slide type article standard", "does this slide article pass",
  "slide type media requirements", any slide-type article being written or audited.
  Pairs with: kb-product-screenshot (make the screenshot), kb-tutorial-video (make + place
  the video), kb-article-writer (write the article), kb-article-auditor (the audit gate).
---

# Slide-type KB standard — AhaSlides Help Centre

A **slide-type KB article** documents one AhaSlides interactive slide type — how to set it
up, present it, and what the audience experiences. Examples: Categorise, Word Cloud, Q&A,
Brainstorm, Open-ended, Match Pairs, Correct Order, Spinner Wheel, Pin on Image, Rating
Scale, Ranking, Idea Board, Quiz, Poll.

Every slide-type article must carry **two media assets**. Both are mandatory. An article
that is missing either one — or has one that does not meet the spec below — is a **FAIL**.

The canonical reference that passes this standard is **`using-the-categorise-slide.md`**.
When in doubt, match what it does.

---

## Gate 1 — Preview-mode screenshot (the hero image)

A screenshot of the slide type **in preview mode**, placed at the **top of the article**
(immediately after the `# H1`, before the first body section). It must show:

- **Both screens at once** — the **presenter screen** (the main projected view) **and** the
  **audience screen** (the participant phone/device view), side by side in one image.
- **Responses populated** — the slide is shown with real audience responses already in it
  (sorted items, submitted words, posted answers, etc.), not an empty/blank state.
- **Size 1920 × 1080** — exported at exactly 1920×1080 (16:9, DPR=1).

Place it as a normal Markdown image with descriptive alt text that names both screens and
the populated state:

```markdown
# Using the Categorise Slide

![Categorise slide in preview mode — presenter screen showing Noun and Verb category columns with responses, alongside the participant phone screen](.gitbook/assets/categorise-slide-preview.png)
```

**How to produce it:** use the **kb-product-screenshot** skill (Playwright at 1920×1080,
DPR=1, optional pink highlight boxes, composited on the branded canvas). Capture the slide
in preview mode with both presenter and audience views and responses already submitted.

---

## Gate 2 — Product-tour tutorial video (after the setup steps)

A product-tour tutorial video for the slide type, placed **after the "Setting up" steps** —
**not** stacked at the top next to the hero image. It lives in its own H3 between the last
setup step and the "Previewing and presenting" section:

```markdown
### 5. Adjust settings
...

### Watch the tutorial

{% embed url="https://www.youtube.com/watch?v=PeAS2yPtA_0" %}

{% endembed %}

## Previewing and presenting
```

Requirements:

- **Own `### Watch the tutorial` H3** directly after the final setup step.
- **Placed after the setup section, before "Previewing and presenting"** — never in the hero
  position at the top.
- **Watchable YouTube URL** inside a GitBook `{% embed %}` block (use the
  `https://www.youtube.com/watch?v=...` form, not an `embed` URL).

**How to produce + place it:** use the **kb-tutorial-video** skill (record the product-tour
webm, voiceover, branded outro, YouTube upload, GitBook embed). That skill owns the full
pipeline; this skill only fixes **where** the embed goes.

---

## The fail rule

When writing or auditing a slide-type article, both gates are hard pass/fail:

| Gate | Requirement | Fail when… |
|------|-------------|-----------|
| 1. Preview screenshot | Top-of-article image, both presenter + audience screens, responses populated, 1920×1080 | Image missing, only one screen, empty/blank state, or wrong dimensions |
| 2. Tutorial video | `### Watch the tutorial` embed placed after the setup steps | Video missing, or placed in the hero/top position instead of after setup |

**Either gate failing = the article fails.** Report it as NOT OK and state which gate failed
and why.

---

## Audit checklist

Run this whenever auditing a slide-type article (the **kb-article-auditor** skill applies
this as a hard gate):

- [ ] Article is a slide-type article (documents one interactive slide type).
- [ ] **Gate 1:** preview-mode screenshot present at the top, after the H1.
- [ ] Screenshot shows **both** presenter and audience screens in one image.
- [ ] Screenshot has **responses populated** (not an empty slide).
- [ ] Screenshot is **1920 × 1080**.
- [ ] **Gate 2:** tutorial video embedded in its own `### Watch the tutorial` H3.
- [ ] Video is placed **after the setup steps**, before "Previewing and presenting" — not at the top.
- [ ] Video uses a watchable YouTube URL inside a `{% embed %}` block.

If any box is unchecked, the article is a **FAIL** on the slide-type standard.
