# T001 skill growth map v1

## 結論

Talking Pets では、次の順でスキルを育てる。

1. 検証設計
2. 公開 docs 同期
3. small-PR preflight / 赤信号抽出

## 根拠

- PR `#181` と `#182` で、localhost TTS、installer update、sandbox 外 verification の切り分けが繰り返し必要になった。
- `implementation-notes.md` では、README / README.en / verification / release / issue template の表現ずれを何度も修正している。
- `docs/goals/talking-pets-hq-japanese/notes/T009-T011` に、PR単位の review 観点と赤信号が既に蓄積されている。
- `docs/goals/talking-pets-hq-japanese/notes/T068-pr9-ci-followup.md` で、公開文書にローカル絶対パスが残って CI が落ちた実例がある。

## 次に切る branch

### 1. verification matrix

- branch: `codex/talking-pets-verification-matrix`
- 目的: sandbox 内 / sandbox 外 / dry-run 代替の verify path を固定する
- 最初に触る候補:
  - `docs/install-update-uninstall.md`
  - `docs/verification-status.md`
  - `implementation-notes.md`

### 2. release-doc sync

- branch: `codex/talking-pets-release-doc-sync`
- 目的: claim 変更時に触る docs 一覧を固定する
- 最初に触る候補:
  - `README.md`
  - `README.en.md`
  - `docs/release-notes-template.md`
  - `.github/ISSUE_TEMPLATE/`

### 3. preflight kit

- branch: `codex/talking-pets-pr-preflight-kit`
- 目的: 5分 preflight と赤信号表を再利用可能にする
- 最初に触る候補:
  - `docs/goals/talking-pets-hq-japanese/notes/T009-pr1-review-checklist.md`
  - `docs/goals/talking-pets-hq-japanese/notes/T010-pr2-review-checklist.md`
  - `docs/goals/talking-pets-hq-japanese/notes/T011-pr3-outreach-docs-review.md`

## 今回やらないこと

- 3本まとめて同じ branch で実装しない。
- paid API call や destructive uninstall を伴う検証はしない。
- 一般的な学習論だけを書いて終わらせない。
