---
name: kb-tutorial-video-audit
description: Audit any AhaSlides KB tutorial video for quality — human UX and AI-agent consumability. Use this skill whenever you need to audit a tutorial video, review a KB video for human and agent viewers, perform a video quality check, check VO voice compliance, assess caption/CC coverage, evaluate chapter markers, or produce a ranked recommendation list for a tutorial video. Trigger phrases include "audit a tutorial video", "review video for human and agent viewers", "video quality check", "check VO voice compliance", "audit the KB video", "review tutorial video quality", "check caption track", "evaluate tutorial for agents", "video checklist". Referenced by the kb-tutorial-video skill. Works on any video uploaded to YouTube or stored locally.
---

# KB Tutorial Video Audit

Complete methodology for auditing a KB tutorial video on two axes:
**human viewer quality** and **AI agent consumability**. Run this audit
before marking any tutorial video as final. It was first applied to the
Categorise slide tutorial (AKB-2) and generalised from that experience.

## When to run this audit

- After producing or re-rendering a KB tutorial video
- Before embedding a new video in an article
- When reopening a task with user feedback about an existing video
- On any video where VO compliance or caption status is unclear

---

## Axis 1 — Human viewer quality

### 1a. VO voice compliance

**Rule:** Only Liam (`VCgLBmBjldJmfphyB8sZ`) and Alice (`Xb7hH8MSUJpSbSDYk0k2`)
are permitted. No other ElevenLabs voices (not Bella, Domi, Rachel, Shelley, or
any macOS TTS voice) are allowed in published KB videos.

**How to check:**
1. Look up the voiceover JSON at `scenarios/<slug>-voiceover.json` for the
   `voice_id` or `voice` field.
2. Cross-check against the permitted list in `kb-video-voiceover` SKILL.md.
3. If the JSON is absent: download the video with yt-dlp, extract audio, and
   listen for voice character; compare to a known Liam/Alice test render.

**Severity:** Critical — non-compliant voice must be re-rendered before publish.

---

### 1b. Pronunciation

Common pitfalls (test with a one-line ElevenLabs render):
- `"live"` used as a verb — must rhyme with "hive" (/laɪv/), not "give".
- `"present"` used as a verb — must be /prəˈzent/ (prih-ZENT, stressed second
  syllable), NOT the noun /ˈprezənt/ (PREZ-ent). This arises when narrating
  "Hit Present to go live" or "when you present your slides". ElevenLabs may
  default to the noun stress without context. **Fix:** Add "to go live" after
  the word to supply verb context (e.g. "Hit Present to go live"), or use a
  phonetic respelling in `tts_text` only (e.g. "prih-ZENT to go live") while
  keeping `display_text` natural. Test a one-line render before mixing.
- Product-specific terms — `"Categorise"` must use British -ise, not US -ize.
- Any slide-type name spelled differently from the AhaSlides UI (capitalised
  proper noun, British spelling where applicable).

**How to check:**
1. Get the auto-captions (yt-dlp `--write-auto-subs`) and search for the
   suspected words.
2. Auto-captions reflect what YouTube STT heard — if it transcribed "categorized"
   the pronunciation is likely wrong. For "present", if STT wrote "present"
   with noun stress, the audio likely mispronounced it.
3. Alternatively, listen at 0.75× speed at the relevant timestamp.

**Fix:** Update `tts_text` in the voiceover JSON with phonetic respelling;
re-render just the affected clips; re-mix; re-upload.

---

### 1c. Silent gaps

A gap > 2s between VO clips is noticeable dead air. App-loading transitions
commonly cause 5–6s silences if no filler VO is planned.

**How to detect:**
```bash
yt-dlp -x --audio-format wav -o /tmp/<slug>.wav '<youtube-url>'
# OR extract audio from local file:
FFMPEG=~/AhaSlides/onboarding-videos/node_modules/ffmpeg-static/ffmpeg
$FFMPEG -i <local.webm> -vn -ar 44100 -ac 1 /tmp/<slug>.wav

# Detect silences > 1.5s
$FFMPEG -i /tmp/<slug>.wav \
  -af "silencedetect=noise=-35dB:duration=1.5" -f null /dev/null 2>&1 \
  | grep -E "silence_(start|end|duration)"
```

**Acceptable:** Silences < 2s between clips are fine (natural breathing room).
Silences > 4s are a UX problem — add a filler VO line bridging the action.

**Fix:** Add a gap-filler step in the voiceover JSON (e.g. "The editor is loading
— in a moment we'll pick the slide type."), render with Liam or Alice, update
`start_sec` and `audio_duration_sec`, re-run `check_vo_overlap.py`, re-mix.

---

### 1d. Caption track (WCAG 2.1 AA)

WCAG 2.1 SC 1.2.2 requires a caption track on all pre-recorded video with audio.
Auto-captions do NOT satisfy this requirement.

**How to check:**
```bash
yt-dlp --list-subs '<youtube-url>'
# Look for lines under "Available subtitles:" (not "Automatic captions")
# A published CC track appears as: en [ext]  English
```

Or check via YouTube Data API:
```bash
curl -s "https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=<id>&key=<KEY>" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); \
      [print(c['snippet']['trackKind'], c['snippet']['language']) for c in d.get('items',[])]"
# trackKind=standard = creator-uploaded; trackKind=asr = auto-captions (does NOT satisfy WCAG)
```

**Fix (if API scope allows `youtube.force-ssl`):**
```bash
ACCESS_TOKEN=<from youtube-uploader MCP channels call>
curl -s -X POST \
  "https://www.googleapis.com/upload/youtube/v3/captions?uploadType=multipart&part=snippet" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "metadata={\"snippet\":{\"videoId\":\"<id>\",\"language\":\"en\",\"name\":\"English\",\"isDraft\":false}};type=application/json" \
  -F "file=@scenarios/<slug>.vtt;type=text/vtt"
```

**If API scope is insufficient (403 `insufficientPermissions`):**
Commit the `.vtt` file to `scenarios/<slug>.vtt` and instruct the user to
upload it manually in YouTube Studio: Subtitles tab → Add → Upload file → .vtt.
Note: the `youtube.upload` scope does NOT include caption write access;
`youtube.force-ssl` is required and must be added to the OAuth consent.

---

### 1e. Audience / results view

Tutorial videos should end with the "payoff" — what participants actually see
when they interact. Without this, the video ends on a static editor shot and
leaves the viewer uncertain about the audience experience.

**Check:** Does the last ~5s of the video show the participant-side UI
(drag-and-drop screen, results chart, or the live presenter results view)?
Or does the video end on the editor?

**Fix options (in order of preference):**
1. Re-record the scenario with an extra step that opens the Preview or presents
   a pre-seeded presentation so the participant view is captured in the visual.
2. Extend the video: freeze-frame the final editor frame and add a VO line
   describing what participants see (e.g. "Participants drag items into the right
   category on their phones — results appear on your screen in real time.").
3. (Least preferred) Screenshot of participant view appended as a static freeze
   for 3–5s.

---

### 1f. Settings panel coverage

If the article has a Settings section (points, time limit, partial scoring,
leaderboard), the video should show or at least mention that panel. Completely
skipping it means new users won't find the controls.

**Check:** Skim the VO script for mentions of "settings", "points", "time limit",
or scroll through the frame captures for the settings panel UI.

**Fix:** Either add a VO step pointing at the panel, or add a note in the article
that settings are configurable after the 60-second setup shown in the video.

---

## Axis 2 — AI agent consumability

### 2a. YouTube chapter markers

Chapter markers (timestamps in the video description) give agents named anchors
to each step. Without them, agents cannot seek to a specific step by name.

**Format (must start at 0:00):**
```
0:00 Introduction
0:03 Create a new presentation
0:07 Editor loading
0:10 Select the Categorise slide type
0:14 Write your question
0:17 Add sortable items
0:21 Enter items separated by commas
0:27 Name your first category
0:32 Add more categories
0:36 Present to audience
0:41 Participant experience
```

**How to check:** `yt-dlp --dump-json '<url>' | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('chapters'))"` — `null` means no chapters.

**Fix:** Update the YouTube video description via Studio or API to include
timestamped chapter lines (8+ characters per line, first entry MUST be 0:00).

---

### 2b. Closed-caption track (agent transcript)

Auto-captions are unstable (they change as YouTube's model updates) and may
use the wrong spelling variant. A creator-uploaded CC track gives agents a
stable, verbatim transcript.

See §1d for check and fix.

---

### 2c. On-screen labels verbatim in VO

Agents parse transcripts and try to map VO phrases to UI elements. If the VO
says "Click add category" but the UI button reads "+ Add Category", the mapping
fails.

**How to check:**
1. Compare the `display_text` in the voiceover JSON to the on-screen button
   labels visible in the step screenshots (`out/shots/step-*.png`).
2. Look for any step where the VO paraphrases instead of quoting the label.

**Fix:** Update `tts_text` (and `display_text` if appropriate) to quote the
exact UI label: "Click the **Add Category** button."

---

### 2d. Step table in the article

A condensed step table in the article footer gives agents a structured parse
target without cluttering human-facing prose.

**Format (add at article bottom, collapsed under a `<details>` tag):**

```markdown
<details>
<summary>Steps reference (for agents)</summary>

| # | Step | Action | Selector |
|---|------|---------|----------|
| 1 | cat-welcome | — | `.new-presentation-button` |
| 2 | cat-create | click | `.new-presentation-button` |
...
</details>
```

Derive from `scenarios/<slug>.json` — it already has `targetSelector` and
`action` per step.

---

## Full audit checklist

Use this as a quick-reference before closing any video task:

**Human:**
- [ ] 1a. VO voice is Liam or Alice — no other voice IDs
- [ ] 1b. Pronunciation spot-checked (especially "live" verb /laɪv/, "present" verb /prəˈzent/ prih-ZENT, "Categorise" -ise)
- [ ] 1c. No gaps > 2s — silencedetect confirms, or voiceover JSON timeline reviewed
- [ ] 1d. Creator-uploaded CC track present (not just auto-captions)
- [ ] 1e. Video ends with participant/results view (not editor-only)
- [ ] 1f. Settings panel mentioned or shown

**Agent:**
- [ ] 2a. Chapter markers in YouTube description (must start at 0:00)
- [ ] 2b. CC track uploaded (same as 1d)
- [ ] 2c. VO quotes exact UI labels for all action steps
- [ ] 2d. Step table in article footer (optional but high value)

---

## Tooling reference

### Download video for inspection
```bash
yt-dlp -o /tmp/<slug>.%(ext)s '<youtube-url>'
yt-dlp --write-auto-subs --sub-lang en -o /tmp/<slug> '<youtube-url>'
```

### Extract frames at 1fps
```bash
FFMPEG=~/AhaSlides/onboarding-videos/node_modules/ffmpeg-static/ffmpeg
$FFMPEG -i <video.webm> -vf fps=1 /tmp/frames/f%03d.png
```

### Silence detection
```bash
$FFMPEG -i <video.webm> -af "silencedetect=noise=-35dB:duration=1.5" -f null /dev/null 2>&1 \
  | grep -E "silence_(start|end|duration)"
```

### Measure MP3 clip durations
```bash
for f in out/*.mp3; do
  dur=$($FFMPEG -i "$f" 2>&1 | grep Duration | awk '{print $2}' | tr -d ',')
  echo "$(basename $f): $dur"
done
```

### VO overlap checker (required before every mix)
```bash
python3 .claude/skills/kb-tutorial-video/scripts/check_vo_overlap.py \
    scenarios/<slug>-voiceover.json
# With audio verification:
FFMPEG=$FFMPEG python3 .claude/skills/kb-tutorial-video/scripts/check_vo_overlap.py \
    scenarios/<slug>-voiceover.json --audio <narrated.webm>
```
Both `CHECK 1 — TIMELINE` and `CHECK 2 — AUDIO ENERGY` must report `PASS`.
See `kb-video-voiceover` SKILL.md for the full voiceover pipeline.

### VTT generation
```python
steps = [
    ("00:00:00.000", "00:00:03.470", "First caption line."),
    # ... one entry per VO step
]
vtt = "WEBVTT\n\n"
for i, (start, end, text) in enumerate(steps, 1):
    vtt += f"{i}\n{start} --> {end}\n{text}\n\n"
with open("scenarios/<slug>.vtt", "w") as f:
    f.write(vtt)
```

---

## Producing the ranked recommendation list

After completing the checklist, rank all issues by impact:

1. **Critical** (must fix before publish): voice non-compliance, complete absence
   of captions on published video.
2. **High** (fix in next round): pronunciation errors, silent gaps > 4s, no
   chapters on a multi-step video, no audience view.
3. **Medium**: label verbatim mismatches, gaps 2–4s, settings panel skipped.
4. **Low** (nice-to-have): step table in article, minor VO pacing.

Format as a numbered list in the Slack reply, worst first, with the specific
timestamp or file location for each issue. Include both human and agent axes.

---

## Reference: AKB-2 Categorise slide audit (2026-06-15)

The first application of this audit (AKB-2 r8) found on video i2tFmejvHHE:

Human issues:
1. VO non-compliant (Bella, not Liam/Alice)
2. "categorized" US spelling in auto-captions (pronunciation wrong)
3. Two silent gaps: 0:04–0:09 (5s) and 0:14–0:20 (6s)
4. No creator-uploaded CC track
5. No audience/results view (ended on editor)

Agent issues:
1. Transcript-to-step alignment absent
2. No YouTube chapter markers
3. VO paraphrases UI labels ("Click add category" vs "+ Add Category")
4. No CC track (same as human issue 4)
5. No step table in article

Fixes shipped in r9 (video PeAS2yPtA_0):
- Re-rendered with Liam (gaps/audience step) + Alice (main steps)
- Added s03 filler VO (0:07): "Your editor is loading — in a moment we'll pick the slide type."
- Added s06 filler VO (0:17): "Now add the items participants will sort."
- Added s11 audience VO (0:41): "Participants drag items into the right category on their phones — results appear on your screen in real time."
- Visual extended 7s via freeze-frame; total: 0:47
- VTT generated at `scenarios/using-the-categorise-slide.vtt` (manual upload to YouTube Studio needed — `youtube.force-ssl` scope not available)
- Chapter markers added to YouTube description
- check_vo_overlap.py: PASS (both timeline and audio)
