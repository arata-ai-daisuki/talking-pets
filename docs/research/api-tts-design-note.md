# API TTS Design Note

Checked: 2026-06-05

This is a design-only note. No API key was used, no paid API call was made, no text was sent to an external service, no dependency was installed, and no README support claim is approved by this note.

The 2026-06-05 refresh checked the official OpenAI Audio / text-to-speech docs only. OpenAI documents `POST /v1/audio/speech` for text-to-speech, including models such as `gpt-4o-mini-tts`, `tts-1`, and `tts-1-hd`, built-in voices, output formats, speed, and streaming options. This note still does not approve a live request path.

## Candidate

- Provider: API TTS / cloud or remote TTS fallback
- Public source: provider-specific source not selected for implementation
- Intended role: explicit opt-in fallback for users who choose cloud or remote TTS
- Proposed readiness level: L0 design-only / privacy-and-billing-review candidate

## Candidate Split

| Candidate | Registry id | Network shape | Credential shape | Current status |
| --- | --- | --- | --- | --- |
| OpenAI-compatible local speech endpoint | `openai-compatible-local` | User-configured localhost/LAN endpoint; local external runtime owns any model/cache | No API key by default; endpoint-specific auth remains design-only | Local opt-in design-only |
| OpenAI Audio speech API | `openai-tts-api` | Remote OpenAI API endpoint; text leaves the machine | API key required outside the repo; billing warning required before live calls | Remote opt-in design-only |
| Generic Voice/API provider | `voice-api` | Future provider-specific remote or local voice API | Provider-specific; must be documented before use | Approval-gated design placeholder |

## Integration Shape

- User-facing setup path: user explicitly chooses a remote provider and configures credentials outside the repo.
- Talking Pets call surface: HTTP API only after explicit opt-in, with provider-specific privacy and billing warning.
- Normal install impact: none; `npm ci`, `npm run check:all`, and package checks must pass without API credentials.
- Failure mode when provider is absent: helper reports unavailable and routing falls back to local providers or OS speech.
- First helper PR scope: configuration validation and dry-run diagnostics only; no default network calls, no bundled provider SDK unless approved, no README support wording.

For OpenAI-compatible local endpoints, the first safe implementation should look more like the existing Irodori/Voicebox health boundary than a remote API integration: validate URL shape, show whether the endpoint is configured, print what would be sent in sanitized dry-run diagnostics, and stop before synthesis until Master approves the exact local runtime.

For remote OpenAI TTS, the first safe implementation should not read the API key or send text. It should only add provider-specific config names, privacy/billing warnings, and dry-run diagnostics that prove the route remains disabled unless both `apiOptIn` and an explicit provider choice are present.

## Boundaries

| Boundary | Answer |
| --- | --- |
| Dependency | Do not add an API provider SDK or optional dependency yet. Prefer built-in HTTP only if a future experiment is approved and can remain isolated. |
| Model download | Not applicable for remote TTS, but remote-generated audio and provider-side model terms still need provider-specific review. |
| Cache location | Do not cache generated remote audio by default. Any future cache must be opt-in, local, documented, and excluded from the repo. |
| License and attribution | Unknown until a provider is selected. Future notes must check voice, model, generated audio, and attribution terms. |
| Privacy and network behavior | Text leaves the machine. This must be explicit, disabled by default, and never triggered by normal monitor runs or tests without credentials and user opt-in. |
| Supported OS / architecture | Provider availability is mostly network/account-bound, but local playback and credential storage still need OS-specific verification. |
| Measurement output | Future helper must separate request latency, synthesis latency if exposed, audio duration, download/write time, playback flag, and sanitized `[latency]` output. |
| README wording | Do not add README support wording. Allowed wording stays at "future opt-in" or "under review" until provider-specific privacy, cost, and evidence exist. |

## Credential And Billing Rules

- Never require an API key for normal install, docs checks, package checks, or dry-run monitoring.
- Never log full API keys, account IDs, request IDs that identify private accounts, or raw private Codex text.
- Prefer environment variables or user-local config paths; never commit credentials or generated remote audio.
- Show a billing/cost warning before any future live API call path.
- Keep paid API calls out of CI and out of default examples.

## Measurement Plan

- Health check: validate that credentials are present without making a synthesis call, if the provider supports that safely.
- Cold start: record first request only after Master approves a live API experiment.
- Warm synthesis: repeated request timing with the same provider and voice, if approved.
- Audio duration: read generated audio duration when a future experiment produces a local file.
- Real-time factor: compute remote synthesis/request time divided by audio duration, while labeling it as network-included if synthesis-only timing is unavailable.
- Playback included: record separately from request/download/write time.
- Sanitized `[latency]` fields: include provider alias, remote=true, request, download, write, audioDuration, rtf when possible, playbackIncluded, and whether speech was audible.
- Contributor evidence path: Platform verification issue with sanitized command output and no attached generated audio unless provider terms and user consent are clear.

## Evidence Gap Questions

Answer these in a provider-specific note before API TTS moves beyond design-only:

1. Which provider is the exact opt-in target, and why does it justify weakening the default local-first story?
2. How will Talking Pets warn the user before text leaves the machine or billing can occur?
3. Where will credentials live, and how will dry-run checks prove config shape without validating or logging real secrets?
4. Will generated remote audio ever be cached locally, and if so, what opt-in path, cleanup rule, and release exclusion prove it is safe?
5. Which latency fields can be measured without confusing network request time, provider synthesis time, download/write time, and playback?

## Stop Lines

Stop and ask Master before:

- choosing a specific API provider
- adding an SDK or dependency
- reading, storing, validating, or logging real API credentials
- sending text to a remote API
- making a paid API call
- enabling remote API routing by default
- caching generated remote audio
- writing README support wording
- changing default routing

## Decision

- Recommendation: keep design-only.
- Reason: API TTS can be useful, but it is an exception to local-first privacy and may create billing risk.
- Next safe action: if Master wants API TTS later, choose one provider and write a provider-specific privacy/billing design note before any live request.
