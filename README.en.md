# Talking Pets MVP

Talking Pets is a small add-on that reads Codex Pet bubble content aloud with local TTS.

Japanese: [README.md](README.md)

## Status

- macOS: supported. The Swift monitor is the stable path.
- Windows: experimental. A Node monitor and PowerShell scripts are included.
- Linux: experimental. The Node monitor is the intended path.

## Requirements

Required:

- Codex Desktop or Codex CLI saving local conversation logs
- Node.js 22 or later
- npm

Stable macOS path:

- macOS
- Swift runtime
- `afplay` for audio playback
- macOS `say` as a fallback

For Japanese voices:

- VOICEVOX Engine
- VOICEVOX Engine running at `http://127.0.0.1:50021`
- Default voice: Zundamon Normal, `speaker=3`

For English voices:

- `kokoro-js`
- Network access for the first Kokoro model download

Windows experimental:

- Node.js 22 or later
- PowerShell
- VOICEVOX Engine or Kokoro
- Codex `state_5.sqlite` available under the user home directory

## Install

macOS:

```bash
cd /path/to/talking-pets
./install.command
./start-selected-tts.command
```

The installer lets you choose a local TTS provider.

- Auto routing: Japanese to VOICEVOX, English to Kokoro, everything else to macOS say
- VOICEVOX: recommended for Japanese. Default is Zundamon Normal `speaker=3`
- Kokoro.js: local TTS, mostly English voices
- macOS say: no extra install

Check your setup:

```bash
./check.command
```

Windows experimental:

```powershell
.\install.ps1
.\start-selected-tts.ps1
.\check.ps1
```

## Manual Start

Stable macOS monitor:

```bash
./scripts/pet-rollout-monitor.command --tts auto --skip-existing
```

Experimental Node monitor:

```bash
./scripts/pet-rollout-monitor-node.command --tts auto --skip-existing
npm run monitor:node -- --once --dry-run
```

Rollback on macOS is simple: use the Swift monitor again.

```bash
./scripts/pet-rollout-monitor.command --tts auto --skip-existing
```

## TTS Options

VOICEVOX:

```bash
./scripts/pet-rollout-monitor.command --tts voicevox --voicebox-speaker 3 --skip-existing
./scripts/pet-rollout-monitor.command --tts voicevox --list-voices
```

Kokoro:

```bash
./scripts/pet-rollout-monitor.command --tts kokoro --kokoro-voice af_heart --skip-existing
./scripts/pet-rollout-monitor.command --tts kokoro --list-voices
```

macOS say:

```bash
./scripts/pet-rollout-monitor.command --tts say --voice Kyoko --skip-existing
```

Multilingual auto routing:

```bash
./scripts/pet-rollout-monitor.command --tts auto --skip-existing
./scripts/pet-rollout-monitor.command --tts auto --speech-language ja --skip-existing
./scripts/pet-rollout-monitor.command --tts kokoro --no-language-route --skip-existing
```

Initial voice presets live in [presets/voices.json](presets/voices.json).

## Check

Dry-run without speaking:

```bash
./scripts/pet-rollout-monitor.command --once --dry-run
```

Use a specific thread:

```bash
./scripts/pet-rollout-monitor.command --thread-id THREAD_ID --dry-run
```

Filter by workspace:

```bash
./scripts/pet-rollout-monitor.command --cwd /path/to/workspace --dry-run
```

## How It Works

Talking Pets reads local Codex conversation logs.

1. Read `threads.rollout_path` from `~/.codex/state_5.sqlite`
2. Find the latest rollout JSONL for the selected thread
3. Read the latest assistant message
4. Convert it into a short spoken line
5. Send it to local TTS

It does not patch Codex itself or modify a signed application bundle.

## Web Demo

You can try the browser-only speech UI.

```bash
open demo/index.html
open demo/bridge.html
```

Basic HTML integration:

```html
<script src="/path/to/talking-pet-mvp.js"></script>
<script>
  TalkingPetMVP.init({
    bubbleSelector: "[data-pet-bubble]",
    observeBubble: true
  });
</script>
```

Separate display text from spoken text:

```js
window.dispatchEvent(new CustomEvent("codex-pet:message", {
  detail: {
    displayText: "This appears on screen",
    speechText: "Master, this is the spoken version."
  }
}));
```

## Notes

- VOICEVOX itself is not bundled.
- Follow VOICEVOX and voice-library terms.
- Kokoro downloads model files on first run.
- Windows support is still experimental.
- License and credit notices should be finalized before making the repository public.
