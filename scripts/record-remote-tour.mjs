#!/usr/bin/env node
/**
 * record-remote-tour.mjs — drive + record an AhaSlides presenter onboarding tour
 * from a scenario JSON hosted REMOTELY on Cloudflare.
 *
 * Pipeline (given only a BASE URL + a local scenario JSON file):
 *   1. Normalize the scenario to the FE shape `{ steps: [...] }` (a bare array
 *      is wrapped; a `{steps:[...]}` object is kept as-is). Validate non-empty.
 *   2. Upload it to the R2 bucket `aha-onboarding-scenarios` via
 *      `wrangler r2 object put ... --remote` under a unique, time-stamped key.
 *   3. JSON_URL = `${WORKER_URL}/<key>`. Verify it's reachable (HTTP 200 + has
 *      `.steps`) before any browser work — fail fast otherwise.
 *   4. ONBOARDING_URL = BASE_URL + `?onboarding=<encodeURIComponent(JSON_URL)>`.
 *      The presenter app's loadScenario `fetch()`es that remote URL directly
 *      (CORS on the worker = `access-control-allow-origin: *`), which both
 *      triggers the overlay and bypasses the feature flag.
 *   5. Drive + record by spawning the EXISTING scripts/record-onboarding.mjs
 *      with ONBOARDING_URL set to the remote-scenario URL and STEPS_FILE set to
 *      the SAME normalized scenario (so the recorder knows what to click for
 *      gated steps). The recorder's URL normalizer leaves an existing
 *      `onboarding=` value untouched, so the remote URL is preserved verbatim.
 *
 * USAGE:
 *   AHA_TOKEN=<jwt> SCENARIO_FILE=<path to {steps:[...]} json> \
 *     node scripts/record-remote-tour.mjs
 *
 * INPUTS (env or argv positional):
 *   SCENARIO_FILE   (required) local scenario JSON ({steps:[...]} or bare array)
 *   BASE_URL        presenter base (default: sandbox presentations URL below)
 *   WORKER_URL      deployed scenario-host worker (default: the one we deployed)
 *   AHA_TOKEN       (required) JWT, passed through to the recorder via env only
 *
 * PASS-THROUGH (forwarded to record-onboarding.mjs if set):
 *   VIEWPORT, STEP_PAUSE_MS, HEADLESS, OUT_DIR, WARMUP, PROFILE_DIR
 *
 * The AHA_TOKEN is NEVER written to any file — only forwarded via child env.
 */

import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename, extname } from 'node:path';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';

// PORTABLE: __dirname locates the sibling recorder; nothing is tied to a fixed
// repo layout. The user's CURRENT working directory is used for wrangler auth /
// config resolution and as the default OUT_DIR.
const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const DEFAULT_BASE_URL =
  'https://ab214fb69c15de4b3d300d0e323bc3a4d29327d6.presenter.sandbox.ahaslide.com/apps/presentations';
// The deployed scenario-host worker (env-overridable via WORKER_URL).
const DEFAULT_WORKER_URL = 'https://aha-onboarding-scenario-host.ahaslides-game.workers.dev';
// R2 bucket the scenario JSON is uploaded to (env-overridable via R2_BUCKET).
const BUCKET = process.env.R2_BUCKET || 'aha-onboarding-scenarios';

const SCENARIO_FILE = process.env.SCENARIO_FILE || process.argv[2];
const BASE_URL = process.env.BASE_URL || DEFAULT_BASE_URL;
const WORKER_URL = (process.env.WORKER_URL || DEFAULT_WORKER_URL).replace(/\/+$/, '');
const TOKEN = process.env.AHA_TOKEN;

function fail(msg) {
  console.error(`\nFATAL: ${msg}\n`);
  process.exit(1);
}

if (!SCENARIO_FILE) fail('SCENARIO_FILE is required (env or first arg) — a local {steps:[...]} JSON.');
if (!TOKEN) fail('AHA_TOKEN env var is required (never written to disk; forwarded to the recorder).');

// ---------------------------------------------------------------------------
// 1. Read + normalize the scenario to FE shape { steps: [...] }
// ---------------------------------------------------------------------------
let parsed;
try {
  parsed = JSON.parse(readFileSync(SCENARIO_FILE, 'utf8'));
} catch (e) {
  fail(`could not read/parse SCENARIO_FILE (${SCENARIO_FILE}): ${e.message}`);
}

let steps;
if (Array.isArray(parsed)) {
  steps = parsed; // bare array → wrap
} else if (parsed && Array.isArray(parsed.steps)) {
  steps = parsed.steps; // already {steps:[...]}
} else if (parsed && typeof parsed === 'object') {
  // Envelope { anyKey: { steps:[...] } } → take the first nested steps array.
  for (const v of Object.values(parsed)) {
    if (v && Array.isArray(v.steps)) {
      steps = v.steps;
      break;
    }
  }
}
if (!Array.isArray(steps) || steps.length === 0) {
  fail(`SCENARIO_FILE has no non-empty steps array (expected {steps:[...]} or a bare array).`);
}

const normalized = { steps };
const baseName = basename(SCENARIO_FILE, extname(SCENARIO_FILE)) || 'scenario';
const TMP_DIR = join(tmpdir(), 'aha-remote-tour');
mkdirSync(TMP_DIR, { recursive: true });
const normalizedTmp = join(TMP_DIR, `${baseName}-normalized.json`);
writeFileSync(normalizedTmp, JSON.stringify(normalized, null, 2));
console.log(`[scenario] ${SCENARIO_FILE}`);
console.log(`[scenario] normalized to {steps:[${steps.length}]} → ${normalizedTmp}`);

// ---------------------------------------------------------------------------
// 2. Upload to R2 under a unique key
// ---------------------------------------------------------------------------
const key = `${baseName}-${Date.now()}.json`;
console.log(`[upload] r2://${BUCKET}/${key}  (--remote)`);
const put = spawnSync(
  'npx',
  [
    'wrangler',
    'r2',
    'object',
    'put',
    `${BUCKET}/${key}`,
    '--file',
    normalizedTmp,
    '--content-type',
    'application/json',
    '--remote',
  ],
  // Run wrangler from the user's current project so their Cloudflare auth /
  // wrangler config are picked up — not a fixed repo path.
  { cwd: process.cwd(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
);
if (put.status !== 0) {
  console.error(put.stdout || '');
  console.error(put.stderr || '');
  fail(`wrangler r2 object put failed (exit ${put.status}).`);
}
console.log(`[upload] done.`);

// ---------------------------------------------------------------------------
// 3. JSON_URL — verify reachable (HTTP 200 + has steps) before browser work
// ---------------------------------------------------------------------------
const JSON_URL = `${WORKER_URL}/${key}`;
console.log(`[verify] GET ${JSON_URL}`);
let verifyOk = false;
for (let attempt = 1; attempt <= 5 && !verifyOk; attempt++) {
  try {
    const res = await fetch(JSON_URL, { cache: 'no-store' });
    if (res.ok) {
      const body = await res.json();
      const n = Array.isArray(body?.steps) ? body.steps.length : 0;
      const cors = res.headers.get('access-control-allow-origin');
      if (n > 0) {
        console.log(`[verify] OK — HTTP ${res.status}, steps=${n}, ACAO=${cors}`);
        verifyOk = true;
        break;
      }
      console.warn(`[verify] attempt ${attempt}: 200 but steps=${n}; retrying…`);
    } else {
      console.warn(`[verify] attempt ${attempt}: HTTP ${res.status}; retrying…`);
    }
  } catch (e) {
    console.warn(`[verify] attempt ${attempt}: ${e.message}; retrying…`);
  }
  await new Promise((r) => setTimeout(r, 1500));
}
if (!verifyOk) fail(`remote scenario not reachable/valid at ${JSON_URL} after retries.`);

// ---------------------------------------------------------------------------
// 4. Build ONBOARDING_URL pointing the app at the REMOTE scenario
// ---------------------------------------------------------------------------
const ONBOARDING_URL =
  BASE_URL + (BASE_URL.includes('?') ? '&' : '?') + 'onboarding=' + encodeURIComponent(JSON_URL);
// Confirm the encoded param round-trips the way the app reads it.
const roundTrip = new URL(ONBOARDING_URL).searchParams.get('onboarding');
if (roundTrip !== JSON_URL) {
  fail(`encoded onboarding= did not round-trip:\n  expected: ${JSON_URL}\n  got:      ${roundTrip}`);
}
console.log(`[url] JSON_URL       = ${JSON_URL}`);
console.log(`[url] ONBOARDING_URL = ${ONBOARDING_URL}`);

// ---------------------------------------------------------------------------
// 5. Spawn the existing recorder to drive + record the tour
// ---------------------------------------------------------------------------
// PORTABLE: resolve the sibling recorder relative to THIS script's own dir, so
// the wrapper works no matter which folder it is invoked from.
const recorder = join(__dirname, 'record-onboarding.mjs');
// PORTABLE: default output lands in the current project's folder (matches the
// recorder's own default). Override with OUT_DIR.
const OUT_DIR =
  process.env.OUT_DIR || join(process.cwd(), 'onboarding-video-output');

const childEnv = {
  ...process.env,
  ONBOARDING_URL, // remote-scenario URL — recorder leaves an existing onboarding= untouched
  STEPS_FILE: normalizedTmp, // same content the app fetched, for gated-step clicks
  AHA_TOKEN: TOKEN,
  OUT_DIR,
};
// Pass-through tunables (only if already set — otherwise let the recorder default).
for (const k of ['VIEWPORT', 'STEP_PAUSE_MS', 'HEADLESS', 'WARMUP', 'PROFILE_DIR']) {
  if (process.env[k] != null) childEnv[k] = process.env[k];
}

console.log(`\n[recorder] spawning node ${recorder}\n`);

// Track newest webm before the run so we can identify the fresh one after.
function newestWebm(dir) {
  try {
    const files = readdirSync(dir)
      .filter((f) => f.endsWith('.webm'))
      .map((f) => ({ f, m: statSync(join(dir, f)).mtimeMs }))
      .sort((a, b) => b.m - a.m);
    return files[0] ? { path: join(dir, files[0].f), mtime: files[0].m } : null;
  } catch {
    return null;
  }
}
const before = newestWebm(OUT_DIR);

let recorderOutput = '';
const child = spawn('node', [recorder], { env: childEnv, stdio: ['inherit', 'pipe', 'pipe'] });
child.stdout.on('data', (d) => {
  const s = d.toString();
  recorderOutput += s;
  process.stdout.write(s);
});
child.stderr.on('data', (d) => {
  const s = d.toString();
  recorderOutput += s;
  process.stderr.write(s);
});

child.on('exit', (code) => {
  // Parse the recorder's reported video path; fall back to newest webm in OUT_DIR.
  let videoPath = null;
  const m = recorderOutput.match(/\[record\] DONE\. Video:\s*(.+\.webm)/);
  if (m) videoPath = m[1].trim();
  if (!videoPath || videoPath.includes('(not found)')) {
    const latest = newestWebm(OUT_DIR);
    if (latest && (!before || latest.mtime > before.mtime)) videoPath = latest.path;
    else if (latest) videoPath = latest.path;
  }
  const stepsM = recorderOutput.match(/\[record\] Steps captured:\s*(\d+)/);

  console.log('\n========================================');
  console.log('[remote-tour] SUMMARY');
  console.log('========================================');
  console.log(`  R2 bucket     : ${BUCKET}`);
  console.log(`  R2 key        : ${key}`);
  console.log(`  Worker URL    : ${WORKER_URL}`);
  console.log(`  JSON_URL      : ${JSON_URL}`);
  console.log(`  ONBOARDING_URL: ${ONBOARDING_URL}`);
  if (stepsM) console.log(`  Steps captured: ${stepsM[1]}`);
  console.log(`  Video         : ${videoPath || '(not found)'}`);
  console.log('========================================');
  process.exit(code || 0);
});
