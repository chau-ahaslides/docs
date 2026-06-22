#!/usr/bin/env node
/**
 * record-onboarding.mjs — Standalone, slow-motion screen recorder for the
 * AhaSlides presenter ONBOARDING flow on a sandbox environment.
 *
 * It:
 *   1. Authenticates by setting the `ahaToken` cookie (read ONLY from the
 *      AHA_TOKEN env var — never hardcoded).
 *   2. Injects a visible mouse-cursor overlay (reused from
 *      fixtures/mouseHelper.js) before navigation.
 *   3. Walks the GATED, SPOTLIGHT onboarding tour (?onboarding=default) step by
 *      step with a visible cursor and ~1s slow-motion pauses, recording the
 *      whole thing to a webm.
 *
 * FAST-BOOT OPTIMIZATIONS
 * ----------------------
 *   • WARM-CACHE / PERSISTENT PROFILE (two-launch). We use a PERSISTENT browser
 *     profile (`chromium.launchPersistentContext(userDataDir, …)`) so the HTTP /
 *     asset / bundle cache survives between launches:
 *       1) WARM-UP launch (NO recordVideo): set cookie, navigate, wait for the
 *          app shell + onboarding tooltip, then close. Assets land on disk.
 *       2) RECORD launch: SAME userDataDir, now with `recordVideo`. The boot is
 *          served from the warm disk cache, so the recorded "loading" segment is
 *          much shorter. The warm-up is best-effort: a failure only logs a
 *          warning and we fall straight through to the record pass.
 *     userDataDir defaults under OUT_DIR/.profile and is configurable via the
 *     PROFILE_DIR env var. It is intentionally reused across runs to stay warm.
 *   • NO LAUNCH-LEVEL slowMo on the record pass. Launch-level `slowMo` would
 *     delay EVERY action — including the page-load-driven ones — making the boot
 *     feel slow. Instead we pace ONLY the tour interactions with explicit waits
 *     (visible `mouse.move(…,{steps:25})` + ~1s `waitForTimeout` between steps),
 *     so navigation / app boot / editor load all run at full browser speed.
 *
 * TOUR-AWARE ADVANCE LOGIC
 * ------------------------
 * The presenter onboarding overlay (OnboardingOverlay.vue on the
 * `claude/add-onboarding-overlay` FE branch deployed to this sandbox) is a
 * 4-step spotlight tour driven by a scenario JSON (scenarios/default.json). Each
 * step is either:
 *   • a NEXT step (action == null)  → click the tooltip's
 *     `[data-testid="onboarding-next-button"]` to advance, OR
 *   • an ACTION step (action.type == 'click') → the tour will only advance when
 *     the user clicks the SPOTLIGHTED target element (action.selector). The
 *     tooltip shows a bouncing "hint" arrow instead of a Next button.
 *
 * This recorder mirrors that contract exactly using the canonical step list
 * embedded below (DEFAULT_SCENARIO_STEPS — copied verbatim from the FE source
 * scenarios/default.json). It NEVER falls back to fuzzy "create"/"created" text
 * matching (that previously mis-clicked a sort-column header). Any generic
 * matching is scoped to `[data-testid^="onboarding-"]` only.
 *
 * Clicking "New presentation" (step-create) creates a real presentation and
 * navigates into the editor; the recorder waits for the editor route + the next
 * step's tooltip before continuing. Missing targets are logged + screenshotted
 * and the walk stops gracefully — the recording still saves.
 *
 * USAGE:
 *   AHA_TOKEN=<jwt> node scripts/record-onboarding.mjs
 *
 * OPTIONAL ENV (all have sensible defaults):
 *   ONBOARDING_URL   target URL (default: the sandbox presentations onboarding URL)
 *   AHA_HOST         cookie host (default: derived from ONBOARDING_URL)
 *   STEPS_FILE       path to a JSON file describing the step sequence
 *   OUT_DIR          video output dir (default: <cwd>/onboarding-video-output)
 *   PROFILE_DIR      persistent user-data dir for the warm cache (default: OUT_DIR/.profile)
 *   WARMUP           "0" to skip the warm-up pass (default: enabled)
 *   VIEWPORT         "WxH" (default: 1440x900)
 *   STEP_PAUSE_MS    pause between steps (default: 1000)
 *   HEADLESS         "0" to watch live (default: headless)
 *   DISCOVER         "1" → discovery pass only (dumps candidates + screenshots, no scripted walk)
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync, mkdirSync, existsSync, writeFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
// PORTABLE: no longer tied to a fixed repo layout. Output defaults to a folder
// in the CURRENT project's working directory (see OUT_DIR below). __dirname is
// only used to resolve sibling bundled assets.
void __dirname;

// ---------------------------------------------------------------------------
// Config (env-driven so this is reusable for any onboarding target)
// ---------------------------------------------------------------------------
const DEFAULT_URL =
  'https://ab214fb69c15de4b3d300d0e323bc3a4d29327d6.presenter.sandbox.ahaslide.com/apps/presentations?onboarding=default';

const RAW_ONBOARDING_URL = process.env.ONBOARDING_URL || DEFAULT_URL;

/**
 * Derive the scenario key from STEPS_FILE basename (e.g. ".../ld-manager.json"
 * → "ld-manager"). Used to repair a URL that is missing `onboarding=<key>`.
 */
function scenarioKeyFromStepsFile() {
  const f = process.env.STEPS_FILE;
  if (!f) return null;
  const base = f.split('/').pop() || '';
  return base.replace(/\.json$/i, '') || null;
}

/**
 * Normalize the onboarding URL so the gated tour actually triggers. The app
 * only recognizes the `onboarding=<key>` query param. Users frequently pass a
 * bare flag-style param instead (e.g. `?ld-manager`), which the app ignores.
 *
 * Rules (conservative — never clobber an existing onboarding= value):
 *   1. If `onboarding=<value>` already present → leave it untouched.
 *   2. Else derive the key from a bare flag param (a key with empty value, e.g.
 *      `?ld-manager`) — strip that bare param and set `onboarding=<key>`.
 *   3. Else derive the key from STEPS_FILE basename and set `onboarding=<key>`.
 *   4. Else leave the URL as-is (let the app use its own default).
 */
function normalizeOnboardingUrl(rawUrl) {
  const u = new URL(rawUrl);
  const params = u.searchParams;
  if (params.get('onboarding')) {
    // Already correct — do not touch.
    return u.toString();
  }
  // Look for a bare flag-style param (value is empty string) to use as the key,
  // preferring a non-reserved one. e.g. `?ld-manager` → key "ld-manager".
  let key = null;
  for (const [k, v] of params.entries()) {
    if (v === '' && k && k !== 'onboarding') {
      key = k;
      params.delete(k);
      break;
    }
  }
  if (!key) key = scenarioKeyFromStepsFile();
  if (key) {
    params.set('onboarding', key);
    u.search = params.toString();
    return u.toString();
  }
  return rawUrl;
}

const ONBOARDING_URL = normalizeOnboardingUrl(RAW_ONBOARDING_URL);
if (ONBOARDING_URL !== RAW_ONBOARDING_URL) {
  console.log(`[url] input URL had no onboarding=<key>; normalized:`);
  console.log(`[url]   from: ${RAW_ONBOARDING_URL}`);
  console.log(`[url]   to:   ${ONBOARDING_URL}`);
}
const TARGET_HOST = process.env.AHA_HOST || new URL(ONBOARDING_URL).host;
// PORTABLE: default output lands in the CURRENT project's folder, not a fixed
// repo path. Override with OUT_DIR for any other location.
const OUT_DIR = process.env.OUT_DIR || join(process.cwd(), 'onboarding-video-output');
// Persistent user-data dir → the HTTP/asset cache survives between the warm-up
// and the record launch (and across runs). Reused on purpose to stay warm.
const PROFILE_DIR = process.env.PROFILE_DIR || join(OUT_DIR, '.profile');
const WARMUP = process.env.WARMUP !== '0';
const [VW, VH] = (process.env.VIEWPORT || '1440x900').split('x').map(Number);
const STEP_PAUSE_MS = Number(process.env.STEP_PAUSE_MS || 1000);
const HEADLESS = process.env.HEADLESS !== '0';
const DISCOVER = process.env.DISCOVER === '1';
// SHORT initial presence probe for a step's tooltip / interaction target. If the
// element isn't present within this window we IMMEDIATELY hand off to
// autoHealReveal (which has its own ~25s internal re-check loop) instead of
// blocking the full TARGET_TIMEOUT_MS. This kills the dead pause before a gated
// step (e.g. ld-pick-answer behind the kickstart "Choose a slide" screen).
const TOOLTIP_PROBE_MS = Number(process.env.TOOLTIP_PROBE_MS || 1500);

const TOKEN = process.env.AHA_TOKEN;
if (!TOKEN) {
  console.error('FATAL: AHA_TOKEN env var is required. Run as: AHA_TOKEN=<jwt> node scripts/record-onboarding.mjs');
  process.exit(2);
}

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(PROFILE_DIR, { recursive: true });
const SHOTS_DIR = join(OUT_DIR, 'shots');
mkdirSync(SHOTS_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Canonical tour definition — copied VERBATIM from the presenter FE source:
//   stpancras-presenter-app @ origin/claude/add-onboarding-overlay
//   src/components-v2/onboarding/scenarios/default.json
// Keep this in sync with that file if the tour changes.
//
// Contract (see OnboardingOverlay.vue):
//   - `path`           : route glob(s) the step is visible on ('*' = wildcard segment)
//   - `targetSelector` : the spotlighted element the tooltip points at
//   - `action == null` : NEXT step → click [data-testid="onboarding-next-button"]
//   - `action.type=='click'` : ACTION step → click `action.selector` to advance
// ---------------------------------------------------------------------------
const DEFAULT_SCENARIO_STEPS = [
  {
    id: 'step-welcome',
    path: '/apps/presentations',
    title: 'Welcome to AhaSlides!',
    targetSelector: '.new-presentation-button',
    action: null,
  },
  {
    id: 'step-create',
    path: '/apps/presentations',
    title: 'Create a New Presentation',
    targetSelector: '.new-presentation-button',
    action: { type: 'click', selector: '.new-presentation-button', hint: "Click 'New Presentation' to continue" },
  },
  {
    id: 'step-slide-type',
    path: '/presentation/*',
    title: 'Add a Poll',
    targetSelector: '[aria-label="Poll"]',
    action: { type: 'click', selector: '[aria-label="Poll"]', hint: "Click 'Poll' to continue" },
  },
  {
    id: 'step-present',
    path: '/presentation/*',
    title: 'Ready to Present!',
    targetSelector: '.aha-button-present',
    action: null,
  },
];

// The tooltip's primary control (Next/Done) — the only generic, onboarding-scoped
// element we ever click. NEVER fall back to fuzzy "create"/"created" text.
const NEXT_BUTTON_SELECTOR = '[data-testid="onboarding-next-button"]';
const TOOLTIP_SELECTOR = '.onboarding-tooltip';

/**
 * Unwrap whatever shape the scenario JSON arrives in into a bare step array.
 * The FE native scenario files are `{ "steps": [...] }`, but be tolerant of a
 * bare array or a `{ record: { steps: [...] } }` / `{ record: [...] }` wrapper.
 */
function unwrapSteps(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.steps)) return parsed.steps;
  if (parsed && parsed.record) {
    if (Array.isArray(parsed.record)) return parsed.record;
    if (Array.isArray(parsed.record.steps)) return parsed.record.steps;
  }
  return null;
}

/**
 * Normalize one FE scenario step into the shape runTour() consumes.
 *
 * The FE schema (scenarios/*.json, driven by OnboardingOverlay.vue
 * `_attachActionListener`) per step:
 *   { id, path, title, description, targetSelector, action }
 * where `action` is one of:
 *   - null                                            → NEXT button
 *   - { type:'click',       selector, hint }          → click selector to advance
 *   - { type:'input',       hint }                    → type into targetSelector,
 *                                                       advance on Enter/blur w/ content
 *   - { type:'input-match', value, hint }             → type EXACT `value` into
 *                                                       targetSelector; FE advances
 *                                                       when input value === value
 *
 * For input / input-match the FE listens on the step's `targetSelector` element
 * (action has no own selector), so we surface a resolved `inputSelector`.
 * We pass every field through and only ADD normalized helpers so nothing is lost.
 */
function normalizeStep(raw) {
  const action = raw.action || null;
  const type = action && action.type ? action.type : null; // null | click | input | input-match
  // The selector the FE listens on / we drive:
  //   click       → action.selector (the spotlighted target)
  //   input(-match)→ the step's targetSelector (FE falls back to it)
  let inputSelector = null;
  if (type === 'input' || type === 'input-match') {
    inputSelector = raw.targetSelector || (action && action.selector) || null;
  }
  // Exact text to type. input-match REQUIRES action.value; plain input accepts
  // any non-empty text — prefer an explicit value/text/placeholder if present.
  let inputValue = null;
  if (type === 'input-match') {
    inputValue = action.value;
  } else if (type === 'input') {
    inputValue =
      action.value ?? action.text ?? action.placeholder ?? raw.placeholder ?? 'What is our remote work policy?';
  }
  return {
    ...raw,
    _actionType: type,                                  // null | 'click' | 'input' | 'input-match'
    _clickSelector: type === 'click' ? action.selector : null,
    _inputSelector: inputSelector,
    _inputValue: inputValue,
  };
}

// Allow overriding the embedded step list with an external JSON file. Accepts
// the FE native scenario schema ({ "steps":[...] }), a bare [...] array, or a
// { record: {...} } wrapper. Defaults to the canonical embedded tour.
let TOUR_STEPS = DEFAULT_SCENARIO_STEPS.map(normalizeStep);
if (process.env.STEPS_FILE && existsSync(process.env.STEPS_FILE)) {
  try {
    const parsed = JSON.parse(readFileSync(process.env.STEPS_FILE, 'utf8'));
    const rawSteps = unwrapSteps(parsed);
    if (!rawSteps || !rawSteps.length) {
      throw new Error('no steps array found (expected {steps:[...]} or a bare array)');
    }
    TOUR_STEPS = rawSteps.map(normalizeStep);
    const typeSummary = TOUR_STEPS.map((s) => s._actionType || 'next').join(', ');
    console.log(`[steps] loaded ${TOUR_STEPS.length} steps from ${process.env.STEPS_FILE}`);
    console.log(`[steps] action types: [${typeSummary}]`);
  } catch (e) {
    console.warn(`[steps] failed to parse STEPS_FILE: ${e.message} — using embedded canonical tour`);
  }
}

// ---------------------------------------------------------------------------
// Mouse-cursor overlay — reused snippet (kept in sync with fixtures/mouseHelper.js)
// ---------------------------------------------------------------------------
const mouseHelperSnippet = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__mouseHelperInstalled) return;
  window.__mouseHelperInstalled = true;
  const install = () => {
    if (!document.body) return;
    if (document.getElementById('playwright-mouse-pointer')) return;
    const box = document.createElement('div');
    box.id = 'playwright-mouse-pointer';
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      #playwright-mouse-pointer {
        pointer-events: none; position: fixed; top: 0; left: 0;
        z-index: 2147483647; width: 22px; height: 22px; margin: -11px 0 0 -11px;
        border-radius: 50%; border: 2px solid #ff0000;
        background: rgba(255,0,0,0.35);
        box-shadow: 0 0 0 2px rgba(255,255,255,0.9);
        transition: background 0.15s, border-color 0.15s, transform 0.05s;
        will-change: transform, left, top; }
      #playwright-mouse-pointer.button-down {
        transform: scale(0.6); background: rgba(0,128,255,0.6); border-color: #0080ff; }`;
    (document.head || document.documentElement).appendChild(styleElement);
    document.body.appendChild(box);
    document.addEventListener('mousemove', (e) => {
      box.style.left = e.clientX + 'px';
      box.style.top = e.clientY + 'px';
    }, true);
    document.addEventListener('mousedown', () => box.classList.add('button-down'), true);
    document.addEventListener('mouseup', () => box.classList.remove('button-down'), true);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else { install(); }
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** The auth cookie set (exact host + parent domain), reused by both passes. */
const authCookies = () => [
  { name: 'ahaToken', value: TOKEN, url: `https://${TARGET_HOST}/`, secure: true },
  { name: 'ahaToken', value: TOKEN, domain: '.ahaslide.com', path: '/', secure: true },
];

/**
 * Apply auth + the visible-cursor init script to a (persistent) context, plus
 * to any popup pages it may open. With launchPersistentContext we hold the
 * context directly (no browser.newContext), so we call addInitScript on the
 * context — it applies to every current/future page, including popups.
 */
async function prepareContext(context) {
  await context.addCookies(authCookies());
  await context.addInitScript(mouseHelperSnippet);
  // Defensive: re-install the cursor overlay on any popup window too.
  context.on('page', (p) => {
    p.addInitScript(mouseHelperSnippet).catch(() => {});
  });
}

/** Smoothly move the visible cursor to a box center, then click there. */
async function moveAndClickBox(page, box) {
  const cx = Math.round(box.x + box.width / 2);
  const cy = Math.round(box.y + box.height / 2);
  await page.mouse.move(cx, cy, { steps: 25 });
  await sleep(250);
  await page.mouse.down();
  await sleep(120);
  await page.mouse.up();
  return { cx, cy };
}

/**
 * Move the visible cursor to a field, click to focus it, then type a value
 * char-by-char so it's watchable. Mirrors what OnboardingOverlay.vue's
 * `_attachActionListener` waits for:
 *   - type 'input-match' → listens on the field's `input` event and advances
 *     when `e.target.value.trim() === actionConfig.value`. We type the EXACT
 *     value so the running value reaches an exact match.
 *   - type 'input'       → advances on Enter / blur once the field has content.
 *     We type the value then press Enter to confirm.
 *
 * Typing via page.keyboard.type fires real keydown/keypress/input events on the
 * focused element (what the FE listens for). For contenteditable (latex div)
 * targets there is no `.value`, but the FE's plain 'input' handler advances on
 * Enter/blur with textContent, which keyboard typing populates too.
 */
async function moveAndType(page, box, value, { kind, frame, selector }) {
  const cx = Math.round(box.x + box.width / 2);
  const cy = Math.round(box.y + box.height / 2);
  const str = String(value ?? '');
  // Resolve the actual field element via the frame locator (NOT activeElement —
  // focus can move). This is the same element the FE listener is bound to.
  const f = frame || page.mainFrame();
  // Resolve the real editable <input>/<textarea>/[contenteditable]. The scenario
  // `targetSelector` may point at a WRAPPER element (e.g. AhaSlides `aha-input`
  // renders `name=…` on its root <div>, with the actual <input> as a child), so
  // we look for an editable element AT or INSIDE the selector. The FE attaches
  // its listener to the wrapper but `input` events bubble up from the child, so
  // we must drive/set the value on the real child input for the match to fire.
  let loc = null;
  if (selector) {
    const candidates = [
      `${selector}:is(input, textarea, [contenteditable])`,
      `${selector} input`,
      `${selector} textarea`,
      `${selector} [contenteditable]`,
      selector,
    ];
    for (const sel of candidates) {
      try {
        const cand = f.locator(sel).first();
        if (await cand.count().catch(() => 0)) { loc = cand; break; }
      } catch { /* try next */ }
    }
  }

  await page.mouse.move(cx, cy, { steps: 25 });
  await sleep(250);
  // Triple-click selects all existing text in a text input (a real user gesture),
  // so the subsequent typing REPLACES any default/pre-filled value rather than
  // appending to it. The presentation-title field opens pre-populated with the
  // default name, so a plain click+type would concatenate.
  await page.mouse.click(cx, cy, { clickCount: 3 });
  await sleep(250);

  if (kind === 'input-match') {
    // The FE's input-match handler advances when the field's `input` event fires
    // with `e.target.value.trim() === actionConfig.value`. Vue controls this
    // input via v-model + autoresize, which can swallow individual keystrokes
    // (observed char drops when typing fast). To GUARANTEE the exact running
    // value the FE compares against, set the value through the native
    // HTMLInputElement value setter (so Vue's reactivity + the FE listener both
    // see it) and dispatch a bubbling 'input' event. We still do a visible
    // char-by-char type first purely so the recording shows real typing.
    await page.keyboard.type(str, { delay: 120 });
    await sleep(300);
    // The FE's input-match handler advances when an `input` event whose
    // `e.target.value.trim()` === actionConfig.value reaches the element the
    // overlay attached to (the step's targetSelector — possibly a WRAPPER whose
    // child <input> bubbles the event up). Vue v-model + autoresize can drop a
    // keystroke, so we deterministically force the exact value on the real input
    // AND re-fire the input event from the inner input so it bubbles to the
    // overlay's listener. We retry a few times because the overlay may attach
    // its listener a beat after the field mounts.
    if (loc) {
      let advanced = false;
      for (let attempt = 1; attempt <= 6 && !advanced; attempt++) {
        try {
          const before = await loc.inputValue().catch(() => '(?)');
          await loc.evaluate((el, val) => {
            el.value = val;
            // Fire both an InputEvent and a plain bubbling Event('input') — some
            // listeners are picky about the event constructor.
            try { el.dispatchEvent(new InputEvent('input', { bubbles: true, data: val })); } catch (_) {}
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, str);
          const after = await loc.inputValue().catch(() => '(?)');
          if (attempt === 1) {
            console.log(`[type] input-match: typed="${before}" → forced="${after}" (target "${str}")`);
          }
        } catch (e) {
          console.warn(`[type] input-match dispatch attempt ${attempt} FAILED: ${e.message}`);
        }
        // Did the overlay advance? It does so by unmounting the current tooltip
        // (currentStepIndex changes → tooltip re-keys). Treat "tooltip momentarily
        // gone / re-rendered" as progress; the caller's next-tooltip wait confirms.
        await sleep(400);
        const stillThere = await findBox(page, TOOLTIP_SELECTOR, { timeout: 0 });
        if (!stillThere) { advanced = true; break; }
      }
      console.log(`[type] input-match: ${advanced ? 'overlay advanced (tooltip re-rendered)' : 'overlay did not visibly advance after retries — caller will re-check'}.`);
    } else {
      console.warn(`[type] input-match: could not resolve field locator "${selector}" for exact-value correction — relying on typed value only.`);
    }
    // (Removed a redundant trailing settle here — the retry loop + the caller's
    // single trailing pause already cover settling without stacking waits.)
  } else if (kind === 'input') {
    // Type char-by-char (visible pacing). keyboard.type fires real
    // keydown/keypress/input on the focused element — what the FE listens for.
    await page.keyboard.type(str, { delay: 110 });
    await sleep(350);
    // Plain input advances on Enter (or blur) once there's content. For
    // contenteditable targets (.value absent) typing populates textContent;
    // pressing Enter triggers the FE's keydown→advance path.
    await page.keyboard.press('Enter');
    await sleep(150);
    // Fallback: also blur, which the FE accepts as a confirm when content exists.
    if (loc) await loc.evaluate((el) => el.blur && el.blur()).catch(() => {});
    await sleep(150);
  }
  return { cx, cy };
}

/**
 * Collect visible, clickable candidates across the main frame + all child
 * frames. Returns [{ frameUrl, text, role, box, testid }]. Boxes returned by
 * child frames are translated into main-page coordinates so page.mouse can
 * reach them.
 */
async function collectCandidates(page) {
  const out = [];
  for (const frame of page.frames()) {
    let frameOffset = { x: 0, y: 0 };
    // Translate child-frame coords into top-level page coords via the owning
    // iframe element's bounding box.
    if (frame !== page.mainFrame()) {
      try {
        const el = await frame.frameElement();
        const fb = await el.boundingBox();
        if (fb) frameOffset = { x: fb.x, y: fb.y };
        else continue; // iframe not visible
      } catch { continue; }
    }
    let items = [];
    try {
      items = await frame.evaluate(() => {
        const sel = 'button, [role="button"], a[href], [data-testid], [tabindex]';
        const els = Array.from(document.querySelectorAll(sel));
        const res = [];
        for (const el of els) {
          const r = el.getBoundingClientRect();
          if (r.width < 8 || r.height < 8) continue;
          const style = window.getComputedStyle(el);
          if (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0') continue;
          if (r.bottom < 0 || r.right < 0 || r.top > window.innerHeight || r.left > window.innerWidth) continue;
          const text = (el.innerText || el.textContent || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 80);
          res.push({
            text,
            role: el.getAttribute('role') || el.tagName.toLowerCase(),
            testid: el.getAttribute('data-testid') || '',
            box: { x: r.x, y: r.y, width: r.width, height: r.height },
          });
        }
        return res;
      });
    } catch { /* cross-origin eval can race during nav */ }
    for (const it of items) {
      out.push({
        frameUrl: frame.url(),
        text: it.text,
        role: it.role,
        testid: it.testid,
        box: {
          x: it.box.x + frameOffset.x,
          y: it.box.y + frameOffset.y,
          width: it.box.width,
          height: it.box.height,
        },
      });
    }
  }
  return out;
}

/**
 * Resolve a CSS selector to a visible element's bounding box, in main-page
 * coordinates, searching the main frame first then any child frames. Returns
 * null if not found / not visible. Used to locate spotlighted targets and the
 * onboarding tooltip's Next button.
 */
async function findBox(page, selector, { timeout = 0 } = {}) {
  const deadline = Date.now() + timeout;
  do {
    for (const frame of page.frames()) {
      let frameOffset = { x: 0, y: 0 };
      if (frame !== page.mainFrame()) {
        try {
          const fb = await (await frame.frameElement()).boundingBox();
          if (fb) frameOffset = { x: fb.x, y: fb.y };
          else continue;
        } catch { continue; }
      }
      try {
        const loc = frame.locator(selector).first();
        if (!(await loc.count().catch(() => 0))) continue;
        const visible = await loc.isVisible().catch(() => false);
        if (!visible) continue;
        const box = await loc.boundingBox().catch(() => null);
        if (box && box.width >= 4 && box.height >= 4) {
          return {
            box: {
              x: box.x + frameOffset.x,
              y: box.y + frameOffset.y,
              width: box.width,
              height: box.height,
            },
            frame,
          };
        }
      } catch { /* cross-origin eval can race during nav */ }
    }
    if (timeout > 0) await sleep(150);
  } while (Date.now() < deadline);
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const recordedSteps = [];

// ---------------------------------------------------------------------------
// GENERIC AUTO-HEAL LAYER
// ---------------------------------------------------------------------------
// Any tour can hit a "target not on screen yet" problem: a step's spotlight
// target (or the tooltip anchored to it) is PRESENT-LATER — it only renders
// after some opener/progress control is clicked (e.g. the KickstartScreen's
// "Choose a slide" must be clicked before [aria-label="Pick Answer"] exists).
//
// Instead of hardcoding one special-case (the old slide-picker branch), we
// recover GENERICALLY whenever a step's tooltip OR interaction target can't be
// resolved within the normal timeout, BEFORE giving up. The recorder can click
// any element the app exposes — exactly like the real product tour — so we:
//   a. SCROLL the window + scrollable ancestors + scrollIntoViewIfNeeded.
//   b. REVEAL-CLICK SEARCH: rank visible clickable candidates by how likely
//      they are a "progress/opener" control, click the best, re-check the
//      target; accept the click ONLY if it actually revealed the target.
//   c. GUARDRAILS: never click destructive / flow-breaking / tooltip-own
//      controls; only click VISIBLE candidates; bound reveal clicks per step
//      (<=3) and per run (<=8) so a bad tour can't spiral.
// Successful reveal clicks are recorded as INSERTED steps so we can emit a
// "healed" scenario JSON that runs natively next time (no auto-heal needed).
// ---------------------------------------------------------------------------

const AUTOHEAL = {
  STEP_BUDGET_MS: 25000, // total recovery budget per step
  MAX_REVEAL_CLICKS_PER_STEP: 3,
  MAX_REVEAL_CLICKS_PER_RUN: 8,
  totalRevealClicks: 0,
};

// PRIORITIZED HINTS — known high-confidence opener selectors. These are only a
// RANKING boost on top of the generic heuristics, NOT the whole mechanism. Any
// app-exposed control can still be discovered and clicked generically.
const REVEAL_HINT_SELECTORS = [
  '[name="kickstart-screen-create-blank-slide-button"]',
  '[data-testid*="create-blank"]',
  '[data-testid*="add-slide"]',
  '[name="kickstart-screen-create-blank-slide-button"]',
];

// Text/aria/testid that SUGGESTS a progress/opener control (higher = try first).
const REVEAL_PROGRESS_RE = /choose|continue|next step|create|blank|start|begin|open|add slide|skip|got it|let'?s go|proceed/i;

// Text/aria/testid that is DESTRUCTIVE / flow-breaking — NEVER click while healing.
const REVEAL_FORBIDDEN_RE = /delete|remove|logout|log out|sign out|cancel|close|dismiss|trash|delete-slide|upgrade|buy|pay/i;

// The onboarding tooltip's own controls must never be treated as reveal clicks.
const ONBOARDING_DISMISS_SELECTOR = '[data-testid="onboarding-dismiss-button"]';

/**
 * Best-effort: build a STABLE CSS selector for a candidate so the healed JSON is
 * reusable. Prefers data-testid / name over brittle text. Falls back to an
 * aria-label selector, then a role+text :has-text() expression.
 */
function stableSelectorForCandidate(c) {
  if (c.testid) return `[data-testid="${c.testid}"]`;
  if (c.name) return `[name="${c.name}"]`;
  if (c.ariaLabel) return `[aria-label="${c.ariaLabel.replace(/"/g, '\\"')}"]`;
  if (c.text) {
    const role = c.role && /^(button|a)$/i.test(c.role) ? c.role : 'button';
    return `${role}:has-text("${c.text.replace(/"/g, '\\"').slice(0, 40)}")`;
  }
  return c.role || 'button';
}

/**
 * Score a candidate by likelihood of being a "progress/opener" control.
 * Higher = try first. Returns -Infinity for forbidden / tooltip-own controls so
 * they are filtered out entirely (a guardrail, not just a low rank).
 */
function scoreRevealCandidate(c) {
  const hay = `${c.text || ''} ${c.ariaLabel || ''} ${c.testid || ''} ${c.name || ''}`;
  // GUARDRAIL: destructive / flow-breaking → exclude.
  if (REVEAL_FORBIDDEN_RE.test(hay)) return -Infinity;
  // GUARDRAIL: anything that is the onboarding tooltip's own dismiss/next control,
  // or lives inside the tooltip, is excluded.
  if (c.insideTooltip) return -Infinity;
  if (/onboarding-(dismiss|next|skip)-button/.test(c.testid || '')) return -Infinity;

  let score = 0;
  // Known high-confidence opener hints (a boost, not the mechanism).
  if (c.matchesHint) score += 100;
  // Progress/opener vocabulary.
  if (REVEAL_PROGRESS_RE.test(hay)) score += 40;
  // data-testid / name present → more "addressable" / intentional control.
  if (c.testid || c.name) score += 15;
  // Prominence: larger buttons are more likely primary CTAs.
  const area = (c.box?.width || 0) * (c.box?.height || 0);
  score += Math.min(20, area / 4000);
  // Primary-styled hints in class/text.
  if (/primary|cta|main/i.test(`${c.cls || ''}`)) score += 10;
  // Slight preference for actual <button>/role=button over generic [tabindex].
  if (/^button$/i.test(c.role)) score += 8;
  return score;
}

/**
 * Richer candidate collection for ranking — augments collectCandidates() with
 * aria-label / name / class / insideTooltip so the ranker + stable-selector
 * builder have what they need. Done as a second per-frame eval keyed by the
 * already-collected boxes would be brittle, so we re-collect with more fields.
 */
async function collectRevealCandidates(page) {
  const out = [];
  for (const frame of page.frames()) {
    let frameOffset = { x: 0, y: 0 };
    if (frame !== page.mainFrame()) {
      try {
        const el = await frame.frameElement();
        const fb = await el.boundingBox();
        if (fb) frameOffset = { x: fb.x, y: fb.y };
        else continue;
      } catch { continue; }
    }
    let items = [];
    try {
      items = await frame.evaluate(() => {
        const sel = 'button, [role="button"], a[href], [data-testid], [tabindex]';
        const els = Array.from(document.querySelectorAll(sel));
        const res = [];
        for (const el of els) {
          const r = el.getBoundingClientRect();
          if (r.width < 8 || r.height < 8) continue;
          const style = window.getComputedStyle(el);
          if (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0') continue;
          if (r.bottom < 0 || r.right < 0 || r.top > window.innerHeight || r.left > window.innerWidth) continue;
          const text = (el.innerText || el.textContent || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 80);
          res.push({
            text,
            role: el.getAttribute('role') || el.tagName.toLowerCase(),
            testid: el.getAttribute('data-testid') || '',
            name: el.getAttribute('name') || '',
            ariaLabel: el.getAttribute('aria-label') || '',
            cls: el.className && typeof el.className === 'string' ? el.className : '',
            insideTooltip: !!el.closest('.onboarding-tooltip'),
            box: { x: r.x, y: r.y, width: r.width, height: r.height },
          });
        }
        return res;
      });
    } catch { /* cross-origin eval can race during nav */ }
    for (const it of items) {
      out.push({
        frameUrl: frame.url(),
        text: it.text,
        role: it.role,
        testid: it.testid,
        name: it.name,
        ariaLabel: it.ariaLabel,
        cls: it.cls,
        insideTooltip: it.insideTooltip,
        box: {
          x: it.box.x + frameOffset.x,
          y: it.box.y + frameOffset.y,
          width: it.box.width,
          height: it.box.height,
        },
      });
    }
  }
  return out;
}

/** Scroll the window + every scrollable container to surface a present-but-offscreen target. */
async function scrollToReveal(page, selector) {
  // 1) Try Playwright's scrollIntoViewIfNeeded across all frames for the exact selector.
  for (const frame of page.frames()) {
    try {
      const loc = frame.locator(selector).first();
      if (await loc.count().catch(() => 0)) {
        await loc.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {});
      }
    } catch { /* selector may be invalid in a frame; ignore */ }
  }
  // 2) Brute-scroll the window + all scrollable ancestors/containers in the main frame.
  try {
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const all = Array.from(document.querySelectorAll('*'));
      for (const el of all) {
        const s = window.getComputedStyle(el);
        const scrollable = /(auto|scroll)/.test(s.overflowY + s.overflow) && el.scrollHeight > el.clientHeight + 4;
        if (scrollable) {
          el.scrollTop = 0;
          // also nudge to bottom-then-top in case the target is lower
          el.scrollTop = el.scrollHeight;
          el.scrollTop = 0;
        }
      }
    });
  } catch { /* eval can race during nav */ }
}

/**
 * GENERIC AUTO-HEAL — runs whenever a step's tooltip OR interaction target can't
 * be resolved in the normal timeout, before giving up. Action-type agnostic:
 * `clickSelector` is the selector we ultimately need to resolve (the step's
 * interaction target, or the tooltip selector when that's what's missing).
 *
 * Recovery order (bounded ~STEP_BUDGET_MS total), each followed by a re-check:
 *   a. SCROLL to bring an off-screen-but-present target into view.
 *   b. REVEAL-CLICK SEARCH: rank visible clickables; click the best opener;
 *      re-resolve; on success record an INSERTED reveal step; else try next,
 *      up to MAX_REVEAL_CLICKS_PER_STEP (and a per-run cap).
 *
 * Returns { ok, via, revealClicks:[{selector,text}] } where ok=true means the
 * target now resolves. On failure, logs the ranked candidate list it tried.
 */
async function autoHealReveal(page, step, clickSelector, order) {
  const deadline = Date.now() + AUTOHEAL.STEP_BUDGET_MS;
  const revealClicks = [];
  const tried = [];

  const targetResolves = async () => !!(await findBox(page, clickSelector, { timeout: 0 }));

  console.log(`[autoheal] step ${order} "${step.id}": "${clickSelector}" not resolvable — starting generic auto-heal (budget ~${AUTOHEAL.STEP_BUDGET_MS / 1000}s).`);

  // ---- (a) SCROLL ----
  await scrollToReveal(page, clickSelector);
  await sleep(400);
  if (await targetResolves()) {
    console.log(`[autoheal] step ${order}: target revealed by SCROLL.`);
    return { ok: true, via: 'scroll', revealClicks };
  }

  // ---- (b) REVEAL-CLICK SEARCH ----
  let clicksThisStep = 0;
  while (
    Date.now() < deadline &&
    clicksThisStep < AUTOHEAL.MAX_REVEAL_CLICKS_PER_STEP &&
    AUTOHEAL.totalRevealClicks < AUTOHEAL.MAX_REVEAL_CLICKS_PER_RUN
  ) {
    const candidates = (await collectRevealCandidates(page))
      .map((c) => {
        c.matchesHint = REVEAL_HINT_SELECTORS.some((h) => {
          // cheap structural hint match against testid/name (the hint selectors
          // are attribute selectors); exact attr-contains check.
          const m = h.match(/\[(name|data-testid)\*?="?([^"\]]+)"?\]/);
          if (!m) return false;
          const [, attr, val] = m;
          const fieldVal = attr === 'name' ? c.name : c.testid;
          return h.includes('*=') ? (fieldVal || '').includes(val) : fieldVal === val;
        });
        c.score = scoreRevealCandidate(c);
        c.stableSelector = stableSelectorForCandidate(c);
        return c;
      })
      // GUARDRAIL: drop excluded (forbidden / tooltip-own) candidates entirely.
      .filter((c) => c.score > -Infinity)
      // Don't bother with near-useless unlabeled tiny controls.
      .filter((c) => (c.text || c.ariaLabel || c.testid || c.name))
      // Don't re-click something we already tried this step.
      .filter((c) => !revealClicks.some((r) => r.selector === c.stableSelector))
      .sort((a, b) => b.score - a.score);

    if (!candidates.length) {
      console.warn(`[autoheal] step ${order}: no eligible reveal candidates on screen.`);
      break;
    }

    const best = candidates[0];
    tried.push({ selector: best.stableSelector, text: best.text || best.ariaLabel, score: Math.round(best.score) });
    console.log(`[autoheal] step ${order}: reveal-click #${clicksThisStep + 1} → ${best.stableSelector} ("${(best.text || best.ariaLabel || '').slice(0, 40)}") score=${Math.round(best.score)}`);

    await moveAndClickBox(page, best.box);
    clicksThisStep++;
    AUTOHEAL.totalRevealClicks++;
    await sleep(STEP_PAUSE_MS);
    // Re-check (also try scrolling, in case the click revealed a scroll region).
    await scrollToReveal(page, clickSelector);
    await sleep(300);

    if (await targetResolves()) {
      // ACCEPT this reveal click — it actually made the target resolve.
      revealClicks.push({ selector: best.stableSelector, text: best.text || best.ariaLabel || '' });
      console.log(`[autoheal] step ${order}: target REVEALED by clicking ${best.stableSelector}. Recording inserted step.`);
      return { ok: true, via: 'reveal-click', revealClicks };
    }
    // Did not reveal → loop and try the next-best candidate.
    revealClicks.push({ selector: best.stableSelector, text: best.text || best.ariaLabel || '', rejected: true });
  }

  // ---- FAILURE: log the ranked list we tried so a human can see what was on screen. ----
  console.warn(`[autoheal] step ${order}: auto-heal FAILED for "${clickSelector}". Ranked candidates tried:`);
  tried.forEach((t, i) => console.warn(`[autoheal]   #${i + 1} ${t.selector} ("${(t.text || '').slice(0, 40)}") score=${t.score}`));
  if (AUTOHEAL.totalRevealClicks >= AUTOHEAL.MAX_REVEAL_CLICKS_PER_RUN) {
    console.warn(`[autoheal] step ${order}: per-run reveal-click cap (${AUTOHEAL.MAX_REVEAL_CLICKS_PER_RUN}) reached.`);
  }
  return { ok: false, via: null, revealClicks: revealClicks.filter((r) => !r.rejected) };
}

// ---------------------------------------------------------------------------
// HEALED STEPS — track the FULL realized sequence (original steps + any inserted
// auto-heal reveal clicks) in the FE-compatible scenario schema, so we can emit
// OUT_DIR/<scenario>-healed.json that runs natively next time (no auto-heal).
// ---------------------------------------------------------------------------
const healedSteps = []; // FE schema: { id, path, title, targetSelector, action }
let autoHealInsertCount = 0;

/** Push the original step (untouched) into the healed sequence. */
function recordHealedOriginal(step) {
  healedSteps.push({
    id: step.id,
    path: step.path,
    title: step.title,
    targetSelector: step.targetSelector,
    action: step.action ?? null,
  });
}

/** Insert a synthesized reveal step (FE schema) immediately BEFORE the step it unblocked. */
function recordHealedRevealClick(reveal, unblockedStep) {
  autoHealInsertCount++;
  const label = (reveal.text || '').trim().slice(0, 50) || reveal.selector;
  healedSteps.push({
    id: `autoheal-open-${autoHealInsertCount}`,
    path: unblockedStep.path,
    title: `Auto-revealed: ${label}`,
    targetSelector: reveal.selector,
    action: { type: 'click', selector: reveal.selector, hint: `Click to reveal "${unblockedStep.title}"` },
  });
}

/** Derive the scenario key for the healed-file name (onboarding= param or STEPS_FILE basename). */
function scenarioKey() {
  try {
    const fromUrl = new URL(ONBOARDING_URL).searchParams.get('onboarding');
    if (fromUrl) return fromUrl;
  } catch { /* ignore */ }
  return scenarioKeyFromStepsFile() || 'onboarding';
}

/**
 * WARM-UP pass — launch the SAME persistent profile WITHOUT recordVideo, set
 * the cookie, navigate, and wait for the app shell + onboarding tooltip so all
 * assets/bundles are fetched and written to the on-disk cache. Then close so
 * the record pass boots from a warm cache. Best-effort: any failure logs a
 * warning and returns (the caller proceeds straight to the record pass).
 */
async function warmUpCache() {
  console.log('[warmup] launching persistent profile to warm the disk cache (no recording)…');
  let ctx = null;
  const startedAt = Date.now();
  try {
    ctx = await chromium.launchPersistentContext(PROFILE_DIR, {
      headless: HEADLESS,
      viewport: { width: VW, height: VH },
      // NO recordVideo, NO slowMo — keep it quiet and fast.
    });
    await prepareContext(ctx);
    const page = ctx.pages()[0] || (await ctx.newPage());
    await page.goto(ONBOARDING_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    // Wait for the onboarding tooltip so the gated overlay's assets are cached too.
    const tip = await findBox(page, TOOLTIP_SELECTOR, { timeout: 30000 });
    // Brief settle to let any trailing asset requests finish writing to cache.
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    console.log(`[warmup] tooltip ${tip ? 'ready' : 'not seen (continuing)'} after ${((Date.now() - startedAt) / 1000).toFixed(1)}s — cache warmed.`);
  } catch (e) {
    console.warn(`[warmup] best-effort warm-up FAILED (${e.message}); continuing to record pass with whatever cache exists.`);
  } finally {
    if (ctx) await ctx.close().catch(() => {});
  }
}

(async () => {
  console.log(`[record] target: ${ONBOARDING_URL}`);
  console.log(`[record] cookie host: ${TARGET_HOST}`);
  console.log(`[record] output dir: ${OUT_DIR}  viewport: ${VW}x${VH}  pause: ${STEP_PAUSE_MS}ms`);
  console.log(`[record] persistent profile: ${PROFILE_DIR}  warm-up: ${WARMUP ? 'on' : 'off'}`);

  // --- OPTIMIZATION 1: warm the cache via a first, non-recorded persistent launch.
  if (WARMUP && !DISCOVER) await warmUpCache();

  // --- RECORD launch: SAME persistent profile (warm cache), now WITH recordVideo.
  //     IMPORTANT: NO launch-level slowMo here — that would slow the boot/nav.
  //     Pacing is done ONLY via per-step waits inside the tour.
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: HEADLESS,
    viewport: { width: VW, height: VH },
    recordVideo: { dir: OUT_DIR, size: { width: VW, height: VH } },
  });

  // --- Auth (ahaToken on exact host + parent domain) + visible cursor BEFORE nav.
  await prepareContext(context);

  const page = context.pages()[0] || (await context.newPage());
  let videoPath = null;
  const recordStartedAt = Date.now();
  let tooltipReadyAtMs = null;

  try {
    console.log('[record] navigating…');
    // Run nav at full browser speed (no slowMo). We DON'T block on networkidle
    // before measuring — this SPA holds long-lived connections and never goes
    // idle, so gating the tooltip measurement on networkidle would inflate the
    // reported loading segment by the full 30s timeout.
    await page.goto(ONBOARDING_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // --- Auth sanity check: did we get redirected to a login page?
    const url = page.url();
    const onHost = url.includes(TARGET_HOST);
    const looksLikeLogin = /\/login|\/signin|\/sign-in/i.test(url);
    console.log(`[record] landed at: ${url}`);
    let authOk = true;
    if (!onHost || looksLikeLogin) {
      authOk = false;
      console.error(`[AUTH] FAILED — redirected to a login page (${url}).`);
      console.error('[AUTH] The ahaToken was rejected by the API (401). Onboarding will NOT render.');
      console.error('[AUTH] Skipping the scripted walk to avoid driving the login form; saving the short clip that captured the load+redirect.');
    } else {
      console.log('[AUTH] OK — still on sandbox host, app chrome rendering.');
    }

    // --- Measure the "loading" segment: seconds from record-start until the
    //     first onboarding tooltip is actually interactable. Measured BEFORE the
    //     networkidle settle so it reflects true time-to-interactable. With a
    //     warm cache this should be noticeably shorter.
    if (authOk && !DISCOVER) {
      const tip0 = await findBox(page, TOOLTIP_SELECTOR, { timeout: 30000 });
      if (tip0) {
        tooltipReadyAtMs = Date.now() - recordStartedAt;
        console.log(`[timing] first onboarding tooltip interactable at ~${(tooltipReadyAtMs / 1000).toFixed(1)}s after record-start (loading segment).`);
      } else {
        console.warn('[timing] first onboarding tooltip not seen within 30s — loading segment unmeasured.');
      }
    } else {
      // Non-tour paths still want a brief mount settle for the screenshot below.
      await sleep(2500);
    }
    // Best-effort settle (does NOT count toward the loading measurement above).
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    await page.screenshot({ path: join(SHOTS_DIR, '00-landed.png') }).catch(() => {});

    // ---- DISCOVERY DUMP (always useful; printed to logs) ----
    const dumpCandidates = async (label) => {
      const c = await collectCandidates(page);
      console.log(`\n[discover:${label}] ${c.length} visible interactive candidates:`);
      c.slice(0, 40).forEach((x, i) => {
        const frameTag = x.frameUrl.includes(TARGET_HOST) && x.frameUrl === page.mainFrame().url() ? 'main' : new URL(x.frameUrl).host;
        console.log(`  [${i}] <${x.role}> "${x.text}"${x.testid ? ` testid=${x.testid}` : ''} @${frameTag}`);
      });
      return c;
    };

    await dumpCandidates('initial');

    if (!authOk) {
      // Linger on the (eventual) login page a moment so the recording clearly
      // shows: app shell briefly loads → API 401 → redirect to login.
      await sleep(3000);
      await page.screenshot({ path: join(SHOTS_DIR, '01-auth-failed-login.png') }).catch(() => {});
    } else if (DISCOVER) {
      // Discovery mode: just dump candidates + a screenshot. No clicking — the
      // tour-aware walk is the real driver; discovery is for inspection only.
      await page.screenshot({ path: join(SHOTS_DIR, 'discover.png') }).catch(() => {});
      await dumpCandidates('discover');
    } else {
      // ---- TOUR-AWARE WALK (only when authenticated) ----
      await runTour(page, TOUR_STEPS);
    }

    // Final settle + ending screenshot
    await sleep(STEP_PAUSE_MS);
    await page.screenshot({ path: join(SHOTS_DIR, '99-final.png') }).catch(() => {});
    console.log(`[record] final URL: ${page.url()}`);

    videoPath = await page.video()?.path().catch(() => null);
  } catch (err) {
    console.error('[record] ERROR during walk:', err.message);
  } finally {
    // CRITICAL: video webm is only finalized on context.close(). With a
    // persistent context there is no separate browser object to close.
    await context.close();
  }

  // page.video().path() is only resolvable after close; recompute if needed
  if (!videoPath) {
    try {
      const { readdirSync, statSync } = await import('node:fs');
      const webms = readdirSync(OUT_DIR)
        .filter((f) => f.endsWith('.webm'))
        .map((f) => ({ f, m: statSync(join(OUT_DIR, f)).mtimeMs }))
        .sort((a, b) => b.m - a.m);
      if (webms.length) videoPath = join(OUT_DIR, webms[0].f);
    } catch { /* ignore */ }
  }

  // Persist the discovered step list as a reusable JSON config (no secrets).
  if (recordedSteps.length) {
    const stepsOut = join(OUT_DIR, 'onboarding-steps.json');
    writeFileSync(stepsOut, JSON.stringify(recordedSteps, null, 2));
    console.log(`[record] wrote step list → ${stepsOut}`);
  }

  // Emit the HEALED scenario file (FE schema) — the original steps PLUS any
  // auto-heal reveal clicks inserted as first-class steps, so a later run using
  // this as STEPS_FILE completes natively WITHOUT needing auto-heal.
  if (healedSteps.length) {
    const healedOut = join(OUT_DIR, `${scenarioKey()}-healed.json`);
    writeFileSync(healedOut, JSON.stringify({ steps: healedSteps }, null, 2));
    console.log(`[record] wrote HEALED scenario → ${healedOut}`);
    if (autoHealInsertCount > 0) {
      console.log(`[record] auto-heal inserted ${autoHealInsertCount} reveal step(s) into the healed scenario (the "auto-fix").`);
    } else {
      console.log('[record] no auto-heal was needed — healed scenario equals the original step sequence.');
    }
  }

  console.log('\n========================================');
  console.log(`[record] DONE. Video: ${videoPath || '(not found)'}`);
  console.log(`[record] Steps captured: ${recordedSteps.length}`);
  if (tooltipReadyAtMs != null) {
    console.log(`[record] Loading segment (record-start → first tooltip interactable): ~${(tooltipReadyAtMs / 1000).toFixed(1)}s`);
  }
  console.log('========================================');
})();

/**
 * Walk the gated spotlight tour step-by-step, mirroring OnboardingOverlay.vue:
 *   • Wait for the step's tooltip + spotlighted target to appear.
 *   • ACTION click (action.type=='click') → move cursor to and click the
 *     spotlighted target (`action.selector`). The tour advances itself.
 *   • ACTION input (action.type=='input') → focus the step's targetSelector
 *     field, type a value, press Enter (FE advances on Enter/blur w/ content).
 *   • ACTION input-match (action.type=='input-match') → focus the field and type
 *     the EXACT `action.value`; the FE advances when the input value matches.
 *   • NEXT step (action==null) → move cursor to and click the tooltip's
 *     `[data-testid="onboarding-next-button"]`.
 *   • After the create click, the tour navigates into the editor — wait for the
 *     `/presentation/*` route + the next tooltip before continuing.
 * Resilient: if a step's target can't be found within TARGET_TIMEOUT_MS, log a
 * warning + screenshot and STOP gracefully (the video still flushes).
 */
async function runTour(page, steps) {
  // Genuine "element is still loading" upper bound, kept available for the
  // post-auto-heal re-resolve fallback. We deliberately do NOT block on this for
  // the FIRST presence check — that uses the short TOOLTIP_PROBE_MS so a gated
  // step hands off to auto-heal immediately instead of eating ~25s of dead time.
  const TARGET_TIMEOUT_MS = 25000;
  // Timing marker so we can report the gap between finishing the title typing
  // (the input-match step) and clicking the gated Pick-Answer target.
  let lastInputDoneAtMs = null;
  let lastInputStepId = null;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const order = i + 1;
    const stepStartedAtMs = Date.now();
    let resolveMs = null; // seconds spent resolving tooltip + target (incl. auto-heal)
    // Normalized action type: null (NEXT) | 'click' | 'input' | 'input-match'.
    const actionType = step._actionType || null;
    const isClick = actionType === 'click';
    const isInput = actionType === 'input' || actionType === 'input-match';
    // The element this step interacts with:
    //   click       → the spotlighted target (action.selector)
    //   input(-match)→ the field (step.targetSelector, surfaced as _inputSelector)
    //   null (NEXT) → the tooltip's Next button
    const interactSelector = isClick
      ? step._clickSelector
      : isInput
        ? step._inputSelector
        : NEXT_BUTTON_SELECTOR;
    const tag = isClick
      ? 'ACTION→click target'
      : isInput
        ? `ACTION→${actionType} field`
        : 'NEXT→tooltip';
    console.log(`\n[tour] step ${order}/${steps.length} "${step.id}" (${tag}) — "${step.title}"`);

    // Reveal clicks that auto-heal accepted for THIS step (recorded into the
    // healed scenario immediately BEFORE this step). Collected from either the
    // tooltip-missing or target-missing recovery below.
    const healedRevealsForStep = [];

    // 1) Wait for the onboarding tooltip card for this step to render. The
    //    spotlight + tooltip only show once the target is on-screen & stable.
    //    SHORT PROBE first: if the tooltip isn't up within TOOLTIP_PROBE_MS we
    //    immediately hand off to auto-heal (gated steps never show on their own,
    //    so blocking the full 25s here is pure dead time).
    let tip = await findBox(page, TOOLTIP_SELECTOR, { timeout: TOOLTIP_PROBE_MS });
    if (!tip) {
      // GENERIC RECOVERY: the tooltip is missing because the FE overlay can only
      // anchor once its target is on-screen & stable. The target may be gated
      // behind an opener control (e.g. KickstartScreen "Choose a slide"). Run the
      // generic auto-heal against the step's interaction target — revealing it
      // also lets the overlay render the tooltip. Action-type agnostic.
      if (interactSelector) {
        const heal = await autoHealReveal(page, step, interactSelector, order);
        if (heal.ok) {
          healedRevealsForStep.push(...heal.revealClicks);
          // After auto-heal the overlay should re-anchor quickly — re-resolve
          // with the SHORT probe, not 25s.
          tip = await findBox(page, TOOLTIP_SELECTOR, { timeout: TOOLTIP_PROBE_MS });
        }
      }
    }
    if (!tip) {
      console.warn(`[tour] step ${order} "${step.id}": onboarding tooltip never appeared within ${TARGET_TIMEOUT_MS}ms (auto-heal exhausted) — stopping gracefully.`);
      await page.screenshot({ path: join(SHOTS_DIR, `stall-step-${String(order).padStart(2, '0')}.png`) }).catch(() => {});
      break;
    }

    // 2) Resolve the element this step interacts with (target / field / Next).
    //    SHORT PROBE first; if absent, hand off to auto-heal, then re-resolve
    //    with the short probe again (gated targets resolve right after the
    //    reveal click — no need to wait the full 25s).
    let hit = await findBox(page, interactSelector, { timeout: TOOLTIP_PROBE_MS });
    if (!hit && interactSelector) {
      // Target still missing though the tooltip showed — generic auto-heal
      // (scroll + ranked reveal-click) covers off-screen-but-present targets and
      // targets behind an opener. Accepted reveal clicks become inserted steps.
      const heal = await autoHealReveal(page, step, interactSelector, order);
      if (heal.ok) healedRevealsForStep.push(...heal.revealClicks);
      hit = await findBox(page, interactSelector, { timeout: TOOLTIP_PROBE_MS });
    }
    if (!hit) {
      console.warn(`[tour] step ${order} "${step.id}": interaction target not found (${interactSelector}) (auto-heal exhausted) — stopping gracefully.`);
      await page.screenshot({ path: join(SHOTS_DIR, `stall-step-${String(order).padStart(2, '0')}.png`) }).catch(() => {});
      break;
    }

    // Tooltip + interaction target are both resolved (including any auto-heal).
    resolveMs = Date.now() - stepStartedAtMs;

    // Record any auto-heal reveal clicks as INSERTED steps in the healed
    // scenario, immediately BEFORE this (now-unblocked) step.
    for (const reveal of healedRevealsForStep) {
      recordHealedRevealClick(reveal, step);
    }
    // Then record the original step itself into the healed sequence.
    recordHealedOriginal(step);

    // Extra per-step settle time from scenario JSON (pauseMs). Applied BEFORE
    // the standard STEP_PAUSE_MS so the spotlight is visible for longer on steps
    // that need a UI transition to complete (e.g. editor load after create).
    if (step.pauseMs && step.pauseMs > 0) {
      console.log(`[tour] step ${order}: extra pauseMs=${step.pauseMs}ms`);
      await sleep(step.pauseMs);
    }

    // Let the spotlight/tooltip settle + show the cursor parked before acting.
    await sleep(STEP_PAUSE_MS);
    await page.screenshot({ path: join(SHOTS_DIR, `step-${String(order).padStart(2, '0')}-before.png`) }).catch(() => {});

    const urlBefore = page.url();
    if (isInput) {
      console.log(`[tour] step ${order}: typing into ${interactSelector} → "${step._inputValue}" (${actionType})`);
      await moveAndType(page, hit.box, step._inputValue, { kind: actionType, frame: hit.frame, selector: interactSelector });
      // Mark when the title typing finished so we can report the gap to the
      // (gated) next click — the dead-pause this fix targets.
      lastInputDoneAtMs = Date.now();
      lastInputStepId = step.id;
    } else {
      console.log(`[tour] step ${order}: clicking ${interactSelector}`);
      // If the PREVIOUS step was an input (e.g. title typing) and this is the
      // gated Pick-Answer click, report the gap between the two.
      if (lastInputDoneAtMs != null) {
        const gapS = ((Date.now() - lastInputDoneAtMs) / 1000).toFixed(1);
        console.log(`[timing] gap from "${lastInputStepId}" typing done → "${step.id}" click: ${gapS}s`);
        lastInputDoneAtMs = null;
        lastInputStepId = null;
      }
      await moveAndClickBox(page, hit.box);
    }

    // --- previewInteractions: run audience-side actions while this step's tooltip
    //     is still on screen (for NEXT-button steps — action:null). Each interaction
    //     targets a cross-origin iframe by frameMatch hostname substring.
    //     Supported types: click (default), type, matchPairsApiSubmit.
    if (Array.isArray(step.previewInteractions) && step.previewInteractions.length > 0) {
      console.log(`[tour] step ${order}: running ${step.previewInteractions.length} previewInteraction(s)…`);
      // Resolve the current presentation ID from the URL for API calls.
      const presMatch = page.url().match(/\/presentation\/([^/?#]+)/);
      const presId = presMatch ? presMatch[1] : null;
      for (const ia of step.previewInteractions) {
        const iaLabel = ia.label || ia.type || '?';
        const pauseAfter = ia.pauseAfterMs || 500;
        if (ia.type === 'matchPairsApiSubmit') {
          // Submit N fake participant responses via the audience API so the
          // presenter board shows populated results.
          const count = ia.count || 3;
          console.log(`[previewIA] matchPairsApiSubmit: submitting ${count} responses for presId=${presId}`);
          if (presId) {
            try {
              // Get game pin from the presenting iframe.
              let gamePin = null;
              for (const f of page.frames()) {
                if (!f.url().includes('presenting=true') && !f.url().includes('presenter')) continue;
                try {
                  gamePin = await f.evaluate(() => {
                    // Try multiple sources for the game pin.
                    const pinEl = document.querySelector('[data-testid="game-pin"], .game-pin, [class*="game-pin"]');
                    if (pinEl) return (pinEl.textContent || '').replace(/\D/g, '') || null;
                    // Fall back to window state.
                    return (window.__GAME_PIN__ || window.__PIN__ || null);
                  }).catch(() => null);
                  if (gamePin) break;
                } catch { /* continue */ }
              }
              console.log(`[previewIA] gamePin resolved: ${gamePin}`);
              // Submit via audience API using a token derived from the current session.
              const audienceBase = 'https://audience.dev.ahaslide.com';
              for (let ri = 0; ri < count; ri++) {
                try {
                  await page.evaluate(async ({ audienceBase, presId, ri }) => {
                    // POST a match-pairs submission. The body shape is what the
                    // audience app sends for a completed match-pairs drag.
                    const body = {
                      presentationId: presId,
                      slideOrder: 0,
                      answers: [
                        { left: 'France', right: 'Paris' },
                        { left: 'Japan', right: 'Tokyo' },
                        { left: 'Germany', right: 'Berlin' },
                      ],
                      userId: `demo-user-${ri}`,
                      userName: ['Alice', 'Bob', 'Carol'][ri] || `User${ri}`,
                    };
                    await fetch(`${audienceBase}/api/match-pairs/submit`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(body),
                    }).catch(() => {});
                  }, { audienceBase, presId, ri });
                } catch { /* ignore fetch errors */ }
              }
            } catch (e) {
              console.warn(`[previewIA] matchPairsApiSubmit error: ${e.message}`);
            }
          } else {
            console.warn('[previewIA] matchPairsApiSubmit: presId not found in URL, skipping');
          }
          await sleep(pauseAfter);
          continue;
        }
        // Find the target frame by hostname substring match.
        let targetFrame = null;
        if (ia.frameMatch) {
          for (const f of page.frames()) {
            if (f.url().includes(ia.frameMatch)) { targetFrame = f; break; }
          }
          if (!targetFrame) {
            console.warn(`[previewIA] "${iaLabel}": no frame matching "${ia.frameMatch}" found — skipping`);
            await sleep(pauseAfter);
            continue;
          }
        }
        // Resolve selector bounding box (translate frame coords to page coords).
        const sel = ia.selector;
        if (!sel) {
          console.warn(`[previewIA] "${iaLabel}": no selector — skipping`);
          await sleep(pauseAfter);
          continue;
        }
        let box = null;
        try {
          const frame = targetFrame || page.mainFrame();
          let frameOffset = { x: 0, y: 0 };
          if (frame !== page.mainFrame()) {
            const fe = await frame.frameElement();
            const fb = await fe.boundingBox();
            if (fb) frameOffset = { x: fb.x, y: fb.y };
          }
          const loc = frame.locator(sel).first();
          if (await loc.count().catch(() => 0)) {
            const b = await loc.boundingBox().catch(() => null);
            if (b) box = { x: b.x + frameOffset.x, y: b.y + frameOffset.y, width: b.width, height: b.height };
          }
        } catch (e) {
          console.warn(`[previewIA] "${iaLabel}": box resolve error: ${e.message}`);
        }
        if (!box) {
          console.warn(`[previewIA] "${iaLabel}": selector "${sel}" not found/visible — skipping`);
          await sleep(pauseAfter);
          continue;
        }
        // Dispatch the interaction.
        if (ia.type === 'type') {
          console.log(`[previewIA] type "${ia.value}" into ${sel} (${iaLabel})`);
          const cx = Math.round(box.x + box.width / 2);
          const cy = Math.round(box.y + box.height / 2);
          await page.mouse.move(cx, cy, { steps: 15 });
          await sleep(200);
          await page.mouse.click(cx, cy);
          await sleep(200);
          if (ia.value) await page.keyboard.type(String(ia.value), { delay: 80 });
        } else {
          // Default: click.
          console.log(`[previewIA] click ${sel} (${iaLabel})`);
          await moveAndClickBox(page, box);
        }
        await sleep(pauseAfter);
      }
      console.log(`[tour] step ${order}: previewInteractions complete.`);
    }

    recordedSteps.push({
      order,
      id: step.id,
      title: step.title,
      kind: isClick ? 'action-click-target' : isInput ? `action-${actionType}` : 'next-button',
      interactSelector,
      typedValue: isInput ? step._inputValue : undefined,
      targetSelector: step.targetSelector,
      path: step.path,
    });

    // 3) Post-action settle. A cross-route transition only happens when the next
    //    step lives on a different route family than the current one (e.g.
    //    create: /apps/presentations → /presentation/<id> editor). Action
    //    steps that stay on the same route advance in place.
    const nextStep = steps[i + 1];
    const currentlyInEditor = /\/presentation\//.test(urlBefore);
    const nextWantsEditor = nextStep && String(nextStep.path).includes('/presentation');
    const expectsNav = nextWantsEditor && !currentlyInEditor;
    if (isClick && expectsNav) {
      console.log('[tour] waiting for editor navigation…');
      await page.waitForURL(/\/presentation\//, { timeout: 30000 }).catch(() => {
        console.warn('[tour] editor URL did not match /presentation/ in time — continuing anyway');
      });
      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
      if (urlBefore !== page.url()) console.log(`[tour] navigated → ${page.url()}`);
    }
    // NOTE: the redundant in-place `sleep(STEP_PAUSE_MS)` that used to live here
    // was removed — the short next-tooltip probe below + the single trailing
    // settle already give enough watchable pacing without stacking pauses.

    // Robust hand-off: if there's a next step, SHORT-PROBE for the next
    // onboarding tooltip before looping. We do NOT block the full 25s here: if
    // the next step is gated (e.g. ld-pick-answer behind the kickstart screen),
    // its tooltip never appears on its own and the next loop iteration's
    // auto-heal reveals it. Blocking here would just re-introduce the dead pause.
    if (nextStep) {
      const settled = await findBox(page, TOOLTIP_SELECTOR, { timeout: TOOLTIP_PROBE_MS });
      if (!settled) {
        console.log(`[tour] after step ${order} "${step.id}": next tooltip not up within ${TOOLTIP_PROBE_MS}ms — next iteration will resolve/auto-heal it (expected for gated steps). Continuing.`);
        await page.screenshot({ path: join(SHOTS_DIR, `stall-after-step-${String(order).padStart(2, '0')}.png`) }).catch(() => {});
      }
    }

    await page.screenshot({ path: join(SHOTS_DIR, `step-${String(order).padStart(2, '0')}-after.png`) }).catch(() => {});
    // Single trailing settle so the cursor park / advance is watchable. This is
    // the ONE intentional ~1s pause that closes out the step — earlier stacked
    // pauses were removed.
    await sleep(STEP_PAUSE_MS);

    // Per-step timing log: (a) resolve seconds (tooltip + target incl. auto-heal),
    // (b) total seconds for the whole step.
    const totalMs = Date.now() - stepStartedAtMs;
    const resolveStr = resolveMs != null ? `${(resolveMs / 1000).toFixed(1)}s` : 'n/a';
    console.log(`[timing] step ${order} "${step.id}": resolve=${resolveStr}, total=${(totalMs / 1000).toFixed(1)}s`);
  }

  console.log(`\n[tour] walk finished — ${recordedSteps.length}/${steps.length} step(s) executed.`);
}
