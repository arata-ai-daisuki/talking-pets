# TTS Provider Comparison

Last updated: 2026-06-05

This is a prep-only comparison for Talking Pets. No package was installed, no model was downloaded, no API key was used, and no paid API call was made for this note.

## Decision For The Next Step

Do not chase a new provider implementation yet.

First, make the measurement shape consistent:

- `health`: endpoint or local helper readiness check
- `cold start`: first model load, first engine startup, or first synthesis after a clean start
- `warm synthesis`: repeated synthesis after the runtime is ready
- `audio duration`: generated speech duration
- `real-time factor`: synthesis time divided by audio duration, when available
- `playback start`: time until audible playback begins, when tested
- `setup friction`: install, engine start, model cache, license, and platform notes

## Measurement Rubric

Use the same rubric for every provider before changing README claims or default routing.

| Field | Meaning | Required before public claim |
| --- | --- | --- |
| `health` | Endpoint, CLI, helper, or OS voice path is reachable. | Yes |
| `cold start` | First startup, first model load, or first synthesis after a clean start. | Yes for model-based providers |
| `warm synthesis` | Repeated synthesis after runtime is ready. | Yes |
| `audio duration` | Duration of generated speech. | Yes for generated WAV paths |
| `real-time factor` | `warm synthesis / audio duration`, when both values exist. | Recommended |
| `playback included` | Whether total time waits for playback completion. | Yes |
| `first audible speech` | Time until sound starts, if measurable. | Optional until tooling supports it |
| `setup friction` | Install, model cache, engine start, license, and platform notes. | Yes |
| `privacy boundary` | Whether text stays local or leaves the machine. | Yes |

Do not compare `playback-included total` against synthesis-only totals. A playback-included value often grows with the length of the spoken audio, so it is useful for user-perceived completion time but not for generation speed.

## Readiness Levels

| Level | Meaning | Allowed public wording |
| --- | --- | --- |
| L0 design-only | Package, license, or model shape is still being researched. | "Candidate", "under review" |
| L1 supported helper | Helper exists, but broad real-device evidence is still missing. | "Optional", "experimental" |
| L2 maintainer measured | Maintainer has a sanitized local measurement. | "Maintainer reference result" |
| L3 contributor verified | At least one external sanitized report exists. | "Verified on one contributor machine" |
| L4 default candidate | Multiple OS/device results support a default path. | "Candidate for default routing" |

Current provider claims should stay at L1-L2 unless contributor evidence arrives through a sanitized issue.

## Current Candidates

| Priority | Provider | Role | Readiness | Strength | Main Risk | Next Safe Action |
| --- | --- | --- | --- | --- | --- | --- |
| P0 | VOICEVOX / Voicebox-compatible endpoint | Japanese local TTS baseline | L2 maintainer measured | Mature local Japanese voice path; already supported through voicebox helper | Requires a running local engine; voice and license notices must stay clear | Collect L3 contributor data through issue #26 |
| P0 | macOS `say` / OS speech fallback | No-extra-install baseline | L2 maintainer measured | Fast setup, useful control sample, no model download | Voice quality and language coverage vary by OS | Keep as control sample, not quality benchmark |
| P1 | Kokoro.js | English local TTS | L1 supported helper | Already has helper and profile output; useful for English demo path | First run may download/load a model; warm mode may need process reuse | Ask before model download; otherwise keep on hold |
| P1 | Irodori-TTS Server | Japanese-oriented local server / OpenAI-compatible API | L2 maintainer measured | High-quality local Japanese candidate; now has health and contribution docs | Cold start and warm synthesis were slow on the maintainer M1 test device | Collect L3 contributor data through issue #25 |
| P2 | sherpa-onnx-node | Future local ONNX provider | L0 design-only | Cross-platform package looks promising from design notes | Needs dependency, model, vocoder, tokens, espeak data, and license confirmation | Stay design-only until Master approves dependency/model experiment |
| P2 | API TTS | Optional cloud or remote fallback | L0 design-only | Can be fast and high quality on good networks | Privacy, cost, API key management, and local-first positioning | Keep opt-in only; do not implement by default; see `docs/research/api-tts-design-note.md` |

## Measurement Text

Use short, boring sentences so provider comparisons are less about prompt content and more about runtime behavior.

Japanese:

```text
こんにちは。Talking Petsのウォーム測定です。
```

English:

```text
Hello. This is a warm latency test for Talking Pets.
```

## What To Record

For each provider, record:

- device model
- OS and version
- CPU / GPU / accelerator path
- RAM
- Node.js and npm versions
- provider version or engine version
- exact command
- cold or warm state
- generated audio duration
- `health`, `cold start`, `warm synthesis`, `write`, and `play` timings where available
- whether speech was audible
- sanitized evidence link, if shared publicly

## Stop Lines

Stop and ask before:

- adding a dependency
- downloading a model
- calling an external API
- using an API key
- making a paid API call
- recommending a model or voice with unclear license terms

## Recommended Order

1. Keep VOICEVOX and Irodori public wording at maintainer-reference level until issues #25 and #26 receive sanitized contributor evidence.
2. Ask Master before Kokoro model download if Kokoro cold/warm measurement is still desired.
3. Keep sherpa-onnx-node and API TTS as explicit opt-in design work.
4. Use the readiness levels above before changing README claims or default routing.

## Provider Experiment Scorecard

Use this scorecard before asking Master to approve a provider experiment. It is a planning tool, not a public ranking.

Score each field from 0 to 2:

- `0`: unknown, risky, or does not fit Talking Pets yet
- `1`: plausible, but needs design or evidence
- `2`: clear enough for a small optional experiment

| Field | What to check | Pass signal |
| --- | --- | --- |
| Local-first fit | Text stays on the machine unless the user explicitly enables a remote/API endpoint. | Local by default, or remote path has privacy/billing warnings. |
| Optional install | Normal `npm ci`, `npm run check:all`, and npm pack checks pass when the provider is absent. | Provider can be skipped cleanly. |
| Model/cache boundary | Model, dictionary, and voice downloads are explicit and cached outside the repo. | No automatic model download during normal monitor runs. |
| License clarity | Package, model, voice, vocoder, and generated-audio terms are known enough to document. | `CREDITS.md` can be updated before public support wording. |
| Measurement shape | Helper can emit health, cold/warm synthesis, audio duration, RTF when possible, playback flag, and sanitized `[latency]` lines. | Output can be compared with the current rubric. |
| Platform confidence | Supported OS/architecture list and unverified platforms are clear. | README can avoid overclaiming Windows/macOS/Linux support. |
| User value | Provider improves a real gap: language, quality, setup simplicity, or latency. | The experiment has a concrete reason beyond "another TTS". |

Suggested decision:

| Total | Decision | Allowed next action |
| --- | --- | --- |
| 0-6 | Hold | Keep research-only; do not add code or README support wording. |
| 7-10 | Design note | Write or update a provider-specific design note. |
| 11-14 | Experiment candidate | Ask Master before a small optional helper PR. |

Current planning read:

| Provider | Provisional score | Lane | Evidence gap | Approval gate before code | Safe next action |
| --- | ---: | --- | --- | --- | --- |
| VOICEVOX / Voicebox-compatible endpoint | 12/14 | Evidence-first | External issue #26 contributor latency and audible reports. | Broader README wording, default routing, or universal performance wording. | Keep asking for sanitized reports; no new provider code needed. |
| Irodori-TTS Server | 11/14 | Evidence-first | External issue #25 contributor CPU/GPU/backend reports and warm/cold separation. | Any performance claim beyond maintainer-reference wording. | Keep contribution route active and compare only like-for-like latency fields. |
| Kokoro.js | 9/14 | Approval-gated measurement | Cold/warm model-download behavior, cache size/path, and warm-process reuse. | Any run that downloads or loads model cache for measurement. | Write a cache/download measurement plan only. |
| sherpa-onnx-node | 8/14 | Design-only | Exact model/vocoder/tokens/espeak data choice, size, cache root, and license evidence. | Installing dependency, downloading assets, or adding a helper. | Refresh design note questions before asking for an experiment. |
| MeloTTS | 7/14 | Design-only / external-runtime | CLI/server/Docker path, dictionary/model cache ownership, and multilingual support evidence. | Python/Docker setup, dictionary/model download, generated audio, or support claim. | Expand runtime/cache measurement plan around health-only detect. |
| Piper-like path | 6/14 | Hold / license review | Current package/binary choice, GPL/MIT boundary, voice/model licenses, and cache behavior. | Adding package/binary, model download, or README provider wording. | Keep license/package questions visible; no implementation. |
| API TTS | 5/14 | Later opt-in | Privacy, billing, secret handling, dry-run, and remote audio/cache policy. | API key creation, paid call, remote endpoint call, or default route. | Keep as separate opt-in design path. |

Scorecard refresh result: no candidate should move to implementation from this table alone. VOICEVOX and Irodori need contributor evidence; Kokoro needs explicit model-download approval; sherpa, MeloTTS, Piper, and API TTS stay behind design or approval gates.

### Evidence Gap Question Queue

Use this queue before opening any provider experiment PR. These are design-note questions, not approval to install dependencies, download models, call APIs, or change README support wording.

| Provider | Question to answer next | Where to answer it | Still blocked |
| --- | --- | --- | --- |
| sherpa-onnx-node | Which one named model family, vocoder, token set, and espeak data should a future experiment review first, and what license evidence is needed for each asset? | [Sherpa ONNX design](sherpa-onnx-design.md#b-design-only-scope) | Dependency install, asset download, helper code, README support wording. |
| MeloTTS | Which runtime shape should Talking Pets target first: CLI, local server, Docker, or user-managed Python, and who owns model/dictionary cache cleanup? | [MeloTTS design note](melotts-design-note.md#c-runtime-design-only-scope) | Python/Docker setup, dictionary/model download, generated audio, Korean/Chinese support claim. |
| Piper-like path | Which current binary/package and voice source should be reviewed, and how do GPL/MIT, voice/model, and generated-audio terms affect a helper? | [Piper design note](piper-design-note.md#evidence-gap-questions) | Package install, bundled binary/model, model download, README provider wording. |
| API TTS | Which provider is worth a separate opt-in design note, and how will privacy, billing, credential storage, dry-run, and audio cache policy be proven before any live request? | [API TTS design note](api-tts-design-note.md#evidence-gap-questions) | API key handling, paid call, remote endpoint call, default route, README support wording. |

## Next Provider Decision Card

Use this card when asking Master what provider work should move from planning into an experiment. Choosing an option here does not install packages, download models, call APIs, or change README support wording.

| Option | Best next action | Why now | What stays blocked |
| --- | --- | --- | --- |
| A: keep gathering contributor evidence | Ask for sanitized VOICEVOX and Irodori reports through the existing verification issues. | Highest score, already supported, and improves public claims without new provider risk. | No new provider helper, dependency, or default routing change. |
| B: approve a tiny sherpa-onnx design experiment | Let a future PR inspect the exact optional dependency/model/vocoder plan before code. | Good local-first fit, but still below experiment score because license/model details are unresolved. | No install, model download, or helper until Master approves the exact scope. |
| C: deepen MeloTTS runtime design | Expand the MeloTTS design note around CLI/server/Docker/cache and measurement shape. | High multilingual value, but Python/Docker runtime shape is not npm-native. | No implementation and no Korean/Chinese support claim. |
| D: hold API TTS for later | Keep API TTS as P2 opt-in with privacy/billing boundaries only. | Useful eventually, but it weakens local-first positioning if rushed. | No API key, no paid call, no remote default, no support wording. |

Recommended default: choose A now. Master has also asked to prepare B and C as design-only follow-ups, so the next safe movement is to deepen sherpa and MeloTTS notes without installing dependencies, downloading models, or changing support wording.

### Local TTS Approval-Only Card

Use this card when Master wants to move from design notes toward a real provider experiment. The approval phrase must name the lane. Anything not named stays blocked.

| Approval phrase | Allowed in the next PR | Still not allowed |
| --- | --- | --- |
| "Keep evidence-first." | Update docs, issue asks, and comparison tables for VOICEVOX/Irodori contributor evidence. | New provider code, default routing changes, broad performance claims. |
| "Approve sherpa metadata review only." | Review public package/model/vocoder/license docs and update `sherpa-onnx-design.md`. | Installing `sherpa-onnx-node`, downloading assets, adding helper code. |
| "Approve sherpa optional experiment." | A separate PR may propose optional dependency scope and explicit asset/cache commands. | Auto download, default routing, README support wording, generated audio claims. |
| "Approve MeloTTS external-runtime design only." | Update CLI/server/Docker/cache questions and health-only integration docs. | Python/Docker setup, dictionary/model download, synthesis, Korean/Chinese support claim. |
| "Approve Piper license review only." | Review package/binary/voice/model/generated-audio license and cache questions. | Installing/bundling Piper, model download, helper implementation, support wording. |
| "Approve API TTS provider-specific design only." | Pick one provider for a privacy/billing/secret/dry-run design note. | API key handling, paid call, remote synthesis, generated audio cache, default route. |

If Master's wording is broader than one row, split the work into separate PRs before implementation.

### Local TTS Approval Follow-Up Snapshot

Checked: 2026-06-05. The current safe default is still evidence-first: keep VOICEVOX/Irodori contributor evidence open and do not add another provider path without a named approval lane.

If Master wants the next local TTS movement, ask for exactly one of these choices:

| Choice | What it allows next | What stays blocked | Recommended when |
| --- | --- | --- | --- |
| A: keep evidence-first | Keep using Issue #25/#26 and contributor reports to improve confidence in existing VOICEVOX/Irodori paths. | New provider dependency, model download, helper implementation, README support claim. | We want public proof and low risk. |
| B: approve sherpa metadata review only | Review `sherpa-onnx-node` public package/model/vocoder/license docs and update the sherpa design note. | Installing `sherpa-onnx-node`, downloading assets, adding a helper, generated audio. | We want the most npm-native future local provider candidate. |
| C: approve MeloTTS external-runtime design only | Refine MeloTTS CLI/server/Docker/cache questions around user-managed runtime and health-only detection. | Python/Docker setup, `unidic` or model download, synthesis, Korean/Chinese support wording. | We want multilingual quality research without pulling runtime into normal install. |

Do not treat this snapshot as approval. It only defines the exact wording needed before any dependency, model, API, generated-audio, or support-claim work.

### Local TTS Approval Decision Card

Checked: 2026-06-05. Use this as the current Master-facing decision card. It summarizes the safe next action without treating prior planning as approval.

Recommended answer: **A: keep evidence-first**.

| Choice | What I will do next | Why this is safest now | What remains blocked |
| --- | --- | --- | --- |
| A: keep evidence-first | Continue collecting sanitized VOICEVOX #26 and Irodori #25 reports, and compare contributor latency by device/runtime. | It improves the already-supported optional paths and public proof without adding package, model, or API risk. | New provider code, new dependency, model download, default routing, broad performance claim. |
| B: approve sherpa metadata review only | Update `sherpa-onnx-design.md` from public package/model/vocoder/license docs only. | sherpa remains the most npm-shaped future local candidate, but useful synthesis still depends on explicit model assets. | Installing `sherpa-onnx-node`, downloading model/vocoder/token/espeak data, helper code, audio generation. |
| C: approve MeloTTS external-runtime design only | Refine the user-managed CLI/server/Docker/cache plan around the existing health-only path. | Good multilingual research lane, but Python/Docker/runtime ownership is too heavy for the normal install path. | Python/Docker setup, `unidic` or model download, synthesis, Korean/Chinese support wording. |

Default execution if Master does not choose B or C: continue A and move the HQ board to multilingual verification intake/watch. B and C stay design-only candidates and do not become implementation approval.

### Local TTS Approval Response Watch

Checked: 2026-06-05. No repo-recorded Master approval selects B or C after the current decision card, so the active local TTS lane remains **A: keep evidence-first**.

| Lane | Current decision | Safe next action | Still blocked |
| --- | --- | --- | --- |
| A: VOICEVOX / Irodori evidence-first | Active default. | Keep Issue #25/#26 open for sanitized contributor evidence and compare results by device/runtime only. | Broader performance claims, default routing changes, or support wording changes. |
| B: sherpa metadata review | Waiting for explicit Master approval. | None until the approval names `sherpa metadata review only` or a narrower public-doc review. | Installing `sherpa-onnx-node`, downloading model/vocoder/token/espeak data, helper code, audio generation. |
| C: MeloTTS external-runtime design | Waiting for explicit Master approval. | None until the approval names `MeloTTS external-runtime design only`. | Python/Docker setup, `unidic` or model download, synthesis, Korean/Chinese support wording. |

Do not infer approval from prior design notes. If Master chooses B or C later, open a separate small PR and keep implementation, dependency, model, API, and generated-audio work behind a new gate.

### Local TTS Approval Later Watch

Rechecked: 2026-06-05. No repo-recorded Master approval names `sherpa metadata review only`, `MeloTTS external-runtime design only`, or a narrower B/C scope after the response watch. The local TTS lane therefore stays **A: keep evidence-first**.

| Candidate | Current lane | Allowed now | Not allowed now |
| --- | --- | --- | --- |
| VOICEVOX / Irodori | Evidence-first. | Keep collecting sanitized #25/#26 contributor latency and audible reports. | Stronger performance guarantees, default-route changes, or broad README support wording. |
| sherpa-onnx-node | Approval-gated. | No action until Master explicitly approves a named metadata-review scope. | Install, optional dependency change, model/vocoder/tokens/espeak download, helper code, generated audio. |
| MeloTTS | Approval-gated external-runtime design. | No action until Master explicitly approves a named external-runtime design scope. | Python/Docker setup, `unidic` or model download, synthesis, Korean/Chinese support wording. |

Next safe internal work: return to multilingual verification intake/watch or public proof docs. Do not turn older design notes, optional install history, or health-only detect paths into fresh implementation approval.

### Local TTS Approval Next Watch

Rechecked: 2026-06-05. No repo-recorded Master approval names `sherpa metadata review only`, `MeloTTS external-runtime design only`, or a narrower B/C scope after the later watch. Keep local TTS on **A: keep evidence-first**.

| Lane | Current decision | Continue | Still blocked |
| --- | --- | --- | --- |
| A: VOICEVOX / Irodori evidence-first | Active default. | Keep using issue #25/#26 for sanitized contributor latency and audible evidence. | Universal performance claims, default routing changes, or broader support wording. |
| B: sherpa metadata review | Waiting for explicit Master approval. | No action until the approval names the review scope. | `sherpa-onnx-node` install, optional dependency change, model/vocoder/tokens/espeak download, helper code, generated audio. |
| C: MeloTTS external-runtime design | Waiting for explicit Master approval. | No action until the approval names the external-runtime design scope. | Python/Docker setup, `unidic` or model download, synthesis, Korean/Chinese support wording. |

Do not treat optional install history, existing design notes, or health-only detect/connect paths as implementation approval.

### Local TTS Approval Follow-Up Watch

Next active lane after the outreach waiting follow-up. Recheck the A/B/C approval boundary before any provider implementation work.

| Lane | Current decision | Allowed next | Still blocked |
| --- | --- | --- | --- |
| A: VOICEVOX / Irodori evidence-first | Active default unless Master says otherwise. | Keep comparing sanitized #25/#26 latency and audible reports by device/runtime. | Universal latency claims, default routing changes, or broader README support wording. |
| B: sherpa metadata review | Approval-gated. | Only a named public-doc metadata review if Master explicitly asks for it. | `sherpa-onnx-node` install, optional dependency changes, model/vocoder/tokens/espeak downloads, helper code, generated audio. |
| C: MeloTTS external-runtime design | Approval-gated. | Only a named external-runtime design refinement if Master explicitly asks for it. | Python/Docker setup, `unidic` or model download, synthesis, Korean/Chinese support wording. |

Do not use the outreach waiting period as implicit approval for new provider implementation.

### Local TTS Approval Follow-Up Result

Checked: 2026-06-05. Repo-recorded instructions still do not name `sherpa metadata review only`, `MeloTTS external-runtime design only`, API TTS, or another narrower B/C approval after the follow-up watch. Keep local TTS on **A: VOICEVOX / Irodori evidence-first**.

| Lane | Result | Continue | Do not do |
| --- | --- | --- | --- |
| A: VOICEVOX / Irodori evidence-first | Still active. | Keep #25/#26 open for sanitized contributor latency and audible evidence. | Do not turn one maintainer or one contributor number into a universal performance claim. |
| B: sherpa metadata review | Not approved. | Wait for explicit Master approval that names the public-doc review scope. | Do not install `sherpa-onnx-node`, add optional dependencies, download model/vocoder/token/espeak data, or add helper code. |
| C: MeloTTS external-runtime design | Not approved. | Wait for explicit Master approval that names external-runtime design refinement. | Do not run Python/Docker setup, `unidic` or model download, synthesis, or Korean/Chinese support wording. |
| API TTS | Not approved. | Keep as later opt-in research only. | Do not create API keys, make paid calls, call remote endpoints, or change local-first wording. |

Next safe internal work: return to multilingual verification watch and keep public support wording unchanged unless sanitized evidence arrives.

### Local TTS Approval Next Cycle Result

Checked: 2026-06-05. Repo-recorded instructions still do not name `sherpa metadata review only`, `MeloTTS external-runtime design only`, API TTS, or another narrower B/C approval after the next-cycle watch. Keep local TTS on **A: VOICEVOX / Irodori evidence-first**.

| Lane | Result | Continue | Do not do |
| --- | --- | --- | --- |
| A: VOICEVOX / Irodori evidence-first | Still active. | Keep #25/#26 open for sanitized contributor latency and audible evidence. | Do not turn one maintainer or one contributor number into a universal performance claim. |
| B: sherpa metadata review | Not approved. | Wait for explicit Master approval that names the public-doc review scope. | Do not install `sherpa-onnx-node`, add optional dependencies, download model/vocoder/token/espeak data, or add helper code. |
| C: MeloTTS external-runtime design | Not approved. | Wait for explicit Master approval that names external-runtime design refinement. | Do not run Python/Docker setup, `unidic` or model download, synthesis, or Korean/Chinese support wording. |
| API TTS | Not approved. | Keep as later opt-in research only. | Do not create API keys, make paid calls, call remote endpoints, or change local-first wording. |

Next safe internal work: return to multilingual verification watch and keep public support wording unchanged unless sanitized evidence arrives.

### Local TTS Approval Cycle Refresh

Checked: 2026-06-05. The post-outreach waiting cycle did not add a Master approval that names `sherpa metadata review only`, `MeloTTS external-runtime design only`, API TTS, or a narrower B/C/API scope. Keep local TTS on **A: VOICEVOX / Irodori evidence-first**.

| Lane | Result | Continue | Do not do |
| --- | --- | --- | --- |
| A: VOICEVOX / Irodori evidence-first | Still active. | Keep #25/#26 open for sanitized contributor latency and audible evidence. | Do not turn maintainer-only or unreadable public-page checks into a universal latency/support claim. |
| B: sherpa metadata review | Not approved in this cycle. | Wait for explicit Master approval that names a public-doc metadata scope. | Do not install `sherpa-onnx-node`, add optional dependencies, download model/vocoder/token/espeak data, or add helper code. |
| C: MeloTTS external-runtime design | Not approved in this cycle. | Wait for explicit Master approval that names external-runtime design refinement. | Do not run Python/Docker setup, `unidic` or model download, synthesis, or Korean/Chinese support wording. |
| API TTS | Not approved in this cycle. | Keep as later opt-in research only. | Do not create API keys, make paid calls, call remote endpoints, or change local-first wording. |

Next safe internal work: return to multilingual verification watch and keep public support wording unchanged unless sanitized evidence arrives.

### Local TTS Approval Cycle Watch Result

Checked: 2026-06-05. The current HQ cycle still has no repo-recorded Master approval that names `sherpa metadata review only`, `MeloTTS external-runtime design only`, API TTS, or another B/C/API implementation path. Keep local TTS on **A: VOICEVOX / Irodori evidence-first**.

| Lane | Result | Continue | Do not do |
| --- | --- | --- | --- |
| A: VOICEVOX / Irodori evidence-first | Still active. | Keep #25/#26 open for sanitized contributor latency and audible evidence, and compare results by device/runtime only. | Do not promote maintainer-only numbers into universal speed, quality, or support claims. |
| B: sherpa metadata review | Not approved in this watch. | Wait for explicit Master approval that names a public-doc metadata scope. | Do not install `sherpa-onnx-node`, add optional dependencies, download model/vocoder/token/espeak data, or add helper code. |
| C: MeloTTS external-runtime design | Not approved in this watch. | Wait for explicit Master approval that names external-runtime design refinement. | Do not run Python/Docker setup, `unidic` or model download, synthesis, or Korean/Chinese support wording. |
| API TTS | Not approved in this watch. | Keep as later opt-in research only. | Do not create API keys, make paid calls, call remote endpoints, or change local-first wording. |

Next safe internal work: return to multilingual verification watch and keep Korean/Chinese as OS speech fallback unless sanitized provider-specific evidence arrives.

### Local TTS Approval Boundary Watch Result

Checked: 2026-06-05. The latest outreach watch did not add a Master approval that names `sherpa metadata review only`, `MeloTTS external-runtime design only`, API TTS, or another B/C/API implementation path. Keep local TTS on **A: VOICEVOX / Irodori evidence-first**.

| Lane | Result | Continue | Do not do |
| --- | --- | --- | --- |
| A: VOICEVOX / Irodori evidence-first | Still active. | Keep #25/#26 open for sanitized contributor latency and audible evidence, and compare results by device/runtime only. | Do not promote maintainer-only numbers into universal speed, quality, or support claims. |
| B: sherpa metadata review | Not approved in this boundary watch. | Wait for explicit Master approval that names a public-doc metadata scope. | Do not install `sherpa-onnx-node`, add optional dependencies, download model/vocoder/token/espeak data, or add helper code. |
| C: MeloTTS external-runtime design | Not approved in this boundary watch. | Wait for explicit Master approval that names external-runtime design refinement. | Do not run Python/Docker setup, `unidic` or model download, synthesis, or Korean/Chinese support wording. |
| API TTS | Not approved in this boundary watch. | Keep as later opt-in research only. | Do not create API keys, make paid calls, call remote endpoints, or change local-first wording. |

Next safe internal work: return to multilingual verification watch and keep Korean/Chinese as OS speech fallback unless sanitized provider-specific evidence arrives.

### Local TTS Next Choice Refresh

Checked: 2026-06-05. This refresh incorporates the sherpa optional npm install check, MeloTTS detect/connect-only helper work, provider feedback capture path, and multilingual evidence routes.

Recommended next small PR: **update the Provider Experiment Scorecard with a refreshed decision matrix and evidence gaps**. This is docs-only and keeps all new-provider implementation behind Master approval.

| Candidate | Current lane | Safe next PR | Needs Master approval before | Why |
| --- | --- | --- | --- | --- |
| VOICEVOX / Voicebox-compatible endpoint | Evidence-first | Keep asking for sanitized issue #26 latency and audible reports. | Broader README wording or default-routing claims. | Already implemented; the highest value is contributor evidence, not more code. |
| Irodori-TTS Server | Evidence-first | Keep issue #25 as the main latency contribution route and refine how results are compared. | Any performance claim beyond maintainer-reference wording. | Maintainer numbers exist, but device/config variation is large. |
| Kokoro.js | Hold unless model-download measurement is approved. | Document the cache/download measurement plan only. | Any cold/warm run that downloads or loads a model cache. | Helper exists, but the first-run model boundary is still approval-sensitive. |
| sherpa-onnx-node | Design-only candidate. | Refresh the scorecard and decide the exact model/vocoder/license questions. | Installing dependency, downloading model/vocoder/tokens/espeak data, or adding a helper. | Optional package install was checked separately, but useful synthesis still needs model choices. |
| MeloTTS | Design-only / external-runtime candidate. | Expand runtime/cache measurement plan around the existing health-only detect path. | Python/Docker setup, dictionary/model download, generated audio, or support claim. | Detect/connect-only exists; real synthesis is runtime-heavy and multilingual-claim sensitive. |
| Piper-like path | Hold / license-review candidate. | Keep license/package questions visible in the scorecard. | Adding package/binary, model download, or any README provider wording. | Current maintained route is license-sensitive and per-voice licensing is unresolved. |
| API TTS | Later opt-in path. | Keep privacy/billing/secret gate visible only. | API key creation, paid call, remote endpoint call, or default route. | Useful eventually, but it changes local-first positioning. |

Recommended T186 outcome: mark this refresh done, then open T187 for a **Provider Experiment Scorecard Refresh**. T187 should not install dependencies, download models, call APIs, or change README support wording.

### Local TTS Master Choice Card

Use this when the next action is "Local TTS design" rather than outreach.

Recommended choice: **A: keep gathering VOICEVOX / Irodori contributor evidence**.

| Choice | What happens next | Why choose it | Stop line |
| --- | --- | --- | --- |
| A: evidence-first | Ask for more sanitized VOICEVOX and Irodori reports through issues #25 and #26. | Improves confidence in already-supported optional paths without dependency or model risk. | Do not generalize maintainer numbers into universal performance claims. |
| B: sherpa design-only | Write the exact dependency/model/vocoder/cache/license scope for a future sherpa experiment. | Good local-first fit, but package/model details are still unresolved. | No install, model download, helper, README support wording, or default routing. |
| C: MeloTTS runtime design-only | Expand the MeloTTS note around CLI/server/Docker/cache and measurement shape. | Useful if multilingual quality becomes the next priority. | No Python stack setup, no Korean/Chinese support claim, no generated audio request. |

Default next PR after this card: keep A active for contributor evidence, while B and C may progress as design-only notes because Master explicitly asked for `BC`.

### B/C Design Follow-Up

| Choice | Current status | Evidence |
| --- | --- | --- |
| B: sherpa design-only | Scope refined around optional package review, one named model family, cache root, helper surface, measurement fields, and license review. | [Sherpa ONNX design](sherpa-onnx-design.md#b-design-only-scope) |
| C: MeloTTS runtime design-only | Scope refined around CLI/server/Docker/Python runtime choices, cache ownership, measurement fields, and the no-support-claim stop line. | [MeloTTS design note](melotts-design-note.md#c-runtime-design-only-scope) |

## Next Provider Approval Gate

Use this gate before promoting any new provider candidate from design notes into code. Passing this gate does not mean the provider is supported; it only means a small experimental helper PR is safe to consider.

| Gate | Required answer before implementation |
| --- | --- |
| Dependency boundary | Is the npm package or binary optional, and can the normal install/check path run without it? |
| Model boundary | Are model downloads explicit, user-approved, cached outside the repo, and skipped during normal monitor runs? |
| License boundary | Are package, model, vocoder, voice, and generated-audio terms known enough to document in `CREDITS.md` if chosen? |
| Privacy boundary | Does the provider keep text local by default, or is any network/API path clearly opt-in with billing and privacy warnings? |
| Platform boundary | Which OS/architecture combinations are expected to work, and which are explicitly unverified? |
| Measurement boundary | Can the helper emit `health`, cold or warm synthesis timing, audio duration, RTF when possible, playback flag, and sanitized `[latency]` output? |
| Public wording boundary | Can README wording stay at "experimental" or "candidate" until sanitized contributor evidence arrives? |

Recommended T144 outcome: keep sherpa-onnx-node as the first design-only local provider to evaluate after approval, keep API TTS separate as an opt-in cloud/remote path, and do not add Piper/Melo/other multilingual providers until their package shape, model size, language coverage, and license terms have a matching design note.

## Multilingual Provider Research Cards

Use these cards before adding Piper, Melo, or another multilingual local TTS provider to `Current Candidates`. These are research placeholders, not support claims.

| Candidate family | Why to research | Required proof before shortlist | Stop line |
| --- | --- | --- | --- |
| Piper-like lightweight local TTS | Potentially small, offline-friendly fallback for languages beyond Japanese and English | Current package or binary shape, supported OS/architectures, exact model source, model size, language list, license terms, and a no-download helper sketch | Stop if model license, voice license, or platform packaging is unclear. |
| Melo-like multilingual neural TTS | Potential quality path for broader multilingual voices | Current install path, runtime requirements, model cache policy, supported languages, license terms, and whether Node can call it without a broad provider abstraction | Stop if setup requires a large Python/runtime stack that cannot remain clearly optional. |
| Other local multilingual TTS | Captures community suggestions without overfitting to a named provider | Public project link, offline behavior, supported languages, model size, license, integration surface, and expected latency measurement shape | Stop if it needs cloud inference, unknown redistribution rights, or normal install-path changes. |

For every research card, record:

- public source URL and checked date
- package/binary name and version, if known
- supported languages and whether Korean / Chinese are first-class or fallback only
- model and voice license notes
- model size and cache location
- install/runtime requirements
- expected command shape for a future helper
- whether `npm run check:all` can remain green without the provider installed
- which Platform verification issue fields would collect contributor evidence

Do not add README support wording, default routing, dependencies, install prompts, or model downloads from a research card alone.

## Multilingual Candidate Public Info Snapshot

Checked: 2026-06-04. This snapshot used public project pages only. No dependency was installed, no model was downloaded, no API key was used, and no audio was generated.

| Candidate | Public source checked | Observed fit | Main unresolved risk | Next safe action |
| --- | --- | --- | --- | --- |
| Piper / `piper-tts` | `rhasspy/piper` archive and `OHF-Voice/piper1-gpl` current repo | Fast local TTS shape; current repo documents `pip install piper-tts`, embedded `espeak-ng`, CLI/web/Python API surfaces | Project moved from archived MIT repo to current GPL-3.0 repo; voice/model licenses and bundling implications need exact per-voice review | Keep design-only; if revisited, write a Piper-specific license/cache/package note before any dependency PR |
| MeloTTS | `myshell-ai/MeloTTS` repo and install docs | Multi-lingual library with English, Spanish, French, Chinese, Japanese, and Korean examples; MIT repo license; CLI and Python API exist | Python-first install, `python -m unidic download`, Docker suggestion for Windows/macOS, and model cache behavior need opt-in design before local-first use | Keep as candidate for multilingual quality research; require a no-normal-install helper sketch before implementation |

Source URLs:

- `https://github.com/rhasspy/piper`
- `https://github.com/OHF-Voice/piper1-gpl`
- `https://github.com/myshell-ai/MeloTTS`
- `https://github.com/myshell-ai/MeloTTS/blob/main/docs/install.md`

Do not add either candidate to default routing from this snapshot. Treat Piper as license-sensitive because the current maintained repo is GPL-3.0, and treat MeloTTS as runtime-sensitive because the published install path is Python/Docker oriented.

### Piper License And Packaging Boundary

Checked: 2026-06-04. Public pages show two Piper lines that must not be mixed together:

- `rhasspy/piper` is archived and marked MIT, with its README pointing to `OHF-Voice/piper1-gpl`.
- `OHF-Voice/piper1-gpl` is the current maintained repo seen in this check, marked GPL-3.0, and documents `pip install piper-tts`.
- PyPI has a `piper-tts` package page, but this note did not inspect wheel contents, bundled libraries, model download behavior, or per-voice license files.

Talking Pets should therefore not add Piper as a dependency, optional dependency, installer choice, default route, or README-supported provider until a Piper-specific design note answers:

- Which package or binary would be used: current `piper-tts`, archived MIT source, external user-installed binary, or another route.
- Whether GPL-3.0 obligations are compatible with the intended distribution path.
- Whether each selected voice/model has a clear license and attribution requirement.
- Whether models are user-approved downloads cached outside the repo.
- Whether normal `npm ci`, `npm run check:all`, and package checks stay green when Piper is absent.
- Whether the first helper can shell out to a user-installed binary instead of bundling Piper.

Safe next action: keep Piper as a license-review candidate only. If Master wants to continue, create a Piper-specific design note before any install, helper, or README wording change.

Design note: `docs/research/piper-design-note.md`

### MeloTTS Runtime And Cache Boundary

Checked: 2026-06-04. Public pages show MeloTTS is promising for multilingual quality, but its runtime shape does not fit the normal npm-only Talking Pets path yet:

- The repository is marked MIT and lists English, Spanish, French, Chinese, Japanese, and Korean examples.
- The local install doc says the repo was developed and tested on Ubuntu 20.04 and Python 3.9.
- The local install path is `git clone`, `pip install -e .`, then `python -m unidic download`.
- The docs suggest Docker for Windows users and some macOS users.
- The CLI can write WAV files through `melo` / `melotts`, and the Python API supports CPU/CUDA/MPS-style device choices.
- The requirements list includes Python/Torch/audio/NLP dependencies such as `torch`, `torchaudio`, `cached_path`, `transformers`, `unidic`, `mecab-python3`, `librosa`, `gradio`, and language-specific G2P packages.

Talking Pets should therefore not add MeloTTS as a dependency, installer prompt, default route, or README-supported provider until a MeloTTS-specific design note answers:

- Whether Talking Pets would call a user-installed `melo` CLI, a user-started local server, Docker, or a Python helper.
- Where MeloTTS downloads or caches model and dictionary files, including `unidic`.
- Whether the first Talking Pets integration can remain no-normal-install and fail cleanly when MeloTTS is absent.
- Whether model/license notices beyond the repo MIT license are needed for the exact selected voices.
- Whether Windows/macOS Docker guidance is acceptable for a local-first optional provider.
- Whether `health`, cold start, warm synthesis, audio duration, RTF, and playback flag can be measured without a broad provider abstraction.

Safe next action: keep MeloTTS as a runtime-review candidate only. If Master wants to continue, create a MeloTTS-specific opt-in external CLI/server design note before any install, helper, or README wording change.

Design note: `docs/research/melotts-design-note.md`

## Provider Feedback Intake

Use this table when someone replies to the provider feedback ask. Record only public or voluntarily shared technical guidance; do not collect private contact details or generated audio files.

Multilingual intake rule: fallback-only OS speech reports stay in verification status as routing/audio evidence. Add a Provider Feedback Intake row only when the report changes a provider assumption such as runtime setup, cache ownership, license, measurement shape, or platform friction.

Outreach reply rule: do not copy simple acknowledgements, likes, or general encouragement into this table. Use it only when the reply changes a provider decision or measurement assumption.

| Date | Source | Provider | Feedback Area | Evidence Summary | Decision Impact | Follow-Up |
| --- | --- | --- | --- | --- | --- | --- |
|  | Public URL or `private summary approved by Master` | Piper / MeloTTS / sherpa-onnx / other | license / runtime / cache / measurement / platform | One-sentence technical summary only | keep design-only / update design note / ask Master / no action | Link to Search Review Log row or next note |

Classification rules:

- `license`: package, model, voice, generated audio, attribution, or redistribution terms.
- `runtime`: Python, Docker, server, CLI, OS support, GPU/CPU/MPS/CUDA, or normal install impact.
- `cache`: model, dictionary, voice, or downloaded asset location and cleanup behavior.
- `measurement`: cold start, warm synthesis, audio duration, RTF, playback flag, or contributor evidence shape.
- `platform`: Windows, macOS, Linux, architecture, or device-specific friction.

Decision impact rules:

- `keep design-only`: feedback is useful context but does not resolve dependency, model, license, cache, and platform boundaries.
- `update design note`: feedback changes a known boundary, adds a public source, or narrows a future helper surface.
- `ask Master`: feedback suggests dependency install, model download, API use, generated audio review, or public support wording.
- `no action`: feedback is promotional, private without approved summary, unrelated, or too vague to affect a provider decision.

Do not change README provider claims from feedback alone. First convert meaningful feedback into a provider-specific design note, then ask Master before dependency, model, or implementation work.

Use `docs/research/provider-design-note-template.md` for the provider-specific note so every candidate answers the same dependency, model, cache, license, privacy, platform, measurement, and README wording questions before implementation.

## Maintainer Real-Time Factor Snapshot

These numbers are maintainer reference data only. They are useful for comparing the shape of current local TTS paths, but they are not public performance guarantees.

| Provider | Device | Warm synthesis | Audio duration | Derived RTF | Notes |
| --- | --- | --- | --- | --- | --- |
| VOICEVOX / voicebox helper | Maintainer machine, local engine already running | 1388.6ms, 2206.6ms, 1334.3ms | 3.861333s | 0.36x, 0.57x, 0.35x | Generation-only comparison. Playback-included total is tracked separately. |
| VOICEVOX / voicebox helper | Maintainer machine, local engine already running | 1127.8ms | 3.210667s | 0.35x | Short playback-included run; RTF uses synthesis only. |
| Irodori-TTS Server | Maintainer M1 reference device | 16.7s, 10.1s, 9.6s | about 3.92s | 4.26x, 2.58x, 2.45x | Warm synthesis was slower than real time on this device. Collect contributor CPU/GPU data before judging the provider. |

RTF below `1.0x` means synthesis finished faster than the produced audio duration. RTF above `1.0x` means synthesis took longer than the audio duration.

## Maintainer Control Sample

macOS `say` via the Node monitor:

```text
[latency] total=440.1ms resolveThread=0.1ms readLatestSpeechCandidate=1.0ms speechText=1.0ms speak=434.9ms candidate=true dryRun=false thread=true
```

This is not a quality benchmark. It is a no-extra-install response-time control sample.

VOICEVOX via the voicebox helper, speaker 3, with a locally running engine:

```text
list_voices total=76.2ms
warm synthesis totals=1388.6ms, 2206.6ms, 1334.3ms
output audio duration=3.861333s
playback-included total=5693.8ms
playback-included synthesis=1127.8ms
playback-included audio duration=3.210667s
```

This is a running-engine benchmark on one maintainer machine, not a universal VOICEVOX claim.

Kokoro status:

```text
no local ~/.cache/talking-pets/transformers cache found
```

Do not measure Kokoro cold start without explicit approval for model download.

### Local TTS Boundary Watch Result

Checked: 2026-06-05.

Current boundary remains unchanged:

- VOICEVOX / Voicebox-compatible endpoint: keep as evidence-first. Existing maintainer measurements are useful reference data, but broader public wording still needs sanitized contributor evidence through issue #26.
- Irodori-TTS Server: keep as evidence-first. Existing maintainer M1 measurements show provider shape, not universal performance. Contributor CPU/GPU/backend evidence is still expected through issue #25.
- Kokoro.js: keep supported helper wording, but do not run cold-start measurement without explicit model-download approval.
- sherpa-onnx-node: keep design-only. Do not install the dependency, download models/assets, or add helper code from current docs alone.
- MeloTTS: keep design-only / external-runtime. Health-only detect/connect remains the boundary; do not run Python/Docker/model/unidic setup or generate audio.
- API TTS: keep later opt-in. Do not create API keys, make paid calls, call remote endpoints, or change default routing.

No dependency install, model download, API call, generated audio, README support claim change, latency guarantee claim, platform support claim, or default routing change was made in this watch.

### Local TTS Boundary Watch Result 2

Checked: 2026-06-05.

The T237 recheck keeps the same boundary:

- VOICEVOX / Voicebox-compatible endpoint: still evidence-first. Keep issue #26 as the route for sanitized contributor latency and audible reports before broadening public wording.
- Irodori-TTS Server: still evidence-first. Keep issue #25 as the route for contributor CPU/GPU/backend reports; the maintainer M1 result remains reference data, not a universal claim.
- Kokoro.js: keep the helper available, but do not run cold-start or cache measurement without explicit model-download approval.
- sherpa-onnx-node: keep design-only. The previous optional npm/package information does not approve dependency changes, helper code, model/vocoder/token/espeak downloads, or generated audio.
- MeloTTS: keep design-only / external-runtime. Health-only detect/connect remains the current boundary; no Python/Docker/model/unidic setup or synthesis.
- API TTS: keep later opt-in. No API key creation, remote endpoint call, paid call, default route, or support claim change.

No install, dependency change, model download, API call, generated audio, README support claim change, latency guarantee claim, platform support claim, or default routing change was made in this watch.

### Local TTS Boundary Watch Result 7

Checked: 2026-06-05.

The T252 recheck keeps the same boundary after outreach wait-state maintenance:

- VOICEVOX / Voicebox-compatible endpoint: still evidence-first. Keep issue #26 and sanitized contributor latency/audibility reports as the proof path before broadening public wording.
- Irodori-TTS Server: still evidence-first. Keep issue #25 and contributor CPU/GPU/backend reports as the proof path, because maintainer measurements are reference data only.
- Kokoro.js: helper remains available, but cold-start/cache measurement still needs explicit model-download approval.
- sherpa-onnx-node: still design-only. Do not treat prior package research or npm-install-only checks as approval for dependency changes, optional dependency changes, model/vocoder/token/espeak downloads, helper code, or generated audio.
- MeloTTS: still design-only / external-runtime. Health-only detect/connect remains the limit; no Python/Docker/model/unidic setup, synthesis, or Korean/Chinese support wording.
- API TTS: still later opt-in. No API key creation, remote endpoint call, paid call, default route, or support claim change.

No install, dependency change, optional dependency change, model download, API call, generated audio, README support claim change, latency guarantee claim, platform support claim, or default routing change was made in this watch.

### Local TTS Boundary Watch Result 4

Checked: 2026-06-05.

The T243 recheck keeps the same boundary:

- VOICEVOX / Voicebox-compatible endpoint: still evidence-first. Keep issue #26 and sanitized contributor reports as the path for broader latency/audibility confidence.
- Irodori-TTS Server: still evidence-first. Keep issue #25 and contributor CPU/GPU/backend reports as the path for comparing device-sensitive results.
- Kokoro.js: helper remains available, but cold-start/cache measurement still needs explicit model-download approval.
- sherpa-onnx-node: still design-only. Do not treat prior package research or npm-install-only planning as approval for dependency changes, optional dependency changes, model/vocoder/token/espeak downloads, helper code, or generated audio.
- MeloTTS: still design-only / external-runtime. Health-only detect/connect remains the limit; no Python/Docker/model/unidic setup or synthesis.
- API TTS: still later opt-in. No API key creation, remote endpoint call, paid call, default route, or support claim change.

No install, dependency change, optional dependency change, model download, API call, generated audio, README support claim change, latency guarantee claim, platform support claim, or default routing change was made in this watch.

### Local TTS Boundary Watch Result 6

Checked: 2026-06-05.

The T249 recheck keeps the same boundary after outreach wait-state maintenance:

- VOICEVOX / Voicebox-compatible endpoint: still evidence-first. Keep issue #26 and sanitized contributor latency/audibility reports as the proof path before broadening public wording.
- Irodori-TTS Server: still evidence-first. Keep issue #25 and contributor CPU/GPU/backend reports as the proof path, because maintainer measurements are reference data only.
- Kokoro.js: helper remains available, but cold-start/cache measurement still needs explicit model-download approval.
- sherpa-onnx-node: still design-only. Do not treat prior package research or npm-install-only checks as approval for dependency changes, optional dependency changes, model/vocoder/token/espeak downloads, helper code, or generated audio.
- MeloTTS: still design-only / external-runtime. Health-only detect/connect remains the limit; no Python/Docker/model/unidic setup, synthesis, or Korean/Chinese support wording.
- API TTS: still later opt-in. No API key creation, remote endpoint call, paid call, default route, or support claim change.

No install, dependency change, optional dependency change, model download, API call, generated audio, README support claim change, latency guarantee claim, platform support claim, or default routing change was made in this watch.

### Local TTS Boundary Watch Result 5

Checked: 2026-06-05.

The T246 recheck keeps the same boundary after outreach wait-state maintenance:

- VOICEVOX / Voicebox-compatible endpoint: still evidence-first. Keep issue #26 and sanitized contributor latency/audibility reports as the proof path before broadening public wording.
- Irodori-TTS Server: still evidence-first. Keep issue #25 and contributor CPU/GPU/backend reports as the proof path, because maintainer M1 measurements are reference data only.
- Kokoro.js: helper remains available, but cold-start/cache measurement still needs explicit model-download approval.
- sherpa-onnx-node: still design-only. Do not treat prior package research or npm-install-only checks as approval for dependency changes, optional dependency changes, model/vocoder/token/espeak downloads, helper code, or generated audio.
- MeloTTS: still design-only / external-runtime. Health-only detect/connect remains the limit; no Python/Docker/model/unidic setup, synthesis, or Korean/Chinese support wording.
- API TTS: still later opt-in. No API key creation, remote endpoint call, paid call, default route, or support claim change.

No install, dependency change, optional dependency change, model download, API call, generated audio, README support claim change, latency guarantee claim, platform support claim, or default routing change was made in this watch.

### Local TTS Boundary Watch Result 3

Checked: 2026-06-05.

The T240 recheck keeps the same boundary:

- VOICEVOX / Voicebox-compatible endpoint: still evidence-first. Keep issue #26 and sanitized contributor reports as the route for broader latency/audibility confidence.
- Irodori-TTS Server: still evidence-first. Keep issue #25 and contributor CPU/GPU/backend reports as the route for comparing device-sensitive results.
- Kokoro.js: helper remains available, but cold-start/cache measurement still needs explicit model-download approval.
- sherpa-onnx-node: still design-only. Do not treat optional package research as approval for dependency changes, model/vocoder/token/espeak downloads, helper code, or generated audio.
- MeloTTS: still design-only / external-runtime. Health-only detect/connect remains the limit; no Python/Docker/model/unidic setup or synthesis.
- API TTS: still later opt-in. No API key creation, remote endpoint call, paid call, default route, or support claim change.

No install, dependency change, model download, API call, generated audio, README support claim change, latency guarantee claim, platform support claim, or default routing change was made in this watch.
