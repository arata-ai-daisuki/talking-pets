# T103 next provider comparison prep

## 結論

次provider比較は、すぐ実装やinstallへ進まず、候補整理から始める。

## 候補

- Irodori: local server / OpenAI-compatible API。実測済み。cold startが大きいのでpreload前提の案内が必要。
- VOICEVOX: 日本語local TTSとして既存導線あり。速度と導入体験の再測定候補。
- Kokoro系: local voice stack文脈でOpenClaw側とも話が合いやすい。license / package / runtime確認が先。
- sherpa-onnx-node: package情報は確認済みだが、依存追加やmodel取得を伴う可能性があるためMaster承認なしで進めない。
- API TTS: local-first思想とは別枠。privacy / cost / key管理を明示したopt-in設計が必要。

## 次にやるなら

外部installなしでできる範囲:

- docs上の候補表を更新する。
- 各providerの評価軸を揃える。
- latency計測の項目を `first audio`, `full utterance`, `end-to-end` に分ける。
- contribution issueで収集したい端末情報を整える。

## 停止線

- package install
- model download
- API key利用
- 有料API呼び出し
- ライセンスが曖昧なmodelの推奨

## 状態

queued。
