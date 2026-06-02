# Talking Pets Sherpa ONNX設計

## 目的

依存追加やmodel downloadをする前に、`sherpa-onnx` がTalking Petsの次のlocal TTS実験として安全か判断する。

## 完了条件

- package選択、model選択、cache/download方針、license checklist、command形、benchmark方針を含む設計メモが存在する。
- 依存追加をしていない。
- model downloadをしていない。
- GoalBuddy `state.yaml` が検証できる。
- 次の実装判断が明確。

## 制約

- 有料API callなし。
- secretなし。
- この設計goal中はmodel downloadなし。
- 公式sherpa-onnx docs / npm / GitHub情報を優先。
- local-first privacy promiseを維持する。

## 開始コマンド

`/goal Follow docs/goals/talking-pets-sherpa-onnx-design/goal.md.`
