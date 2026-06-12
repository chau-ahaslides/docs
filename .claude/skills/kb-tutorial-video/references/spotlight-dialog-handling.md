# Spotlight & Dialog Handling Reference

Critical reference for Phase 2 verification. These lessons were learned through
real re-records (r4/r5/r6 on Pin on Image). Read this whenever a scenario
involves a dialog, modal, or image upload — and before verifying any take.

Also available as the standalone `kb-spotlight-dialog` sub-skill (same content)
for cases where you need this guidance without the full tutorial-video context.

## Spotlight verification checklist

Check every step, not just the dialog ones:

- [ ] Spotlight covers the key mouse action for every step.
- [ ] When a step opens a popup or dialog, the spotlight target for that step
  must be an element inside the dialog — not the panel behind it.
- [ ] No step's spotlight ring lands on background UI while a foreground dialog
  is open (the exact r4/r5 bug — background panel selector used for a
  foreground dialog step).
- [ ] Verify frame-by-frame — read `out/shots/step-*.png` and confirm the
  spotlight ring lands where the click/type action actually happens. Do not
  ship a take where the spotlight is anchored to background UI during a
  foreground dialog interaction.

## The two modal components in the AhaSlides editor

**This is the single most important thing in this file.** Two different modal
components exist and they are NOT interchangeable:

| Dialog | Selector | Notes |
|---|---|---|
| Image picker / library dialog | `.aha-modal__content` | Renders in the OUTER app document (not the settings iframe). Confirmed by DOM probe on Pin on Image r5: `null` before open, fully present at `[108,90 1224x720]` while open, `null` again after close. |
| Crop dialog (opens after picking an image) | `.modal-crop-image` | Bootstrap-style. Does NOT have `.aha-modal__content`. |

**Never use `.aha-modal__content` as the `targetSelector` for the crop step.**
It won't find the element, the overlay tooltip never renders, and the tour
stalls. (r6 discovery.)

**Never use the settings panel selector for either dialog step.** It causes
the spotlight ring to appear on background UI, not the foreground dialog
(confirmed r4/r5 bug).

## State-transition rule

A step's `targetSelector` must resolve to an element present in the DOM at
the moment the step becomes ACTIVE. This means step transitions must align
with UI state (dialog open/close). Never start a step targeting a background
element while a foreground dialog is open — the spotlight will land on the
background.

## Correct 3-step pattern for image upload dialogs

Split the interaction into exactly 3 action steps:

**Step 1 — Image picker open (tooltip-only):**
```json
{
  "id": "...",
  "targetSelector": ".aha-modal__content",
  "action": null,
  "pauseMs": 0
}
```
Runs WHILE the image picker is open; spotlight on the dialog. Run non-closing
`mainInteractions` here (tab clicks, search box typing). Do NOT pick the image
here — the tour would advance before the crop dialog opens.

**Step 2 — Pick the image (action step):**
```json
{
  "id": "...",
  "targetSelector": ".aha-modal__content",
  "action": {"type": "click", "selector": "<image item selector>"}
}
```
The tour advances AT the click (before the crop dialog opens), so the anchor
is still present when the step completes.

**Step 3 — Crop and save (action step):**
```json
{
  "id": "...",
  "targetSelector": ".modal-crop-image",
  "pauseMs": 3000,
  "action": {"type": "click", "selector": "[data-testid=\"crop-image-save-button\"]"}
}
```
Targets the crop dialog by its actual class. The `pauseMs: 3000` lets the crop
dialog finish rendering before the step acts.

## Image picker as outer-document element

The `.aha-modal__content` picker renders in the OUTER app document, not inside
the settings iframe. This means it IS a valid `targetSelector` value while the
dialog is open — the overlay can anchor to it. This was counter-intuitive
before the DOM probe confirmed it.

## Discovering dialog selectors

Use a probe script in the workspace dir with `force: true` clicks (leftover
onboarding panels intercept pointer events). Open the dialog, then query the
DOM to find which elements are present. The distinction between
`.aha-modal__content` (image picker) and `.modal-crop-image` (crop dialog) was
discovered this way.
