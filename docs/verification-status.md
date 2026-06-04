# Verification Status

This page records the current verification state for public review and release prep. It is intentionally separate from the reusable checklist in `docs/real-device-verification.md`.

## Current Snapshot

- Date: 2026-06-04
- Maintainer environment: macOS 26.5, arm64
- Node.js: v24.2.0
- npm: 11.6.4
- Codex local state: available
- Default config during local checks: none (`.talking-pets.local.env` absent)

## Verified Locally

macOS local verification has current evidence for:

- `npm ci`
- `npm run check:all`
- `npm run check:compat`
- `npm run check:runtime`
- `npm run check:audio:strict`
- `npm run check:config`
- `npm run check:installers`
- `npm run check:docs`
- `npm run check:platform-scripts`
- `npm run check:swift-cli`
- `npm run check:pack`
- `npm run check:release`
- `npm run check:sanitize`
- `npm run test:dry-run`
- `npm run sanitize:public-output`
- `./check.command`
- `./scripts/pet-rollout-monitor.command --once --dry-run`
- `./scripts/pet-rollout-monitor.command --tts say --voice Kyoko --once --rollout test/fixtures/assistant-rollout.jsonl`

Observed result:

- Fixture compatibility passes for `assistant-rollout.jsonl`, `mixed-ja-en-rollout.jsonl`, and `ko-zh-rollout.jsonl`.
- Stateful Codex compatibility reads the latest local rollout from the Codex state DB.
- macOS audio path reports both `afplay` and `say` as available.
- VOICEVOX Engine was not running during this snapshot; that is not a blocker for the current macOS evidence because the recorded audible TTS path is `macOS say`.
- `./check.command` uses fixture-only compatibility and prints public-friendly dry-run output.
- Stateful dry-run can read the latest local Codex assistant message.
- Stateful dry-run output includes the local thread title, rollout path, and conversation text, so it is local verification only and must not be pasted publicly without sanitization and manual review.
- A macOS `say` fixture TTS command is recorded as the current audible local TTS evidence for the release draft.

## Irodori Latency Snapshot

Irodori-TTS Server is experimental optional and should not be treated as a universal latency benchmark from one maintainer machine.

Maintainer reference result:

- Device: MacBook Air, Apple M1, 8 CPU cores, 7-core Apple M1 GPU, 8 GB RAM
- OS: macOS 26.5.1 / arm64
- Node.js / npm: v24.2.0 / 11.6.4
- Irodori backend observed in server log: MPS, fp32
- Health: 49.8ms
- Warm-up with runtime load: 33.4s client-side, 33.17s server-side
- Warm synthesis runs: 16.7s, 10.1s, 9.6s
- Output audio duration: about 3.92s

Collect more data with the [Irodori latency contribution](real-device-verification.md#irodori-latency-contribution) format and a sanitized Platform verification issue.

## Release Evidence Draft

Use this as the starting point for the macOS row in `docs/release-notes-template.md`:

- macOS: `macOS 26.5 / arm64 / Node.js v24.2.0 / npm 11.6.4 / Codex CLI: 0.135.0 / TTS: macOS say / speech-language: auto / config source: none (.talking-pets.local.env absent) / audible: yes / sanitized: yes`

Use these row templates only after a sanitized Platform verification issue passes the review in "When Evidence Arrives":

- Windows: `<version> / <arch> / Node.js <version> / npm <version> / Codex: <version|unknown> / TTS: Windows OS speech|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS / speech-language: auto|ja|en|ko|zh|other / config source: <installer default|preset|custom|none> / audible: yes / sanitized: yes / Evidence link: <Platform verification issue>`
- Linux: `<distro/version> / <arch> / Node.js <version> / npm <version> / Codex: <version|unknown> / TTS: Linux espeak|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS / speech-language: auto|ja|en|ko|zh|other / config source: <installer default|preset|custom|none> / audible: yes / sanitized: yes / Evidence link: <Platform verification issue>`

## Still Required Before Platform Graduation

The repository can be published as a macOS stable / Windows and Linux experimental public preview before Windows or Linux audible TTS evidence arrives. Collect that post-release evidence through sanitized Platform verification issues, then update this page before changing either platform from experimental.

Windows remains experimental until a real Windows machine records:

- install
- platform check
- dry-run
- one audible TTS line
- OS/version
- CPU architecture
- Node.js and npm versions
- TTS path tested
- speech-language value
- config source
- Codex Desktop / CLI version if known
- audible: yes
- sanitized: yes
- sanitized Platform verification issue link

Linux remains experimental until a real Linux machine records:

- install
- platform check
- dry-run
- one audible TTS line
- OS/version
- CPU architecture
- Node.js and npm versions
- TTS path tested
- speech-language value
- config source
- Codex Desktop / CLI version if known
- audible: yes
- sanitized: yes
- sanitized Platform verification issue link

Do not count unsanitized reports or inaudible reports as graduation evidence. They are useful follow-up data only.

CI-only evidence, fixture-only dry-runs, `npm run check:compat -- --no-state`, and package checks are release gates, not platform graduation evidence. Use them to catch regressions before asking for real-device reports; do not use them as substitutes for audible, sanitized Windows or Linux evidence.

## Evidence Rules

- Follow `docs/real-device-verification.md` for exact commands and pass criteria.
- Use the GitHub "Platform verification" issue template for external evidence.
- Sanitize every public command output before posting.
- Keep known public fixture rollout paths visible as evidence.
- Do not attach private rollout JSONL, local SQLite DBs, local env files, generated audio, recordings, archives, downloaded model files, credentials, or private conversation text.

## When Evidence Arrives

Before changing Windows or Linux status, review the Platform verification issue and confirm all of these are true:

1. The issue has install, platform check, dry-run, and one audible TTS command output.
2. Public evidence is marked `sanitized: yes`.
3. One spoken line is marked `audible: yes`.
4. OS/version, CPU architecture, Node.js and npm versions, TTS path, speech-language value, config source, and Codex Desktop / CLI version if known are recorded.
5. The evidence link points to a sanitized Platform verification issue, not a private log, local file, archive, or chat transcript.
6. Any `no local Codex state yet` limitation is recorded as a limitation and not counted as stateful Codex compatibility.

After the review passes, update this page first, then copy the platform evidence row into `docs/release-notes-template.md`.

## Update Rules

- Update this file whenever a platform status changes.
- Update this file after adding or removing a release gate command.
- Keep Windows and Linux marked experimental until sanitized, audible real-device evidence exists for each OS.
- Do not replace `docs/real-device-verification.md`; link to it for reusable commands and pass criteria.
