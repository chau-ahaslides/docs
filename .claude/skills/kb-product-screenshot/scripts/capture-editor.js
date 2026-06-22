/**
 * Capture the Slide Editor with browser-injected highlight boxes.
 *
 * Usage (from repo root):
 *   source .env
 *   WORKSPACE=$(pwd)/out-screenshots PRESENTER_TOKEN=$PRESENTER_TOKEN \
 *   PRESENTATION_ID=9545237 \
 *     node .claude/skills/kb-product-screenshot/scripts/capture-editor.js
 *
 * Output: $WORKSPACE/raw-editor-injected.png  (1920×1080)
 *
 * The editor loads with ?presenting=true (server redirect). Pressing Escape
 * dismisses the presenter overlay, revealing the slide editor underneath.
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PRESENTER_TOKEN = process.env.PRESENTER_TOKEN;
const PRESENTATION_ID = process.env.PRESENTATION_ID || '9545237';
const WORKSPACE = process.env.WORKSPACE || path.join(__dirname, '../../../../out-screenshots');

if (!PRESENTER_TOKEN) { console.error('PRESENTER_TOKEN not set'); process.exit(1); }
fs.mkdirSync(WORKSPACE, { recursive: true });

// Shared drawBox function — injected as a string via eval() inside page.evaluate()
const DRAW_BOX_FN = `
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
    'left:' + rect.left + 'px', 'top:' + rect.top + 'px',
    'width:' + rect.width + 'px', 'height:' + rect.height + 'px',
    'border:3px solid ' + PINK,
    'border-radius:4px', 'box-sizing:border-box', 'pointer-events:none',
  ].join(';');
  container.appendChild(box);
  if (label) {
    const tag = document.createElement('div');
    tag.textContent = label;
    const tagTop = rect.top >= 22 ? rect.top - 24 : rect.top + 4;
    tag.style.cssText = [
      'position:fixed',
      'left:' + rect.left + 'px', 'top:' + tagTop + 'px',
      'background:' + PINK, 'color:white',
      'font:600 12px/1 -apple-system,sans-serif',
      'padding:2px 6px', 'border-radius:3px',
      'white-space:nowrap', 'pointer-events:none',
    ].join(';');
    container.appendChild(tag);
  }
}
`;

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  await context.addCookies([{
    name: 'ahaToken', value: PRESENTER_TOKEN,
    domain: '.ahaslides.com', path: '/'
  }]);
  const page = await context.newPage();

  // App redirects to ?presenting=true — load that directly
  await page.goto(
    `https://presenter.ahaslides.com/presentation/${PRESENTATION_ID}?presenting=true`,
    { waitUntil: 'domcontentloaded', timeout: 30000 }
  );
  await page.waitForSelector('.aha-presentation-editor-wrapper', { timeout: 15000 });
  await page.waitForTimeout(3000);

  // Dismiss presenter overlay — reveals the slide editor underneath
  await page.keyboard.press('Escape');
  await page.waitForTimeout(3000);

  const bodyClass = await page.evaluate(() => document.body.className);
  if (bodyClass.includes('body-presenting')) {
    throw new Error('Still in presenting mode after Escape — try again or use a different presentation');
  }
  console.log('Editor mode active, body class:', bodyClass.slice(0, 80));

  // Inject highlight boxes
  await page.evaluate((DRAW_BOX_FN) => {
    eval(DRAW_BOX_FN);

    const allBtns = Array.from(document.querySelectorAll('button')).filter(b => {
      const r = b.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });

    // Top toolbar
    const toolbar = document.querySelector('.aha-presentation-editor-header');
    if (toolbar) drawBox(toolbar.getBoundingClientRect(), 'Toolbar');

    // Key toolbar buttons
    allBtns.forEach(btn => {
      const text = btn.textContent.trim();
      const r = btn.getBoundingClientRect();
      if (text === 'Preview') drawBox(r, 'Preview');
      else if (text === 'Present') drawBox(r, 'Present');
      else if (text === 'Results') drawBox(r, 'Results');
      else if (text === 'New slide') drawBox(r, 'New slide');
      else if (text === 'Improve') drawBox(r, 'Improve');
      else if (text === 'Participant view') drawBox(r, 'Participant view');
      else if (text === 'Reset results') drawBox(r, 'Reset results');
    });

    // Left slides panel
    const leftPanel = document.querySelector('[class*="aha-left-column"]');
    if (leftPanel) drawBox(leftPanel.getBoundingClientRect(), 'Slides panel');

    // Center slide canvas
    const canvas = document.querySelector('.top-panel--canvas-stack');
    if (canvas) drawBox(canvas.getBoundingClientRect(), 'Slide canvas');

    // Right settings panel (find by position: x >= 1820, height >= 500)
    const rightPanel = Array.from(document.querySelectorAll('*')).find(el => {
      const r = el.getBoundingClientRect();
      return r.x >= 1820 && r.width >= 80 && r.height >= 500;
    });
    if (rightPanel) drawBox(rightPanel.getBoundingClientRect(), 'Settings panel');

    // Slide notes area
    const notes = document.querySelector('[placeholder*="note" i], [class*="notes-input"]');
    if (notes) drawBox(notes.getBoundingClientRect(), 'Slide notes');

  }, DRAW_BOX_FN);

  await page.waitForTimeout(300);
  const outPath = path.join(WORKSPACE, 'raw-editor-injected.png');
  await page.screenshot({ path: outPath });
  console.log('Saved:', outPath);

  await browser.close();
}
main().catch(e => { console.error(e.message); process.exit(1); });
