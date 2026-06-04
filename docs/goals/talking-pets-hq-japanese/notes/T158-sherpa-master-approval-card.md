# T158 Sherpa Master Approval Card

## Objective

`sherpa-onnx-node`実験へ進む前に、Masterが許可範囲を迷わず選べる判断カードを作る。

## Current State

- `docs/research/sherpa-onnx-design.md` はprovider template観点へ揃った。
- `sherpa-onnx-node` はまだ L0 design-only / dependency-and-model-review candidate。
- dependency install、model download、helper実装、README support wording、default routeは未実行。

## Recommended Approval Scope

最初に許可するなら、最小安全スコープはこれ。

```text
sherpa-onnx-node実験を許可する。
範囲は package install / import health check / no model download helper skeleton まで。
model、vocoder、tokens、espeak-ng data のdownloadはまだしない。
README support claimとdefault routeも追加しない。
```

## What This Would Allow

- `sherpa-onnx-node` をoptional experimentとして扱う小PR。
- package install可否、import可否、platform/library pathのhealth check確認。
- model assetなしでも失敗が読みやすい helper skeleton の検討。
- normal install/check pathがprovider不在でもgreenであることの確認。

## What This Would Not Allow

- acoustic model、vocoder、tokens、espeak-ng dataのdownload。
- generated WAV作成や音声再生benchmark。
- README support wording。
- default routing。
- API call、paid path、外部送信。
- generated audio attachment。

## Stop If

- normal `npm ci` / `npm run check:all` / package checksがprovider不在で壊れる。
- package license、native binary、platform support、cache pathのどれかが曖昧になる。
- model assetなしではhelper skeletonの価値が薄いと分かった。
- 実験が広いprovider abstractionを要求し始める。

## Alternative Decisions

- 保留: outreachと外部検証を優先し、sherpaはdesign-onlyに残す。
- 先にlicense review: package/native binary/licenseだけ公開情報で再確認する。
- model downloadまで許可: これは別途、model/vocoder/tokens/espeak-ng dataのsource/license/size/cache確認を含む明示許可が必要。

## Receipt

- decision: `sherpa_master_approval_card`
- result: done
- next: Masterが上の許可文を明示した時だけ、package install/import health check系の小PRへ進む。
