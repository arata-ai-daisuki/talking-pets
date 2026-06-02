# T013 PR 2 stage精査メモ

Owner role: 文月 栞里

## 対象

PR 2: 多言語fallback claimとfixtures

stage候補:

```text
README.md
README.en.md
FUTURE_PLAN.md
presets/speech-style.json
presets/voices.json
test/fixtures/ja-rollout.jsonl
test/fixtures/en-rollout.jsonl
test/fixtures/ko-rollout.jsonl
test/fixtures/zh-rollout.jsonl
test/fixtures/zh-traditional-rollout.jsonl
test/fixtures/symbol-only-rollout.jsonl
```

## 差分確認

既存tracked差分:

```text
README.md
README.en.md
FUTURE_PLAN.md
presets/speech-style.json
presets/voices.json
```

未追跡だがPR 2へ含めるべき差分:

```text
test/fixtures/ja-rollout.jsonl
test/fixtures/en-rollout.jsonl
test/fixtures/ko-rollout.jsonl
test/fixtures/zh-rollout.jsonl
test/fixtures/zh-traditional-rollout.jsonl
test/fixtures/symbol-only-rollout.jsonl
```

## PR 2に入れてよい理由

- README / README.en は `ko` / `zh` を専用TTSではなくOS speech fallbackとして説明している。
- README / README.en はrouting diagnosticsの確認方法を追加している。
- README冒頭のStar導線は、初手outreachのStar依頼ではなく、repo訪問者向けの自然な導線として扱える。
- FUTURE_PLANは `ko` / `zh` を「今後の専用provider候補」と「現時点のfallback」とで分けている。
- presetsは `ko` / `zh` のfallback文とvoice routingを追加している。
- fixturesは `ja` / `en` / `ko` / `zh` / `zh-traditional` / `symbol-only` をdry-runで確認するための最小JSONL。

## PR 2に入れないもの

```text
package.json
scripts/pet-rollout-monitor.mjs
scripts/tts-kokoro.mjs
scripts/tts-voicebox.mjs
scripts/latency-benchmark.mjs
docs/performance.md
docs/ROADMAP.md
docs/research/**
docs/goals/**
implementation-notes.md
docs/demo/*.mp4
docs/demo/*.png
```

理由:

- レイテンシ計測とdiagnostics実装はPR 1へ寄せる。
- Roadmap / outreach / GoalBuddy / implementation-notesはPR 3へ寄せる。
- demo素材は未追跡で、PR 2の多言語fallbackとは別判断。

## stageするならこのコマンド

まだ実行していない。Masterが `PR分割/commitを優先` を選んだ後に使う。

```bash
git add README.md README.en.md FUTURE_PLAN.md presets/speech-style.json presets/voices.json test/fixtures/ja-rollout.jsonl test/fixtures/en-rollout.jsonl test/fixtures/ko-rollout.jsonl test/fixtures/zh-rollout.jsonl test/fixtures/zh-traditional-rollout.jsonl test/fixtures/symbol-only-rollout.jsonl
```

## PR 2検証コマンド

```bash
npm run check:syntax
npm run test:dry-run
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ko-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-traditional-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/symbol-only-rollout.jsonl
```

## 実行済み確認

- GoalBuddy state check: pass。`goal_status: active` / `active_task: T006` のまま。
- `npm run check:syntax`: pass。
- `npm run test:dry-run`: pass。
- `ko-rollout.jsonl` diagnostics: pass。`detectedLanguage=ko` / `effectiveLanguage=ko` / OS speech fallback。
- `zh-traditional-rollout.jsonl` diagnostics: pass。`detectedLanguage=zh` / `effectiveLanguage=zh` / OS speech fallback。
- `symbol-only-rollout.jsonl` diagnostics: pass。`detectedLanguage=other` / `effectiveLanguage=other` / `spokenText=New message.` / OS speech fallback。

## 判断

PR 2は小さく切れる。

注意点は3つ:

- READMEのdiagnostics説明はPR 1の実装に依存するため、PR 1を先に入れる方が自然。
- `zh-traditional-rollout.jsonl` はsource全体では `zh` fallbackに行くが、summary後の `spokenText` は先頭文が落ちる。自然な中国語発話品質の保証には使わない。
- README冒頭のStar導線はrepo内の導線としてはOK。ただしoutreach初手メッセージでStar依頼をしない方針は維持する。
