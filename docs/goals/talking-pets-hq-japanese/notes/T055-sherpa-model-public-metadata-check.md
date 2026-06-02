# T055 sherpa model public metadata check

## 結論

`sherpa-onnx-node` の次段階として、model downloadなしで公開metadataだけ確認した。

実行した範囲:

- 公式docs確認
- GitHub release APIでasset名、size、digest、download URL確認

実行していない:

- `npm install`
- model download
- archive展開
- 音声生成
- README support claim

## 公式exampleの構成

公式 JavaScript TTS Matcha English example は、次の構成を使う。

| component | path / file |
| --- | --- |
| package | `sherpa-onnx-node` |
| acoustic model | `matcha-icefall-en_US-ljspeech/model-steps-3.onnx` |
| vocoder | `vocos-22khz-univ.onnx` |
| tokens | `matcha-icefall-en_US-ljspeech/tokens.txt` |
| dataDir | `matcha-icefall-en_US-ljspeech/espeak-ng-data` |

公式docs上の注意:

- Matcha English は Vocos vocoder を別途必要とする。
- sync / async generation の両方がある。
- 実行には macOS / Linux で library path 設定が必要。

## 公開asset size

GitHub release APIだけで確認した。ファイルはdownloadしていない。

| asset | release tag | size | digest |
| --- | --- | ---: | --- |
| `matcha-icefall-en_US-ljspeech.tar.bz2` | `tts-models` | `76,747,608 bytes` | `sha256:bc0d41e728aa1ec50c3dee8f57c6ce7244d8864b42f5fde8c6e109bd4b29b7f1` |
| `espeak-ng-data.tar.bz2` | `tts-models` | `7,252,012 bytes` | not provided by API response |
| `vocos-22khz-univ.onnx` | `vocoder-models` | `53,884,024 bytes` | not provided by API response |

参考候補として確認:

| asset | release tag | size | digest |
| --- | --- | ---: | --- |
| `matcha-icefall-zh-baker.tar.bz2` | `tts-models` | `75,451,522 bytes` | `sha256:729e8516c4d7f5ffcebac174a3935e6ee1764e2c4e60fd0bd911253241abc153` |
| `vocos-16khz-univ.onnx` | `vocoder-models` | `53,882,848 bytes` | `sha256:b599142a1fb8ff03de3e84ac35ff537c619e56f4267a6fe894851a42844acf9e` |
| `vocos_24khz.onnx` | `vocoder-models` | `54,157,409 bytes` | `sha256:bcb3b970e384161c4d634f0bb9e999ff1c471b34c9bc0b1049a5014065ed3cc0` |

## サイズ感

Matcha English exampleを最小で試す場合、download対象は少なくとも:

- `matcha-icefall-en_US-ljspeech.tar.bz2`: 約76.7MB
- `vocos-22khz-univ.onnx`: 約53.9MB

合計で約130.6MB。

`espeak-ng-data.tar.bz2` を別途必要にする構成なら、さらに約7.3MB増える。

## license判断

package licenseはT052で `Apache-2.0` と確認済み。

ただし、model / vocoder / espeak-ng data のlicenseは、この確認だけではまだ断言しない。

理由:

- GitHub release APIのasset metadataにはlicense項目がない。
- 公式exampleは必要ファイルとdownload手順を示すが、assetごとのlicense / attribution / commercial-use条件まではこの範囲で確認できていない。
- downloadしてarchive内のlicense fileを確認するには、Masterのmodel download許可が必要。

## 次の判断

あいちゃん推奨:

まだ `npm install` へ行くより、次はどちらかをMasterに選んでもらう。

```text
model licenseをもう少し公開情報だけで深掘りして。
```

または:

```text
package確認とmodelサイズ確認はOK。npm installだけ試して。model downloadはまだしない。
```

## 実行コマンド

```bash
curl -s 'https://api.github.com/repos/k2-fsa/sherpa-onnx/releases/130612623/assets?per_page=100' | jq -r '.[] | select(.name=="matcha-icefall-en_US-ljspeech.tar.bz2" or .name=="matcha-icefall-zh-baker.tar.bz2" or .name=="espeak-ng-data.tar.bz2") | [.name, .size, .digest, .browser_download_url] | @tsv'
curl -s 'https://api.github.com/repos/k2-fsa/sherpa-onnx/releases/192661565/assets?per_page=100' | jq -r '.[] | select(.name=="vocos-22khz-univ.onnx" or .name=="vocos-16khz-univ.onnx" or .name=="vocos_24khz.onnx") | [.name, .size, .digest, .browser_download_url] | @tsv'
```

## Sources

- https://k2-fsa.github.io/sherpa/onnx/javascript-api/install.html
- https://k2-fsa.github.io/sherpa/onnx/javascript-api/examples/tts_matcha_en.html
- https://k2-fsa.github.io/sherpa/onnx/tts/pretrained_models/index.html
- https://github.com/k2-fsa/sherpa-onnx/releases/tag/tts-models
- https://github.com/k2-fsa/sherpa-onnx/releases/tag/vocoder-models

## 状態

done。

まだinstall、model download、音声生成、commit、pushはしていない。
