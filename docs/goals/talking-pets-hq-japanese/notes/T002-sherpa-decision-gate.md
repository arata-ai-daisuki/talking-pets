# T002 Sherpa ONNX 判断待ちメモ

Owner role: 歌澄 音羽

## 状態

Master判断待ちとして保留。

## 判断が必要な理由

`sherpa-onnx-node` 実験は、次のどれかを含む可能性があります。

- `npm install` による依存追加。
- model / vocoder のdownload。
- model license確認。
- cache directory設計。
- 実音声生成による品質・レイテンシ確認。

これらはlocal-firstの範囲内ですが、repoの依存やローカルcacheを増やすため、Master承認なしでは実行しません。

## 選択肢

1. 許可する
   - 次に `scripts/tts-sherpa-onnx.mjs` のexperimental helper設計/実装へ進む。
   - 依存追加とmodel downloadの範囲を事前に明記する。

2. まだ設計のみ
   - `docs/research/sherpa-onnx-design.md` のまま保留。
   - 他のTTS候補や多言語fixture整備を先に進める。

3. 別provider優先
   - Piper、VOICEVOX改善、Kokoro warm mode、またはAPI opt-in設計へ切り替える。

## 現在のPM判断

Masterから明示承認が出るまで、T002は「判断待ち」として扱い、T003/T004の安全に進められる作業を先に進める。
