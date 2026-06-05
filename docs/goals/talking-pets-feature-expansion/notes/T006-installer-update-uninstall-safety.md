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
- status: done
- result: done
- implementation:
  - `docs/install-update-uninstall.md` を追加し、install/update/uninstallの所有境界を整理。
  - `.talking-pets.local.env`、`node_modules/`、Kokoro cache、Codex state、external runtime、API secret、generated evidenceを分けて記録。
  - README / README.en から安全ガイドへリンク。
  - 将来のupdate/uninstall helperはdry-runから始める境界を明記。
- changed_files:
  - `docs/install-update-uninstall.md`
  - `README.md`
  - `README.en.md`
  - `package.json`
  - `scripts/check-npm-pack.mjs`
  - `docs/goals/talking-pets-feature-expansion/notes/T006-installer-update-uninstall-safety.md`
  - `docs/goals/talking-pets-feature-expansion/notes/T003-user-preference-config.md`
  - `docs/goals/talking-pets-feature-expansion/activity-log.md`
  - `docs/goals/talking-pets-feature-expansion/state.yaml`
- verification:
  - `npm run check:docs`
  - `npm run check:installers`
  - `npm run check:all`
- verification_result: pass
- next: `T003 user preference config`へ進む。provider registryを使い、言語、声、provider優先度、速度/品質、API opt-inをdry-runで反映する。
