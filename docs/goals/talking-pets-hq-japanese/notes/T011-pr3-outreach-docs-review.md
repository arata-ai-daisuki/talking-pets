# T011 PR 3 / outreach docs セルフレビューchecklist

Owner role: 白瀬 怜奈

## 対象

PR 3: Roadmap / GoalBuddy / outreach docs

想定stage候補:

```text
docs/ROADMAP.md
docs/research/sns-outreach-strategy.md
docs/research/x-outreach-targets.md
docs/research/sherpa-onnx-design.md
docs/goals/talking-pets-roadmap/
docs/goals/talking-pets-next-tranche/
docs/goals/talking-pets-growth-latency-wave/
docs/goals/talking-pets-routing-diagnostics/
docs/goals/talking-pets-sherpa-onnx-design/
docs/goals/talking-pets-hq-japanese/
implementation-notes.md
```

## レビュー観点

### 1. outreachの安全性

- [ ] 自動返信、自動DM、自動follow、自動likeを前提にしていない。
- [ ] 初回接触でStar依頼をしていない。
- [ ] DMは明示的な招待、返信、follow-upがある場合だけに限定している。
- [ ] private contactや非公開情報を集めない方針になっている。
- [ ] 「萌え」「アニメ」「VTuber」文脈を雑な釣り文句にしていない。

### 2. ターゲット根拠とメッセージが対応しているか

- [ ] Codex系にはCodex UX / local TTS / latencyの話をしている。
- [ ] local voice系にはfirst audio / full utterance / end-to-end turn timeの問いを置いている。
- [ ] AI VTuber / companion系にはdeveloper-tool companionshipの観点を置いている。
- [ ] VOICEVOX系にはoptional local providerとcreditsを明記している。
- [ ] watch-only対象へ無理な初手メッセージを用意していない。

### 3. Roadmapが実装claimと混ざっていないか

- [ ] roadmapは「次に進める候補」であり、完了済み機能の保証として読めない。
- [ ] local TTS / API対応 / 多言語対応の未完了部分をfutureとして扱っている。
- [ ] レイテンシ最適化は測定結果と改善案を分けている。
- [ ] social strategyは手動運用と反応記録を前提にしている。

### 4. GoalBuddy生成物のPR方針

- [ ] 日本語HQ boardは、進捗管理の正本として残す価値がある。
- [ ] 完了済み短期boardの `.goalbuddy-board/` をPRに含めるかは明示的に判断する。
- [ ] boardを含める場合、重い生成物や一時ファイルが混ざっていない。
- [ ] boardを含めない場合でも、`goal.md` / `state.yaml` / `notes/` で経緯を追える。

### 5. implementation-notesの扱い

- [ ] 実装判断、妥協、Master判断待ちを隠していない。
- [ ] PR 1 / PR 2 / PR 3 の境界が読める。
- [ ] 未追跡demo素材をPRに含めない方針が書かれている。
- [ ] sherpa-onnx実験はMaster承認待ちとして残っている。

## 推奨検証コマンド

```bash
node <goalbuddy-check> docs/goals/talking-pets-hq-japanese/state.yaml
rg -n "自動返信|自動DM|Star|DM Policy|First Week Plan|watch only|手動" docs/research/x-outreach-targets.md docs/research/sns-outreach-strategy.md
rg -n "sherpa|onnx|Master|承認|PR 1|PR 2|PR 3|demo素材" implementation-notes.md docs/goals/talking-pets-hq-japanese/notes/T006-stage-manifest.md
```

## 実行済み確認

- GoalBuddy state check: pass。`goal_status: active` / `active_task: T006` のまま。
- outreach guardrails search: pass。手動運用、自動返信/自動DM禁止、初回Star依頼禁止、watch-only対象が確認できた。
- PR split / sherpa approval search: pass。PR 1 / PR 2 / PR 3 の境界と、sherpa-onnx実験がMaster承認待ちであることを確認できた。

## レビュー時の赤信号

- outreach docsが「大量に声をかける」方針に読める。
- 初回メッセージでStarや宣伝色が強い。
- watch-only対象に送信文を用意している。
- GoalBuddyの生成物を全部stageして、PRが巨大で読みにくくなる。
- sherpa-onnx実験を、承認なしに開始済みのように書いている。
