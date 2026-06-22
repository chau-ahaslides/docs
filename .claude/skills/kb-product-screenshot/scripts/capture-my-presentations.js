/**
 * Capture the My Presentations page with browser-injected highlight boxes.
 *
 * Usage (from repo root):
 *   source .env
 *   WORKSPACE=$(pwd)/out-screenshots PRESENTER_TOKEN=$PRESENTER_TOKEN \
 *     node .claude/skills/kb-product-screenshot/scripts/capture-my-presentations.js
 *
 * Output: $WORKSPACE/raw-my-pres-injected.png  (1920×1080)
 *
 * Key technique: inject position:fixed divs via getBoundingClientRect() so
 * highlight boxes are rendered by the browser — pixel-perfect, no coordinate math.
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PRESENTER_TOKEN = process.env.PRESENTER_TOKEN;
const WORKSPACE = process.env.WORKSPACE || path.join(__dirname, '../../../../out-screenshots');

if (!PRESENTER_TOKEN) { console.error('PRESENTER_TOKEN not set'); process.exit(1); }
fs.mkdirSync(WORKSPACE, { recursive: true });

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,   // 1 CSS px = 1 screenshot px — no compositor scaling
  });
  await context.addCookies([{
    name: 'ahaToken', value: PRESENTER_TOKEN,
    domain: '.ahaslides.com', path: '/'
  }]);
  const page = await context.newPage();

  await page.goto('https://presenter.ahaslides.com/apps/presentations', {
    waitUntil: 'networkidle', timeout: 45000
  });
  await page.waitForTimeout(2000);

  // Navigate to My presentations section
  const myPresItems = await page.$$('text=My presentations');
  if (myPresItems.length > 0) await myPresItems[0].click();
  await page.waitForTimeout(2000);

  // Inject highlight boxes directly into the DOM
  await page.evaluate(() => {
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

    function highlight(selector, label) {
      try {
        const el = document.querySelector(selector);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) { drawBox(r, label); return true; }
        }
      } catch (e) {}
      return false;
    }

    // Header
    highlight('header', 'Header');

    // Sidebar
    highlight('aside', 'Sidebar') ||
    highlight('[class*="sidebar"]', 'Sidebar') ||
    highlight('nav', 'Sidebar');

    // Templates section (top card strip)
    const templateSection = Array.from(document.querySelectorAll('section, [class*="template"], [class*="discover"]'))
      .find(el => {
        const r = el.getBoundingClientRect();
        return r.y > 50 && r.height > 100 && r.height < 300 && r.width > 900;
      });
    if (templateSection) drawBox(templateSection.getBoundingClientRect(), 'Templates section');

    // Action buttons
    Array.from(document.querySelectorAll('button')).forEach(btn => {
      const text = btn.textContent.trim();
      const r = btn.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (text === 'New presentation') drawBox(r, 'New presentation');
      else if (text === 'Import') drawBox(r, 'Import');
      else if (text === 'New folder') drawBox(r, 'New folder');
    });

    // Presentations table
    const table = document.querySelector('table, [role="table"], [class*="table-container"]');
    if (table) {
      const r = table.getBoundingClientRect();
      if (r.width > 500) drawBox(r, 'Presentations table');
    }

    // Sort/filter control
    const sortEl = Array.from(document.querySelectorAll('*')).find(el =>
      el.textContent.trim().startsWith('Sort by') && el.getBoundingClientRect().width > 0
    );
    if (sortEl) drawBox(sortEl.getBoundingClientRect(), 'Sort by');
  });

  await page.waitForTimeout(300);
  const outPath = path.join(WORKSPACE, 'raw-my-pres-injected.png');
  await page.screenshot({ path: outPath });
  console.log('Saved:', outPath);

  await browser.close();
}
main().catch(e => { console.error(e.message); process.exit(1); });
