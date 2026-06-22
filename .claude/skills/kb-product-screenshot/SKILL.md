---
name: kb-product-screenshot
description: "Produce styled AhaSlides product screenshots with pink (#FF4081) highlight boxes on the branded Background-White.svg canvas. Use whenever you need to capture, annotate, or refresh a product screenshot for the KB, marketing, or documentation — e.g. 'screenshot the My Presentations page', 'add highlight boxes to the editor', 'produce a styled screenshot for the article'. The approach: load the page with Playwright at 1920×1080 DPR=1, inject pink border boxes directly into the DOM via JS (getBoundingClientRect → position:fixed div), screenshot, then composite onto the background SVG canvas with Pillow."
---

# KB Product Screenshot Pipeline

Produce pixel-perfect annotated screenshots of AhaSlides pages for KB articles,
docs, or marketing assets. The key technique: **inject highlight boxes via JS/CSS**
rather than computing coordinates externally. The browser renders the boxes so
they are guaranteed to line up with the element.

Proven on AKB-37 (My Presentations + Slide Editor screenshots).

---

## Prerequisites

- `PRESENTER_TOKEN` in `/Users/ahaslides/Workplace/ahaslides-kb/.env` (JWT without "Bearer " prefix)
- Playwright installed: `node_modules/playwright` under the ahaslides-kb workspace
- Python 3 with Pillow: `pip install Pillow`
- Background SVG at `/tmp/background-white.svg` (download from Slack file `F0BD23J12QY` or team assets)

---

## Core principle: inject boxes, never compute coordinates

**Do NOT** extract element coordinates and then draw boxes in Python/PIL. That
requires knowing the exact scale factor and offset of the screenshot on the
canvas, and any mismatch produces misaligned boxes.

**Do** inject `position:fixed` divs via `page.evaluate()` in Playwright. The
browser computes the pixel positions, the boxes are rendered in the screenshot
itself, and compositing onto the canvas is just image-in-image — no coordinate
math at all.

### The drawBox helper (paste into any `page.evaluate()` call)

```js
function drawBox(rect, label) {
  const PINK = '#FF4081';
  let container = document.getElementById('aha-kb-boxes');
  if (!container) {
    container = document.createElement('div');
    container.id = 'aha-kb-boxes';
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483647;';
    document.body.appendChild(container);
  }

  const box = document.createElement('div');
  box.style.cssText = [
    'position:fixed',
    'left:' + rect.left + 'px',
    'top:' + rect.top + 'px',
    'width:' + rect.width + 'px',
    'height:' + rect.height + 'px',
    'border:3px solid ' + PINK,
    'border-radius:4px',
    'box-sizing:border-box',
    'pointer-events:none',
  ].join(';');
  container.appendChild(box);

  if (label) {
    const tag = document.createElement('div');
    tag.textContent = label;
    const tagTop = rect.top >= 22 ? rect.top - 24 : rect.top + 4;
    tag.style.cssText = [
      'position:fixed',
      'left:' + rect.left + 'px',
      'top:' + tagTop + 'px',
      'background:' + PINK,
      'color:white',
      'font:600 12px/1 -apple-system,sans-serif',
      'padding:2px 6px',
      'border-radius:3px',
      'white-space:nowrap',
      'pointer-events:none',
    ].join(';');
    container.appendChild(tag);
  }
}
```

To highlight an element: `drawBox(el.getBoundingClientRect(), 'Label')`.

---

## Step 1: Playwright setup

Always use these settings to avoid viewport scaling artifacts:

```js
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,   // CRITICAL: 1px CSS = 1px screenshot pixel
});
await context.addCookies([{
  name: 'ahaToken', value: PRESENTER_TOKEN,
  domain: '.ahaslides.com', path: '/'
}]);
```

**Why headless Playwright, not Chrome DevTools?** Chrome DevTools emulation sets
`innerWidth=1920` but the physical window may be narrower (`outerWidth=1627`).
The compositor scales rendered content to fit the physical window, so screenshot
pixels no longer map 1:1 to CSS pixels — boxes drift. Playwright headless owns
the window; `outerWidth == innerWidth` always.

---

## Step 2: Page-specific loading notes

### My Presentations (`/apps/presentations`)

```js
await page.goto('https://presenter.ahaslides.com/apps/presentations', {
  waitUntil: 'networkidle', timeout: 45000
});
await page.waitForTimeout(2000);
// Click "My presentations" in sidebar
const items = await page.$$('text=My presentations');
if (items.length > 0) await items[0].click();
await page.waitForTimeout(2000);
```

### Slide Editor (`/presentation/:id`)

The app always redirects to `?presenting=true` (server-side redirect based on
last state). The slide editor is rendered underneath the presenter overlay. Press
**Escape** to dismiss the overlay:

```js
await page.goto(`https://presenter.ahaslides.com/presentation/${PRES_ID}?presenting=true`, {
  waitUntil: 'domcontentloaded', timeout: 30000
});
await page.waitForSelector('.aha-presentation-editor-wrapper', { timeout: 15000 });
await page.waitForTimeout(3000);

// Dismiss presenter overlay — reveals the editor underneath
await page.keyboard.press('Escape');
await page.waitForTimeout(3000);

// Verify
const bodyClass = await page.evaluate(() => document.body.className);
if (bodyClass.includes('body-presenting')) throw new Error('Still in presenting mode');
```

Key editor CSS selectors:
| Region | Selector |
|--------|----------|
| Top toolbar | `.aha-presentation-editor-header` |
| Left slides panel | `[class*="aha-left-column"]` |
| Slide canvas | `.top-panel--canvas-stack` |
| Right settings tabs | first element with `x >= 1820 && height >= 500` |

---

## Step 3: Inject boxes and screenshot

```js
await page.evaluate(() => {
  // paste drawBox() helper here
  // then call drawBox(el.getBoundingClientRect(), 'Label') for each element
});
await page.waitForTimeout(300);   // let paint settle
await page.screenshot({ path: 'raw-output.png' });
```

See `scripts/capture-my-presentations.js` and `scripts/capture-editor.js` for
complete working examples.

---

## Step 4: Composite onto background canvas (Python/Pillow)

```python
from PIL import Image, ImageDraw

SCALE = 1546 / 1920   # 0.8052 — from pixel analysis of reference Home.png
CONTENT_X, CONTENT_Y = 178, 97   # where screenshot content starts on canvas
BORDER_X, BORDER_Y = 174, 95     # where 2px pink border starts
CANVAS_W, CANVAS_H = 1920, 1080
PINK = (255, 64, 129)

def add_rounded_corners(img, radius=12):
    w, h = img.size
    mask = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0,0),(w-1,h-1)], radius=radius, fill=255)
    result = Image.new('RGBA', (w,h), (0,0,0,0))
    result.paste(img.convert('RGBA'), (0,0), mask)
    return result

bg = Image.open('/tmp/background-white.svg-rasterized.png').convert('RGBA')  # pre-rasterized
bg = bg.resize((CANVAS_W, CANVAS_H), Image.LANCZOS)

shot = Image.open('raw-output.png').convert('RGBA')
shot_w, shot_h = shot.size
target_w = int(shot_w * SCALE)
target_h = int(shot_h * SCALE)

shot_scaled = shot.resize((target_w, target_h), Image.LANCZOS)
shot_rounded = add_rounded_corners(shot_scaled, radius=12)

canvas = bg.copy()
# 2px pink border
draw = ImageDraw.Draw(canvas)
draw.rounded_rectangle(
    [(BORDER_X, BORDER_Y), (BORDER_X+target_w+3, BORDER_Y+target_h+3)],
    radius=14, outline=PINK, width=2
)
canvas.paste(shot_rounded, (CONTENT_X, CONTENT_Y), shot_rounded)
canvas.convert('RGB').save('output-styled.png', 'PNG')
```

**Note:** The background SVG must be rasterized to PNG first. Use Playwright:

```js
// Render the SVG to a 1920x1080 PNG via Playwright
await page.goto('file:///tmp/background-white.svg');
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
| Label font | 600 12px -apple-system, sans-serif |
| Canvas size | 1920 × 1080 |
| Screenshot scale on canvas | 1546/1920 = 0.8052 |
| Content offset on canvas | x=178, y=97 |
| Border offset on canvas | x=174, y=95 |
| Screenshot border radius | 12px |

---

## Files

- `scripts/capture-my-presentations.js` — complete My Presentations capture script
- `scripts/capture-editor.js` — complete Slide Editor capture script

Run from the ahaslides-kb root:

```bash
source .env
WORKSPACE=$(pwd) PRESENTER_TOKEN=$PRESENTER_TOKEN \
  node .claude/skills/kb-product-screenshot/scripts/capture-my-presentations.js
```
