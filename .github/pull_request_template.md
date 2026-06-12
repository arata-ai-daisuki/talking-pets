## Summary

- 

## Checks

- [ ] `npm ci`
- [ ] `npm run check:all`
- [ ] `npm run test:dry-run` when touching monitor extraction, rollout fixtures, or public evidence commands
- [ ] `npm run check:compat` on a machine with local Codex state when touching Codex log compatibility or release evidence
- [ ] `npm run check:installers` when touching `install.command`, `install.ps1`, `install.sh`, or runtime config keys
- [ ] `npm run check:platform-scripts` when touching `.command`, `.sh`, `.ps1`, or Swift launcher scripts
- [ ] `npm run check:swift-cli` when touching the Swift monitor CLI or macOS stable monitor behavior
- [ ] `npm run check:pack` when touching package metadata, docs/assets included in releases, or npm tarball scope
- [ ] `npm run check:release` when touching public docs, issue templates, release gates, or packaged artifacts
- [ ] `npm run check:sanitize` when touching public-output redaction, issue templates, release evidence, or sanitizer examples
- [ ] `./check.command` on macOS when touching install, monitor, TTS, or Codex log behavior
- [ ] `npm run check:audio:strict` on a real machine when claiming audio playback support

## Documentation

- [ ] Updated `README.md` and `README.en.md` together for user-facing behavior changes
- [ ] Checked `docs/release-doc-sync-matrix.md` when changing public wording, release evidence, platform status, provider claims, or issue intake
- [ ] Checked `docs/pr-preflight-kit.md` for claim strength, private evidence, scope drift, and verification mismatch
- [ ] Updated `CHANGELOG.md` for release-visible changes
- [ ] Updated `implementation-notes.md` for judgment calls, compromises, or public-facing behavior changes
- [ ] Updated `docs/verification-status.md` when verification state, release gates, or platform status changed

## Safety

- [ ] No Codex Desktop patching or signed app bundle modification
- [ ] No bundled VOICEVOX app, Kokoro model files, downloaded model files, generated audio, local recordings, archives, macOS metadata, local env files, local Codex logs, private rollout JSONL, or local SQLite DBs such as `state_5.sqlite`
- [ ] Custom TTS endpoint behavior is documented if conversation text may leave the machine

## Real-Device Evidence

- [ ] Not needed for this change
- [ ] Recorded with `docs/real-device-verification.md`
- [ ] Evidence includes install, platform check, dry-run, and one audible TTS command output
- [ ] Evidence includes TTS path tested, speech-language value, config source, and Codex Desktop / CLI version if known
- [ ] Linked from a sanitized Platform verification issue for release notes
- [ ] Public evidence sanitization is confirmed as `sanitized: yes` before linking from release notes
- [ ] Platform status changes use only evidence with `audible: yes` and one spoken line; follow-up reports are not counted as graduation evidence
- [ ] CI-only, fixture-only, `--no-state`, and package-check output are treated as release gates, not Windows / Linux graduation evidence
