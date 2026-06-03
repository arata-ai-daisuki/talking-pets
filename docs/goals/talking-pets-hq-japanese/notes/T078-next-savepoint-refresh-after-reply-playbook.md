# T078 next savepoint refresh after reply playbook

## 結論

T077のoutreach reply playbookが増えたので、PR #9 merge後の次保存点PRは **HQ receipts T069-T078 only** に更新する。

T074 / T076は古いmanifestとして残す。このT078を次savepointの正本にする。

このメモではbranch作成、stage、commit、push、PR作成はしない。

## PR #9状態

- PR: https://github.com/arata-ai-daisuki/talking-pets/pull/9
- state: `OPEN`
- mergeable: `MERGEABLE`
- GitHub CI:
  - ubuntu-latest: success
  - macos-latest: success
  - windows-latest: success

## 次savepointに入れる候補

```text
docs/goals/talking-pets-hq-japanese/state.yaml
docs/goals/talking-pets-hq-japanese/notes/T069-next-decision-one-pager.md
docs/goals/talking-pets-hq-japanese/notes/T070-pr9-final-ci-green.md
docs/goals/talking-pets-hq-japanese/notes/T071-outreach-today-copy-pack.md
docs/goals/talking-pets-hq-japanese/notes/T072-multilingual-fallback-recheck.md
docs/goals/talking-pets-hq-japanese/notes/T073-api-tts-opt-in-boundary.md
docs/goals/talking-pets-hq-japanese/notes/T074-next-savepoint-after-pr9.md
docs/goals/talking-pets-hq-japanese/notes/T075-good-first-issue-drafts.md
docs/goals/talking-pets-hq-japanese/notes/T076-next-savepoint-refresh-after-issues.md
docs/goals/talking-pets-hq-japanese/notes/T077-outreach-reply-playbook.md
docs/goals/talking-pets-hq-japanese/notes/T078-next-savepoint-refresh-after-reply-playbook.md
```

## 入れないもの

```text
README.md
README.en.md
FUTURE_PLAN.md
docs/ROADMAP.md
docs/research/**
.github/**
test/fixtures/**
presets/**
package.json
package-lock.json
docs/demo/**
```

理由:

- T069-T078はHQ運用記録だけ。
- T075はIssue下書きであり、実際の`.github` template変更やIssue作成ではない。
- T077は返信playbookであり、実際の返信送信ではない。
- outreach文面は送信準備であり、送信結果ではない。
- local TTS install-onlyはまだMaster判断待ち。
- API TTSは境界整理だけで、実装やAPI callはしていない。
- 多言語claimは現状整合しており、README変更不要。

## 推奨branch

```text
codex/talking-pets-hq-after-pr9-followups
```

## 検証

PR作成前:

```bash
node <goalbuddy-check> docs/goals/talking-pets-hq-japanese/state.yaml
rg -n "T069|T070|T071|T072|T073|T074|T075|T076|T077|T078|recommend_outreach_first|pr9_merge_ready|outreach_today_copy_pack_ready|multilingual_claim_still_accurate|api_tts_opt_in_boundary_ready|good_first_issue_drafts_ready|outreach_reply_playbook_ready" docs/goals/talking-pets-hq-japanese/state.yaml docs/goals/talking-pets-hq-japanese/notes/T0{69,70,71,72,73,74,75,76,77,78}-*.md
git status --short
```

Stage後:

```bash
git diff --cached --name-only
```

期待:

- `docs/goals/talking-pets-hq-japanese/**` だけ。
- README、package、fixture、demo素材、`.github` が混ざらない。

## 次のMaster判断

PR #9 merge後の実行順はこれが自然。

1. T071から最大2件の手動outreachを送る。
2. 送信後、T007へ送信ログを貼る。
3. 返信が来たらT077から返答案を選ぶ。
4. 反応が出たらT075のgood first issue候補から1件だけ作るか判断する。
5. local TTSは、必要になったらT069のAで `npm install` だけ試す。

## 状態

done。

PR #9 merge、Issue作成、outreach送信、返信送信、npm install、model download、API callはしていない。
