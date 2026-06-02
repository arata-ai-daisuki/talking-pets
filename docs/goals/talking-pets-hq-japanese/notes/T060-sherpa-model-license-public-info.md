# T060 sherpa model license public info

## 結論

T059の推奨Bに従い、model downloadなしでlicense公開情報を深掘りした。

現時点の判断:

- `matcha-icefall-en_US-ljspeech` のtraining datasetである LJSpeech は public domain と確認できる。
- `vocos-22khz-univ.onnx` の由来候補である Vocos は、公式GitHub / Hugging Face上で MIT license と確認できる。
- `espeak-ng-data` の由来である eSpeak NG は、公式GitHub上で GPL version 3 or later と確認できる。
- ただし、sherpa-onnx release asset内に実際に同梱されているlicense file / noticeは、downloadなしでは最終確認できない。

## 確認した公開情報

| component | 公開情報で確認できたこと | Talking Petsでの扱い |
| --- | --- | --- |
| `matcha-icefall-en_US-ljspeech` | Hugging Face model cardは LJSpeech datasetで学習したと説明。LJSpeech公式ページは public domain と説明。 | dataset由来は低リスク寄り。ただしmodel artifact自体のlicense明記は弱い。 |
| `vocos-22khz-univ.onnx` | sherpa-onnx-models上に53.9MB assetとして存在。Vocos公式GitHubと `charactr/vocos-mel-24khz` はMIT license。 | Vocos由来ならMIT寄り。ただしsherpa配布の `vocos-22khz-univ.onnx` へのlicense継承はasset単体では未確定。 |
| `espeak-ng-data` | eSpeak NG公式GitHubは GPL version 3 or later と説明。repoにはGPL / Apache / BSD / UCD系license fileがある。 | 同梱や再配布をするなら注意。Talking Pets repoには入れない方針を維持。 |

## 確定できたこと

LJSpeech:

- 公式ページは、datasetがpublic domainで、use restrictionなしと説明している。
- text、audio、annotationsもpublic domainと説明している。

Vocos:

- `gemelo-ai/vocos` のREADMEはMIT licenseと説明している。
- Hugging Face `charactr/vocos-mel-24khz` は `License: mit` と表示している。

eSpeak NG:

- 公式GitHub READMEは、eSpeak NG Text-to-SpeechがGPL version 3 or later licenseであると説明している。
- GitHubのlicense検出では GPL-3.0 に加え、Apache-2.0、BSD-2-Clause、UCD系のlicense fileも見える。

## まだ確定しないこと

downloadなしでは、次はまだ未確定:

- `matcha-icefall-en_US-ljspeech.tar.bz2` 内にlicense / notice fileがあるか。
- `vocos-22khz-univ.onnx` が `charactr/vocos-mel-24khz` 由来そのものか、別途変換/再学習されたものか。
- `espeak-ng-data.tar.bz2` 内のlicense / notice構成。
- generated audioへのattribution要否。
- Talking Petsがmodel download helperを持つ場合、license noticeをどこに表示すべきか。

## 次の判断

あいちゃん推奨:

まだmodel downloadせず、次は `npm installだけ` か `保留してoutreach` のどちらか。

理由:

- 公開情報だけではlicenseの輪郭は見えた。
- ただし最終確定にはarchive内license確認が必要。
- archive確認はmodel downloadに入るため、Master明示許可が必要。

次に進む文:

```text
package確認とlicense公開情報はOK。npm installだけ試して。model downloadはまだしない。
```

さらに慎重に進む文:

```text
model downloadはまだしない。local TTSは保留してoutreachを優先して。
```

## Sources

- https://huggingface.co/csukuangfj/matcha-icefall-en_US-ljspeech
- https://keithito.com/LJ-Speech-Dataset/
- https://k2-fsa.github.io/sherpa/onnx/tts/pretrained_models/index.html
- https://huggingface.co/k2-fsa/sherpa-onnx-models/blob/main/vocoder-models/vocos-22khz-univ.onnx
- https://github.com/gemelo-ai/vocos
- https://huggingface.co/charactr/vocos-mel-24khz
- https://github.com/espeak-ng/espeak-ng

## 状態

done。

この調査では、npm install、model download、archive展開、音声生成、commit、pushはしていない。
