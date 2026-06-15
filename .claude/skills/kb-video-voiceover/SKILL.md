---
name: kb-video-voiceover
description: Generate, time, and mix ElevenLabs voiceover narration for AhaSlides KB tutorial videos. Use this whenever you need to add voiceover to a tutorial video, generate VO audio clips, narrate a tutorial, create voiceover for a knowledge base video, mix narration onto a visual track, or verify no voice clip overlaps. Trigger phrases include "generate voiceover", "VO for video", "narration for tutorial", "add voice over", "add narration", "ElevenLabs TTS for video", "mix audio clips", "check VO overlap", "voice clip overlap", "kb tutorial narration". Single source of truth for approved voice IDs and the complete VO pipeline (render → time → overlap-check → mix). Referenced by the kb-tutorial-video skill's Phase 3b.
---

# KB Video Voiceover

Complete reference for generating, timing, and mixing narration onto a KB
tutorial video visual track. This skill covers Phase 3b of the
`kb-tutorial-video` pipeline and can be used standalone when only voiceover
work is needed.

## Approved voices — use ONLY these two

**No other voice IDs are permitted** (not Bella, Domi, Rachel, or any other
premade voice). This list is the single source of truth.

| Name  | Voice ID                   | Character                |
|-------|----------------------------|--------------------------|
| Liam  | `VCgLBmBjldJmfphyB8sZ`     | Male, calm, clear        |
| Alice | `Xb7hH8MSUJpSbSDYk0k2`     | Female, upbeat, natural  |

**Default when a single voice is needed:** Liam (`VCgLBmBjldJmfphyB8sZ`).

If a script alternates narrators across steps, alternate between Liam and
Alice only. Verify each with a one-line test render before the full run —
confirm the ID resolves on your ElevenLabs account.

## TTS provider

Prefer **ElevenLabs** over macOS `say` — it produces significantly better
levels and more natural pronunciation.

API key is in `ahaslides-kb/.env` as `ELEVENLABS_API_KEY`. **Never commit,
print, or echo this value** — load it with `grep ... | cut -d'=' -f2`.

Fall back to macOS `say` only if the ElevenLabs key is absent (see §Fallback
below).

## Step 1 — Write the VO script

Add a `<slug>-voiceover.json` file alongside the scenario at
`scenarios/<slug>-voiceover.json`. It records:
- `voice_id` — one of the two approved IDs above.
- `voice_settings` — stability, similarity_boost, style (see §Voice settings).
- `video_duration_sec` — total visual track length.
- `steps[]` — one entry per narration clip with:
  - `id` — matches the scenario step id (e.g. `s01`, `s02`).
  - `display_text` — natural-language copy for on-screen/article use.
  - `tts_text` — what ElevenLabs receives; use phonetic respellings here ONLY
    if a test render sounds wrong (keep `display_text` natural).
  - `start_sec` — when this clip starts in the mixed video.
  - `window_sec` — available time window (use for pacing reference).
  - `audio_duration_sec` — filled in after rendering; needed for overlap check.

See `scenarios/using-the-categorise-slide-voiceover.json` as a reference example.

## Step 2 — Pronunciation / quality notes

ElevenLabs handles English context well. Do NOT add phonetic respellings
unless a test render sounds wrong. Always verify:
- "live" used as a verb (not the adjective) — ElevenLabs sometimes mis-stresses it.
- Product-specific terms like "Categorise" — listen to a test clip first.

Use respellings in `tts_text` only; keep `display_text` natural.

## Step 3 — Per-line render (one API call per MP3 clip)

```python
import subprocess, json, os

el_key = subprocess.check_output(
    "grep ELEVENLABS_API_KEY /Users/claude/AhaSlides/ahaslides-kb/.env | cut -d'=' -f2",
    shell=True).decode().strip()
outdir = "/path/to/out-<slug>"
voice_id = "VCgLBmBjldJmfphyB8sZ"  # Liam (approved) — alt: Alice Xb7hH8MSUJpSbSDYk0k2
settings = {"stability": 0.45, "similarity_boost": 0.75, "style": 0.4}

lines = [
    ("s01", "Line one text here."),
    ("s02", "Line two text here."),
    # ... one entry per step
]

for key, text in lines:
    outfile = f"{outdir}/{key}.mp3"
    body = json.dumps({"text": text, "model_id": "eleven_multilingual_v2",
                       "voice_settings": settings})
    subprocess.run([
        "curl", "-s", "-X", "POST",
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        "-H", f"xi-api-key: {el_key}",
        "-H", "Content-Type: application/json",
        "-d", body, "-o", outfile
    ])
    size = os.path.getsize(outfile) if os.path.exists(outfile) else 0
    print(f"{key}: size={size}")
```

After rendering, measure each MP3's duration and fill in `audio_duration_sec`
in the voiceover JSON before proceeding to the overlap check.

## Voice settings tuning

`stability` 0.4–0.5, `similarity_boost` 0.7–0.8, `style` 0.3–0.4 gives
lively delivery. Higher `stability` produces a slightly more measured pace —
useful if a clip's text overruns its `window_sec`.

## Step 4 — Overlap check (required before mixing)

After setting `start_sec` + `audio_duration_sec` values in the voiceover JSON
but **before** running the ffmpeg mix command, run the bundled overlap checker:

```bash
python3 .claude/skills/kb-tutorial-video/scripts/check_vo_overlap.py \
    scenarios/<slug>-voiceover.json
```

The script is at `.claude/skills/kb-tutorial-video/scripts/check_vo_overlap.py`
relative to the `ahaslides-kb` repo root.

Exit codes:
- `0` — timeline is clean, safe to mix.
- `1` — one or more overlaps found; fix `start_sec` offsets before mixing.
- `2` — usage / file error.

**Do not mix or upload a video that fails this check.** Fix the `start_sec`
offsets (push the later clip's start to ≥ end of prior clip), then re-run.

Strict mode (flag even 0.01s overlaps):

```bash
python3 .claude/skills/kb-tutorial-video/scripts/check_vo_overlap.py \
    scenarios/<slug>-voiceover.json --min-overlap 0.01
```

## Step 5 — Mix MP3 clips onto the trimmed visual with ffmpeg

```bash
FFMPEG=./node_modules/ffmpeg-static/ffmpeg   # run from ~/AhaSlides/onboarding-videos/
$FFMPEG -y \
  -i visual-trimmed.webm \
  -i out/s01.mp3 -i out/s02.mp3 -i out/s03.mp3 \
  -filter_complex \
    '[1:a]adelay=0|0[a1];[2:a]adelay=3000|3000[a2];[3:a]adelay=9800|9800[a3];
     [a1][a2][a3]amix=inputs=3:normalize=0[aout]' \
  -map 0:v -map '[aout]' \
  -c:v copy -c:a libopus -b:a 64k \
  narrated.webm
```

Adjust the number of inputs and `adelay` values to match the voiceover JSON
`start_sec` fields (multiply seconds by 1000 for milliseconds). Verify output:
`Duration` ≈ visual length, audio levels mean ~−18 dB, no clipping.

## Step 6 — Post-mix audio check

After mixing, run the overlap checker again with `--audio` to verify audio
energy too:

```bash
FFMPEG=./node_modules/ffmpeg-static/ffmpeg \
python3 .claude/skills/kb-tutorial-video/scripts/check_vo_overlap.py \
    scenarios/<slug>-voiceover.json \
    --audio out/<slug>-narrated.webm
```

Both `CHECK 1 — TIMELINE` and `CHECK 2 — AUDIO ENERGY` must report `PASS`
before proceeding to upload (Phase 4 of the kb-tutorial-video pipeline).

## No-overlap rule — background

Root cause of AKB-4 r8 residual overlaps (documented for future reference):
Only the s01→s02 overlap was fixed in r8. s05→s06 (pin-add-image ends 26.68s /
pin-switch-tab starts 26.5s = 0.18s overlap) and s06→s07 (pin-switch-tab ends
29.3s / pin-image-library starts 28.0s = 1.30s overlap) were missed. The
`check_vo_overlap.py` script was written to catch these automatically.

## macOS `say` (fallback only)

Use only if the ElevenLabs key is absent.

```bash
say -v "Shelley (English (US))" -r 178 -o s01.aiff "Line text here"
```

Choose Shelley for highest mean volume among the built-in voices. Output is
AIFF; the ffmpeg mix command works the same way (swap `.aiff` for `.mp3`).

Caveat: macOS TTS mispronounces some words — test "live" (verb) and product
terms first; use phonetic respellings in `tts_text` only.
