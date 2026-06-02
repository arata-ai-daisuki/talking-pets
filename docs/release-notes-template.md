# Release Notes Template

Use this template for GitHub Releases. Replace placeholders before publishing. Review `docs/verification-status.md` first, and update it if the release changes platform status, verified commands, or evidence links.

## Talking Pets vX.Y.Z

Talking Pets reads local Codex conversation logs and speaks the latest Codex Pet / assistant message through local TTS. It does not patch Codex Desktop or modify signed app bundles.

## What's Changed

- Initial public preview for local Codex Pet / assistant speech with local TTS.
- macOS stable path with Swift monitor and macOS `say` evidence.
- Windows and Linux experimental Node monitor paths, with post-release real-device evidence collection through Platform verification issues.

## Verified Platforms

Use `docs/real-device-verification.md` for the commands and pass criteria. Link each external real-device result to its sanitized Platform verification issue. Include the Codex Desktop / CLI version in evidence when known.

Before changing a platform from Experimental to Stable, update `docs/verification-status.md` first and confirm the linked Platform verification issue has OS/version, CPU architecture, Node.js and npm versions, install, platform check, dry-run, one audible TTS command, TTS path tested, speech-language value, config source, Codex Desktop / CLI version if known, `audible: yes`, `sanitized: yes`, and no unreviewed private evidence. A report with `no local Codex state yet` may be linked as a limitation, but it is not stateful Codex compatibility evidence.

| Platform | Status | Evidence | Evidence link |
| --- | --- | --- | --- |
| macOS | Stable | `<version> / <arch> / Node.js <version> / npm <version> / Codex: <version|unknown> / TTS: macOS say|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS / speech-language: auto|ja|en|ko|zh|other / config source: <installer default|preset|custom|none> / audible: yes|no / sanitized: yes|no` | `<Platform verification issue or maintainer-run note>` |
| Windows | Experimental | `<version> / <arch> / Node.js <version> / npm <version> / Codex: <version|unknown> / TTS: Windows OS speech|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS / speech-language: auto|ja|en|ko|zh|other / config source: <installer default|preset|custom|none> / audible: yes|no / sanitized: yes|no` | `<Platform verification issue>` |
| Linux | Experimental | `<distro> / <arch> / Node.js <version> / npm <version> / Codex: <version|unknown> / TTS: Linux espeak|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS / speech-language: auto|ja|en|ko|zh|other / config source: <installer default|preset|custom|none> / audible: yes|no / sanitized: yes|no` | `<Platform verification issue>` |

For Windows or Linux graduation, copy the reviewed row template from `docs/verification-status.md` so the release evidence keeps `audible: yes`, `sanitized: yes`, TTS path, speech-language value, config source, and the Platform verification issue link together.

## Verified Commands

Sanitize every command output you plan to link or paste publicly:

```bash
./install.command 2>&1 | npm run sanitize:public-output
./check.command 2>&1 | npm run sanitize:public-output
./scripts/pet-rollout-monitor.command --once --dry-run 2>&1 | npm run sanitize:public-output
./scripts/pet-rollout-monitor.command --tts say --voice Kyoko --once --rollout test/fixtures/assistant-rollout.jsonl 2>&1 | npm run sanitize:public-output
```

```powershell
.\install.ps1 2>&1 | npm run sanitize:public-output
.\check.ps1 2>&1 | npm run sanitize:public-output
npm run monitor:node -- --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl 2>&1 | npm run sanitize:public-output
npm run monitor:node -- --tts say --once --rollout test/fixtures/assistant-rollout.jsonl 2>&1 | npm run sanitize:public-output
npm run monitor:node -- --tts say --speech-language ko --once --rollout test/fixtures/ko-zh-rollout.jsonl 2>&1 | npm run sanitize:public-output
```

```bash
./install.sh 2>&1 | npm run sanitize:public-output
./check.sh 2>&1 | npm run sanitize:public-output
npm run monitor:node -- --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl 2>&1 | npm run sanitize:public-output
npm run monitor:node -- --tts say --once --rollout test/fixtures/assistant-rollout.jsonl 2>&1 | npm run sanitize:public-output
npm run monitor:node -- --tts say --speech-language zh --once --rollout test/fixtures/ko-zh-rollout.jsonl 2>&1 | npm run sanitize:public-output
```

```bash
npm ci
npm run check:all
npm run check:compat
npm run check:runtime
npm run check:audio:strict
npm run check:config
npm run check:installers
npm run check:docs
npm run check:platform-scripts
npm run check:swift-cli
npm run check:pack
npm run check:release
npm run check:sanitize
npm run test:dry-run
./install.command
./check.command
./scripts/pet-rollout-monitor.command --once --dry-run
./scripts/pet-rollout-monitor.command --tts say --voice Kyoko --once --rollout test/fixtures/assistant-rollout.jsonl
```

Windows PowerShell:

```powershell
npm ci
npm run check:all
npm run check:compat
npm run check:runtime
npm run check:audio:strict
npm run check:config
npm run check:installers
npm run check:docs
npm run check:platform-scripts
npm run check:swift-cli
npm run check:pack
npm run check:release
npm run check:sanitize
npm run test:dry-run
.\install.ps1
.\check.ps1
npm run monitor:node -- --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl
npm run monitor:node -- --tts say --once --rollout test/fixtures/assistant-rollout.jsonl
npm run monitor:node -- --tts say --speech-language ko --once --rollout test/fixtures/ko-zh-rollout.jsonl
```

Linux:

```bash
npm ci
npm run check:all
npm run check:compat
npm run check:runtime
npm run check:audio:strict
npm run check:config
npm run check:installers
npm run check:docs
npm run check:platform-scripts
npm run check:swift-cli
npm run check:pack
npm run check:release
npm run check:sanitize
npm run test:dry-run
./install.sh
./check.sh
npm run monitor:node -- --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl
npm run monitor:node -- --tts say --once --rollout test/fixtures/assistant-rollout.jsonl
npm run monitor:node -- --tts say --speech-language zh --once --rollout test/fixtures/ko-zh-rollout.jsonl
```

## Known Limits

- This release is intended as a public preview with macOS stable and Windows / Linux experimental support. Windows and Linux audible TTS evidence can be collected after publication through Platform verification issues.
- Windows / Linux remain experimental until OS/version, CPU architecture, Node.js and npm versions, install, platform check, dry-run, one audible TTS path, TTS path tested, speech-language value, config source, Codex Desktop / CLI version if known, `audible: yes`, `sanitized: yes`, and a sanitized Platform verification issue link are recorded on real hardware.
- CI, fixture-only dry-runs, package checks, and `npm run check:compat -- --no-state` are release gates only; they are not platform graduation evidence.
- Platform verification issues with unsanitized evidence or no audible spoken line are follow-up reports, not release evidence for graduating a platform.
- Talking Pets depends on local Codex `state_5.sqlite` and rollout JSONL files. Codex storage changes may require a compatibility update.
- If a verifier has no local Codex state yet, record that limitation in the Platform verification issue; `npm run check:compat -- --no-state` is supplemental fixture evidence, not stateful Codex verification for platform graduation.
- VOICEVOX itself is not bundled. Start VOICEVOX Engine separately when using VOICEVOX.
- Kokoro.js may download model files on first use.
- Custom TTS endpoints may receive conversation text if configured.

## Credits And Terms

- See `CREDITS.md` for VOICEVOX, Kokoro, Voicebox-compatible endpoint/custom local TTS, Codex, and voice/model usage notes.
- Do not attach private Codex logs, private rollout JSONL, local SQLite DBs such as `state_5.sqlite`, local env files, generated audio, local recordings, archives, downloaded model files, or credentials to public issues. Known public fixture rollout paths may remain visible as evidence.

## Upgrade Notes

- No upgrade steps for the initial public preview.
