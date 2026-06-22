#!/usr/bin/env node
/**
 * inject-boxes.js — generic product screenshot utility
 *
 * Takes a URL, loads it in Playwright headless at 1920×1080 DPR=1,
 * then injects pink (#FF4081) bounding-box overlays for a list of elements
 * specified as CSS selectors or by-text matches. Screenshots the result.
 *
 * Usage:
 *   node inject-boxes.js <config.json>
 *
 * config.json schema:
 * {
 *   "url": "https://presenter.ahaslides.com/apps/presentations",
 *   "waitFor": ".some-selector",          // optional: wait for this selector before injecting
 *   "waitMs": 2000,                       // optional: extra settle time (ms, default 2000)
 *   "escapePresenter": false,             // optional: press Escape to exit presenting mode
 *   "clickBefore": [                      // optional: click these selectors before injecting
 *     { "text": "My presentations" }
 *   ],
 *   "boxes": [
 *     { "selector": "header",             "label": "Header" },
 *     { "text": "New presentation",       "label": "New presentation",  "tag": "button" },
 *     { "selector": "[role='table']",     "label": "Presentations table" },
 *     { "position": { "x": 1609, "y": 10, "width": 88, "height": 36 }, "label": "Preview" }
 *   ],
 *   "output": "out-screenshots/my-pres.png"
 * }
 *
 * Box spec fields (use one of selector / text / position):
 *   selector  — CSS querySelector string
 *   text      — exact textContent match; optionally restrict to "tag" (e.g. "button")
 *   position  — fixed { x, y, width, height } in CSS pixels (fallback when selector is fragile)
 *   label     — text shown in pink tag above the box
 *
 * Environment:
 *   PRESENTER_TOKEN  — AhaSlides JWT (without "Bearer " prefix)
 *   AUTH_COOKIE_NAME — cookie name (default: "ahaToken")
 *   AUTH_DOMAIN      — cookie domain (default: ".ahaslides.com")
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PRESENTER_TOKEN = process.env.PRESENTER_TOKEN;
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'ahaToken';
const AUTH_DOMAIN = process.env.AUTH_DOMAIN || '.ahaslides.com';

// ── drawBox helper — injected as a string so it runs inside page.evaluate()
const DRAW_BOX = `
function drawBox(rect, label) {
  const PINK = '#FF4081';
  let container = document.getElementById('aha-kb-boxes');
  if (!container) {
    container = document.createElement('div');
    container.id = 'aha-kb-boxes';
    container.style.cssText = [
      'position:fixed', 'top:0', 'left:0',
      'width:100%', 'height:100%',
      'pointer-events:none', 'z-index:2147483647',
    ].join(';');
    document.body.appendChild(container);
  }

  // Border box
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

  // Label tag
  if (label) {
    const tag = document.createElement('div');
    tag.textContent = label;
    const tagTop = rect.top >= 26 ? rect.top - 26 : rect.top + 4;
    tag.style.cssText = [
      'position:fixed',
      'left:' + rect.left + 'px',
      'top:' + tagTop + 'px',
      'background:' + PINK,
      'color:white',
      'font:600 12px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      'padding:2px 7px',
      'border-radius:3px',
      'white-space:nowrap',
      'pointer-events:none',
    ].join(';');
    container.appendChild(tag);
  }
}
`;

async function main() {
  const configPath = process.argv[2];
  if (!configPath) {
    console.error('Usage: node inject-boxes.js <config.json>');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const {
    url,
    waitFor,
    waitMs = 2000,
    escapePresenter = false,
    clickBefore = [],
    boxes = [],
    output,
  } = config;

  if (!url) { console.error('config.url is required'); process.exit(1); }
  if (!output) { console.error('config.output is required'); process.exit(1); }

  fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,  // 1 CSS px = 1 screenshot px
  });

  if (PRESENTER_TOKEN) {
    await context.addCookies([{
      name: AUTH_COOKIE_NAME,
      value: PRESENTER_TOKEN,
      domain: AUTH_DOMAIN,
      path: '/',
    }]);
  }

  const page = await context.newPage();

  // Navigate
  const waitUntil = url.includes('?presenting=true') ? 'domcontentloaded' : 'networkidle';
  await page.goto(url, { waitUntil, timeout: 45000 });

  // Wait for a specific element if requested
  if (waitFor) {
    await page.waitForSelector(waitFor, { timeout: 15000 });
  }
  await page.waitForTimeout(waitMs);

  // Optional: click elements before injecting (e.g. nav items to show a section)
  for (const click of clickBefore) {
    if (click.text) {
      const els = await page.$$(`text=${click.text}`);
      if (els.length > 0) await els[0].click();
    } else if (click.selector) {
      const el = await page.$(click.selector);
      if (el) await el.click();
    }
    await page.waitForTimeout(click.waitMs || 1500);
  }

  // Optional: exit presenter mode
  if (escapePresenter) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(3000);
    const cls = await page.evaluate(() => document.body.className);
    if (cls.includes('body-presenting')) {
      throw new Error('Still in presenting mode after Escape');
    }
    console.log('Presenter mode dismissed');
  }

  // Inject boxes
  await page.evaluate(({ DRAW_BOX, boxes }) => {
    eval(DRAW_BOX);

    for (const spec of boxes) {
      let rect = null;

      if (spec.position) {
        // Explicit pixel rect
        rect = {
          left: spec.position.x,
          top: spec.position.y,
          width: spec.position.width,
          height: spec.position.height,
        };
      } else if (spec.selector) {
        try {
          const el = document.querySelector(spec.selector);
          if (el) {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) rect = r;
          }
        } catch (e) {}
      } else if (spec.text) {
        const tag = spec.tag || '*';
        const all = Array.from(document.querySelectorAll(tag));
        const el = all.find(el => el.textContent.trim() === spec.text);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) rect = r;
        }
      }

      if (rect) {
        drawBox(rect, spec.label || null);
      } else {
        console.warn('inject-boxes: could not find element for spec', JSON.stringify(spec));
      }
    }
  }, { DRAW_BOX, boxes });

  await page.waitForTimeout(300);
  await page.screenshot({ path: output });
  console.log('Saved:', output);

  await browser.close();
}

main().catch(e => { console.error(e.message); process.exit(1); });
