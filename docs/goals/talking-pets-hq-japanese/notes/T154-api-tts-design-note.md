# T154 API TTS Design Note

## Objective

API TTSを将来候補として扱う場合の、local-first例外、privacy、billing、credential停止線を実装前に明確にする。

## Added

- `docs/research/api-tts-design-note.md` を追加した。
- API TTSはL0 design-only / privacy-and-billing-review candidateとして扱った。
- textが外部へ出ること、API key、paid call、credential logging、remote audio cacheを明確な停止線にした。
- `docs/research/tts-provider-comparison.md` からAPI TTS design noteへ導線を追加した。

## Guardrails

- API keyは使っていない。
- paid API callはしていない。
- textを外部APIへ送っていない。
- SDK/dependencyは追加していない。
- README support wordingやdefault routingは追加していない。

## Receipt

- decision: `api_tts_design_note`
- result: done
- next: MasterがAPI TTSを進めたい場合は、providerを1つ選んでprovider-specific privacy/billing design noteを書く。
