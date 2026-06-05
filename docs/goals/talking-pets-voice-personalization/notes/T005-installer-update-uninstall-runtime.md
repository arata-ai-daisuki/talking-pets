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
