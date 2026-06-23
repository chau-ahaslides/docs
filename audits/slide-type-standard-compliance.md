# Slide-type KB standard — compliance audit

Standard: `.claude/skills/kb-slide-type-standard/SKILL.md`
Reference (PASS): `using-the-categorise-slide.md`
Audited: 2026-06-23 (AKB-39, round 48)

Two hard gates per slide-type article:

- **Gate 1 — hero preview screenshot.** Top-of-article image showing **both** presenter
  and audience screens, **responses populated**, exported at **1920×1080**.
- **Gate 2 — tutorial video.** A watchable YouTube `{% embed %}` in its own
  `### Watch the tutorial` H3, placed **after** the setup steps (never in the hero/top
  position).

Missing or non-conforming on **either** gate = **FAIL**.

This round applied the cheap, high-value structural fix only: **Gate 2 placement** —
moving an existing tutorial-video embed into its own `### Watch the tutorial` H3 after the
setup steps (and, where the embed was a blockquote/`youtube.com/embed/` link, converting it
to a GitBook `{% embed %}` block with a `watch?v=` URL). No new videos were recorded and no
screenshots were captured — those are asset-production jobs, listed in the follow-up section.

---

## Per-article compliance

| Article | Gate 1 — hero preview screenshot | Gate 2 — tutorial video | Result | Action this round |
|---------|----------------------------------|-------------------------|--------|-------------------|
| `using-the-categorise-slide.md` *(reference)* | ✅ present, dual-screen, populated, **1920×1080** (`categorise-slide-preview.png`) | ✅ YouTube embed in `### Watch the tutorial` after setup | **PASS** | none (gold standard) |
| `using-the-brainstorm-slide.md` | ❌ no hero image | ✅ now in `### Watch the tutorial` after setup — **converted** blockquote `youtube.com/embed/npIv2Ag-aMU` → `{% embed %}` `watch?v=npIv2Ag-aMU` and relocated | FAIL (Gate 1) | Gate 2 placement fixed + format converted |
| `using-the-correct-order-slide.md` | ❌ no hero image | ✅ moved YouTube embed from top → `### Watch the tutorial` after setup | FAIL (Gate 1) | Gate 2 placement fixed |
| `using-the-match-pairs-slide.md` | ❌ no hero image | ✅ moved YouTube embed from top → `### Watch the tutorial` after setup | FAIL (Gate 1) | Gate 2 placement fixed |
| `using-the-open-ended-slide.md` | ❌ no hero image | ✅ moved YouTube embed from top → `### Watch the tutorial` after Step 5 | FAIL (Gate 1) | Gate 2 placement fixed |
| `using-the-pin-on-image-slide.md` | ❌ no hero image | ✅ moved YouTube embed from top → `### Watch the tutorial` after Step 5 (mirrors Categorise exactly) | FAIL (Gate 1) | Gate 2 placement fixed |
| `using-the-spinner-wheel.md` | ❌ no hero image | ✅ moved YouTube embed from intro → `### Watch the tutorial` after Settings (navattic interactive demo left at top) | FAIL (Gate 1) | Gate 2 placement fixed |
| `using-the-word-cloud-slide.md` | ❌ no hero image (intro text "In the example above" references a hero image that does not exist) | ✅ moved YouTube embed from mid-setup → `### Watch the tutorial` after Step 3 | FAIL (Gate 1) | Gate 2 placement fixed |
| `how-to-use-the-idea-board-slide.md` | ❌ no hero image | ✅ **converted** blockquote `youtube.com/embed/O691TLPtsto` → `{% embed %}` `watch?v=O691TLPtsto`, renamed `### Watch the tutorial video` → `### Watch the tutorial`, relocated to after the settings | FAIL (Gate 1) | Gate 2 placement fixed + format converted |
| `creating-a-poll-question-on-ahaslides.md` | ❌ no hero image | ✅ moved YouTube embed from top → `### Watch the tutorial` after "Other settings" (navattic interactive demo left at top) | FAIL (Gate 1) | Gate 2 placement fixed |
| `using-qa.md` | ❌ no hero image | ✅ moved YouTube embed from top → `### Watch the tutorial` after the Q&A settings | FAIL (Gate 1) | Gate 2 placement fixed |
| `using-the-ranking-slide.md` | ❌ no hero image | ⚠️ has a video in its own `### Watch the tutorial video` H3, but it is a **Loom** embed (`loom.com/embed/...`), not a watchable YouTube URL, and it sits **mid-setup** (before "Change the settings") | FAIL (Gate 1 + Gate 2) | **not fixed** — cannot convert Loom → YouTube without re-recording (would fabricate). Listed as follow-up |
| `using-the-type-answer-slide.md` | ❌ no hero image | ❌ no tutorial video at all | FAIL (both) | none — needs a recorded video (follow-up) |
| `using-the-pick-answer-slide.md` | ❌ no hero image | ❌ no tutorial video at all | FAIL (both) | none — needs a recorded video (follow-up) |
| `how-to-use-rating-scale-slides-on-ahaslides.md` | ❌ no hero image | ❌ no tutorial video at all | FAIL (both) | none — needs a recorded video (follow-up) |

### Excluded (not single-slide-type articles)

| Article | Reason |
|---------|--------|
| `making-a-live-word-cloud.md` | Alias/redirect stub (`alias_for: using-the-word-cloud-slide`), no body content. Not an article. |
| `how-to-make-and-run-a-quiz.md` | Umbrella quiz guide covering 5 quiz slide types + leaderboard, not a single slide type. Has a deliberate `## Video and interactive demo` section near the top plus an inline leaderboard explainer; left unchanged. |
| `using-the-content-slide.md`, `using-the-content-v2-slide.md`, `using-the-diagram-slide.md`, `using-the-surveys-tool.md` | Not interactive audience-response slide types (static content / diagram / multi-slide tool). Out of scope for the slide-type media standard. |

---

## Gate 2 — status after this round

All 10 fixed articles now satisfy **Gate 2**: a watchable YouTube `{% embed %}` in its own
`### Watch the tutorial` H3 placed after the setup steps. Verified by re-scan — each file has
exactly one `### Watch the tutorial` heading and no remaining top-of-article video embed
(navattic *interactive demos* deliberately retained near the top of Spinner Wheel and Poll —
they are demos, not the tutorial video).

`lint-kb-links.sh` and `lint-slide-names.sh` both pass.

---

## REMAINING ASSET PRODUCTION (follow-up — OUT OF SCOPE this pass)

These are heavy pipeline jobs (kb-tutorial-video for videos, kb-product-screenshot for
screenshots). They were **not** attempted this round.

### Every in-scope slide-type article still needs a Gate 1 hero screenshot

A dual-screen (presenter + audience), responses-populated, **1920×1080** preview screenshot at
the top of the article — produced via the **kb-product-screenshot** skill. Currently **only
`using-the-categorise-slide.md` has one.** All of the following still need one captured:

- `using-the-brainstorm-slide.md`
- `using-the-correct-order-slide.md`
- `using-the-match-pairs-slide.md`
- `using-the-open-ended-slide.md`
- `using-the-pin-on-image-slide.md`
- `using-the-ranking-slide.md`
- `using-the-spinner-wheel.md`
- `using-the-word-cloud-slide.md` (also remove the stale "In the example above" line that references a non-existent hero image)
- `how-to-use-the-idea-board-slide.md`
- `creating-a-poll-question-on-ahaslides.md`
- `using-qa.md`
- `using-the-type-answer-slide.md`
- `using-the-pick-answer-slide.md`
- `how-to-use-rating-scale-slides-on-ahaslides.md`

### Articles that still need a tutorial VIDEO recorded (Gate 2)

Produced via the **kb-tutorial-video** skill, then embedded in `### Watch the tutorial` after
the setup steps:

- `using-the-type-answer-slide.md` — no video exists.
- `using-the-pick-answer-slide.md` — no video exists.
- `how-to-use-rating-scale-slides-on-ahaslides.md` — no video exists.
- `using-the-ranking-slide.md` — has a **Loom** video only; needs a YouTube-hosted tutorial recorded (or the Loom re-hosted to YouTube), then placed in `### Watch the tutorial` after the *last* setup step ("Change the settings"), not mid-setup.

### Minor video housekeeping

- `using-the-word-cloud-slide.md` — the embed caption still carries a `TODO: replace L89bd83WaYU…` maintenance note (pre-existing). Resolve when the re-recorded word-cloud video is uploaded to YouTube; the placement is now correct.
