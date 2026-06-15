# Voiceover Reference (Phase 3b)

> **Superseded.** The authoritative voiceover reference has moved to the
> dedicated `kb-video-voiceover` skill at `.claude/skills/kb-video-voiceover/SKILL.md`.
> This file is retained for historical context only. Do NOT add new VO guidance
> here — update the `kb-video-voiceover` skill instead.

---

Full reference for Phase 3b of the KB tutorial video pipeline. Read this when
adding narrated audio to a trimmed visual track.

Prefer ElevenLabs TTS over macOS `say` — it produces significantly better
levels and more natural pronunciation.

## ElevenLabs (preferred)

API key is in `ahaslides-kb/.env` as `ELEVENLABS_API_KEY`. **Never commit,
print, or echo this value** — load it with `grep ... | cut -d'=' -f2`.
Fall back to macOS `say` only if the key is absent.

### Voice selection

**Approved voices (use ONLY these two — no others):**

| Name  | Voice ID                     | Character                  |
|-------|------------------------------|----------------------------|
| Liam  | `VCgLBmBjldJmfphyB8sZ`       | Male, calm, clear          |
| Alice | `Xb7hH8MSUJpSbSDYk0k2`       | Female, upbeat, natural    |

Do NOT use any other voice IDs (Bella, Domi, Rachel, or any other premade
voice). If a script alternates narrators across steps, alternate between Liam
and Alice only.

Default choice when a single voice is needed: **Liam** (`VCgLBmBjldJmfphyB8sZ`).

Verify each with a one-line test render before the full render run — confirm
the ID resolves on your ElevenLabs account.

### Natural spelling first

ElevenLabs handles English context well. Do NOT add phonetic respellings
unless a test render sounds wrong. Verify "live" (verb context) and
product-specific words like "Categorise" by listening to test clips before
the full render run. Use respellings in the `tts_text` field only (keep
`display_text` natural for on-screen/article copy).

### Per-line render (one API call per line → MP3)

```python
import subprocess, json, os

el_key = subprocess.check_output(
    "grep ELEVENLABS_API_KEY /Users/claude/AhaSlides/ahaslides-kb/.env | cut -d'=' -f2",
    shell=True).decode().strip()
outdir = "/path/to/out-<slug>"
voice_id = "VCgLBmBjldJmfphyB8sZ"  # Liam — approved voice (alt: Alice Xb7hH8MSUJpSbSDYk0k2)
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

### Voice settings tuning

`stability` 0.4–0.5, `similarity_boost` 0.7–0.8, `style` 0.3–0.4 tends
toward lively delivery. Higher `stability` produces slightly more measured
pace (useful if lines overflow their window).

### Mixing MP3 clips onto the trimmed visual with ffmpeg

```bash
FFMPEG=./node_modules/ffmpeg-static/ffmpeg   # in onboarding-videos workspace
# Timestamps from voiceover JSON start_sec → milliseconds for adelay
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

Adjust the number of inputs and delays to match the voiceover JSON
`start_sec` fields. Verify output: `Duration` ≈ visual length, audio levels
mean ~−18 dB, no clipping.

## Saving the voiceover JSON

Save alongside the scenario at `scenarios/<slug>-voiceover.json` — record the
voice id, voice settings, per-step `tts_text` (natural spelling unless a
respelling was needed), and `start_sec`/`window_sec` for future re-runs. See
`scenarios/using-the-categorise-slide-voiceover.json` as the reference.

## macOS `say` (fallback)

Use only if the ElevenLabs key is absent.

```bash
say -v "Shelley (English (US))" -r 178 -o s01.aiff "Line text here"
```

Choose Shelley for highest mean volume among the built-in voices. Output is
AIFF; the ffmpeg mix command works the same way (swap `.aiff` for `.mp3`).

Caveat: macOS TTS mispronounces some words — test "live" (verb) and product
terms first; use phonetic respellings in the `tts_text` field only (keep
`display_text` natural for on-screen/article copy).
