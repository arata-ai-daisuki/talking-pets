# T004 日本語表示点検メモ

Owner role: 文月 栞里

## 結果

完了。

GoalBuddy hubで追う主要ボードの表示を日本語寄りにした。

## 対応したこと

- `talking-pets-hq-japanese` を継続activeなHQ看板として追加。
- `growth-latency-wave`、`routing-diagnostics`、`sherpa-onnx-design` の `state.yaml` を日本語化。
- 同3ボードの `goal.md` を日本語化。
- 生成済み `.goalbuddy-board/index.html` の固定ラベルを日本語化。
- 生成済み `.goalbuddy-board/app.js` の画面表示用status labelを日本語化。

## 確認したこと

- `http://goalbuddy.localhost:41737/api/boards` 上で主要ボード名が日本語表示になっている。
- `Talking Pets 日本語HQ` は `active` のまま。
- 完了済みの波ボードは履歴として残っている。
- 画面に出る固定ラベルの `Status` / `Active` / `Updated` / `Task detail` / `Completed` / `Queued` / `Blocked` / `Unknown` / `Waiting` / `None` は検出されなくなった。

## 残る英語

以下は残してよい。

- `T001` などのtask ID。
- `README` / `Quick Start` / `Kokoro` / `VOICEVOX` など固有名詞や英語ドキュメント名。
- JavaScript内部変数名。
- X/Reddit向けの送信用英文。

## 注意

`npx goalbuddy board` で再生成すると、GoalBuddy本体由来のUIラベルは英語に戻る可能性がある。再生成後に必要なら同じ置換をもう一度適用する。
