# Scenario Authoring Reference

Full reference for Phase 1 of the KB tutorial video pipeline. Read this when
authoring a new scenario or debugging a stalled/desynced tour.

## Scenario JSON schema

Scenarios live at `scenarios/<article-slug>.json` (1:1 with articles,
version-controlled with the KB — commit scenario changes alongside the
article). Point `SCENARIO_FILE` at the repo path when recording; no copy into
the workspace is needed.

```json
{
  "steps": [
    {
      "id": "step-id",
      "path": "/presentation/*",
      "title": "Tooltip title",
      "description": "Tooltip body copy — brand voice, viewer-facing",
      "targetSelector": "CSS selector for spotlight + tooltip anchor",
      "pauseMs": 1500,
      "action": null
    }
  ]
}
```

**`path`** — route glob. Inside the editor use `/presentation/*`.

**`pauseMs`** — optional extra settle time (ms) before acting. Use when a UI
transition needs to complete before the step acts.

**`action`** — one of:
- `null` — tooltip-only; the recorder clicks Next. Use for welcome/closing
  steps and for Preview steps where you anchor the tooltip to a pane wrapper.
  **Caveat — `action:null` cannot hold for long.** A long `pauseMs` (≥~5s) on
  an `action:null` step silently breaks the overlay: the recorder's Next-button
  click stops registering and the spotlight collapses, so a step you wanted to
  *hold* under a 7s VO clip instead snaps away early (AKB-15 r9). To hold a
  spotlight for the full duration of a long VO line, give the step a **real
  `action`** (e.g. a `{"type":"click", ...}` on a harmless toggle/checkbox)
  with the long `pauseMs` — only steps with a real action type reliably hold
  for 7+ seconds.
- `{"type": "click", "selector": "..."}` — advance by clicking the spotlighted
  target. The `selector` is what gets clicked; `targetSelector` is what the
  spotlight ring anchors to (they can differ — e.g., spotlight on a dialog,
  click an item inside it).
- `{"type": "input", "value": "..."}` — type into the target.
- `{"type": "input-match", "value": "..."}` — type and wait for a match event
  (useful for search/filter inputs).

## Constraints from the onboarding overlay

### Target must be on screen when the step starts

The overlay cannot anchor to an element that doesn't exist yet. Always verify
that `targetSelector` resolves in the DOM at the moment the step becomes
active — i.e., the previous step's action has already completed and any
resulting UI change has settled (use `pauseMs` on the CURRENT step to wait for
the transition).

### Never target an element that unmounts itself on click

Example: the kickstart "Choose a slide" button — the picker replaces it. The
click passes through and works, but the app misses step completion and the tour
stalls (reproduced twice, including with a 1.5s settle; app-side bug,
reported). Instead, skip from the prior step straight to the gated target
(e.g. `[aria-label="Poll"]`) and let the recorder's auto-heal click through
the opener. The heal gap is silent dead time on screen — Phase 3's
freeze-trim removes it.

### Preview pattern

A Preview demonstration is a good closing pattern: click the header Preview
button (`[data-testid="editor-middle-preview-button"]`), hold with
`pauseMs: 8000` (preview iframes load slowly), exit via
`[data-testid="editor-middle-back-to-editor-button"]`, then a final
tooltip-only step on `.aha-button-present`. Preview only adds `?preview=true`,
so `path` stays `/presentation/*`.

Watch for the preview-exit fluke: occasionally the exit lands the app in
Present mode instead of the editor. Check the recorder's `final URL` line
(no `?presenting=true`) and the final screenshot; if it happened, re-record
(1-in-3-ish occurrence, cause not yet pinned down).

## Demonstrating audience participation in Preview

The participant pane in Preview is a cross-origin iframe
(`audience.sandbox.ahaslide.com`) which the overlay can't anchor to — so
in-audience actions can't be tour steps. Instead use `previewInteractions`
(recorder-side feature, local patch): the recorder glides the visible cursor
to the in-frame element (boundingBox in page coords) and dispatches the click
inside the frame document, bypassing the overlay backdrop.

Recipe for a NEW slide type:
1. Find a sandbox deck containing that slide — recording runs leave decks
   behind; deck ids are in the recorder's `navigated →` log lines (or create
   one via AhaSlides MCP `create_slides`).
2. Discover the audience-side selectors with the bundled probe:

   ```bash
   cd "$(git rev-parse --show-toplevel)" && source <plugin>/test-env.sh && \
   node <skill-dir>/scripts/probe_preview_audience.mjs <deckId>
   ```

   It prints every interactive element in the audience iframe (testids/text)
   plus the host-side anchor wrappers, and drops `/tmp/preview-probe.png`.
3. Add the new type's testids to the table below.

### Known audience-app selectors

| Slide type | Interact with |
|---|---|
| Poll / quiz answers | `[data-testid="audience-quiz-option"]:has-text("<option>")`, then `[data-testid="audience-quiz-submit-button"]` |
| Any slide | reactions: `[data-testid="audience-reactions-v2-<like|heart|laugh|wow|sad>-button"]` |
| App tabs | `[data-testid="audience-tabs-<presentation|review|feedback|profile>-tab"]` |

### previewInteractions pattern

Use TWO anchored tooltip steps so viewers' eyes are directed before things
happen. The pane wrappers live in the host document (the overlay CAN anchor
to them): `.iframe-wrapper-audience` and `.iframe-wrapper-presenter`.

```json
{
  "id": "x-preview-vote",
  "title": "This is your audience's phone",
  "targetSelector": ".iframe-wrapper-audience",
  "pauseMs": 8000,
  "action": null,
  "previewInteractions": [
    {
      "frameMatch": "audience.",
      "selector": "[data-testid=\"audience-quiz-option\"]:has-text(\"Monday\")",
      "label": "pick Monday",
      "pauseAfterMs": 1800
    },
    {
      "frameMatch": "audience.",
      "selector": "[data-testid=\"audience-quiz-submit-button\"]",
      "label": "submit",
      "pauseAfterMs": 2200
    }
  ]
},
{
  "id": "x-preview-results",
  "title": "Results update live",
  "targetSelector": ".iframe-wrapper-presenter",
  "pauseMs": 3000,
  "action": null
}
```

Interactions run after the step's `pauseMs` (so the iframes are loaded),
while that step's tooltip is up; the second step then spotlights the
presenter pane to explain the chart reacting.

## Selector discovery

When the table above doesn't cover a control: write a probe script in the
workspace dir (crib from `probe2.mjs`), fresh profile dir, `force: true`
clicks (leftover onboarding panels intercept pointer events), no `?onboarding`
param.

Header buttons follow `[data-testid="editor-*"]`. Picker items are:
`[aria-label="<Type>"][data-testid="editor-new-slide-type-item-v2-button"]`.

For dialogs specifically (image pickers, crop dialogs), see
`references/spotlight-dialog-handling.md` — the selector rules there are
critical and distinct from regular UI elements.

## Voiceover JSON

Save voiceover data alongside the scenario at
`scenarios/<slug>-voiceover.json` — record the voice id, voice settings,
per-step `tts_text` (natural spelling unless a respelling was needed), and
`start_sec`/`window_sec` for future re-runs. See
`scenarios/using-the-categorise-slide-voiceover.json` as the reference.
