# T059 local TTS decision matrix

## 結論

T053のMaster判断用に、次の3ルートを比較した。

あいちゃん推奨は **B: model licenseを公開情報だけで深掘り**。

理由:

- `npm install` はpackage / lockfile差分が発生するため、保存点PRの設計が必要。
- model downloadはまだ許可されていない。
- release asset metadataだけではmodel / vocoder / espeak-ng dataのlicenseを断言できない。
- 公開情報のlicense探索なら、repo変更や大容量downloadなしで不確実性を減らせる。

## 選択肢

| option | 内容 | できること | できないこと | リスク |
| --- | --- | --- | --- | --- |
| A | `npm install`だけ試す | package-lock差分、platform packageの実際の入り方、`check:all`影響を確認できる | model音声生成、license確定、品質確認 | lockfileが大きくなる可能性。native packageのCI差分が出る可能性 |
| B | model licenseを公開情報だけで深掘り | GitHub docs/release/Hugging Face等でlicense/attributionを追加確認できる | archive内license確認、実生成品質確認 | 公開ページだけでは最終確定できない可能性 |
| C | local TTS実験を保留 | outreach/README/次PR整理に集中できる | local TTSの実装前進は止まる | Xで言ったlatency/local voice文脈の次アクションが弱くなる |

## A: npm installだけ試す

Masterが許可する文:

```text
package確認とmodelサイズ確認はOK。npm installだけ試して。model downloadはまだしない。
```

やること:

1. 新branchを切る。
2. `npm install sherpa-onnx-node --save-optional` か通常dependencyかを決める。
3. `package.json` / `package-lock.json` 差分を確認する。
4. `npm run check:all` を実行する。
5. model downloadなしで、READMEには対応済みclaimを書かない。

まだやらない:

- model download
- helper実装
- 音声生成
- benchmark claim

## B: model licenseを公開情報だけで深掘り

Masterが許可する文:

```text
model licenseをもう少し公開情報だけで深掘りして。
```

やること:

1. sherpa-onnx公式pretrained model docsを再確認する。
2. `matcha-icefall-en_US-ljspeech` の由来、license、attributionを公開ページで探す。
3. `vocos-22khz-univ.onnx` の由来、license、attributionを公開ページで探す。
4. `espeak-ng-data` のlicense/attributionを公開ページで探す。
5. 不明点を「downloadしないと確認できないもの」として分ける。

まだやらない:

- asset download
- archive展開
- npm install
- 音声生成

## C: local TTS実験を保留

Masterが許可する文:

```text
local TTS実験はいったん止めて、outreachやREADME改善を優先して。
```

やること:

1. T056のoutreach手動送信をMaster作業として進める。
2. T007へ送信ログを残す。
3. READMEのStar導線やdemo導線を整える小PRを検討する。

まだやらない:

- sherpa install
- model調査の続き
- provider実装

## 判断基準

今すぐ技術リスクを減らすなら:

```text
B
```

公開repoの見え方と反応を優先するなら:

```text
C
```

実装に踏み出すなら:

```text
A
```

## 状態

done。

このメモ作成では、`npm install`、model download、archive展開、音声生成、commit、pushはしていない。
