# T164 Provider Experiment Scorecard

## Objective

local/API TTS候補を実装前に同じ物差しで比べられるProvider Experiment Scorecardを追加する。

## Added

- `docs/research/tts-provider-comparison.md` に `Provider Experiment Scorecard` を追加した。
- 評価軸を local-first fit、optional install、model/cache boundary、license clarity、measurement shape、platform confidence、user value にした。
- 合計点ごとに Hold、Design note、Experiment candidate の次アクションを分けた。
- 現候補の provisional score をplanning readとして整理した。

## Guardrails

- provider実装、依存追加、model download、API callはしていない。
- READMEの対応provider claimは増やしていない。
- scoreはpublic benchmarkではなく、実装前の判断補助として扱う。
- Korean / Chinese dedicated provider support claimは追加していない。

## Receipt

- decision: `provider_experiment_scorecard`
- result: done
- next: 11点以上の候補でも、実験helper PRの前にMaster承認を取る。
