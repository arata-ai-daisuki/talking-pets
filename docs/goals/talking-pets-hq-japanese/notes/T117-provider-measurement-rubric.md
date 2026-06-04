# T117 provider measurement rubric

## 結論

downloadなしで進められるlocal TTS設計として、provider比較表に共通の測定軸とreadiness levelを追加する。

## 変更内容

- `docs/research/tts-provider-comparison.md` に `Measurement Rubric` を追加。
- `docs/research/tts-provider-comparison.md` に `Readiness Levels` を追加。
- provider候補表へreadiness列を追加。
- VOICEVOX/Irodoriは maintainer measured に留め、外部検証Issue #25/#26でL3へ進める方針にした。
- `docs/performance.md` からreadiness level参照を追加。

## 判断

今は新provider実装より、公開claimを変える前の証拠基準を揃える段階。

VOICEVOX/Irodoriの数字はmaintainer環境の参考値であり、性能保証やdefault routing候補としてはまだ扱わない。

## 実行していないこと

- package install
- model download
- API call
- paid API
- READMEの性能claim強化
- default routing変更

## 状態

done。
