# T175 Sherpa Optional NPM Install

## Objective

T061由来の判断として、`sherpa-onnx-node`をmodel downloadなしでoptional dependencyとして`npm install`だけ試す。

## Result

- `npm install sherpa-onnx-node --save-optional` を実行した。
- `package.json` に `optionalDependencies.sherpa-onnx-node` が追加された。
- `package-lock.json` に `sherpa-onnx-node` とplatform package metadataが追加された。
- macOS arm64環境では `node_modules/sherpa-onnx-darwin-arm64` が約73MB、`node_modules/sherpa-onnx-node` が約92KBだった。
- npm audit resultは `found 0 vulnerabilities`。

## Guardrails

- model、vocoder、tokens、espeak-ng dataはdownloadしていない。
- import health check、音声生成、helper実装、README support claim、default routing変更はしていない。
- normal install impactはCIとpackage checksで確認する。

## MeloTTS Installer Card

MeloTTSのexternal runtimeについては、今はinstallerでdownload/installまで進めない。

- Next: `external-runtime-helper-design`
- Later: `MeloTTS opt-in installer`
- Stop line: Python/Docker/model/dictionary download、cache path、cleanup、license、size、network approvalが揃うまで自動installしない。

## Receipt

- decision: `sherpa_optional_npm_install`
- result: done
- next: CIが通れば、次はsherpa import health checkに進むか、MeloTTS external runtime helper designへ戻る。
