# T006 Feature Update Surface

## 担当

- 星乃 玲: Outreach Scout

## 目的

機能アップデートとして見えるREADME/SNS導線を整理し、協力者がlatency/provider/language報告を出しやすい形にする。

## 期待する成果

- latency benchmark table outputを短く紹介できる。
- providerSelection diagnosticsを短く紹介できる。
- API boundaryがdesign-onlyであることを誤解なく説明できる。
- maintenance dry-run planをupdate/uninstall安全導線として説明できる。

## 停止線

- 未検証の性能claimをしない。
- API TTS対応済み、韓国語/中国語provider対応済み、installerが削除実行可能、のように誤解される表現を避ける。
- outreach送信はMasterの手動判断に残す。

## 実装結果

- `docs/feature-update-voice-personalization.md` を追加。
- README/README.enからリンク。
- provider registry、providerSelection、latency table、API boundary、maintenance dry-runを1ページに整理。
- X投稿下書きを追加。ただし投稿はMaster手動判断に残す。

## 検証

- `npm run check:docs`
- `CLANG_MODULE_CACHE_PATH=/private/tmp/talking-pets-clang-module-cache npm run check:all`
