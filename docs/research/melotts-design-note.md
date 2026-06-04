# MeloTTS Design Note

Checked: 2026-06-04

This is a design-only note. No dependency was installed, no model or dictionary was downloaded, no audio was generated, and no README support claim is approved by this note.

## Candidate

- Provider: MeloTTS
- Public source: `https://github.com/myshell-ai/MeloTTS`, `https://github.com/myshell-ai/MeloTTS/blob/main/docs/install.md`
- Intended role: multilingual quality research candidate for local or user-started runtime use
- Proposed readiness level: L0 design-only / runtime-review candidate

## Integration Shape

- User-facing setup path: user installs and starts MeloTTS outside Talking Pets.
- Talking Pets call surface: user-installed CLI, user-started local server, or explicit Docker/Python helper only after approval.
- Normal install impact: none; `npm ci`, `npm run check:all`, and package checks must pass when MeloTTS is absent.
- Failure mode when provider is absent: helper reports unavailable and routing falls back to existing providers.
- First helper PR scope: health check and optional external runtime command shape only; no Python dependency install, no Docker setup, no `unidic` download, no README support wording.

## Boundaries

| Boundary | Answer |
| --- | --- |
| Dependency | Do not add MeloTTS, Python packages, Docker images, or optional dependencies to Talking Pets yet. Treat only a user-managed external runtime as a future experiment candidate. |
| Model download | Do not download models, dictionaries, or language assets from Talking Pets. `python -m unidic download` must remain outside the normal path unless Master approves an explicit experiment. |
| Cache location | Unknown until the exact runtime path is selected. Future notes must identify where models, dictionaries, and cached assets are stored and how users can clean them up. |
| License and attribution | Repo is marked MIT in the public snapshot, but exact model, voice, dictionary, and generated-audio terms need review before any helper PR or README wording. |
| Privacy and network behavior | Intended use is local-only after setup. Future notes must confirm whether setup/runtime downloads assets or calls network services. |
| Supported OS / architecture | Unverified for Talking Pets. Public docs point to Ubuntu/Python and suggest Docker for Windows and some macOS users, so OS guidance must stay experimental. |
| Measurement output | Future helper must emit health, cold start, warm synthesis, audio duration, RTF when possible, playback flag, and sanitized `[latency]` output. |
| README wording | Do not add README support wording. Allowed wording stays at "candidate" or "under review" in internal research docs only. |

## Measurement Plan

- Health check: detect configured external MeloTTS CLI/server without installing packages or downloading dictionaries.
- Cold start: measure first synthesis only after Master approves an explicit external-runtime experiment.
- Warm synthesis: repeated synthesis after Python/Docker runtime, model, and dictionary are already ready.
- Audio duration: read generated WAV duration when a future experiment produces a local file.
- Real-time factor: compute warm synthesis divided by audio duration.
- Playback included: record separately from synthesis time.
- Sanitized `[latency]` fields: include provider name, health, runtime path, cold/warm state, synthesis, audioDuration, rtf, playbackIncluded, and whether speech was audible.
- Contributor evidence path: Platform verification issue with sanitized command output and no attached generated audio.

## Stop Lines

Stop and ask Master before:

- installing MeloTTS or Python/Torch/audio/NLP dependencies
- running Docker setup
- running `python -m unidic download`
- downloading a model, dictionary, voice, or language asset
- writing README support wording
- changing default routing
- publishing latency or quality claims

## Decision

- Recommendation: keep design-only.
- Reason: the most important unresolved risk is optional runtime and cache shape, not provider routing code.
- Next safe action: collect public provider feedback or write a runtime/cache review note before any install, helper, or README wording change.

## C Runtime Design-Only Scope

This is the exact scope for option C in the Local TTS Master Choice Card. It is still design-only.

### Runtime Choices To Compare

| Runtime path | Why it might fit | Main risk | First proof needed |
| --- | --- | --- | --- |
| User-installed CLI | Keeps Talking Pets npm install clean and can fail closed when absent. | CLI name, arguments, output behavior, and cache path may vary by install. | A dry design of command args and sanitized latency fields. |
| User-started local server | Similar to VOICEVOX/Irodori server style if a stable endpoint is available. | Server setup may require Python/Docker and may not be standard in public docs. | Health endpoint shape and local-only privacy boundary. |
| Docker runtime | May be clearer for Windows/macOS users than native Python setup. | Docker is heavy for a small companion tool and weakens low-friction onboarding. | A no-normal-install boundary and cache cleanup plan. |
| Python helper | Gives direct control over device, model, and timing. | Pulls Python/Torch/NLP complexity into the project if rushed. | Explicit Master approval for an isolated experiment only. |

### Runtime Boundary

Talking Pets should treat MeloTTS as an external runtime unless Master approves a separate isolated experiment.

| Boundary | Allowed in a future design PR | Not allowed yet |
| --- | --- | --- |
| Discovery | Detect a user-provided CLI command, local server URL, or Docker endpoint from explicit config. | Auto-detect broad Python environments, scan user home directories, or mutate shell profiles. |
| Invocation | Run a configured command/server only when the user explicitly selects the MeloTTS candidate path. | Route normal monitor output to MeloTTS by default. |
| Failure | Report unavailable, missing config, timeout, or non-zero exit as a clean fallback reason. | Treat missing MeloTTS as an install error for Talking Pets. |
| Output | Write generated WAV to a user-selected temp/output path during an approved experiment. | Commit generated audio, cache files, models, dictionaries, or Docker artifacts. |
| Documentation | Keep wording as `candidate`, `external runtime`, or `design-only`. | Claim Korean, Chinese, or multilingual provider support in README. |

### Cache Boundary

MeloTTS cache behavior remains unresolved, so Talking Pets must not own or create a MeloTTS cache yet.

| Asset or cache | Current boundary | Required proof before implementation |
| --- | --- | --- |
| Python packages | User-managed outside Talking Pets. | Exact install command, supported Python versions, and cleanup path. |
| Torch/audio/NLP packages | User-managed outside Talking Pets. | Normal `npm ci` and package checks stay unaffected when absent. |
| `unidic` dictionary | Never downloaded by Talking Pets at this stage. | Where it downloads, size, license/attribution, and cleanup command. |
| Model files | Never downloaded or cached by Talking Pets at this stage. | Model source URL, size, license, cache directory, and update behavior. |
| Generated WAV files | Temporary experiment output only. | Output path is explicit, ignored by git, and not requested as public evidence. |
| Docker images/volumes | User-managed outside Talking Pets. | Image source, volume/cache path, size, GPU/CPU behavior, and cleanup command. |

If a later experiment needs a Talking Pets-owned cache, propose it separately as `~/.cache/talking-pets/melotts/` and keep it empty until explicit download approval. Do not reuse this proposed path as evidence that MeloTTS cache behavior is known.

### Measurement Shape

If C advances later, compare only after the runtime is already installed by the user or inside an approved isolated experiment:

- `health`: CLI/server/helper is reachable.
- `runtime`: `cli`, `server`, `docker`, or `python-helper`.
- `device`: CPU/CUDA/MPS if the runtime reports it.
- `prepare`: any one-time dictionary/model readiness step, excluding normal Talking Pets startup.
- `synthesis`: warm generation time for one text fixture.
- `audioDuration`: duration of the generated WAV if available.
- `rtf`: synthesis divided by audio duration.
- `playbackIncluded`: whether playback time is included.
- `audible`: whether one spoken line was heard by the tester.
- `cacheOwner`: `user-managed`, `docker-managed`, or `talking-pets-approved-cache`.
- `cachePathKnown`: yes/no, with sanitized path category only.

### Approval Question For Master

Approve the next C step only if the PR is limited to one of these:

1. `metadata-review`: inspect public MeloTTS docs for CLI/server/cache facts, with no install.
2. `external-runtime-helper-design`: draft a helper interface that assumes the user already installed MeloTTS, with no executable implementation.
3. `isolated-local-experiment`: run MeloTTS locally on a disposable environment, after explicit approval for Python/Docker setup and downloads.

### Stop Line

C does not approve Korean/Chinese dedicated support wording. It only prepares the runtime/cache questions needed before any MeloTTS helper, Docker guide, Python setup, or README claim exists.
