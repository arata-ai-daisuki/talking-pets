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
