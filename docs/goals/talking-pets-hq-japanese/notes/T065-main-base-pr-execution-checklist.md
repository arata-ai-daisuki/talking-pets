# T065 main-base PR execution checklist

## 結論

T063 / T064を実行に移す時のチェックリストを作った。

このメモでは、worktree作成、branch作成、stage、commit、push、PR作成はしない。

## 現在のworktree状況

```text
<main-workspace>     [codex/talking-pets-latency-routing-diagnostics]
<tmp-worktree-pr2>                        [codex/talking-pets-multilingual-readme-fallback]
<tmp-worktree-pr3>                        [codex/talking-pets-roadmap-goalbuddy-outreach]
```

既存の `<tmp-worktree-pr2>` / `<tmp-worktree-pr3>` は過去PR用なので再利用しない。

## 推奨worktree

```text
<tmp-worktree-hq-post-pr8>
```

推奨branch:

```text
codex/talking-pets-hq-post-pr8-receipts
```

## 実行手順

1. `origin/main` をfetchする。
2. main baseの新worktreeを作る。
3. 現在workspaceからHQ receiptsだけをコピーする。
4. 新worktreeでGoalBuddy checkerを実行する。
5. 新worktreeで `git status --short` を確認する。
6. HQ receipts以外が混ざっていなければstageする。
7. commitする。
8. pushする。
9. PR作成する。
10. PR checksを見る。

## コピー対象

```text
docs/goals/talking-pets-hq-japanese/state.yaml
docs/goals/talking-pets-hq-japanese/notes/T054-pr8-merged-next-local-tts.md
docs/goals/talking-pets-hq-japanese/notes/T055-sherpa-model-public-metadata-check.md
docs/goals/talking-pets-hq-japanese/notes/T056-outreach-day1-post-merge-send-pack.md
docs/goals/talking-pets-hq-japanese/notes/T057-multilingual-current-claim-audit.md
docs/goals/talking-pets-hq-japanese/notes/T058-hq-current-rollup-after-pr8.md
docs/goals/talking-pets-hq-japanese/notes/T059-local-tts-decision-matrix.md
docs/goals/talking-pets-hq-japanese/notes/T060-sherpa-model-license-public-info.md
docs/goals/talking-pets-hq-japanese/notes/T061-local-tts-next-scope-after-license.md
docs/goals/talking-pets-hq-japanese/notes/T062-outreach-day1-recording-guide.md
docs/goals/talking-pets-hq-japanese/notes/T063-next-pr-manifest-after-pr8.md
docs/goals/talking-pets-hq-japanese/notes/T064-next-pr-main-base-preflight.md
docs/goals/talking-pets-hq-japanese/notes/T065-main-base-pr-execution-checklist.md
```

## コマンド案

```bash
git fetch origin main
git worktree add -b codex/talking-pets-hq-post-pr8-receipts <tmp-worktree-hq-post-pr8> origin/main
```

コピーは手作業で対象を限定する。

```bash
node <goalbuddy-check> docs/goals/talking-pets-hq-japanese/state.yaml
git status --short
```

## stage前の停止線

`git status --short` に次が出たら止める:

- `README.md`
- `README.en.md`
- `FUTURE_PLAN.md`
- `implementation-notes.md`
- `presets/`
- `test/fixtures/`
- `docs/demo/`
- `package.json`
- `package-lock.json`

## PR body

T063のPR message案を使う。

## 状態

done。

まだ実行していない。
