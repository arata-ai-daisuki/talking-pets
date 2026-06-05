# T006 Installer / Update / Uninstall Safety

## Objective

installer高度化、update、uninstall対応の最小安全導線を設計する。

## Desired User Value

ユーザーがTalking Petsを入れ直したり更新したりやめたりするときに、既存設定、provider設定、model cache、external runtime、API secretがどう扱われるかを事前に理解できるようにする。

## Scope

- install/update/uninstallの責任境界を分ける。
- 既存 `.talking-pets.local.env` を確認なしに上書きしない。
- providerごとに以下を整理する。
  - 導入ファイル
  - user config
  - generated logs/evidence
  - model cache
  - external runtime
  - API secret
  - rollback path
- uninstallは削除実行より先に、dry-runまたはdocsで削除候補を明示する。

## Stop Lines

- このカードではファイル削除、cache削除、uninstall実行をしない。
- 既存設定を確認なしに上書きまたは削除しない。
- external runtime、model cache、API secretをTalking Petsが所有しているように書かない。
- provider別cacheやsecretの場所が不明なものは、unknownとして残す。

## Agent Comments

- 月城 奏: 「installは入口、updateは継続、uninstallは出口です。出口が怖いアプリは使われません。」
- 白瀬 怜奈: 「削除より先にinventoryです。何を消す候補にするか、何を絶対に残すかを分けます。」
- 相庭 愛: 「この設計ができたら、次のPRで`--dry-run`付きのupdate/uninstall helperに進めます。」

## Receipt

- decision: `installer_update_uninstall_safety`
- owner: `月城 奏 / 白瀬 怜奈`
- status: active
- result: pending
- next: 既存install scripts、config validator、provider capability registryを読んで、最小安全導線をdocsまたはimplementation planへ落とす。
