# T005 差分整理 / handoffメモ

Owner role: 文月 栞里

## 目的

ここまでの変更が大きくなっているため、PR化・commit・次回レビューのために差分を整理する。

## 実装系の変更

- `scripts/pet-rollout-monitor.mjs`
  - `--profile-latency` を追加。
  - `--diagnose-routing` を追加。
  - `ko` / `zh` / `other` のfallback理由をJSONで確認できるようにした。

- `scripts/latency-benchmark.mjs`
  - 複数回dry-run benchmarkを実行し、`minMs` / `p50Ms` / `p95Ms` / `maxMs` を出す。
  - `--out` でJSON receiptを保存できる。

- `scripts/tts-kokoro.mjs`
  - `--profile-latency` を追加。

- `scripts/tts-voicebox.mjs`
  - `--profile-latency` を追加。

- `package.json`
  - `benchmark:dry-run`
  - `benchmark:latency`
  - `check:syntax` に `scripts/latency-benchmark.mjs` を追加。

## docs / GoalBuddy

- `docs/ROADMAP.md`
  - STELLAVOX体制とロードマップ。

- `docs/performance.md`
  - レイテンシ計測方法、測定範囲、次の最適化候補。

- `docs/research/x-outreach-targets.md`
  - X/Reddit/GitHub向けの手動outreach候補と返信案。

- `docs/research/sherpa-onnx-design.md`
  - `sherpa-onnx-node` の設計spike。依存追加・model downloadなし。

- `docs/goals/talking-pets-hq-japanese/`
  - 継続activeな日本語HQ看板。

- 完了済みGoalBuddy board
  - `talking-pets-roadmap`
  - `talking-pets-next-tranche`
  - `talking-pets-growth-latency-wave`
  - `talking-pets-routing-diagnostics`
  - `talking-pets-sherpa-onnx-design`

## 多言語fixture

追加:

- `test/fixtures/ja-rollout.jsonl`
- `test/fixtures/en-rollout.jsonl`
- `test/fixtures/ko-rollout.jsonl`
- `test/fixtures/zh-rollout.jsonl`
- `test/fixtures/zh-traditional-rollout.jsonl`
- `test/fixtures/symbol-only-rollout.jsonl`

確認したclaim:

- 日本語はVOICEVOX route。
- 英語はKokoro route。
- 韓国語・中国語・その他はOS speech fallback。
- `ko` / `zh` は専用TTS provider対応ではない。

## outreach

送信はしていない。

Masterが手動送信する候補:

- OpenClaw / Sogni Voice
- V1GPT
- V1R4

送信メモ:

- `docs/goals/talking-pets-hq-japanese/notes/T001-outreach-send-prep.md`

## 未追跡demo素材

次の未追跡demo素材は、今回の実装作業では触っていない。PR化前に含めるか分けるか判断が必要。

- `docs/demo/talking-pets-overlay-2026-05-28-x-1280x720-speedramps-x4.mp4`
- `docs/demo/talking-pets-overlay-2026-05-28-x-1280x720.mp4`
- `docs/demo/talking-pets-overlay-2026-05-28-x4-frame.png`

## 次の判断

1. sherpa-onnx-node実験を許可するか。
2. outreachをXだけで行うか、Reddit/GitHub public threadも許可するか。
3. この大きな差分を1PRにするか、以下のように分割するか。

推奨分割:

- PR 1: レイテンシ計測とrouting diagnostics。
- PR 2: 多言語fixtureとREADME claim整合。
- PR 3: ROADMAP / GoalBuddy / outreach docs。

## 検証済み

- `npm run check:syntax`
- `npm run test:dry-run`
- `node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-traditional-rollout.jsonl`
- `check-goal-state docs/goals/talking-pets-hq-japanese/state.yaml`
