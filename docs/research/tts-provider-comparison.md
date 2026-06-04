# TTS Provider Comparison

Last updated: 2026-06-04

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
| P2 | API TTS | Optional cloud or remote fallback | L0 design-only | Can be fast and high quality on good networks | Privacy, cost, API key management, and local-first positioning | Keep opt-in only; do not implement by default |

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

## Provider Feedback Intake

Use this table when someone replies to the provider feedback ask. Record only public or voluntarily shared technical guidance; do not collect private contact details or generated audio files.

| Date | Source | Provider | Feedback Area | What They Said | Decision Impact | Follow-Up |
| --- | --- | --- | --- | --- | --- | --- |
|  |  | Piper / MeloTTS / other | license / runtime / cache / measurement / platform |  | keep design-only / write design note / ask Master / no action |  |

Classification rules:

- `license`: package, model, voice, generated audio, attribution, or redistribution terms.
- `runtime`: Python, Docker, server, CLI, OS support, GPU/CPU/MPS/CUDA, or normal install impact.
- `cache`: model, dictionary, voice, or downloaded asset location and cleanup behavior.
- `measurement`: cold start, warm synthesis, audio duration, RTF, playback flag, or contributor evidence shape.
- `platform`: Windows, macOS, Linux, architecture, or device-specific friction.

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
