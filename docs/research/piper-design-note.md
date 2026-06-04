# Piper Design Note

Checked: 2026-06-04

This is a design-only note. No dependency was installed, no model was downloaded, no audio was generated, and no README support claim is approved by this note.

## Candidate

- Provider: Piper / `piper-tts`
- Public source: `https://github.com/OHF-Voice/piper1-gpl`, `https://github.com/rhasspy/piper`
- Intended role: lightweight offline multilingual local TTS candidate
- Proposed readiness level: L0 design-only / license-review candidate

## Integration Shape

- User-facing setup path: user installs and configures Piper outside Talking Pets.
- Talking Pets call surface: external user-installed CLI or user-started local service only.
- Normal install impact: none; `npm ci`, `npm run check:all`, and package checks must pass when Piper is absent.
- Failure mode when provider is absent: helper reports unavailable and routing falls back to existing providers.
- First helper PR scope: health check, optional CLI path detection, no model download, no bundled binary, no README support wording.

## Boundaries

| Boundary | Answer |
| --- | --- |
| Dependency | Do not add Piper as an npm, Python, optional, bundled, or installer dependency yet. Treat only a user-installed external binary/service as a future experiment candidate. |
| Model download | Do not download voices or models from Talking Pets. Any future experiment must require explicit user action outside the repo and document model source. |
| Cache location | Unknown until the exact Piper package/binary and voice source are selected. Do not assume cache behavior from the repo name alone. |
| License and attribution | Blocked for implementation. The current maintained repo seen in research is GPL-3.0, while the archived repo is MIT. Exact package, model, voice, and generated-audio terms need review before any helper PR. |
| Privacy and network behavior | Intended use is local-only. Future notes must confirm whether the selected install path performs any network download or telemetry. |
| Supported OS / architecture | Unverified for Talking Pets. Future evidence should separate macOS, Windows, Linux, and CPU architecture. |
| Measurement output | Future helper must emit health, cold or warm synthesis timing, audio duration if a WAV is produced, RTF when possible, playback flag, and sanitized `[latency]` output. |
| README wording | Do not add README support wording. Allowed wording stays at "candidate" or "under review" in internal research docs only. |

## Measurement Plan

- Health check: detect configured Piper CLI or local service without invoking model download.
- Cold start: measure first synthesis only after Master approves a no-download experiment path.
- Warm synthesis: repeated synthesis after runtime and selected model are already ready.
- Audio duration: read generated WAV duration when a future experiment produces a local file.
- Real-time factor: compute warm synthesis divided by audio duration.
- Playback included: record separately from synthesis time.
- Sanitized `[latency]` fields: include provider name, health, cold/warm state, synthesis, audioDuration, rtf, playbackIncluded, and whether speech was audible.
- Contributor evidence path: Platform verification issue with sanitized command output and no attached generated audio.

## Stop Lines

Stop and ask Master before:

- installing `piper-tts` or any Piper package
- downloading a model, voice, vocoder, or language data
- bundling a Piper binary or model
- writing README support wording
- changing default routing
- publishing latency or quality claims
- giving legal advice about GPL compatibility

## Decision

- Recommendation: keep design-only.
- Reason: the most important unresolved risk is license and packaging shape, not helper code.
- Next safe action: collect public provider feedback or write a license-focused review note before any dependency, install, or helper PR.
