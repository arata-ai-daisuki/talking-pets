# T999 Final Audit

## 担当

- 相庭 愛: Producer
- 白瀬 怜奈: Judge

## 目的

声と好みの機能開発ゴールの10条件すべてが、現在のmainで証拠つき達成済みか確認する。

## 監査対象

1. provider capability registry
2. user preference config
3. local TTS provider改善または追加
4. 多言語routing diagnostics
5. Voice/API opt-in境界
6. latency benchmark
7. README/docs反映
8. `npm run check:all`
9. 機能アップデート成果物
10. installer update/uninstall安全導線

## 停止線

- 弱い証拠で完了扱いしない。
- 未達条件があれば、次のWorker/Judgeタスクを作る。

## 監査結果

| 条件 | 判定 | 証拠 |
| --- | --- | --- |
| 1. provider capability registry | 達成 | `src/provider-capabilities.js`、`npm run monitor:node -- --list-provider-capabilities` |
| 2. user preference config | 達成 | `src/user-preferences.js`、`presets/preferences.local-first.json`、`--preferences` diagnostics |
| 3. local TTS provider改善または追加 | 達成 | Irodori TTS Server route/helper/docsがmainにあり、`scripts/tts-irodori.mjs`、`package.json` `tts:irodori`、README Irodori導線で確認できる |
| 4. 多言語routing diagnostics | 達成 | `ko-zh-rollout.jsonl` と `--diagnose-routing` が `fallback-only` / `provider-specific` / `unknown` を分ける |
| 5. Voice/API opt-in境界 | 達成 | `docs/research/api-tts-design-note.md`、`openai-compatible-local`、`openai-tts-api`、`voice-api` registry |
| 6. latency benchmark | 達成 | `npm run benchmark:latency -- --runs 2 --format markdown` がdevice info、total、firstAudio境界を出す |
| 7. README/docs反映 | 達成 | README/README.en、`docs/feature-update-voice-personalization.md`、`docs/install-update-uninstall.md` |
| 8. `npm run check:all` | 達成 | `CLANG_MODULE_CACHE_PATH=/private/tmp/talking-pets-clang-module-cache npm run check:all` pass |
| 9. 機能アップデート成果物 | 達成 | `docs/feature-update-voice-personalization.md` にX draftとreport checklist |
| 10. installer update/uninstall安全導線 | 達成 | `npm run maintenance:plan -- --uninstall --dry-run` が保持、削除候補、external runtime、cache、secret境界、rollbackを表示 |

## 実行した確認

- `npm run monitor:node -- --list-provider-capabilities`
- `npm run monitor:node -- --once --dry-run --diagnose-routing --preferences presets/preferences.local-first.json --rollout test/fixtures/ko-zh-rollout.jsonl`
- `npm run maintenance:plan -- --uninstall --dry-run`
- `npm run benchmark:latency -- --runs 2 --format markdown`
- `CLANG_MODULE_CACHE_PATH=/private/tmp/talking-pets-clang-module-cache npm run check:all`

## 結論

声と好みの機能開発ゴールの最初の実装波は完了。

次の波では、local providerの深掘り、API opt-inの最小実装、installer automationのdry-run超え、またはcontributor evidence収集を選べる。
