# Contributor Entrypoints

This page lists small, concrete ways to help Talking Pets without needing to understand the whole codebase.

## Public Proof Hub

Use this hub to see what is already evidenced, what is still waiting, and where to add useful public verification.

| Need | Start here | What it proves | Claim boundary |
| --- | --- | --- | --- |
| Current support status | [Verification status](verification-status.md#current-snapshot) | Which OS/provider paths are stable, experimental, optional, or waiting. | Waiting rows are not verified support. |
| Public proof package | [Release Proof Package Index](verification-status.md#release-proof-package-index) | Which public docs and issues can support release notes. | Do not turn reference data into performance guarantees. |
| Windows / Linux proof | [External Verification Intake](verification-status.md#external-verification-intake) | What Issue #23/#24 need before platform wording changes. | CI and fixture checks do not graduate real-device support. |
| VOICEVOX / Irodori latency | [Real Device Verification](real-device-verification.md#voicevox-latency-contribution) | How to report device, timing, playback, audio duration, and sanitized output. | One machine's data is reference evidence, not a universal speed claim. |
| Korean / Chinese evidence | [Minimal Multilingual Report Form](real-device-verification.md#minimal-multilingual-report-form) | Whether a report is fallback-only or provider-specific. | OS speech fallback is not dedicated provider support. |

If you only have a few minutes, pick one row from [Best First Issues](#best-first-issues), run the smallest matching check, sanitize output, and open a public issue.

## Best First Issues

| Priority | Title | Good for | What to do | Issue template |
| --- | --- | --- | --- | --- |
| P0 | Windows real-device verification | Windows users | Run install, checks, dry-run, and one audible TTS command. Paste sanitized output. | Platform verification |
| P0 | Linux real-device verification | Linux users | Run install, checks, dry-run, and one audible TTS command with `espeak`, `aplay`, `paplay`, or `ffplay`. Paste sanitized output. | Platform verification |
| P0 | VOICEVOX latency on another machine | Japanese TTS users | Start VOICEVOX Engine, run the short synthesis checks, and report timings plus device specs. | Platform verification |
| P1 | Irodori latency on another GPU / CPU | Irodori users | Run the Irodori latency contribution commands and report health, cold/warm, backend, and audio duration. | Platform verification |
| P1 | Korean / Chinese dedicated-provider evidence | Multilingual local TTS users | Use the Minimal Multilingual Report Form, then mark fallback-only vs provider-specific evidence. | Platform verification |
| P1 | Installer feedback | First-time users | Try `install.command`, `install.ps1`, or `install.sh` and report unclear prompts or failures. | Install trouble |
| P2 | New local TTS provider suggestion | TTS builders | Share provider URL, license notes, local setup shape, and whether it supports CLI or HTTP. | TTS provider request |

## Ready-To-Open Issue Titles

Use these titles if you want a quick issue:

- `[Verify]: Windows 11 x64 audible TTS`
- `[Verify]: Ubuntu 24.04 x64 audible TTS`
- `[Verify]: VOICEVOX latency on <device>`
- `[Verify]: Irodori latency on <device>`
- `[Verify]: Korean/Chinese provider-specific TTS on <device>`
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
For Korean, Chinese, or other multilingual provider evidence, start from the [Minimal Multilingual Report Form](real-device-verification.md#minimal-multilingual-report-form) and state whether the evidence is fallback-only or provider-specific. Do not ask maintainers to infer dedicated provider support from OS speech fallback.

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
