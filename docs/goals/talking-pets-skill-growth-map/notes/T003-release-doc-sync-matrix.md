# T003 release doc sync matrix

## 結論

公開 docs 同期スキルの artifact として、`docs/release-doc-sync-matrix.md` を追加した。

この matrix は、public wording / release evidence / install behavior / provider boundary / issue intake を変える時に、どの docs を一緒に見るかを固定する。

## 作ったもの

- change type ごとの primary files と also check
- claim change checklist
- public claim を強めてはいけない条件
- PR body に貼れる minimal docs sync note

## 根拠

- 直近の notes では README / README.en / verification status / release notes / issue templates の表現ずれを何度も release readiness で検出している。
- PR template には docs 更新項目があるが、変更タイプごとの対応表はなかった。
- `docs/verification-matrix.md` で evidence boundary を分けたので、次は docs 同期先を分ける必要がある。

## 今回やらないこと

- README の claim は強めない。
- Windows / Linux の status は変更しない。
- issue template field は増やさない。

## 検証

- `ruby -e 'require "yaml"; YAML.load_file("docs/goals/talking-pets-skill-growth-map/state.yaml"); puts "yaml: ok"'`
- `npm run check:docs`
- `npm run check:pack`
- `node --check scripts/check-npm-pack.mjs`
- `npm run check:release`
