# Contributor Entrypoints

This page lists small, concrete ways to help Talking Pets without needing to understand the whole codebase.

## Best First Issues

| Priority | Title | Good for | What to do | Issue template |
| --- | --- | --- | --- | --- |
| P0 | Windows real-device verification | Windows users | Run install, checks, dry-run, and one audible TTS command. Paste sanitized output. | Platform verification |
| P0 | Linux real-device verification | Linux users | Run install, checks, dry-run, and one audible TTS command with `espeak`, `aplay`, `paplay`, or `ffplay`. Paste sanitized output. | Platform verification |
| P0 | VOICEVOX latency on another machine | Japanese TTS users | Start VOICEVOX Engine, run the short synthesis checks, and report timings plus device specs. | Platform verification |
| P1 | Irodori latency on another GPU / CPU | Irodori users | Run the Irodori latency contribution commands and report health, cold/warm, backend, and audio duration. | Platform verification |
| P1 | Installer feedback | First-time users | Try `install.command`, `install.ps1`, or `install.sh` and report unclear prompts or failures. | Install trouble |
| P2 | New local TTS provider suggestion | TTS builders | Share provider URL, license notes, local setup shape, and whether it supports CLI or HTTP. | TTS provider request |

## Ready-To-Open Issue Titles

Use these titles if you want a quick issue:

- `[Verify]: Windows 11 x64 audible TTS`
- `[Verify]: Ubuntu 24.04 x64 audible TTS`
- `[Verify]: VOICEVOX latency on <device>`
- `[Verify]: Irodori latency on <device>`
- `[Install]: macOS installer feedback`
- `[TTS]: <provider name> local TTS support`

## What Counts As Useful Evidence

Useful verification evidence includes:

- OS and version
- CPU architecture
- device model, CPU/GPU, and RAM when reporting latency
- Node.js and npm versions
- TTS path tested
- command output after sanitization
- whether one spoken line was audible
- known limitation or follow-up

Use the `Platform verification` issue template for real-device evidence. For Irodori, include the optional Irodori latency fields in that template.

## Safety Rules

Do not paste:

- private paths
- conversation text
- local env values
- credentials
- local SQLite DBs such as `state_5.sqlite`
- private rollout JSONL
- generated audio
- recordings
- archives
- macOS metadata
- downloaded model files

Run output through the sanitizer first, then review it manually:

```bash
./check.command 2>&1 | npm run sanitize:public-output
```

```powershell
.\check.ps1 2>&1 | npm run sanitize:public-output
```

```bash
./check.sh 2>&1 | npm run sanitize:public-output
```

## Maintainer Notes

Good first issue labels to use:

- `good first issue`
- `verification`
- `latency`
- `windows`
- `linux`
- `tts`

Do not mark an issue as release evidence until it has `audible: yes` and `sanitized: yes`.
