# Talking Pets ルーティング診断

## 目的

Talking Petsに、言語判定とTTS routing判断を確認するローカルdry-run診断を追加する。

音声再生や外部text送信なしで、多言語claimとprovider routingの証拠を確認できるようにする。

## 完了条件

- `scripts/pet-rollout-monitor.mjs` がrouting診断をJSONで出せる。
- 診断に detected language、effective language、chosen TTS engine、fallback reason、speech textが含まれる。
- 韓国語/中国語のfallback挙動が、専用provider対応を主張せずに見える。
- ローカル検証コマンドが通る。
- GoalBuddy `state.yaml` が検証できる。

## 制約

- 外部text送信なし。
- 有料/API callなし。
- diagnostics modeでは音声再生なし。
- 実装は小さくローカルに保つ。

## 開始コマンド

`/goal Follow docs/goals/talking-pets-routing-diagnostics/goal.md.`
