# T159 Multilingual Tester Targets

## Objective

Provider-specific multilingual TTSを検証できる人を、手動outreachで探しやすくする。

## Added

- `docs/research/x-outreach-targets.md` に `Multilingual local TTS experimenters` segmentを追加した。
- Korean/Chinese/local multilingual TTS向けの手動検索queryを追加した。
- provider-specific multilingual TTS向けの返信テンプレを追加した。

## Guardrails

- 具体アカウントの大量追加はしていない。
- 自動返信、DM、follow、like、mentionは追加していない。
- Korean / Chinese dedicated provider support claimは追加していない。
- provider実装、依存追加、model download、API callはしていない。

## Receipt

- decision: `multilingual_tester_targets`
- result: done
- next: 手動検索で該当postを見つけた時だけ、provider-specific multilingual TTS templateを使う。
