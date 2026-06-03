# T039 PR1 conflict解消とCI確認

Owner role: 白瀬 怜奈

## 目的

PR #6 作成後に GitHub 上で `mergeable: CONFLICTING` になっていたため、origin/main の公開プレビュー更新を取り込み、PR1のlatency / diagnostics機能を維持したまま conflict を解消する。

## 実行結果

PR #6 は conflict 解消済み。

```text
PR: https://github.com/arata-ai-daisuki/talking-pets/pull/6
branch: codex/talking-pets-latency-routing-diagnostics
merge commit: f0b6af4 Merge main into latency diagnostics PR
mergeable: MERGEABLE
```

## 解消方針

- origin/main の公開プレビュー整備を保持した。
- `package.json` の公開チェック群を保持しつつ、`scripts/latency-benchmark.mjs` のsyntax checkとbenchmark scriptsを追加した。
- `scripts/pet-rollout-monitor.mjs` はmain側のprivate path redactionを保持しつつ、`--profile-latency` と `--diagnose-routing` を再適用した。
- `scripts/tts-kokoro.mjs` と `scripts/tts-voicebox.mjs` はmain側のcross-platform playbackを保持しつつ、`--profile-latency` を再適用した。

## ローカル検証

一時worktree `/private/tmp/talking-pets-pr1-update` で実行。

```bash
npm run check:syntax
npm run test:dry-run
npm run benchmark:latency -- --runs 5
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ko-zh-rollout.jsonl
```

結果:

- syntax: pass
- dry-run: pass
- benchmark: pass
- routing diagnostics: pass

## GitHub CI

```text
Node checks (macos-latest): pass
Node checks (ubuntu-latest): pass
Node checks (windows-latest): pass
```

## 片付け

conflict解消用の一時worktreeは削除済み。

## 状態

done。

次はPR2保存点、outreach手動送信、local TTS実験の判断待ち。
