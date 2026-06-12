---
name: kb-spotlight-dialog
description: Checklist and pattern reference for handling dialogs, modals, and image-upload flows when recording AhaSlides KB tutorial videos. Use this whenever a recording scenario involves an image upload, an asset/library picker dialog, a crop dialog, or any modal that appears in the AhaSlides editor — or whenever you need to verify that a recorded take has correct spotlight placement during dialog interactions. Trigger phrases include "image upload step", "upload image in scenario", "modal step in tour", "aha-modal", "crop dialog", "image picker", "spotlight on dialog", "Pin on Image tutorial", or any question about which CSS selector to use for a dialog in a recording scenario.
---

# Spotlight & Dialog Handling

Lessons learned through real re-records (r4/r5/r6 on Pin on Image). Apply
this before authoring any scenario step that involves a dialog, and before
verifying any take.

## The two modal components in the AhaSlides editor

Two different modal components exist and they are NOT interchangeable:

| Dialog | Selector | Notes |
|---|---|---|
| Image picker / library dialog | `.aha-modal__content` | Renders in the OUTER app document (not the settings iframe). Present while open, `null` before and after. |
| Crop dialog (opens after picking an image) | `.modal-crop-image` | Bootstrap-style. Does NOT have `.aha-modal__content`. |

**Never use `.aha-modal__content` as the `targetSelector` for the crop step.**
It won't find the element, the overlay tooltip never renders, and the tour
stalls. (r6 discovery.)

**Never use the settings panel selector for either dialog step.** It causes
the spotlight ring to appear on background UI, not the foreground dialog
(confirmed r4/r5 bug).

## State-transition rule

A step's `targetSelector` must resolve to an element present in the DOM at
the moment the step becomes ACTIVE. Step transitions must align with UI state
(dialog open/close). Never start a step targeting a background element while a
foreground dialog is open — the spotlight will land on the background, not the
foreground interaction.

## Correct 3-step pattern for image upload

Split the full image-upload interaction into exactly 3 action steps:

**Step 1 — Image picker open (tooltip-only):**
```json
{
  "id": "...",
  "targetSelector": ".aha-modal__content",
  "action": null,
  "pauseMs": 0
}
```
Runs WHILE the picker is open; spotlight on the dialog. Run non-closing
`mainInteractions` here (tab clicks, search). Do NOT pick the image here.

**Step 2 — Pick the image (action step):**
```json
{
  "id": "...",
  "targetSelector": ".aha-modal__content",
  "action": {"type": "click", "selector": "<image item selector>"}
}
```
Tour advances AT the click (before the crop dialog opens), so the anchor is
still present when the step completes.

**Step 3 — Crop and save (action step):**
```json
{
  "id": "...",
  "targetSelector": ".modal-crop-image",
  "pauseMs": 3000,
  "action": {"type": "click", "selector": "[data-testid=\"crop-image-save-button\"]"}
}
```
Targets the crop dialog by its actual class. `pauseMs: 3000` lets the crop
dialog finish rendering before the step acts.

## Tooltip occlusion rule

The tour tooltip must never cover the interaction target or the area where the
action visibly happens. If a tooltip would occlude the element being typed
into/clicked (e.g. a dialog's search input), split the interaction into smaller
steps each targeting the specific control (proven pattern from the Pin on Image
tutorial: Stock Photos tab → search input → first image result), or adjust
tooltip placement. Frame-verify: at every step, neither the spotlight border
nor the tooltip box covers the active element.

## Spotlight verification checklist

Check every step in any take, not just dialog ones:

- [ ] Spotlight covers the key mouse action for every step.
- [ ] When a step opens a popup or dialog, the spotlight target is an element
  inside the dialog — not the panel behind it.
- [ ] No spotlight ring lands on background UI while a foreground dialog is
  open.
- [ ] Verified frame-by-frame via `out/shots/step-*.png` — do not ship a take
  where spotlight is anchored to background UI during a foreground dialog
  interaction.
- [ ] Tooltip never covers the interaction target or the area where the action
  visibly happens. Adjust placement or split interaction if needed.

## The `.aha-modal__content` picker is an outer-document element

Counter-intuitive but confirmed: the image picker dialog renders in the OUTER
app document, not inside the settings iframe. This means it IS a valid
`targetSelector` while open — the overlay can anchor to it. Confirmed by DOM
probe on Pin on Image r5: `.aha-modal__content` is `null` before the dialog
opens, fully present at `[108,90 1224x720]` while open, and `null` again
after close.

## Discovering dialog selectors

Use a probe script in the `~/AhaSlides/onboarding-videos/` workspace dir with
`force: true` clicks (leftover onboarding panels intercept pointer events).
Open the dialog, then query the DOM to find which elements are present. See
also `references/spotlight-dialog-handling.md` under the `kb-tutorial-video`
skill for full context.
