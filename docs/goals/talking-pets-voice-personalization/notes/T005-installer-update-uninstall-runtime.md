# T005 Installer / Update / Uninstall / Runtime

## 担当

- 月城 奏: Installer Worker

## 目的

installer高度化として、update、uninstall、external runtime download/install、config保持、cache削除選択、rollbackを安全に見える化する。

## 期待する成果

- 既存configを壊さないupdate導線。
- uninstall時に、導入ファイル、設定、cache、external runtime、secretの所有境界が分かる。
- external runtime download/installは承認ゲートとdry-runから始める。
- 削除候補を実行前に見せる。

## 停止線

- 削除やuninstallを実行しない。
- 既存config/cacheを確認なしに変更しない。
- external runtimeを勝手にdownload/installしない。
- API secretの場所を推測して削除しない。

## 実装結果

- `scripts/talking-pets-maintenance.mjs` を追加。
- `npm run maintenance:plan -- --update --dry-run` でupdate計画を表示。
- `npm run maintenance:plan -- --uninstall --dry-run --format json` でuninstall計画をJSON表示。
- 出力は保持、削除候補、user-managed external runtime、secret境界、rollbackを分ける。
- コマンドはdry-run必須で、削除、download、config変更、secret探索を実行しない。

## 検証

- `node --check scripts/talking-pets-maintenance.mjs`
- `npm run maintenance:plan -- --update --dry-run`
- `npm run maintenance:plan -- --uninstall --dry-run --format json`
- `node --no-warnings --test`
- `npm run check:pack`
- `ruby -e 'require "yaml"; YAML.load_file("docs/goals/talking-pets-voice-personalization/state.yaml"); puts "yaml: ok"'`
- `npm run check:docs`
- `CLANG_MODULE_CACHE_PATH=/private/tmp/talking-pets-clang-module-cache npm run check:all`
