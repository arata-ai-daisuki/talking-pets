# T174 Minimal Multilingual Test Pack

## Objective

Backlog BoardのNextにある多言語検証を、協力者が短時間で試せるMinimal Multilingual Test Packへ進める。

## Added

- `docs/real-device-verification.md` に `Minimal Multilingual Test Pack` を追加した。
- Korean、Simplified Chinese、Traditional Chineseの短いpublic test sentenceを追加した。
- `ko-rollout.jsonl` と `zh-traditional-rollout.jsonl` のdry-run routing checkを提示した。
- `docs/research/x-outreach-targets.md` に `Minimal multilingual test pack` のfollow-up文を追加した。
- HQ Backlog BoardとActivity IndexをT174へ進めた。

## Guardrails

- Korean / Chinese dedicated provider support claimは追加していない。
- fallback-onlyとprovider-specificを分けて報告する形にした。
- generated audio、private logs、local paths、model files、downloaded dictionaries、credentials、private Codex textの添付を求めていない。
- provider実装、依存追加、model download、API callはしていない。

## Receipt

- decision: `minimal_multilingual_test_pack`
- result: done
- next: 多言語TTSに関心のある相手が反応したら、このtest pack linkを共有して報告を受け取る。
