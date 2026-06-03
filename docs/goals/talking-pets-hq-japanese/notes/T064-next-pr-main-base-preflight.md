# T064 next PR main-base preflight

## 結論

T063のHQ receipts保存PRは、現在のworkspace branchから直接切らない。

理由:

- 現在branchは `codex/talking-pets-latency-routing-diagnostics`。
- これはPR #6系の古いbranchで、`origin/main` よりbehindしている。
- `docs/goals/talking-pets-hq-japanese/*` は現在workspaceでは未tracked。
- `origin/main` にはT044までのHQ receiptsと `state.yaml` がtracked済み。

したがって、次PR実行時は main base のworktreeで作業する。

## 確認結果

現在branch:

```text
codex/talking-pets-latency-routing-diagnostics
```

`origin/main` 側に存在する範囲:

```text
docs/goals/talking-pets-hq-japanese/state.yaml
docs/goals/talking-pets-hq-japanese/notes/T001...T044
docs/goals/talking-pets-hq-japanese/notes/T999-hq-continuation-audit.md
```

現在workspaceで未trackedの次PR候補:

```text
docs/goals/talking-pets-hq-japanese/state.yaml
docs/goals/talking-pets-hq-japanese/notes/T054-pr8-merged-next-local-tts.md
docs/goals/talking-pets-hq-japanese/notes/T063-next-pr-manifest-after-pr8.md
```

注:

`git status --short -- <subset>` では一部だけ見えているが、`docs/goals/` 全体は未trackedのため、T055からT062も次PR候補に含める。

## 次PR実行時の安全手順

1. `origin/main` から新しいworktreeを作る。
2. 現在workspaceのHQ state / T054-T063 notesだけを新worktreeへコピーする。
3. 新worktreeでGoalBuddy checkerを実行する。
4. 新worktreeで `git status --short` を確認し、HQ receipts以外が混ざっていないことを確認する。
5. 問題なければstage / commit / push / PR作成へ進む。

## 入れるファイル

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
```

## 入れないファイル

```text
README.md
README.en.md
FUTURE_PLAN.md
implementation-notes.md
presets/*.json
test/fixtures/*.jsonl
docs/demo/*.mp4
package.json
package-lock.json
```

## 状態

done。

branch作成、stage、commit、push、PR作成はしていない。
