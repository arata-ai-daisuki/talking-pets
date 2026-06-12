# Verification Matrix

Last updated: 2026-06-12

This matrix tells maintainers which checks can run as routine local proof, which checks need real local state or real devices, and which checks must stay opt-in.

Use it before changing monitor extraction, installer behavior, TTS providers, release evidence, or public documentation.

## Boundary Terms

| Term | Meaning | Public evidence status |
| --- | --- | --- |
| Fixture check | Uses committed test fixtures only. | Safe to share after normal review. |
| Stateful local check | Reads local Codex state, rollout JSONL, or local workspace paths. | Local proof only; sanitize before sharing. |
| Audible real-device check | Plays actual TTS on a named OS/device. | Counts for platform evidence when sanitized and audible. |
| Sandbox-sensitive check | May fail in restricted environments because of localhost listen, npm cache, Swift cache, or registry access. | Re-run outside the sandbox only when needed. |
| Opt-in external check | May contact external runtimes, local servers, or remote APIs. | Requires explicit command and matching docs boundary. |

## Routine Local Proof

Run these first for most PRs.

| Change type | Commands | What it proves | Boundary |
| --- | --- | --- | --- |
| JavaScript or script wiring | `npm run check:syntax` and `npm test` | Source parses and unit tests pass. | Fixture/local only. |
| Monitor extraction or fixture behavior | `npm run test:dry-run` | The fixture monitor path still emits expected dry-run output. | No audio playback. |
| Docs or links | `npm run check:docs` | Local Markdown links resolve. | Does not prove package inclusion. |
| Public package scope | `npm run check:pack` | The npm package allowlist does not include private or internal artifacts. | Uses a temporary npm cache. |
| Release readiness wording | `npm run check:release` | Required public release guidance still exists. | Text guard only. |
| Public log redaction | `npm run check:sanitize` | Sanitizer smoke sample still redacts expected private patterns. | Still requires manual review for real logs. |

## Stateful Or Real-Device Proof

Use these when a PR changes local Codex integration, installer behavior, audio behavior, or platform claims.

| Scenario | Commands | What it proves | Boundary |
| --- | --- | --- | --- |
| Codex local state compatibility | `npm run check:compat` | Current local Codex state shape is readable. | May reveal local paths or thread context. |
| CI or machine without Codex state | `npm run check:compat -- --no-state` | Fixture compatibility still passes without local Codex state. | Supplemental only; not stateful proof. |
| macOS platform check | `./check.command` | Config, runtime, fixture compat, audio path, and dry-run path report. | Sanitize before public issue use. |
| Windows platform check | `.\check.ps1` | Windows entrypoint reports platform diagnostics. | Real Windows evidence required for graduation. |
| Linux platform check | `./check.sh` | Linux entrypoint reports platform diagnostics. | Real Linux evidence required for graduation. |
| Audible macOS TTS | `./scripts/pet-rollout-monitor.command --tts say --voice Kyoko --once --rollout test/fixtures/assistant-rollout.jsonl` | At least one spoken line is audible through macOS `say`. | Counts only for the tested OS/TTS path. |

## Sandbox-Sensitive Checks

These are valid checks, but they can be blocked by the execution environment rather than by the code change.

| Check | Why it can fail in a sandbox | Clean fallback |
| --- | --- | --- |
| `npm ci` | Registry access or npm cache permissions. | Re-run in a normal local shell and record Node.js/npm versions. |
| `npm run check:all` | It includes npm, Swift, package, compat, audio, and dry-run checks. | Run targeted checks first, then re-run full check outside sandbox if cache or network blocks it. |
| Localhost TTS smoke tests | The test may need to listen on a local port. | Keep a fixture/unit test for payload shape, then run localhost smoke outside sandbox when required. |
| Swift CLI checks | Swift module cache writes may be blocked. | Set a temp module cache path or run outside sandbox with the same command. |

## Opt-In External Boundaries

| Path | Allowed default? | Required proof before stronger claim |
| --- | --- | --- |
| OpenAI-compatible local TTS endpoint | No automatic routing. Manual `--tts openai-compatible-local` only. | Localhost-only URL, payload smoke test, and no API key requirement. |
| Remote OpenAI TTS API | No. Requires `--api-opt-in` and `OPENAI_API_KEY`. | Explicit user opt-in, no secret storage, billing/privacy note, and sanitized output. |
| VOICEVOX / Voicebox / Irodori runtime | No automatic install. User-managed runtime. | Runtime availability, audible result, config source, and sanitized evidence. |
| Kokoro model path | Manual or documented provider path. | Model download boundary and local cache behavior documented. |
| Uninstall automation | No destructive automation. Dry-run only. | Exact paths, rollback, and explicit user confirmation before any future deletion. |

## PR Verification Recipe

For a normal code PR:

```bash
npm run check:syntax
npm test
npm run test:dry-run
npm run check:docs
```

For provider, installer, release, or evidence PRs:

```bash
npm run check:all
npm run maintenance:plan -- --update --dry-run
npm run maintenance:plan -- --uninstall --dry-run
npm run check:sanitize
```

If `npm run check:all` fails because of cache, registry, localhost, or Swift module cache restrictions, record the failing environment boundary and re-run the same command in a normal local shell before treating it as a code failure.

Before pasting any stateful local output into a public issue:

```bash
./check.command 2>&1 | npm run sanitize:public-output
```

Then review the result manually. Sanitizer output is a helper, not a guarantee.
