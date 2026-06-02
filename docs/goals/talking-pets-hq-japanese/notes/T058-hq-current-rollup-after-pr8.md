# T058 HQ current rollup after PR8

## 結論

Talking Pets HQの現在地:

- PR #6 / #7 / #8 はmerge済み。
- outreach Day 1 はMaster手動送信待ち。
- local TTSは `sherpa-onnx-node` のpackage確認とmodel公開metadata確認まで完了。
- 多言語claimは現行fixtureで再検証済み。
- active taskはT053。次はlocal TTS実験の範囲判断。

## 完了済みの波

| wave | 状態 | 証跡 |
| --- | --- | --- |
| PR #6 latency / routing diagnostics | merged | `T040`, PR #6 |
| PR #7 multilingual docs / fallback | merged | `T043`, PR #7 |
| PR #8 roadmap / GoalBuddy / outreach notes | merged | `T054`, PR #8 |

## Outreach

現在状態:

- Day 1手動送信用パックはPR #8 merge後版として更新済み。
- 送信はまだしていない。
- DM / follow / like / mention / Star依頼はしていない。

次にMasterが手でできること:

1. `T056` の文面を見て、V1GPTへReddit public commentを送る。
2. OpenClaw / Sogni VoiceのX投稿文脈を確認して、自然ならpublic replyを送る。
3. 送ったら `T007` に実績を記録する。

## Local TTS

現在状態:

- `sherpa-onnx-node` package metadata確認済み。
- package versionは `1.13.2`。
- package licenseは `Apache-2.0`。
- macOS arm64 platform packageはunpacked約75.7MB。
- Matcha English exampleのmodel/vocoder公開asset size確認済み。
- 最小構成は約130.6MB以上。
- model / vocoder / espeak-ng data のlicenseはasset metadataだけでは断言しない。

まだしていない:

- `npm install`
- model download
- archive展開
- 音声生成
- READMEへのsherpa対応済みclaim

Master判断:

```text
package確認とmodelサイズ確認はOK。npm installだけ試して。model downloadはまだしない。
```

または:

```text
model licenseをもう少し公開情報だけで深掘りして。
```

または:

```text
local TTS実験はいったん止めて、outreachやREADME改善を優先して。
```

## Multilingual

現在状態:

- README / README.en / FUTURE_PLAN は、韓国語・中国語をfirst-class fallbackとして扱う表現に揃っている。
- 現行fixtureで `ko` / `zh` / Traditional Chinese をdry-run diagnostics再検証済み。
- `ko` / `zh` はOS speech fallbackへ行く。

言ってよい:

- Japanese and English are prioritized.
- Korean and Chinese are first-class fallback paths.
- Korean and Chinese currently route to OS speech fallback.
- `--speech-language ja|en|ko|zh|other` can force the spoken language.

言わない:

- Korean dedicated TTS support.
- Chinese dedicated TTS support.
- production-ready multilingual TTS.
- Korean / Chinese speech quality guarantee.

## 次の推奨順

あいちゃん推奨:

1. Master判断が来るまではlocal TTSのinstall/model downloadを止める。
2. outreachは手動送信のみ。自動化しない。
3. コード側は次に保存点を作るなら、PR #8後のHQ receiptsをmainへ反映する小さなPRにする。
4. その後、Masterが許可した範囲だけlocal TTS実験PRへ進む。

## 状態

done。

このメモ作成では、送信、依存追加、model download、音声生成、commit、pushはしていない。
