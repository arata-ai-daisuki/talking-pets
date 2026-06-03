# T006 PR分割・次優先度メモ

Owner role: 相庭 愛

## 状態

Master判断待ちを維持しつつ、安全に進められるPR分割準備を完了。

実行していないこと:

- stageしていない。
- commitしていない。
- pushしていない。
- sherpa-onnx-nodeをinstallしていない。
- model downloadしていない。
- outreach投稿/DMしていない。

## 推奨PR分割

### PR 1: レイテンシ計測とrouting diagnostics

目的:

- monitor / TTS helperの計測を入れる。
- routing判断をJSONで確認できるようにする。
- 通常dry-run出力を壊していないことを示す。

含める候補:

- `scripts/pet-rollout-monitor.mjs`
- `scripts/tts-kokoro.mjs`
- `scripts/tts-voicebox.mjs`
- `scripts/latency-benchmark.mjs`
- `package.json`
- `docs/performance.md`
- `implementation-notes.md` の該当節

確認:

- `npm run check:syntax`
- `npm run test:dry-run`
- `npm run benchmark:latency -- --runs 5`
- `node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-rollout.jsonl`

### PR 2: 多言語fallback claimとfixtures

目的:

- `ko` / `zh` を専用TTS対応ではなくfirst-class fallbackとして扱う。
- READMEのpreset抜粋と実際の `presets/voices.json` を揃える。
- fixtureで日本語/英語/韓国語/簡体字/繁体字/記号のみを確認できる。

含める候補:

- `README.md`
- `README.en.md`
- `FUTURE_PLAN.md`
- `presets/speech-style.json`
- `presets/voices.json`
- `test/fixtures/ja-rollout.jsonl`
- `test/fixtures/en-rollout.jsonl`
- `test/fixtures/ko-rollout.jsonl`
- `test/fixtures/zh-rollout.jsonl`
- `test/fixtures/zh-traditional-rollout.jsonl`
- `test/fixtures/symbol-only-rollout.jsonl`

確認:

- `npm run test:dry-run`
- `node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ko-rollout.jsonl`
- `node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-traditional-rollout.jsonl`

### PR 3: Roadmap / GoalBuddy / outreach docs

目的:

- STELLAVOX体制、ロードマップ、HQ看板、outreach手動メモを残す。
- 完了済みの波を履歴化し、日本語HQを継続activeにする。

含める候補:

- `docs/ROADMAP.md`
- `docs/research/sns-outreach-strategy.md`
- `docs/research/x-outreach-targets.md`
- `docs/research/sherpa-onnx-design.md`
- `docs/goals/**`
- `implementation-notes.md` のGoalBuddy/outreach該当節

確認:

- `check-goal-state docs/goals/talking-pets-hq-japanese/state.yaml`
- `curl -s http://goalbuddy.localhost:41737/api/boards`

## PRに入れない候補

以下は別判断:

- `docs/demo/talking-pets-overlay-2026-05-28-x-1280x720-speedramps-x4.mp4`
- `docs/demo/talking-pets-overlay-2026-05-28-x-1280x720.mp4`
- `docs/demo/talking-pets-overlay-2026-05-28-x4-frame.png`
- `docs/goals/.DS_Store`

demo素材は公開見せ方に関係するが、今回のGoalBuddy/latency/diagnostics PR群と混ぜると差分が重くなる。

`.DS_Store` はPRに含めない。

## 次のMaster判断

おすすめ順:

1. PR分割/commitを優先
   - ここまでの成果が大きいので、先に保存点を作るのが安全。

2. outreach手動送信を優先
   - `T001-outreach-send-prep.md` を見ながら、day-1最大2件だけ送る。

3. sherpa-onnx実験を許可
   - 依存追加とmodel downloadが入るので、PR分割後の方が安全。

## あいちゃん推奨

次は `PR分割/commitを優先`。

理由:

- 現在の差分は実装、docs、GoalBuddy、research、fixturesが混ざっている。
- local TTS実験へ進む前に、今の成果を小さく安全に保存した方が戻りやすい。
- outreachは送信前にrepoの見え方が安定している方がよい。
