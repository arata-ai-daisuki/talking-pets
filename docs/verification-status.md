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
- VOICEVOX Engine was also tested later after startup with speaker 3 as an optional local TTS path.
- `./check.command` uses fixture-only compatibility and prints public-friendly dry-run output.
- Stateful dry-run can read the latest local Codex assistant message.
- Stateful dry-run output includes the local thread title, rollout path, and conversation text, so it is local verification only and must not be pasted publicly without sanitization and manual review.
- A macOS `say` fixture TTS command is recorded as the current audible local TTS evidence for the release draft.

## Multilingual Routing Evidence Boundary

Current fixture diagnostics prove routing decisions only. They do not prove dedicated Korean or Chinese TTS provider support, real-device audio quality, or first audible speech timing.

| Fixture | Detected / effective language | Chosen engine | Evidence boundary |
| --- | --- | --- | --- |
| `test/fixtures/ja-rollout.jsonl` | `ja` / `ja` | `voicevox` | Routing only; requires a running VOICEVOX Engine for audible TTS. |
| `test/fixtures/en-rollout.jsonl` | `en` / `en` | `kokoro` | Routing only; Kokoro first use may need model download. |
| `test/fixtures/ko-rollout.jsonl` | `ko` / `ko` | `say` | OS speech fallback, not dedicated Korean provider support. |
| `test/fixtures/zh-rollout.jsonl` | `zh` / `zh` | `say` | OS speech fallback, not dedicated Chinese provider support. |
| `test/fixtures/zh-traditional-rollout.jsonl` | `zh` / `zh` | `say` | OS speech fallback, not dedicated Traditional Chinese provider support. |
| `test/fixtures/symbol-only-rollout.jsonl` | `other` / `other` | `say` | Fallback message path for non-language text. |

Before changing public wording from "fallback" to dedicated Korean or Chinese support, collect sanitized real-device evidence with a provider-specific TTS path, one audible spoken line, OS/version, speech-language value, and config source. Fixture-only routing diagnostics are useful release gates, but they are not enough for that claim.

When a Platform verification issue includes Korean or Chinese testing, use the optional multilingual fallback field to record the source text or fixture, detected or forced speech-language value, chosen TTS path, audible result, and whether the evidence is fallback-only or provider-specific. This keeps `ko` / `zh` fallback evidence separate from future dedicated-provider evidence.

For quick contributor replies, use the [Minimal Multilingual Report Form](real-device-verification.md#minimal-multilingual-report-form). It is enough for intake and triage, but it does not by itself graduate fallback language wording to dedicated provider support.

If the reply includes provider-specific guidance, such as runtime setup, model cache behavior, license notes, platform friction, or which latency metric matters, also copy a one-sentence technical summary into [Provider Feedback Intake](https://github.com/arata-ai-daisuki/talking-pets/blob/main/docs/research/tts-provider-comparison.md#provider-feedback-intake). Keep the public verification issue as evidence and do not paste private messages or generated audio.

### Multilingual Evidence Handling Order

When a Korean, Chinese, or other fallback-language report arrives:

1. Link the sanitized Platform verification issue before copying details into this status file.
2. Mark the evidence as `fallback-only` or `provider-specific`.
3. Keep `fallback-only` reports as routing/audio evidence only; do not use them for dedicated provider support wording.
4. For `provider-specific` reports, run the Dedicated Provider Evidence Checklist below.
5. Copy only technical provider guidance into Provider Feedback Intake when it changes runtime, cache, license, measurement, or platform assumptions.
6. Update README support wording only after the checklist is complete and the verification-status row links to the sanitized issue.

For quick triage, use the [Multilingual Evidence Intake Queue](real-device-verification.md#multilingual-evidence-intake-queue) before deciding whether a report belongs in verification status, provider feedback, or follow-up notes.

### Multilingual Verification Watch Snapshot

Checked: 2026-06-05. Public issue check found no new multilingual evidence to classify:

| Issue | State | Comments | Updated | Multilingual impact |
| --- | --- | ---: | --- | --- |
| [#23 Linux audible TTS](https://github.com/arata-ai-daisuki/talking-pets/issues/23) | Open | 0 | 2026-06-04T05:57:31Z | No new fallback/provider-specific evidence. |
| [#24 Windows audible TTS](https://github.com/arata-ai-daisuki/talking-pets/issues/24) | Open | 0 | 2026-06-04T05:57:33Z | No new fallback/provider-specific evidence. |
| [#25 Irodori latency](https://github.com/arata-ai-daisuki/talking-pets/issues/25) | Open | 0 | 2026-06-04T05:57:33Z | No new provider-specific multilingual evidence. |
| [#26 VOICEVOX latency](https://github.com/arata-ai-daisuki/talking-pets/issues/26) | Open | 0 | 2026-06-04T05:57:34Z | No new provider-specific multilingual evidence. |

Result: keep Korean/Chinese and other fallback-language wording as OS speech fallback. Do not change README, provider comparison, or release wording from this watch.

### Multilingual Verification Follow-Up Snapshot

Rechecked: 2026-06-05. Issues #23-#26 remain open with 0 public comments, so there is still no new fallback-only or provider-specific multilingual evidence to classify.

| Issue | Current result | Claim impact |
| --- | --- | --- |
| [#23 Linux audible TTS](https://github.com/arata-ai-daisuki/talking-pets/issues/23) | Open, 0 comments, updated 2026-06-04T05:57:31Z. | No multilingual claim change. |
| [#24 Windows audible TTS](https://github.com/arata-ai-daisuki/talking-pets/issues/24) | Open, 0 comments, updated 2026-06-04T05:57:33Z. | No multilingual claim change. |
| [#25 Irodori latency](https://github.com/arata-ai-daisuki/talking-pets/issues/25) | Open, 0 comments, updated 2026-06-04T05:57:33Z. | No provider-specific multilingual claim change. |
| [#26 VOICEVOX latency](https://github.com/arata-ai-daisuki/talking-pets/issues/26) | Open, 0 comments, updated 2026-06-04T05:57:34Z. | No provider-specific multilingual claim change. |

Decision: keep the Minimal Multilingual Report Form and Evidence Intake Queue as the active intake path. Korean, Chinese, and other fallback-language wording remains OS speech fallback until a sanitized public issue completes the provider-specific checklist below.

### Multilingual Verification Later Watch

Rechecked: 2026-06-05. The public issue check still shows no new multilingual evidence:

| Issue | Current result | Intake decision |
| --- | --- | --- |
| [#23 Linux audible TTS](https://github.com/arata-ai-daisuki/talking-pets/issues/23) | Open, 0 comments, updated 2026-06-04T05:57:31Z. | Nothing to classify. |
| [#24 Windows audible TTS](https://github.com/arata-ai-daisuki/talking-pets/issues/24) | Open, 0 comments, updated 2026-06-04T05:57:33Z. | Nothing to classify. |
| [#25 Irodori latency](https://github.com/arata-ai-daisuki/talking-pets/issues/25) | Open, 0 comments, updated 2026-06-04T05:57:33Z. | No provider-specific multilingual evidence. |
| [#26 VOICEVOX latency](https://github.com/arata-ai-daisuki/talking-pets/issues/26) | Open, 0 comments, updated 2026-06-04T05:57:34Z. | No provider-specific multilingual evidence. |

Decision: keep multilingual support wording at OS speech fallback. Do not change README, release notes, provider comparison, or platform status from this later watch.

### Multilingual Verification Next Watch

Rechecked: 2026-06-05. The public issue check still shows no new multilingual evidence:

| Issue | Current result | Intake decision |
| --- | --- | --- |
| [#23 Linux audible TTS](https://github.com/arata-ai-daisuki/talking-pets/issues/23) | Open, 0 comments, updated 2026-06-04T05:57:31Z. | Nothing to classify. |
| [#24 Windows audible TTS](https://github.com/arata-ai-daisuki/talking-pets/issues/24) | Open, 0 comments, updated 2026-06-04T05:57:33Z. | Nothing to classify. |
| [#25 Irodori latency](https://github.com/arata-ai-daisuki/talking-pets/issues/25) | Open, 0 comments, updated 2026-06-04T05:57:33Z. | No provider-specific multilingual evidence. |
| [#26 VOICEVOX latency](https://github.com/arata-ai-daisuki/talking-pets/issues/26) | Open, 0 comments, updated 2026-06-04T05:57:34Z. | No provider-specific multilingual evidence. |

Decision: keep multilingual support wording at OS speech fallback. Do not change README, release notes, provider comparison, or platform status from this next watch.

### Multilingual Verification Follow-Up Watch

Rechecked: 2026-06-05. The public issue check still shows no new multilingual evidence after the next watch:

| Issue | Current result | Intake decision |
| --- | --- | --- |
| [#23 Linux audible TTS](https://github.com/arata-ai-daisuki/talking-pets/issues/23) | Open, 0 comments, updated 2026-06-04T05:57:31Z. | Nothing to classify. |
| [#24 Windows audible TTS](https://github.com/arata-ai-daisuki/talking-pets/issues/24) | Open, 0 comments, updated 2026-06-04T05:57:33Z. | Nothing to classify. |
| [#25 Irodori latency](https://github.com/arata-ai-daisuki/talking-pets/issues/25) | Open, 0 comments, updated 2026-06-04T05:57:33Z. | No provider-specific multilingual evidence. |
| [#26 VOICEVOX latency](https://github.com/arata-ai-daisuki/talking-pets/issues/26) | Open, 0 comments, updated 2026-06-04T05:57:34Z. | No provider-specific multilingual evidence. |

Decision: keep multilingual support wording at OS speech fallback. Do not change README, release notes, provider comparison, platform status, or Korean/Chinese dedicated-provider wording from this follow-up watch.

### Multilingual Intake Routing Matrix

| Evidence type | Verification status entry | Provider Feedback Intake | README wording |
| --- | --- | --- | --- |
| `fallback-only` OS speech | Record as routing/audio evidence with source text, speech-language, chosen fallback path, OS/device, and audible result. | Not needed unless the report also includes provider design guidance. | Keep OS speech fallback wording. |
| `provider-specific` local TTS | Record only after the public issue links a named provider path and audible result. | Add one sentence only if runtime, cache, license, measurement, or platform assumptions change. | Do not change until the checklist below is complete. |
| Private or unsanitized feedback | Do not paste details. Ask for a sanitized public issue or Master-approved summary. | Use `private summary approved by Master` only when needed. | No wording change. |
| Partial report | Keep as follow-up evidence and ask for missing fields. | Not needed until it changes a provider assumption. | No wording change. |

### Dedicated Provider Evidence Checklist

Use this checklist before changing Korean, Chinese, or any other fallback language from "OS speech fallback" to "dedicated provider support":

- The issue uses a provider-specific TTS path, not `macOS say`, `Windows System.Speech`, or `Linux espeak`.
- The contributor records the source text or fixture, detected or forced speech-language value, provider name, provider version if known, OS/version, CPU architecture, config source, and whether one spoken line was audible.
- The evidence includes sanitized command output or `[latency]` lines with no private Codex text, credentials, generated audio attachments, or local private file paths.
- Any provider-specific guidance that changes runtime, cache, license, measurement, or platform assumptions is summarized in Provider Feedback Intake before README wording changes.
- The provider is already represented by a design note or a supported helper, and any dependency, model, cache, license, privacy, or billing boundary is documented.
- The verification-status row links to the sanitized Platform verification issue before README wording changes.

If any item is missing, keep the wording as fallback-only evidence.

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

## VOICEVOX Latency Snapshot

VOICEVOX was measured with a locally running engine and speaker 3. These numbers are maintainer-environment examples, not universal VOICEVOX performance claims.

- `list_voices`: 76.2ms
- Warm synthesis totals without playback: 1388.6ms, 2206.6ms, 1334.3ms
- Output audio duration for warm runs: 3.861333s
- Playback-included short run: total 5693.8ms, synthesis 1127.8ms, play 4398.6ms
- Output audio duration for playback-included run: 3.210667s

The playback-included `total` waits for playback to finish, so it is not the same as time to first audible speech.

## Release Evidence Draft

Use this as the starting point for the macOS row in `docs/release-notes-template.md`:

- macOS: `macOS 26.5 / arm64 / Node.js v24.2.0 / npm 11.6.4 / Codex CLI: 0.135.0 / TTS: macOS say / speech-language: auto / config source: none (.talking-pets.local.env absent) / audible: yes / sanitized: yes`

Use these row templates only after a sanitized Platform verification issue passes the review in "When Evidence Arrives":

- Windows: `<version> / <arch> / Node.js <version> / npm <version> / Codex: <version|unknown> / TTS: Windows OS speech|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS / speech-language: auto|ja|en|ko|zh|other / config source: <installer default|preset|custom|none> / audible: yes / sanitized: yes / Evidence link: <Platform verification issue>`
- Linux: `<distro/version> / <arch> / Node.js <version> / npm <version> / Codex: <version|unknown> / TTS: Linux espeak|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS / speech-language: auto|ja|en|ko|zh|other / config source: <installer default|preset|custom|none> / audible: yes / sanitized: yes / Evidence link: <Platform verification issue>`

## Release Proof Package Index

Use this index before changing README support wording or preparing a GitHub Release. It points to the public proof sources without adding new support claims.

| Proof area | Source | Use for release proof | Claim boundary |
| --- | --- | --- | --- |
| Current platform status | [Current Snapshot](#current-snapshot) | Show which OS/provider rows are verified, partial, or waiting. | Do not treat waiting rows as verified. |
| External verification issues | [External Verification Intake](#external-verification-intake) | Link sanitized contributor evidence from Issue #23-#26 when it arrives. | No README support change until required evidence is present. |
| Real-device command format | [Real Device Verification](real-device-verification.md) | Ask testers for install, check, dry-run, audible TTS, and sanitized output. | CI and fixture-only checks do not graduate Windows/Linux. |
| Multilingual evidence | [Multilingual Evidence Handling Order](#multilingual-evidence-handling-order) | Separate fallback-only evidence from provider-specific evidence. | Korean/Chinese fallback is not dedicated provider support. |
| Provider latency data | [Maintainer RTF Snapshot](https://github.com/arata-ai-daisuki/talking-pets/blob/main/docs/research/tts-provider-comparison.md#maintainer-real-time-factor-snapshot) | Share maintainer measurements as reference data. | VOICEVOX/Irodori numbers are not performance guarantees. |
| Release note rows | [Release Notes Template](release-notes-template.md) | Copy only rows backed by sanitized evidence links. | Do not paste private logs, generated audio, model files, or local paths. |

## External Verification Intake

Use these open issues to collect post-release evidence. Do not mark any row as verified until the linked issue has sanitized evidence that passes the review in "When Evidence Arrives".

### Issue Watch Snapshot

Checked: 2026-06-05. No maintainer reply or claim change is needed from this snapshot.

Later watch: 2026-06-05. Issues #23-#26 are still open with 0 public comments, and their latest `updatedAt` timestamps remain 2026-06-04. No README, platform status, or provider performance wording should change from this later watch.

| Issue | Current state | Public comments | Watch result |
| --- | --- | ---: | --- |
| [#23 Linux audible TTS](https://github.com/arata-ai-daisuki/talking-pets/issues/23) | Open | 0 | Waiting for contributor evidence. |
| [#24 Windows audible TTS](https://github.com/arata-ai-daisuki/talking-pets/issues/24) | Open | 0 | Waiting for contributor evidence. |
| [#25 Irodori latency](https://github.com/arata-ai-daisuki/talking-pets/issues/25) | Open | 0 | Waiting for contributor evidence. |
| [#26 VOICEVOX latency](https://github.com/arata-ai-daisuki/talking-pets/issues/26) | Open | 0 | Waiting for contributor evidence. |

Do not change Windows/Linux experimental wording, VOICEVOX/Irodori performance wording, or README support wording until a sanitized public issue includes the required evidence below.

| Track | Issue | Current status | Required before using as evidence |
| --- | --- | --- | --- |
| Windows audible TTS | [#24](https://github.com/arata-ai-daisuki/talking-pets/issues/24) | Waiting for contributor evidence | Windows version, CPU architecture, Node.js/npm versions, TTS path, install/check/dry-run/audible command output, `audible: yes`, `sanitized: yes` |
| Linux audible TTS | [#23](https://github.com/arata-ai-daisuki/talking-pets/issues/23) | Waiting for contributor evidence | distro/version, CPU architecture, Node.js/npm versions, audio command or TTS path, install/check/dry-run/audible command output, `audible: yes`, `sanitized: yes` |
| Irodori latency | [#25](https://github.com/arata-ai-daisuki/talking-pets/issues/25) | Waiting for contributor evidence | device, CPU/GPU/backend, Irodori server version if known, cold/warm state, synthesis timing, playback-included flag, audio duration, derived RTF if known, sanitized output |
| VOICEVOX latency | [#26](https://github.com/arata-ai-daisuki/talking-pets/issues/26) | Waiting for contributor evidence | OS/device, VOICEVOX version if known, speaker id/name, warm synthesis runs, playback-included flag, audio duration, derived RTF if known, sanitized output |

VOICEVOX and Irodori reports should be treated as contributor reference results, not universal performance claims.

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
