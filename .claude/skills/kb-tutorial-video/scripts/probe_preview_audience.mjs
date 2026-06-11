#!/usr/bin/env node
// Probe the audience app inside a deck's Preview to discover selectors for
// previewInteractions — works for ANY slide type.
//
// Usage (run FROM the recording workspace so playwright resolves):
//   cd ~/AhaSlides/onboarding-videos
//   source <plugin>/test-env.sh        # exports AHA_TOKEN (never write to disk)
//   node <skill-dir>/scripts/probe_preview_audience.mjs <deckId>
//
// Use a sandbox deck that already CONTAINS the slide type you're probing
// (e.g. one left behind by a previous recording run — deck ids are in the
// recorder's "navigated →" log lines). Output: the host-document pane
// wrappers, every visible interactive element inside the audience iframe
// (tag / data-testid / text), and a screenshot at /tmp/preview-probe.png.

import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(join(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const deckId = process.argv[2];
if (!deckId) {
  console.error('usage: node probe_preview_audience.mjs <deckId>');
  process.exit(1);
}
if (!process.env.AHA_TOKEN) {
  console.error('AHA_TOKEN env is required (source the plugin test-env.sh)');
  process.exit(1);
}
const base = process.env.BASE_HOST
  || 'https://ab214fb69c15de4b3d300d0e323bc3a4d29327d6.presenter.sandbox.ahaslide.com';

const ctx = await chromium.launchPersistentContext('/tmp/probe-preview-audience', {
  headless: true, viewport: { width: 1440, height: 900 },
});
const page = ctx.pages()[0] ?? (await ctx.newPage());
await ctx.addCookies([{
  name: 'ahaToken', value: process.env.AHA_TOKEN,
  domain: new URL(base).hostname, path: '/',
}]);
await page.goto(`${base}/presentation/${deckId}?preview=true`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(15000); // preview iframes load slowly

console.log('--- host-document pane wrappers (tooltip anchors) ---');
for (const sel of ['.iframe-wrapper-presenter', '.iframe-wrapper-audience', '.preview-header']) {
  const n = await page.locator(sel).count();
  console.log(`${sel}: ${n ? 'present' : 'MISSING'}`);
}

console.log('--- audience iframe interactive elements ---');
let found = false;
for (const f of page.frames()) {
  if (!f.url().includes('audience.')) continue;
  found = true;
  console.log('frame:', f.url().slice(0, 100));
  try {
    const hits = await f.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll(
        'button, [role="button"], [data-testid], input, label, [class*="option"]')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const tid = el.getAttribute('data-testid') || '';
        const text = (el.textContent || '').trim().slice(0, 45);
        if (tid || text) out.push({ tag: el.tagName, tid, text });
      }
      // dedupe by tid+text
      const seen = new Set();
      return out.filter((h) => {
        const k = h.tid + '|' + h.text;
        if (seen.has(k)) return false;
        seen.add(k); return true;
      }).slice(0, 40);
    });
    console.log(JSON.stringify(hits, null, 1));
  } catch (e) {
    console.log('  (cannot evaluate:', String(e).slice(0, 80), ')');
  }
}
if (!found) console.log('no audience.* frame found — is the preview loaded / deck non-empty?');

await page.screenshot({ path: '/tmp/preview-probe.png' });
console.log('screenshot: /tmp/preview-probe.png');
await ctx.close();
