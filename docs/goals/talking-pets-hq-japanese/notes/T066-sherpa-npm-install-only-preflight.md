# T066 sherpa npm install only preflight

## 結論

MasterがT061のAを選んだ場合、次は `npm install` だけの実験PRにする。

このメモではinstallしない。

## 現在のpackage状態

`package.json` の現在のruntime dependency:

```json
{
  "dependencies": {
    "kokoro-js": "^1.2.1"
  }
}
```

`sherpa-onnx-node` はnative/platform packageを含むため、通常dependencyにするか optional dependency にするかを先に決める。

## あいちゃん推奨

最初の実験では `optionalDependencies` 寄り。

理由:

- Talking Petsの既定routeへまだ組み込まない。
- model downloadもまだしない。
- sherpaはplatform packageが大きい。
- CI / OS差分が出る可能性がある。

ただし、npmのoptional dependencyは失敗時の扱いが通常dependencyと違うため、install実験ではlockfileとCI結果をよく見る。

## Master許可文

```text
package確認とlicense公開情報はOK。npm installだけ試して。model downloadはまだしない。optionalDependencies案で進めて。
```

通常dependencyで試すなら:

```text
package確認とlicense公開情報はOK。npm installだけ試して。model downloadはまだしない。dependencies案で進めて。
```

## 実行時の範囲

やる:

- main base worktreeで新branchを切る。
- `sherpa-onnx-node` を追加する。
- `package.json` / `package-lock.json` 差分を見る。
- `npm run check:all` または存在しない場合は `npm run check:syntax` + `npm run test:dry-run` を実行する。
- GitHub CIのmacOS / Ubuntu / Windows結果を見る。

やらない:

- model download
- archive展開
- audio generation
- helper script実装
- READMEに対応済みclaim追加
- default routing追加

## 差分確認

install後に見る:

```bash
git diff -- package.json package-lock.json
npm ls sherpa-onnx-node
npm run check:syntax
npm run test:dry-run
```

`npm run check:all` がある場合:

```bash
npm run check:all
```

## 停止条件

次のどれかならPR化前に止める:

- `node_modules` やbinaryが誤ってstage候補に出る。
- lockfileに想定外の大きなdependency treeが入る。
- installにcompiler / Python / CMakeが必要になる。
- macOSでinstallできてもWindows/Linux CIで明らかに壊れそうな差分が出る。
- package installだけでREADME claimが必要になりそうになる。

## PR scope

入れる可能性:

```text
package.json
package-lock.json
docs/goals/talking-pets-hq-japanese/notes/T066-sherpa-npm-install-only-preflight.md
docs/goals/talking-pets-hq-japanese/state.yaml
```

入れない:

```text
scripts/tts-sherpa-onnx.mjs
README.md
README.en.md
docs/research/sherpa-onnx-design.md
model files
generated wav files
```

## 状態

done。

npm install、model download、archive展開、音声生成、branch作成、stage、commit、push、PR作成はしていない。
