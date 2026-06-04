# T165 Provider Next Decision Card

## Objective

Provider Experiment Scorecardの結果から、次にMasterへ提示するprovider作業の選択肢をDecision Cardにまとめる。

## Added

- `docs/research/tts-provider-comparison.md` に `Next Provider Decision Card` を追加した。
- 選択肢を4つに分けた:
  - A: keep gathering contributor evidence
  - B: approve a tiny sherpa-onnx design experiment
  - C: deepen MeloTTS runtime design
  - D: hold API TTS for later
- 推奨defaultはA、Masterが明示承認する場合のみBへ進む形にした。

## Guardrails

- provider実装、依存追加、model download、API callはしていない。
- READMEの対応provider claimは増やしていない。
- 選択肢はplanning decisionであり、Master承認なしに実験へ進めない。
- Korean / Chinese dedicated provider support claimは追加していない。

## Receipt

- decision: `provider_next_decision_card`
- result: done
- next: Masterに選択肢を提示し、A/B/C/Dのどれを進めるか確認する。
