# T003 User Preference Config

## Objective

user preference configの最小schemaを追加し、language、voice/provider優先度、speed/quality preference、API opt-inをdry-runで反映できるようにする。

## Desired User Value

ユーザーが「日本語はこの声、英語はこのprovider、速さ優先、APIは使わない」のような好みを、手元の設定で安全に表現できるようにする。

## Initial Shape

- provider capability registryを参照する。
- secret値は保存しない。
- API opt-inはbooleanやprovider idだけを保存し、API key本体は環境変数や外部secret storeに残す。
- `--dry-run` または `--diagnose-routing` で、どのpreferenceが使われたかを表示する。

## Stop Lines

- API keyをdocs、fixtures、logs、configへ保存しない。
- API opt-in未設定時に外部送信しない。
- provider-specific evidenceがない言語をdedicated supportとして扱わない。
- installerで既存configを確認なしに上書きしない。

## Agent Comments

- 相庭 愛: 「ここから“好みを反映できるTalking Pets”に入ります。」
- 歌澄 音羽: 「声とprovider優先度はregistryとつなげます。存在しないproviderは診断で止めます。」
- 白瀬 怜奈: 「API opt-inは形だけ先に作り、secretと外部送信は別PRの承認ゲートにします。」

## Receipt

- decision: `user_preference_config`
- owner: `相庭 愛 / 歌澄 音羽`
- status: done
- result: done
- implementation:
  - `src/user-preferences.js` にuser preference configの最小schemaを追加。
  - `presets/preferences.local-first.json` にlocal-firstのサンプル設定を追加。
  - `scripts/pet-rollout-monitor.mjs --preferences <path>` でpreferenceを読み、`--diagnose-routing` にsafe summaryを表示。
  - API opt-inはbooleanのみ。API key、secret、外部送信、paid callは扱わない。
  - `scripts/check-config-files.mjs` とunit testでschemaを検証。
  - README / README.en に設定例を追加。
- changed_files:
  - `src/user-preferences.js`
  - `presets/preferences.local-first.json`
  - `scripts/pet-rollout-monitor.mjs`
  - `scripts/check-config-files.mjs`
  - `test/monitor.test.mjs`
  - `package.json`
  - `README.md`
  - `README.en.md`
  - `docs/goals/talking-pets-feature-expansion/notes/T003-user-preference-config.md`
  - `docs/goals/talking-pets-feature-expansion/activity-log.md`
  - `docs/goals/talking-pets-feature-expansion/state.yaml`
- verification:
  - `npm run check:config`
  - `node --no-warnings --test`
  - `node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --preferences presets/preferences.local-first.json --rollout test/fixtures/ko-zh-rollout.jsonl`
  - `CLANG_MODULE_CACHE_PATH=/private/tmp/talking-pets-clang-module-cache npm run check:all`
- verification_result: pass
- next: `T004 latency benchmark出力改善`へ進む。first audio、total、RTF、端末情報つきの機能アップデート用出力へ進める。

## Agent Completion Comments

- 相庭 愛: 「ユーザーの好みをJSONで表現できる入口ができました。API keyは絶対に入れない設計です。」
- 歌澄 音羽: 「provider優先度と声の好みがrouting diagnosticsに見えるようになりました。」
- 白瀬 怜奈: 「韓国語/中国語は引き続き`say` fallback-first。provider-specific claimは増やしていません。」
