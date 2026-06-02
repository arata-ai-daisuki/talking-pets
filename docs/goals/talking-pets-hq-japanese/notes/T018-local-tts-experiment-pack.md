# T018 Local TTS 実験準備パック

Owner role: 歌澄 音羽

## 目的

Masterが `sherpa-onnx実験を許可する` と言った時に、最初の実験を安全に始められるようにする。

このメモではまだ依存追加、model download、音声生成はしない。

## 現在の候補

第一候補:

```text
sherpa-onnx-node
```

理由:

- 公式JavaScript API install pageが `sherpa-onnx-node` を案内している。
- 公式TTS JavaScript exampleも `require("sherpa-onnx-node")` を使っている。
- macOS arm64を含む主要platformをサポートしている。

## 実験前チェック

Master承認後、最初に確認する:

```bash
npm view sherpa-onnx-node version license dist.unpackedSize
npm view sherpa-onnx-node dependencies optionalDependencies peerDependencies
```

確認すること:

- package license
- unpacked size
- native binaryの扱い
- install時にbuild toolchainが必要か
- macOS arm64で動くか
- dependency treeが大きすぎないか

注意:

- これは承認後に実行する。現時点では未実行。
- `npm install` はまだしない。

## model確認

候補:

```text
Matcha English TTS example model
vocos vocoder
tokens
espeak-ng data
```

確認すること:

- model archive URL
- model size
- model license
- vocoder license
- generated public audioのcredit要否
- commercial-use / redistribution / language / speaker制限

保存先候補:

```text
~/.cache/talking-pets/sherpa/
```

禁止:

- 通常monitor起動時の自動download
- repoへのmodel同梱
- READMEで「sherpa対応済み」と書くこと

## 実験branch案

```text
codex/talking-pets-sherpa-onnx-experiment
```

実験PRに入れる候補:

```text
scripts/tts-sherpa-onnx.mjs
docs/research/sherpa-onnx-design.md
docs/performance.md
package.json
package-lock.json
```

入れないもの:

```text
model files
generated wav files
cache files
README support claim
default provider route
```

## helperの最小仕様

script:

```text
scripts/tts-sherpa-onnx.mjs
```

最初のoption:

```text
--text TEXT
--model-dir PATH
--vocoder PATH
--out PATH
--profile-latency
--play
```

latency区間:

```text
prepare_env
import_sherpa
load_model
generate
write_wav
play
```

方針:

- stdoutは生成したWAV pathだけにする。
- latencyはstderrの `[latency]` 行に出す。
- `--play` がない時は再生しない。
- monitorから自動routingしない。
- modelがない場合はdownloadせず、エラーで止める。

## 最初の成功条件

承認後の実験で成功と言える条件:

- `npm install sherpa-onnx-node` がmacOS arm64で通る。
- helperがsyntax checkを通る。
- 明示指定したlocal model pathからWAVを生成できる。
- `--profile-latency` で区間がstderrに出る。
- 生成WAVをrepo外の一時pathへ保存する。
- READMEで一般対応claimをしない。

## 中止条件

次のどれかなら中止:

- installに広いnative toolchainが必要。
- model/vocoder licenseが不明。
- model download sizeがoptional installとして重すぎる。
- generated audio qualityがTalking Pets用途に合わない。
- helper追加前に大きなprovider抽象化が必要。
- packageがmacOS arm64で安定しない。

## Master承認文

実験を始める場合:

```text
sherpa-onnx実験を許可する。依存とmodel downloadの確認から始めて。
```

installまで許可する場合:

```text
sherpa-onnx実験を許可する。package確認後、問題なければnpm installまで進めて。
```

model downloadまで許可する場合:

```text
sherpa-onnx実験を許可する。licenseとサイズ確認後、問題なければmodel downloadまで進めて。
```

## 現在の判断

まだ実験しない。

PR 1から保存点を作った後に始めるのが安全。
