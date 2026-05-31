# Contributing

Thanks for helping improve Talking Pets.

## Local Checks

Run these before opening a pull request:

```bash
npm ci
npm run check:all
```

For macOS manual checks:

```bash
./install.command
./check.command
./scripts/pet-rollout-monitor.command --once --dry-run
./scripts/pet-rollout-monitor.command --tts say --voice Kyoko --once --rollout test/fixtures/assistant-rollout.jsonl
```

For Windows experimental checks:

```powershell
.\install.ps1
.\check.ps1
npm run monitor:node -- --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl
npm run monitor:node -- --tts say --once --rollout test/fixtures/assistant-rollout.jsonl
npm run monitor:node -- --tts say --speech-language ko --once --rollout test/fixtures/ko-zh-rollout.jsonl
```

For Linux experimental checks:

```bash
./install.sh
./check.sh
npm run monitor:node -- --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl
npm run monitor:node -- --tts say --once --rollout test/fixtures/assistant-rollout.jsonl
npm run monitor:node -- --tts say --speech-language zh --once --rollout test/fixtures/ko-zh-rollout.jsonl
```

Compatibility checks:

```bash
npm run check:compat
npm run check:compat -- --no-state
npm run check:runtime
npm run check:audio
npm run check:audio:strict
npm run check:config
npm run check:installers
npm run check:docs
npm run check:platform-scripts
npm run check:swift-cli
npm run check:pack
npm run check:release
npm run check:sanitize
./check.command 2>&1 | npm run sanitize:public-output
```

Use `--no-state` in CI or clean machines where Codex has not created `~/.codex/state_5.sqlite` yet.
Use `check:audio:strict` only on real machines where an audible playback path is expected to exist.
For release evidence, follow `docs/real-device-verification.md`.
For contributor-provided OS evidence, use the "Quick Contributor Request" in `docs/real-device-verification.md`, then open a "Platform verification" issue.
Release evidence must include OS/version, CPU architecture, Node.js and npm versions, install, platform check, dry-run, one audible TTS command output, TTS path tested, speech-language value, config source, Codex Desktop / CLI version if known, `audible: yes`, `sanitized: yes`, and the sanitized Platform verification issue link.
CI-only, fixture-only, `--no-state`, and package-check output are release gates, not Windows / Linux graduation evidence.
If audio fails or no spoken line is audible, still open the Platform verification issue as follow-up evidence; it does not count toward graduating Windows or Linux from experimental.
For GitHub Release copy, start from `docs/release-notes-template.md`.
The sanitizer reads stdin or one input file, so pass it actual check output and review the result manually before pasting.
If you paste installer output for platform verification, sanitize that output too:

```bash
./install.command 2>&1 | npm run sanitize:public-output
```

```powershell
.\install.ps1 2>&1 | npm run sanitize:public-output
```

```bash
./install.sh 2>&1 | npm run sanitize:public-output
```

## Pull Requests

- Keep changes small and focused.
- Use `.github/pull_request_template.md` and leave unchecked items only when they clearly do not apply.
- Update `README.md` and `README.en.md` together when user-facing behavior changes.
- Update `implementation-notes.md` when making a judgment call, compromise, or public-facing behavior change.
- Do not bundle VOICEVOX, Kokoro model files, downloaded model files, generated audio, local recordings, archives, macOS metadata, local env files, credentials, private rollout JSONL, local SQLite DBs such as `state_5.sqlite`, or local Codex logs.
- Avoid changes that patch Codex Desktop or modify signed app bundles.

## Issues

Choose the issue template that matches the work:

- Bug report: broken behavior after setup or a regression in existing features.
- Install trouble: setup, first run, local config, audio path, or starter script problems.
- Platform verification: real-device install, platform check, dry-run, and audible TTS evidence for release notes.
- TTS provider request: a new local TTS provider, voice library, endpoint, or voice integration.

When reporting a problem, include:

- OS and version
- CPU architecture
- Node.js and npm versions
- TTS provider
- Speech-language value and config source when reporting audio or platform verification
- Codex Desktop / CLI version if known
- Command you ran
- Relevant `./check.command`, `.\check.ps1`, or `./check.sh` output
- Whether Codex is saving local logs

Sanitize public logs first:

The sanitizer helps with known local paths, private rollout JSONL, common credential env/header patterns, and artifact names. It keeps the known public fixture rollout paths visible for evidence, but still manually remove credentials before posting.

```bash
./check.command 2>&1 | npm run sanitize:public-output
```

```powershell
.\check.ps1 2>&1 | npm run sanitize:public-output
```

```bash
./check.sh 2>&1 | npm run sanitize:public-output
```
