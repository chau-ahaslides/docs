---
name: kb-product-screenshot
description: "Produce styled AhaSlides product screenshots with pink (#FF4081) highlight boxes on the branded Background-White.svg canvas. Use whenever you need to capture, annotate, or refresh a product screenshot for the KB, marketing, or documentation — e.g. 'screenshot the My Presentations page', 'add highlight boxes to the editor', 'produce a styled screenshot for the article'. The generic tool is scripts/inject-boxes.js: give it a JSON config (url + element specs), it loads the page in Playwright at 1920x1080 DPR=1, injects pink border boxes via getBoundingClientRect, and screenshots. Then composite onto Background-White.svg with Pillow."
---

# KB Product Screenshot — Generic Injection Approach

Produce pixel-perfect annotated screenshots of any AhaSlides page.

**Core tool:** `scripts/inject-boxes.js` — one script, driven by a JSON config.
Pass it a URL and a list of element specs; it injects pink boxes in the browser
and screenshots. No page-specific scripts needed.

Proven on AKB-37 (My Presentations + Slide Editor). See example configs in
`scripts/example-my-presentations.json` and `scripts/example-editor.json`.

---

## Quick start

```bash
# From the ahaslides-kb repo root:
source .env
node .claude/skills/kb-product-screenshot/scripts/inject-boxes.js \
  .claude/skills/kb-product-screenshot/scripts/example-my-presentations.json
# -> out-screenshots/my-presentations.png
```

---

## Why this approach

**Do NOT** extract element coordinates and redraw boxes in Python/PIL.
That requires knowing a precise scale factor and offset; any mismatch produces
misaligned boxes (confirmed root cause of AKB-37 r1-r10 failures).

**Do** inject `position:fixed` divs via `getBoundingClientRect()` inside
`page.evaluate()`. The browser computes pixel positions; the boxes are rendered
into the screenshot by the browser itself. No coordinate math, guaranteed alignment.

**Why Playwright, not Chrome DevTools?**
Chrome DevTools emulation sets `innerWidth=1920` but the physical Chrome window
on this machine has `outerWidth=1627`. The compositor scales rendered content to
fit the physical window, so screenshot pixels no longer map 1:1 to CSS pixels —
boxes drift. Playwright headless owns the window, so `outerWidth == innerWidth`
always.

---

## Config file schema

```jsonc
{
  "url": "https://presenter.ahaslides.com/...",

  // Optional: wait for this CSS selector before injecting (useful for SPAs)
  "waitFor": ".some-selector",

  // Optional: extra settle time in ms after navigation (default: 2000)
  "waitMs": 2000,

  // Optional: click these before injecting (e.g. sidebar nav items)
  "clickBefore": [
    { "text": "My presentations", "waitMs": 2000 },
    { "selector": "#some-btn",    "waitMs": 500 }
  ],

  // Optional: press Escape to dismiss AhaSlides presenter overlay
  // Use when URL is /presentation/:id?presenting=true to reveal the editor
  "escapePresenter": false,

  // Elements to highlight — each spec uses ONE of: selector / text / position
  "boxes": [
    { "selector": "header",                        "label": "Header" },
    { "text": "New presentation", "tag": "button", "label": "New presentation" },
    { "position": { "x": 1609, "y": 10, "width": 88, "height": 36 }, "label": "Preview" }
  ],

  // Output path for the raw screenshot (1920x1080, boxes already painted in)
  "output": "out-screenshots/my-page.png"
}
```

### Box spec fields

| Field | Description |
|-------|-------------|
| `selector` | CSS `querySelector` string |
| `text` | Exact `textContent` match; combine with `tag` (e.g. `"button"`) to narrow |
| `position` | Explicit `{ x, y, width, height }` in CSS pixels — use when selector is fragile |
| `label` | Text shown in a pink tag above the box (omit for an unlabelled border) |

---

## Page-specific notes

### My Presentations (`/apps/presentations`)

Navigate to the "My presentations" section via `clickBefore`:
```json
"clickBefore": [{ "text": "My presentations", "waitMs": 2000 }]
```

### Slide Editor (`/presentation/:id`)

The app always redirects to `?presenting=true` (server-side). The editor is
rendered underneath the presenter overlay. Set `"escapePresenter": true` in the
config to dismiss it automatically.

Key editor selectors:

| Region | Selector |
|--------|----------|
| Top toolbar | `.aha-presentation-editor-header` |
| Left slides panel | `[class*="aha-left-column"]` |
| Slide canvas | `.top-panel--canvas-stack` |
| Settings tabs (right) | Use `position` with `x>=1820, height>=500` |

---

## Compositing onto Background-White.svg (Python/Pillow)

After capturing the raw screenshot with boxes already painted, composite it
onto the branded background:

```python
from PIL import Image, ImageDraw

SCALE = 1546 / 1920   # 0.8052 -- from pixel analysis of reference Home.png
CONTENT_X, CONTENT_Y = 178, 97   # screenshot content offset on canvas
BORDER_X,  BORDER_Y  = 174, 95   # 2px pink border offset
CANVAS_W, CANVAS_H = 1920, 1080
PINK = (255, 64, 129)

def add_rounded_corners(img, radius=12):
    w, h = img.size
    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([(0,0),(w-1,h-1)], radius=radius, fill=255)
    out = Image.new('RGBA', (w, h), (0,0,0,0))
    out.paste(img.convert('RGBA'), (0, 0), mask)
    return out

bg   = Image.open('/tmp/bg-1920.png').convert('RGBA')   # pre-rasterized SVG
shot = Image.open('out-screenshots/my-page.png').convert('RGBA')

scaled  = shot.resize((int(shot.width*SCALE), int(shot.height*SCALE)), Image.LANCZOS)
rounded = add_rounded_corners(scaled, radius=12)

canvas = bg.copy()
draw = ImageDraw.Draw(canvas)
draw.rounded_rectangle(
    [(BORDER_X, BORDER_Y), (BORDER_X + scaled.width + 3, BORDER_Y + scaled.height + 3)],
    radius=14, outline=PINK, width=2
)
canvas.paste(rounded, (CONTENT_X, CONTENT_Y), rounded)
canvas.convert('RGB').save('out-screenshots/my-page-styled.png', 'PNG')
```

Rasterize the SVG background first (one-time):
```js
// In a Playwright script:
await page.goto('file:///path/to/Background-White.svg');
await page.setViewportSize({ width: 1920, height: 1080 });
await page.screenshot({ path: '/tmp/bg-1920.png' });
```

---

## Brand constants

| Constant | Value |
|----------|-------|
| Highlight color | `#FF4081` |
| Box border | 3px solid |
| Box border-radius | 4px |
| Label font | 600 12px -apple-system sans-serif |
| Label padding | 2px 7px |
| Canvas size | 1920 x 1080 |
| Screenshot scale on canvas | `1546 / 1920 = 0.8052` |
| Content offset on canvas | x=178, y=97 |
| Border offset on canvas | x=174, y=95 |
| Screenshot corner radius | 12px |
| Canvas corner radius | 14px |

---

## Files

```
scripts/
  inject-boxes.js                  <- generic tool -- run this
  example-my-presentations.json    <- ready-to-use config for My Presentations page
  example-editor.json              <- ready-to-use config for Slide Editor
  capture-my-presentations.js      <- (legacy, page-specific -- prefer inject-boxes.js)
  capture-editor.js                <- (legacy, page-specific -- prefer inject-boxes.js)
```
