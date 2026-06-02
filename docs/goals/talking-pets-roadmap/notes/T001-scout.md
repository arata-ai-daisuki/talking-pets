# T001 Scout Receipt

## Result

done

## Summary

STELLAVOX Scout work collected roadmap inputs across TTS provider expansion, multilingual support, latency measurement, product/SNS growth, and risk guardrails. No implementation files were edited, no paid API paths were executed, and no secrets were handled.

## Findings

### 歌澄 音羽 / Voice Provider Lead

- Current providers are `auto`, `voicevox`, `kokoro`, and `say`.
- Current routing is `ja -> voicevox`, `en -> kokoro`, and fallback to `say`.
- `presets/voices.json` already documents the initial routing intent.
- P0 should strengthen the current provider path before adding paid APIs.
- P1 can evaluate local multilingual options such as Piper or local custom endpoints.
- P2 can consider optional API providers such as OpenAI TTS, ElevenLabs, Google Cloud TTS, Azure Speech, or Polly, but only behind explicit opt-in.

### 言守 詞葉 / Multilingual Strategy Lead

- Current first-class languages are effectively Japanese and English.
- `ko` appears in CLI/detection paths, but dedicated Korean routing is not implemented.
- `zh` is not implemented, and CJK-heavy text can currently be classified as Japanese.
- P0 should align docs, CLI, and implementation claims.
- P1 should add `ko` and `zh` fallback fixtures, presets, and routing diagnostics.
- P2 should research dedicated Korean and Chinese local TTS providers.

### 速水 光莉 / Latency & Benchmark Lead

- Useful measurement sections are poll wait, thread resolution, rollout read/parse, speech formatting, route selection, child process/TTS time, and provider-specific synthesis/playback time.
- `--interval` default of 1 second is a major perceived-latency factor.
- TTS helper subprocess startup and Kokoro model load/generation are likely significant.
- P0 should add Node monitor `--profile-latency` with dry-run support.
- P1 should extend profiling to TTS helpers and add benchmark scripts.
- P2 should consider Kokoro worker warm mode and rollout tail/delta parsing.

### 星宮 未来 / Product Growth & SNS Lead

- README already has a strong hook: Codex is not patched, local logs are read, and local TTS is used.
- Demo video and X-friendly assets already exist under `docs/demo/`.
- README lacks a clear Star/Watch/Issue call to action in the first viewport.
- P0 should pick an X demo asset and add modest README CTA.
- P1 should prepare good-first-issue/community issue paths and release proof notes.
- SNS should use the X-friendly speed-ramp video, while README should keep the normal demo recording for honesty.

### 白瀬 怜奈 / Quality Judge & Risk Officer

- The roadmap can fail by expanding into TTS/API/multilingual/SNS/community/latency all at once.
- API TTS must remain opt-in and clearly marked as external text transfer plus possible billing.
- Public claims should distinguish Stable, Experimental, fallback, and unverified.
- Community/SNS surfaces must not invite users to paste private Codex logs, generated audio, `state_5.sqlite`, rollout JSONL, API keys, or credentials.
- Final roadmap needs guardrails, Master confirmation gates, proof columns, and next PR candidates.

## Recommended Next Step

Create `docs/ROADMAP.md` with:

- STELLAVOX ownership model
- P0/P1/P2/P3 roadmap table
- proof and verification columns
- Master confirmation gates
- next 3 PR candidates
- guardrails for privacy, billing, public claims, and small PRs
