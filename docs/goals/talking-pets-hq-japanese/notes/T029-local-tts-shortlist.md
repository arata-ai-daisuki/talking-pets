# T029 local TTS候補ショートリスト

Owner role: 歌澄 音羽

## 目的

Masterが local TTS 実験を許可した時に、どの候補から試すかを迷わないようにする。

このメモでは依存追加、model download、音声生成はしない。

## 現在の結論

第一候補は引き続き `sherpa-onnx-node`。

理由:

- 公式JavaScript APIが `sherpa-onnx-node` を案内している。
- Node addonとしてTTS例があり、Talking PetsのNode helperに載せやすい。
- macOS arm64 / Windows x64 / Linux x64 / Linux arm64 を公式docsが挙げている。
- 公式docs上では、C/C++ compiler、Python、CMakeを事前installしなくてよい。

第二候補は `MeloTTS`。

理由:

- English / Chinese / Japanese / Korean など多言語の範囲が広い。
- MIT License と書かれている。
- ただしPython中心なので、Talking PetsのNode-first helperとは距離がある。

第三候補は `Piper` / Piper ONNX系。

理由:

- local/offline/軽量TTSとして広く使われている。
- Raspberry Pi級でも動く文脈がある。
- ただしTalking PetsでNode helper化する時、どのpackage/APIを正本にするか追加調査が必要。

## 比較表

| 候補 | 強み | 懸念 | Talking Petsでの扱い |
| --- | --- | --- | --- |
| `sherpa-onnx-node` | Node addon、公式JS docs、主要OS対応、事前toolchain不要とされる | library path設定、model/vocoder/license確認、model size | 最初のexperimental helper候補 |
| `MeloTTS` | 日本語/中国語/韓国語を含む多言語、MIT License | Python中心、Node monitorから直接呼ぶにはwrapperが必要 | 多言語品質比較の後続候補 |
| Piper / Piper ONNX | 軽量local TTS、offline文脈が強い | Node正本packageの選定、言語/voiceごとの品質差、model license確認 | 軽量性比較の後続候補 |
| API TTS | 高品質になりやすい、実装が単純 | local-firstから外れる、費用/送信/secret管理が発生 | P2 opt-in。Master明示承認まで保留 |

## 実験順

1. `sherpa-onnx-node` のpackage情報、license、サイズ、依存を確認する。
2. model/vocoder/token/espeak-ng data のURL、サイズ、licenseを確認する。
3. 問題なければ、実験branchで `scripts/tts-sherpa-onnx.mjs` を作る。
4. local model pathを明示指定してWAV生成する。自動downloadはしない。
5. `--profile-latency` で cold generate / write_wav を測る。
6. 品質とlatencyが足りなければ、MeloTTSまたはPiper系を次候補にする。

## 判断基準

優先する:

- local-first
- Node helperに薄く載せられる
- modelをrepoに入れずに済む
- licenseとcreditが明確
- cold start / warm startを測れる
- 日本語/英語/韓国語/中国語のどれかを改善できる

避ける:

- 通常monitor起動時の自動download
- repoへのmodel同梱
- secretやAPI key必須
- provider abstractionの大改造が先に必要
- licenseが曖昧なmodel
- 「多言語TTS対応済み」の過大claim

## Master承認後の最初のコマンド候補

まだ実行しない。

```bash
npm view sherpa-onnx-node version license dist.unpackedSize dependencies optionalDependencies peerDependencies
```

次に、公式exampleで使うmodel/vocoderのURLとlicenseを確認する。

## 出典メモ

- sherpa official JavaScript API install docs: `https://k2-fsa.github.io/sherpa/onnx/javascript-api/install.html`
- sherpa official Matcha English TTS example: `https://k2-fsa.github.io/sherpa/onnx/javascript-api/examples/tts_matcha_en.html`
- MeloTTS GitHub: `https://github.com/myshell-ai/MeloTTS`
- Piper系は候補として維持。ただし次回は公式repo/packageを特定してから比較する。

## 状態

done。

T006のMaster判断待ちは継続。依存追加、model download、音声生成、PR stage、commit、pushはしていない。
