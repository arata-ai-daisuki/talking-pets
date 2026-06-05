# Voice Personalization Feature Update

Last updated: 2026-06-05

Talking Pets now has a clearer path for voice, language, provider preference, API boundaries, latency reporting, and safe maintenance.

This is not a performance guarantee or a claim that every language has a dedicated TTS provider. It is a feature update surface for users and contributors who want to try the current local-first paths and report useful evidence.

## What changed

| Area | User-visible result | Safe command |
| --- | --- | --- |
| Provider capability registry | See provider, language, model download, external runtime, API key, and support-claim boundaries. | `npm run monitor:node -- --list-provider-capabilities` |
| User preference diagnostics | See how provider priority affects routing without playing audio. | `npm run monitor:node -- --once --dry-run --diagnose-routing --preferences presets/preferences.local-first.json --rollout test/fixtures/ko-zh-rollout.jsonl` |
| Provider selection trace | `providerSelection` shows candidate providers, `supportLevel`, and which route was selected. | Same diagnostics command above |
| Latency benchmark tables | Export dry-run latency as JSON, Markdown, or CSV with device info and first-audio boundary. | `npm run benchmark:latency -- --runs 20 --format markdown` |
| Voice/API boundary | OpenAI-compatible local endpoints and remote OpenAI TTS are design-only, explicit opt-in candidates. | `npm run monitor:node -- --list-provider-capabilities` |
| Maintenance dry-run | Review update/uninstall boundaries without deleting files. | `npm run maintenance:plan -- --uninstall --dry-run` |

## Important boundaries

- `ko` and `zh` are first-class fallback routes, not dedicated-provider support claims.
- `firstAudio` is `not_measured` in dry-run latency output because dry-run does not play audio.
- API TTS is not enabled by default. No API key is created, no paid API call is made, and no text is sent to a remote endpoint by the default commands.
- The maintenance plan is dry-run only. It does not delete files, download runtimes, edit config, or inspect secrets.

## Contributor report checklist

When sharing results, include:

- OS and CPU/device name.
- Selected provider and whether it is local, external runtime, fallback-only, or design-only.
- Command used.
- Sanitized `--diagnose-routing` output when reporting language/provider behavior.
- Markdown or CSV latency table when reporting performance.
- Whether audio was actually audible. Dry-run output alone does not prove audible speech.

Do not include API keys, private Codex text, local private paths, generated remote audio, or unsanitized logs.

## X post draft

Talking Pets update:

- provider/language capability registry
- user preference routing diagnostics
- latency benchmark tables with device info
- API voice paths kept explicit opt-in/design-only
- update/uninstall dry-run maintenance plan

Still local-first by default. Korean/Chinese are fallback routes for now, not dedicated TTS claims.

Looking for sanitized reports from different devices/providers.
