# T021 PR 2 preflight

Owner role: 白瀬 怜奈

## 目的

MasterがPR 2実行を許可した時に、stage直前で混入や取りこぼしがないか確認する。

このメモではまだ `git add`、commit、push、PR作成はしない。

## PR 2候補

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

## 現在の差分状態

tracked差分:

```text
FUTURE_PLAN.md
README.en.md
README.md
presets/speech-style.json
presets/voices.json
```

untrackedだがPR 2に入れる:

```text
test/fixtures/en-rollout.jsonl
test/fixtures/ja-rollout.jsonl
test/fixtures/ko-rollout.jsonl
test/fixtures/symbol-only-rollout.jsonl
test/fixtures/zh-rollout.jsonl
test/fixtures/zh-traditional-rollout.jsonl
```

## stage前チェック

- [ ] PR 2候補11ファイルだけをstageする。
- [ ] `package.json` はstageしない。
- [ ] `scripts/pet-rollout-monitor.mjs` はstageしない。
- [ ] `scripts/tts-kokoro.mjs` はstageしない。
- [ ] `scripts/tts-voicebox.mjs` はstageしない。
- [ ] `scripts/latency-benchmark.mjs` はstageしない。
- [ ] `docs/performance.md` はstageしない。
- [ ] `docs/ROADMAP.md` / `docs/research/**` / `docs/goals/**` はstageしない。
- [ ] `implementation-notes.md` はPR 3へ寄せるためstageしない。
- [ ] `docs/demo/*.mp4` / `docs/demo/*.png` はstageしない。

## stageコマンド

Master承認後にだけ実行する。

```bash
git add README.md README.en.md FUTURE_PLAN.md presets/speech-style.json presets/voices.json test/fixtures/ja-rollout.jsonl test/fixtures/en-rollout.jsonl test/fixtures/ko-rollout.jsonl test/fixtures/zh-rollout.jsonl test/fixtures/zh-traditional-rollout.jsonl test/fixtures/symbol-only-rollout.jsonl
```

## stage後の確認コマンド

stageした後に実行する。

```bash
git diff --cached --name-only
```

期待値:

```text
FUTURE_PLAN.md
README.en.md
README.md
presets/speech-style.json
presets/voices.json
test/fixtures/en-rollout.jsonl
test/fixtures/ja-rollout.jsonl
test/fixtures/ko-rollout.jsonl
test/fixtures/symbol-only-rollout.jsonl
test/fixtures/zh-rollout.jsonl
test/fixtures/zh-traditional-rollout.jsonl
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
- PR 2 tracked差分5ファイルとuntracked fixtures 6本を再確認した。

## commit案

```bash
git commit -m "Align multilingual fallback docs and fixtures"
```

## 赤信号

- `git diff --cached --name-only` にlatency実装、GoalBuddy、outreach docs、demo素材が混ざる。
- fixture 6本のどれかをstageし忘れる。
- READMEで `ko` / `zh` を専用TTS provider対応済みに見せている。
- README冒頭のStar導線がoutreach初手Star依頼と混同される。
- `zh-traditional-rollout.jsonl` を自然な中国語発話品質の保証として扱う。

## 現在の判断

PR 2はpreflight上ready。

ただしPR 2のREADME diagnostics説明はPR 1の実装に依存するため、PR 1保存点の後に進めるのが自然。
