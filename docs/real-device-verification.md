# Real Device Verification

Use this page when graduating a platform from experimental or preparing a release note. CI can prove syntax, dry-run extraction, and command availability. Real audio still needs a person on the target OS.

If the verification is done by a contributor or on another machine, capture it with the GitHub "Platform verification" issue template so the result can be linked from release notes. The issue must confirm that public evidence was sanitized before it is linked.

When preparing a GitHub Release, copy the sanitized Platform verification issue URL into the `Evidence link` column in `docs/release-notes-template.md`.

Reports with `Public evidence sanitized? = No` or `Was one spoken line audible? = No` are useful follow-up data, but they do not count as release evidence for graduating Windows or Linux from experimental.

CI, fixture rollouts, `npm run check:compat -- --no-state`, and sanitized dry-run output prove packaging, parser, and public-log safety. They do not prove real-device audio or stateful Codex compatibility on Windows or Linux, and they must not be used by themselves to graduate a platform.

For latency reports, include generated audio duration when possible. Real-time factor, or RTF, is `synthesis time / audio duration`. RTF below `1.0x` means synthesis finished faster than the produced audio duration. RTF above `1.0x` means synthesis took longer than the audio duration.

When reading a generated latency table, compare `total` for user-visible elapsed time, `synthesis` for engine generation time, `audioDuration` for produced WAV length, and `rtf` for whether synthesis is faster or slower than the generated audio. Treat rows without `audioDuration` or `rtf` as partial latency evidence.

When pasting latency results into a Platform verification issue, use the generated Markdown table shape below. Replace the placeholder values with the sanitized table from `npm run latency:table`; do not treat these placeholders as benchmark data.

| run | provider | total | synthesis | audioDuration | rtf | success | play |
| --- | --- | --- | --- | --- | --- | --- | --- |
| warm-1 | voicevox | `<generated>` | `<generated>` | `<generated>` | `<generated>` | true | false |
| warm-2 | voicevox | `<generated>` | `<generated>` | `<generated>` | `<generated>` | true | false |
| warm-3 | voicevox | `<generated>` | `<generated>` | `<generated>` | `<generated>` | true | false |

## Minimal Multilingual Report Form

Use this compact form when someone only has time to report Korean, Chinese, or another fallback-language check. It is intentionally shorter than a full platform graduation report. It helps maintainers separate fallback evidence from future dedicated-provider evidence.

```text
Talking Pets multilingual check

- OS/version:
- Device / CPU architecture:
- Node.js / npm:
- TTS path tested: OS speech / VOICEVOX / Irodori / Kokoro / other:
- Speech language tested: ko / zh / other:
- Source: fixture name or short public test sentence:
- Detected or forced speech-language value:
- Chosen provider/path:
- Was one spoken line audible: yes/no:
- Evidence type: fallback-only / provider-specific:
- Provider feedback intake needed: yes/no:
- Sanitized command output or latency line:
- Private text, paths, credentials, generated audio, model files removed: yes/no:
- Notes:
```

Rules for this form:

- `OS speech`, `macOS say`, `Windows System.Speech`, and `Linux espeak` are fallback-only evidence.
- Provider-specific evidence must name the provider and version if known.
- Do not attach generated audio unless the exact model and generated-audio terms have already been reviewed.
- Do not change README wording from fallback to dedicated support from this form alone.
- If provider-specific evidence changes a runtime, cache, license, measurement, or platform assumption, summarize it in `docs/research/tts-provider-comparison.md#provider-feedback-intake`.
- If the report includes Korean or Chinese provider-specific evidence, also check the Dedicated Provider Evidence Checklist in `docs/verification-status.md`.

## Minimal Multilingual Test Pack

Use this pack when asking a contributor for a quick Korean or Chinese check. The goal is not to claim dedicated provider support. The goal is to classify the result as `fallback-only` or `provider-specific` and capture enough sanitized evidence to decide what to test next.

### Test sentences

| Language | Short public test sentence | Evidence type expected |
| --- | --- | --- |
| Korean | `안녕하세요. Talking Pets 다국어 확인입니다.` | `fallback-only` unless a named Korean-capable provider is used. |
| Simplified Chinese | `你好。这是 Talking Pets 的多语言检查。` | `fallback-only` unless a named Chinese-capable provider is used. |
| Traditional Chinese | `你好。這是 Talking Pets 的多語言檢查。` | `fallback-only` unless a named Chinese-capable provider is used. |

### Quick commands

Run the dry-run routing check first. This proves language detection and provider selection without generating audio:

```bash
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ko-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-traditional-rollout.jsonl
```

Then run one audible check using the contributor's existing local TTS path. If the contributor only has OS speech, record it as `fallback-only`. If they use a named local provider such as MeloTTS, Piper-like, or another multilingual TTS runtime, record it as `provider-specific` and include the provider name/version if known.

### What to paste into the issue

Copy the Minimal Multilingual Report Form above and fill it with:

- the language tested
- fallback-only or provider-specific
- chosen provider/path
- one sanitized routing line or latency line
- whether one spoken line was audible
- device/OS and Node/npm versions
- whether the result should also become a provider feedback intake row

Do not attach generated audio, private logs, local paths, model files, downloaded dictionaries, credentials, or private Codex text.

## Multilingual Evidence Handling Order

Use this order when a contributor shares Korean, Chinese, or another fallback-language result:

1. Record the sanitized public Platform verification issue URL first.
2. Classify the report as `fallback-only` or `provider-specific`.
3. If it is fallback-only, keep README wording as OS speech fallback and record only follow-up notes.
4. If it is provider-specific, check the Dedicated Provider Evidence Checklist in `docs/verification-status.md`.
5. If the report changes runtime, cache, license, measurement, or platform assumptions, copy only a one-sentence technical summary into `docs/research/tts-provider-comparison.md#provider-feedback-intake`.
6. Change README support wording only after the checklist is complete and the sanitized issue is linked from `docs/verification-status.md`.

Do not wait on outside replies before continuing safe internal work. Missing or partial reports should stay as intake/follow-up evidence, not as a blocker.

### Multilingual Evidence Intake Queue

Use this queue before editing README wording or provider docs. It keeps quick fallback reports separate from provider-specific evidence.

| Incoming evidence | First record | Copy to provider feedback? | Next action |
| --- | --- | --- | --- |
| OS speech fallback with Korean/Chinese text and one audible line | Platform verification issue plus `docs/verification-status.md` as fallback routing/audio evidence. | No, unless the report includes provider setup guidance. | Keep README wording as OS speech fallback. |
| Named local TTS provider with Korean/Chinese text and audible result | Platform verification issue plus Dedicated Provider Evidence Checklist. | Yes, only one technical sentence if runtime/cache/license/measurement/platform assumptions change. | Keep README wording unchanged until the checklist is complete. |
| Provider setup advice without an audible run | Search Review Log or Provider Feedback Intake, depending on whether it changes a provider assumption. | Yes, if it affects a design note or stop line. | Treat as design input, not verification evidence. |
| Private or unsanitized report | No repo details until Master approves a short summary. | Only after Master approves `private summary approved by Master`. | Ask for a sanitized public issue if evidence is needed. |

Do not attach generated audio, private logs, screenshots with local paths, model files, local env files, or private contact details.

### Multilingual Verification Watch Snapshot

Checked: 2026-06-05. Issues #23-#26 are still open with 0 public comments, so no new multilingual evidence is ready to classify.

| Surface | Current state | Action |
| --- | --- | --- |
| Minimal Multilingual Report Form | Ready for Korean, Chinese, or other fallback-language reports. | Keep using it for quick sanitized reports. |
| Multilingual Evidence Intake Queue | Ready to split `fallback-only`, `provider-specific`, provider advice, and private/unsanitized reports. | Do not change README wording from queue entries alone. |
| Dedicated Provider Evidence Checklist | Ready only when a named local TTS provider report arrives. | Leave Korean/Chinese wording as fallback-only until checklist evidence exists. |

Safe internal work may continue while waiting for reports. Missing comments on #23-#26 are not a blocker and are not evidence for stronger provider claims.

### Multilingual Verification Follow-Up Snapshot

Rechecked: 2026-06-05. The public verification issues are still open with 0 comments:

| Issue | Follow-up state | Intake result |
| --- | --- | --- |
| [#23 Linux audible TTS](https://github.com/arata-ai-daisuki/talking-pets/issues/23) | Open, no public reply. | Nothing to classify. |
| [#24 Windows audible TTS](https://github.com/arata-ai-daisuki/talking-pets/issues/24) | Open, no public reply. | Nothing to classify. |
| [#25 Irodori latency](https://github.com/arata-ai-daisuki/talking-pets/issues/25) | Open, no public reply. | No provider-specific multilingual evidence. |
| [#26 VOICEVOX latency](https://github.com/arata-ai-daisuki/talking-pets/issues/26) | Open, no public reply. | No provider-specific multilingual evidence. |

Keep using the Minimal Multilingual Report Form for quick reports. Do not change README wording from fallback-only to dedicated provider support until a sanitized public issue supplies provider-specific evidence and the verification checklist is complete.

### Multilingual Verification Later Watch

Rechecked: 2026-06-05. Issues #23-#26 are still open with 0 comments. There is no new fallback-only or provider-specific multilingual report to route.

| Surface | Current state | Action |
| --- | --- | --- |
| Minimal Multilingual Report Form | Ready. | Keep using it for quick sanitized reports. |
| Multilingual Evidence Intake Queue | Ready. | Keep separating fallback-only, provider-specific, provider advice, and private/unsanitized reports. |
| Dedicated Provider Evidence Checklist | Waiting for a named provider-specific report. | Do not change Korean/Chinese wording until the checklist is complete. |

Missing reports are not blockers and are not evidence for stronger support wording.

### Multilingual Verification Next Watch

Rechecked: 2026-06-05. Issues #23-#26 are still open with 0 comments. There is no new fallback-only or provider-specific multilingual report to route.

| Surface | Current state | Action |
| --- | --- | --- |
| Minimal Multilingual Report Form | Ready. | Keep using it for quick sanitized reports. |
| Multilingual Evidence Intake Queue | Ready. | Keep separating fallback-only, provider-specific, provider advice, and private/unsanitized reports. |
| Dedicated Provider Evidence Checklist | Waiting for a named provider-specific report. | Do not change Korean/Chinese wording until the checklist is complete. |

Missing reports are not blockers and are not evidence for stronger support wording.

### Multilingual Verification Follow-Up Watch

Rechecked: 2026-06-05. Issues #23-#26 are still open with 0 comments. There is no new fallback-only or provider-specific multilingual report to route.

| Surface | Current state | Action |
| --- | --- | --- |
| Minimal Multilingual Report Form | Ready. | Keep using it for quick sanitized reports. |
| Multilingual Evidence Intake Queue | Ready. | Keep separating fallback-only, provider-specific, provider advice, and private/unsanitized reports. |
| Dedicated Provider Evidence Checklist | Waiting for a named provider-specific report. | Do not change Korean/Chinese wording until the checklist is complete. |

Missing reports are not blockers and are not evidence for stronger support wording.

### Multilingual Verification Next Cycle Watch

Rechecked: 2026-06-05. Issues #23-#26 remain open with 0 comments and no new multilingual report to route.

| Surface | Current state | Action |
| --- | --- | --- |
| Minimal Multilingual Report Form | Ready. | Keep using it for quick sanitized Korean, Chinese, or fallback-language reports. |
| Multilingual Evidence Intake Queue | Ready. | Keep separating fallback-only, provider-specific, provider advice, and private/unsanitized reports. |
| Dedicated Provider Evidence Checklist | Waiting for a named provider-specific report. | Do not change Korean/Chinese wording until the checklist is complete. |

Missing reports are not blockers and are not evidence for stronger support wording.

### Multilingual Verification Cycle Refresh

Rechecked: 2026-06-05. Issues #23-#26 remain open with 0 comments and no new fallback-only or provider-specific multilingual report to route.

| Surface | Current state | Action |
| --- | --- | --- |
| Minimal Multilingual Report Form | Ready. | Keep using it for quick sanitized Korean, Chinese, or fallback-language reports. |
| Multilingual Evidence Intake Queue | Ready. | Keep separating fallback-only, provider-specific, provider advice, and private/unsanitized reports. |
| Dedicated Provider Evidence Checklist | Waiting for a named provider-specific report. | Do not change Korean/Chinese wording until the checklist is complete. |

Missing reports are not blockers and are not evidence for stronger support wording.

### Multilingual Verification Cycle Watch Result

Rechecked: 2026-06-05. Issues #23-#26 remain open with 0 comments and no new fallback-only or provider-specific multilingual report to route.

| Surface | Current state | Action |
| --- | --- | --- |
| Minimal Multilingual Report Form | Ready. | Keep using it for quick sanitized Korean, Chinese, or fallback-language reports. |
| Multilingual Evidence Intake Queue | Ready. | Keep separating fallback-only, provider-specific, provider advice, and private/unsanitized reports. |
| Dedicated Provider Evidence Checklist | Waiting for a named provider-specific report. | Do not change Korean/Chinese wording until the checklist is complete. |

Missing reports are not blockers and are not evidence for stronger support wording.

### Multilingual Intake Routing Matrix

Use this matrix after the first classification:

| Incoming report | Record in | Do not do |
| --- | --- | --- |
| `fallback-only` with OS speech and one audible line | Platform verification issue and `docs/verification-status.md` as routing/audio evidence. | Do not change README wording to dedicated provider support. |
| `provider-specific` with a named local TTS path and audible result | Platform verification issue, `docs/verification-status.md`, and the Dedicated Provider Evidence Checklist. | Do not skip license/cache/runtime review. |
| Provider advice about runtime, cache, license, measurement, or platform behavior | One-sentence technical summary in `docs/research/tts-provider-comparison.md#provider-feedback-intake`. | Do not paste private messages, full threads, generated audio, or contact details. |
| Partial, missing, or unclear report | Follow-up notes only, plus a request for the Minimal Multilingual Report Form if appropriate. | Do not treat it as evidence for public support wording. |

## Quick Contributor Request

When asking someone else to verify Windows or Linux, send them this short checklist:

1. Run the matching OS command block below, including install, check, dry-run, and one audible TTS command.
2. Sanitize every command output you plan to paste publicly with the matching `npm run sanitize:public-output` pipe example.
3. Open a GitHub "Platform verification" issue.
4. Paste sanitized command output, mark whether one spoken line was audible, and include the speech-language value plus config source.
5. If anything failed or audio was not audible, still open the issue as follow-up evidence; it just does not count toward platform graduation.

Copy-paste request:

```text
Could you verify Talking Pets on a real Windows or Linux device?

Please run the matching OS command block in docs/real-device-verification.md, including install, check, dry-run, and one audible TTS command. Before pasting any output publicly, pipe each command output through npm run sanitize:public-output and manually review it for private paths, conversation text, local env values, credentials, local SQLite DBs, private rollout JSONL, generated audio, recordings, archives, macOS metadata, and downloaded model files.

Then open a GitHub "Platform verification" issue and include OS/version, CPU architecture, Node.js and npm versions, Codex Desktop or CLI version if known, TTS path tested, speech-language value, config source, sanitized command output, whether one spoken line was audible, and any limitation such as no local Codex state yet.

Only evidence marked audible: yes and sanitized: yes can be used to graduate Windows or Linux from experimental. Failed or inaudible reports are still useful follow-up reports.
```

## Irodori Latency Contribution

Irodori-TTS Server performance is expected to vary a lot by device and settings. Please treat each report as one data point, not a universal benchmark.

When asking someone to test Irodori, use this short request:

```text
Could you help measure Irodori-TTS Server latency for Talking Pets?

Please start Irodori-TTS-Server locally, run the health check, run one warm-up synthesis, then run the same short synthesis 3 times after the runtime is loaded. Open a GitHub "Platform verification" issue and paste sanitized results.

Please include device specs, OS/version, CPU/GPU, RAM, Node/npm versions, Irodori backend/device if known, whether the run was CPU/MPS/CUDA/ROCm, cold-start time, warm synthesis times, output audio duration, and whether generated speech was audible. Do not attach generated audio, model files, private paths, local env files, private rollout JSONL, or conversation text.
```

Suggested commands after Irodori-TTS-Server is listening on `http://127.0.0.1:8088`:

```bash
npm run tts:irodori -- --health --url http://127.0.0.1:8088 --profile-latency
npm run tts:irodori -- --url http://127.0.0.1:8088 --voice none --model irodori-tts --format wav --text "こんにちは。これはウォームアップです。" --out /tmp/talking-pets-irodori-warmup.wav --profile-latency
npm run tts:irodori -- --url http://127.0.0.1:8088 --voice none --model irodori-tts --format wav --text "こんにちは。Talking Petsのウォーム測定です。" --out /tmp/talking-pets-irodori-warm-1.wav --profile-latency
npm run tts:irodori -- --url http://127.0.0.1:8088 --voice none --model irodori-tts --format wav --text "こんにちは。Talking Petsのウォーム測定です。" --out /tmp/talking-pets-irodori-warm-2.wav --profile-latency
npm run tts:irodori -- --url http://127.0.0.1:8088 --voice none --model irodori-tts --format wav --text "こんにちは。Talking Petsのウォーム測定です。" --out /tmp/talking-pets-irodori-warm-3.wav --profile-latency
```

To make a compact table, copy only the sanitized `[latency]` lines into a text file and run:

```bash
npm run latency:table -- /tmp/talking-pets-irodori-latency-lines.txt
```

For spreadsheet import, maintainers can also generate CSV from the same sanitized lines:

```bash
npm run latency:table -- --format csv /tmp/talking-pets-irodori-latency-lines.txt
```

Record:

- Device model:
- CPU / GPU:
- RAM:
- OS and version:
- Node.js and npm versions:
- Irodori backend/device if known: CPU, MPS, CUDA, ROCm, or unknown:
- Irodori settings changed from defaults: `speed`, `num_steps`, precision, reference voice, preload, or none:
- Health latency:
- Cold start or warm-up latency:
- Warm synthesis run 1:
- Warm synthesis run 2:
- Warm synthesis run 3:
- Output audio duration:
- Derived RTF, if known:
- Was generated speech audible:
- Notes:

Maintainer reference result from one local test machine:

- Device: MacBook Air, Apple M1, 8 CPU cores, 7-core Apple M1 GPU, 8 GB RAM
- OS: macOS 26.5.1 / arm64
- Node.js / npm: v24.2.0 / 11.6.4
- Irodori backend observed in server log: MPS, fp32
- Health: 49.8ms
- Warm-up with runtime load: 33.4s client-side, 33.17s server-side
- Warm synthesis runs: 16.7s, 10.1s, 9.6s
- Output audio duration: about 3.92s

## VOICEVOX Latency Contribution

VOICEVOX performance also varies by device, engine version, speaker, and whether playback is included. Please treat each report as one data point.

When asking someone to test VOICEVOX, use this short request:

```text
Could you help measure VOICEVOX latency for Talking Pets?

Please start VOICEVOX Engine locally, run a voice list or health check, then run the same short synthesis 3 times with the engine already running. Open a GitHub "Platform verification" issue and paste sanitized results.

Please include device specs, OS/version, CPU/GPU, RAM, Node/npm versions, VOICEVOX Engine version if known, speaker id/name, endpoint mode, warm synthesis times, output audio duration, whether playback was included, derived RTF if known, and whether generated speech was audible. Do not attach generated audio, private paths, local env files, private rollout JSONL, or conversation text.
```

Suggested commands after VOICEVOX Engine is listening on `http://127.0.0.1:50021`:

```bash
node scripts/tts-voicebox.mjs --mode voicevox --list-voices --url http://127.0.0.1:50021 --profile-latency
node scripts/tts-voicebox.mjs --mode voicevox --speaker 3 --url http://127.0.0.1:50021 --text "こんにちは。Talking Petsのウォーム測定です。" --out /tmp/talking-pets-voicevox-warm-1.wav --profile-latency
node scripts/tts-voicebox.mjs --mode voicevox --speaker 3 --url http://127.0.0.1:50021 --text "こんにちは。Talking Petsのウォーム測定です。" --out /tmp/talking-pets-voicevox-warm-2.wav --profile-latency
node scripts/tts-voicebox.mjs --mode voicevox --speaker 3 --url http://127.0.0.1:50021 --text "こんにちは。Talking Petsのウォーム測定です。" --out /tmp/talking-pets-voicevox-warm-3.wav --profile-latency
```

If WAV duration is readable, the latency line includes `audioDuration` and `rtf`:

```text
[latency] total=1334.3ms audio_query=120.0ms parse_audio_query=1.0ms synthesis=1100.0ms read_audio=1.0ms write_audio=1.0ms audioDuration=3.861333s rtf=0.28x provider=voicevox success=true play=false
```

Paste the sanitized `[latency]` line into the issue. Do not attach generated WAV files.

For three warm runs, copy only the sanitized `[latency]` lines into a text file and run:

```bash
npm run latency:table -- /tmp/talking-pets-voicevox-latency-lines.txt
```

Paste the generated Markdown table into the issue. For spreadsheet import, maintainers can also run:

```bash
npm run latency:table -- --format csv /tmp/talking-pets-voicevox-latency-lines.txt
```

Record:

- Device model:
- CPU / GPU:
- RAM:
- OS and version:
- Node.js and npm versions:
- VOICEVOX Engine version if known:
- Speaker id/name:
- Endpoint mode: `voicevox` or `generic`:
- Warm synthesis run 1:
- Warm synthesis run 2:
- Warm synthesis run 3:
- Output audio duration:
- Playback included: yes/no:
- Derived RTF, if known:
- Was generated speech audible:
- Notes:

## Evidence To Record

- OS and version:
- CPU architecture:
- Node.js version:
- npm version:
- Codex Desktop / CLI version if known:
- TTS path tested: `macOS say`, `Windows OS speech`, `Linux espeak`, `VOICEVOX`, `Kokoro.js`, `Irodori-TTS Server`, `Voicebox-compatible endpoint`, or `Other local TTS`:
- Speech-language value: `auto`, `ja`, `en`, `ko`, `zh`, or `other`:
- Config source: installer default, `.talking-pets.local.env.example`, `presets/examples/<name>.env`, or custom:
- Commands run:
- Sanitization check: confirm private paths, conversation text, local env values, credentials, local SQLite DBs such as `state_5.sqlite`, private rollout JSONL, generated audio, local recordings, archives, macOS metadata, and downloaded model files are not attached publicly. Known public fixture rollout paths may remain visible as evidence.
- Audible result:
- Known limitation or follow-up:

Before sharing command output publicly, run any pasted check, dry-run, installer, or TTS logs through the matching platform sanitizer example:

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

## macOS Stable Path

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

Pass criteria:

- `check:all` passes.
- `check:compat` checks the real local Codex state DB, unless the machine has no Codex state yet and that limitation is recorded.
- `check:runtime` reports `node:sqlite` as ok.
- `check:audio:strict` reports `macOS afplay` and `macOS say` as ok.
- `check:config`, `check:installers`, `check:docs`, `check:platform-scripts`, `check:swift-cli`, `check:pack`, and `check:release` pass.
- `test:dry-run` prints public fixture `[source]` and `[pet]` lines.
- `./install.command` creates `.talking-pets.local.env`, or a documented manual config fallback is recorded.
- `./check.command` uses fixture-only compatibility and dry-run output suitable for public evidence after sanitization.
- If local config is present, the platform check script must not end with `check: failed -> fix .talking-pets.local.env`.
- Dry-run prints both `[source]` and `[pet]`.
- One audible spoken line is heard through `say` or another selected local TTS.
- Public evidence is sanitized before attaching or linking.

## Windows Experimental Path

Run in PowerShell:

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

Pass criteria:

- `check:all` passes.
- `check:compat` checks the real local Codex state DB, unless the machine has no Codex state yet and that limitation is recorded.
- `check:runtime` reports `node:sqlite` as ok.
- `check:audio:strict` reports PowerShell and `System.Speech` as ok.
- `check:config`, `check:installers`, `check:docs`, `check:platform-scripts`, `check:swift-cli`, `check:pack`, and `check:release` pass.
- `test:dry-run` prints public fixture `[source]` and `[pet]` lines.
- `.\install.ps1` creates `.talking-pets.local.env`, or a documented manual config fallback is recorded.
- `.\check.ps1` uses fixture-only compatibility and dry-run output suitable for public evidence after sanitization.
- If local config is present, the platform check script must not end with `check: failed -> fix .talking-pets.local.env`.
- Dry-run prints both `[source]` and `[pet]`.
- One audible spoken line is heard through Windows OS speech or another selected local TTS.
- If Korean / Chinese fallback is claimed, the speech-language value and fixture or source text are recorded.
- Public evidence is sanitized before attaching or linking.

## Linux Experimental Path

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

Pass criteria:

- `check:all` passes.
- `check:compat` checks the real local Codex state DB, unless the machine has no Codex state yet and that limitation is recorded.
- `check:runtime` reports `node:sqlite` as ok.
- `check:audio:strict` reports either a WAV player (`aplay`, `paplay`, or `ffplay`) or `espeak` as ok.
- `check:config`, `check:installers`, `check:docs`, `check:platform-scripts`, `check:swift-cli`, `check:pack`, and `check:release` pass.
- `test:dry-run` prints public fixture `[source]` and `[pet]` lines.
- `./install.sh` creates `.talking-pets.local.env`, or the manual `cp presets/examples/privacy-first-say.env .talking-pets.local.env` fallback is recorded.
- `./check.sh` reports runtime, fixture-only compatibility, audio path, config, and fixture dry-run diagnostics.
- If local config is present, the platform check script must not end with `check: failed -> fix .talking-pets.local.env`.
- Dry-run prints both `[source]` and `[pet]`.
- One audible spoken line is heard through `espeak`, Kokoro.js plus a WAV player, VOICEVOX plus a WAV player, or another selected local TTS.
- If Korean / Chinese fallback is claimed, the speech-language value and fixture or source text are recorded.
- Public evidence is sanitized before attaching or linking.

## Release Note Snippet

```text
Verified on:
- macOS: <version>, <arch>, Node.js <version>, npm <version>, Codex: <version|unknown>, TTS: macOS say|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS, speech-language: auto|ja|en|ko|zh|other, config source: <installer default|preset|custom|none>, audible: yes|no, sanitized: yes|no
- Windows: <version>, <arch>, Node.js <version>, npm <version>, Codex: <version|unknown>, TTS: Windows OS speech|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS, speech-language: auto|ja|en|ko|zh|other, config source: <installer default|preset|custom|none>, audible: yes|no, sanitized: yes|no
- Linux: <distro/version>, <arch>, Node.js <version>, npm <version>, Codex: <version|unknown>, TTS: Linux espeak|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS, speech-language: auto|ja|en|ko|zh|other, config source: <installer default|preset|custom|none>, audible: yes|no, sanitized: yes|no

Known limits:
- Windows / Linux remain experimental until OS/version, CPU architecture, Node.js and npm versions, install, platform check, dry-run, one audible TTS path, TTS path tested, speech-language value, config source, Codex Desktop / CLI version if known, `audible: yes`, `sanitized: yes`, and a sanitized Platform verification issue link are recorded on real hardware.
```

## Multilingual Verification Boundary Watch Result

Checked: 2026-06-05

Current public verification issues remain waiting-only:

- #23 Ubuntu audible TTS: open, 0 comments, updated 2026-06-04T05:57:31Z.
- #24 Windows audible TTS: open, 0 comments, updated 2026-06-04T05:57:33Z.
- #25 Irodori latency: open, 0 comments, updated 2026-06-04T05:57:33Z.
- #26 VOICEVOX latency: open, 0 comments, updated 2026-06-04T05:57:34Z.

Korean / Chinese verification remains fallback-only until a sanitized real-device report includes speech-language value, fixture or source text, audible result, platform details, and a public issue link. Do not treat OS fallback as Korean/Chinese dedicated provider support.

## Multilingual Verification Boundary Watch Result 2

Checked: 2026-06-05

Current public verification issues remain waiting-only:

- #23 Ubuntu audible TTS: open, 0 comments, updated 2026-06-04T05:57:31Z.
- #24 Windows audible TTS: open, 0 comments, updated 2026-06-04T05:57:33Z.
- #25 Irodori latency: open, 0 comments, updated 2026-06-04T05:57:33Z.
- #26 VOICEVOX latency: open, 0 comments, updated 2026-06-04T05:57:34Z.

Korean / Chinese verification remains fallback-only until a sanitized real-device report includes speech-language value, fixture or source text, audible result, platform details, and a public issue link. Do not treat OS fallback as Korean/Chinese dedicated provider support.

No generated audio, private rollout, private log, private contact, model download, API call, or README support claim change was made in this watch.

## Multilingual Verification Boundary Watch Result 3

Checked: 2026-06-05.

Current public evidence status:

- #23 Ubuntu audible TTS: API JSON confirmed open, 0 comments, updated 2026-06-04T05:57:31Z.
- #24 Windows audible TTS: API JSON confirmed open, 0 comments, updated 2026-06-04T05:57:33Z.
- #25 Irodori latency: API JSON confirmed open, 0 comments, updated 2026-06-04T05:57:33Z.
- #26 VOICEVOX latency: public HTML fetch succeeded, but API JSON recheck was blocked by the local network/approval boundary in this run. Keep the previous recorded value instead of treating this as new contributor evidence: open, 0 comments, updated 2026-06-04T05:57:34Z.

There is still no new fallback-only or provider-specific multilingual report to route. Keep using the Minimal Multilingual Report Form and Dedicated Provider Evidence Checklist, and do not treat OS fallback as Korean/Chinese dedicated provider support.

No generated audio, private rollout, private log, private contact, model download, API call, or README support claim change was made in this watch.

## Multilingual Verification Boundary Watch Result 4

Checked: 2026-06-05.

Current routing / report boundary:

- Korean, Simplified Chinese, and Traditional Chinese checks remain fallback-only unless a named provider-specific report arrives.
- The Minimal Multilingual Report Form is still the preferred low-friction report shape for Korean, Chinese, and other fallback-language checks.
- The Dedicated Provider Evidence Checklist is still waiting for a named provider-specific report before any public support wording changes.
- GitHub issue API refresh was blocked by the local network / approval boundary in this run, so this watch does not claim new public issue evidence or changed issue state.

There is still no locally recorded fallback-only or provider-specific multilingual report to route. Keep using the Minimal Multilingual Report Form and Dedicated Provider Evidence Checklist, and do not treat OS fallback as Korean/Chinese dedicated provider support.

No generated audio, private rollout, private log, private contact, model download, API call, or README support claim change was made in this watch.

## Multilingual Verification Boundary Watch Result 5

Checked: 2026-06-05.

Current routing / report boundary:

- Korean, Simplified Chinese, and Traditional Chinese checks remain fallback-only unless a named provider-specific report arrives.
- The Minimal Multilingual Report Form is still the preferred low-friction report shape for Korean, Chinese, and other fallback-language checks.
- The Dedicated Provider Evidence Checklist is still waiting for a named provider-specific report before any public support wording changes.
- GitHub issue API refresh was not used in this run, so this watch does not claim new public issue evidence or changed issue state.

There is still no locally recorded fallback-only or provider-specific multilingual report to route. Keep using the Minimal Multilingual Report Form and Dedicated Provider Evidence Checklist, and do not treat OS fallback as Korean/Chinese dedicated provider support.

No generated audio, private rollout, private log, private contact, model download, API call, or README support claim change was made in this watch.

## Multilingual Verification Boundary Watch Result 6

Checked: 2026-06-05.

Current routing / report boundary:

- Korean, Simplified Chinese, and Traditional Chinese checks remain fallback-only unless a named provider-specific report arrives.
- The Minimal Multilingual Report Form remains the low-friction report shape for Korean, Chinese, and other fallback-language checks.
- The Dedicated Provider Evidence Checklist is still waiting for a named provider-specific report before public support wording changes.
- GitHub issue API refresh was blocked by the local approval boundary in this run, so this watch does not claim new public issue evidence or changed issue state.

There is still no locally recorded fallback-only or provider-specific multilingual report to route. Keep using the Minimal Multilingual Report Form and Dedicated Provider Evidence Checklist, and do not treat OS fallback as Korean/Chinese dedicated provider support.

No generated audio, private rollout, private log, private contact, model download, API call, fallback-to-provider wording change, or README support claim change was made in this watch.

## Multilingual Verification Boundary Watch Result 8

Checked: 2026-06-05.

Current routing / report boundary:

- Korean, Simplified Chinese, and Traditional Chinese checks remain fallback-only unless a named provider-specific report arrives.
- The Minimal Multilingual Report Form remains the low-friction report shape for Korean, Chinese, and other fallback-language checks.
- The Dedicated Provider Evidence Checklist is still waiting for a named provider-specific report before public support wording changes.
- GitHub issue API refresh was not used in this run, so this watch does not claim new public issue evidence or changed issue state.

There is still no locally recorded fallback-only or provider-specific multilingual report to route. Keep using the Minimal Multilingual Report Form and Dedicated Provider Evidence Checklist, and do not treat OS fallback as Korean/Chinese dedicated provider support.

No generated audio, private rollout, private log, private contact, model download, API call, fallback-to-provider wording change, or README support claim change was made in this watch.

## Multilingual Verification Boundary Watch Result 7

Checked: 2026-06-05.

Current routing / report boundary:

- Korean, Simplified Chinese, and Traditional Chinese checks remain fallback-only unless a named provider-specific report arrives.
- The Minimal Multilingual Report Form remains the low-friction report shape for Korean, Chinese, and other fallback-language checks.
- The Dedicated Provider Evidence Checklist is still waiting for a named provider-specific report before public support wording changes.
- GitHub issue API refresh was not used in this run, so this watch does not claim new public issue evidence or changed issue state.

There is still no locally recorded fallback-only or provider-specific multilingual report to route. Keep using the Minimal Multilingual Report Form and Dedicated Provider Evidence Checklist, and do not treat OS fallback as Korean/Chinese dedicated provider support.

No generated audio, private rollout, private log, private contact, model download, API call, fallback-to-provider wording change, or README support claim change was made in this watch.

## Multilingual Verification Boundary Watch Result 9

Checked: 2026-06-05.

Current routing / report boundary:

- Korean, Simplified Chinese, and Traditional Chinese checks remain fallback-only unless a named provider-specific report arrives.
- The Minimal Multilingual Report Form remains the low-friction report shape for Korean, Chinese, and other fallback-language checks.
- The Dedicated Provider Evidence Checklist is still waiting for a named provider-specific report before public support wording changes.
- GitHub issue API refresh was not used in this run, so this watch does not claim new public issue evidence or changed issue state.

There is still no locally recorded fallback-only or provider-specific multilingual report to route. Keep using the Minimal Multilingual Report Form and Dedicated Provider Evidence Checklist, and do not treat OS fallback as Korean/Chinese dedicated provider support.

No generated audio, private rollout, private log, private contact, model download, API call, fallback-to-provider wording change, or README support claim change was made in this watch.

## Multilingual Verification Boundary Watch Result 10

Checked: 2026-06-05.

Current routing / report boundary:

- Korean, Simplified Chinese, and Traditional Chinese checks remain fallback-only unless a named provider-specific report arrives.
- The Minimal Multilingual Report Form remains the low-friction report shape for Korean, Chinese, and other fallback-language checks.
- The Dedicated Provider Evidence Checklist is still waiting for a named provider-specific report before public support wording changes.
- GitHub issue API refresh was not used in this run, so this watch does not claim new public issue evidence or changed issue state.

There is still no locally recorded fallback-only or provider-specific multilingual report to route. Keep using the Minimal Multilingual Report Form and Dedicated Provider Evidence Checklist, and do not treat OS fallback as Korean/Chinese dedicated provider support.

No generated audio, private rollout, private log, private contact, model download, API call, fallback-to-provider wording change, or README support claim change was made in this watch.
