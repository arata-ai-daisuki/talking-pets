# Public Repo Review Checklist

This checklist tracks public-readiness work that should stay visible after the original root checklist was folded into docs.

## Done In This Repo

- First-screen README positioning explains what Talking Pets does and that it does not patch Codex.
- Demo recording and still frame are linked from both READMEs.
- macOS install, check, start, stop, restart, and config-change flows are documented.
- Windows and Linux are clearly marked experimental.
- License, credits, security policy, contribution notes, changelog, and issue templates exist.
- Pull request template keeps checks, docs, safety, and real-device evidence visible.
- CI runs syntax, runtime, unit, compatibility fixture, audio-path, config, installer-generated config, docs-link, platform script, npm pack scope, release-readiness, public-output sanitizer smoke, dry-run, shell / PowerShell parse, Swift parse, and Swift CLI error checks.
- Linux has experimental `install.sh`, `check.sh`, and `start-selected-tts.sh` entrypoints so users do not need to translate the macOS scripts by hand.
- Example configs cover VOICEVOX, Kokoro, Korean / Chinese OS speech fallback, privacy-first OS speech, and generic Voicebox-compatible endpoints.
- Example config docs explain that `privacy-first-say.env` uses OS speech with `auto` speech-language and no model download, while `generic-voicebox.env` uses a Voicebox-compatible endpoint in generic mode with profile `default` and language `en`.

## Keep Watching

- Verification planning should start from [Verification Matrix](verification-matrix.md) so routine fixture checks, stateful local checks, audible real-device checks, sandbox-sensitive checks, and opt-in external checks do not get mixed together.
- Public wording changes should use the [Release Doc Sync Matrix](release-doc-sync-matrix.md) so README, verification status, release notes, package scope, and issue templates move together.
- Codex local storage compatibility: `state_5.sqlite`, `threads.rollout_path`, rollout JSONL assistant message shapes, and mixed Japanese / English speech fixture coverage.
- Platform check scripts should keep public-friendly fixture compatibility and fixture dry-run output; stateful Codex verification stays in `npm run check:compat`.
- CI-only and fixture-only evidence can keep the repo release-ready, but cannot graduate Windows or Linux without audible, sanitized real-device evidence.
- Public preview release is allowed before Windows / Linux audible TTS evidence, as long as both platforms remain experimental and post-release evidence is collected through Platform verification issues.
- Korean / Chinese fallback compatibility: `test/fixtures/ko-zh-rollout.jsonl` should stay in default `npm run check:compat` coverage.
- Windows real-device install and audio playback.
- Linux real-device install and audio playback.
- Audio playback command availability: `npm run check:audio` should explain the local playback path before users try TTS.
- Node.js runtime availability: `npm run check:runtime` should confirm `node:sqlite`, because the monitor reads Codex local metadata through SQLite.
- Preset and example config validity should pass `npm run check:config`.
- Installer-generated config validity should pass `npm run check:installers` so macOS, Windows, and Linux installers do not drift from the runtime config validator.
- Npm package scope should pass `npm run check:pack` so accidental tarballs do not include private or internal artifacts. This is a package-scope audit, not npm publish preparation; `package.json` should remain `private: true` until publication is intentional. The check uses a temporary npm cache for `npm pack --dry-run --json` so local `~/.npm` cache permissions do not hide package-scope issues. The only packaged `test/` files should be the known public rollout fixtures: `assistant-rollout.jsonl`, `mixed-ja-en-rollout.jsonl`, and `ko-zh-rollout.jsonl`.
- Public issue logs should be passed through `npm run sanitize:public-output` and then manually reviewed before sharing.
- Release evidence should be recorded with `docs/real-device-verification.md`.
- Current verification status should be summarized in `docs/verification-status.md`.
- Real-device reports should use the "Quick Contributor Request" and copy-paste request in `docs/real-device-verification.md`, then the GitHub "Platform verification" issue template, and record OS/version, CPU architecture, Node.js and npm versions, install, platform check, dry-run, one audible TTS command output, TTS path tested, speech-language value, config source, Codex Desktop / CLI version if known, `audible: yes`, `sanitized: yes`, and an evidence link for release notes.
- GitHub Release copy should start from `docs/release-notes-template.md`.
- Local Markdown links should pass `npm run check:docs`.
- Optional short GIF replacement or addition if it improves first-screen clarity beyond the current real-device screenshot.
- Additional local TTS providers for Korean and Chinese, only after terms and offline behavior are clear.

## Release Gate

Run the common local release gate before tagging:

```bash
npm ci
npm run check:all
npm run test:dry-run
npm run check:compat
npm run check:runtime
npm run check:audio:strict
npm run check:config
npm run check:installers
npm run check:docs
npm run check:platform-scripts
npm run check:pack
npm run check:release
npm run check:swift-cli
npm run check:sanitize
```

macOS evidence commands:

```bash
./install.command 2>&1 | npm run sanitize:public-output
./check.command 2>&1 | npm run sanitize:public-output
./check.command
./scripts/pet-rollout-monitor.command --once --dry-run 2>&1 | npm run sanitize:public-output
./scripts/pet-rollout-monitor.command --tts say --voice Kyoko --once --rollout test/fixtures/assistant-rollout.jsonl 2>&1 | npm run sanitize:public-output
```

Windows evidence commands:

```powershell
.\install.ps1 2>&1 | npm run sanitize:public-output
.\check.ps1 2>&1 | npm run sanitize:public-output
.\check.ps1
npm run monitor:node -- --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl 2>&1 | npm run sanitize:public-output
npm run monitor:node -- --tts say --once --rollout test/fixtures/assistant-rollout.jsonl 2>&1 | npm run sanitize:public-output
npm run monitor:node -- --tts say --speech-language ko --once --rollout test/fixtures/ko-zh-rollout.jsonl 2>&1 | npm run sanitize:public-output
```

Linux evidence commands:

```bash
./install.sh 2>&1 | npm run sanitize:public-output
./check.sh 2>&1 | npm run sanitize:public-output
./check.sh
npm run monitor:node -- --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl 2>&1 | npm run sanitize:public-output
npm run monitor:node -- --tts say --once --rollout test/fixtures/assistant-rollout.jsonl 2>&1 | npm run sanitize:public-output
npm run monitor:node -- --tts say --speech-language zh --once --rollout test/fixtures/ko-zh-rollout.jsonl 2>&1 | npm run sanitize:public-output
bash -n install.sh check.sh start-selected-tts.sh
```

Run the sanitizer example for the OS being verified before pasting any check, dry-run, installer, or TTS command output into a public issue. Record OS/version, CPU architecture, Node.js and npm versions, installer, platform check, dry-run, and audible TTS evidence, plus TTS path tested, speech-language value, config source, Codex Desktop / CLI version if known, `audible: yes`, and `sanitized: yes` with `docs/real-device-verification.md` before changing platform stability claims.

For CI or machines without Codex local state, use:

```bash
npm run check:compat -- --no-state
```

If a real-device verifier has no local Codex state yet, record that limitation in the Platform verification issue. Treat `npm run check:compat -- --no-state` as supplemental fixture evidence, not as stateful Codex verification for platform graduation.
