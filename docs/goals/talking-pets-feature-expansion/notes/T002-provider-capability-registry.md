# T002 Provider Capability Registry

## Objective

provider capability registryの最小実装を追加する。

## Desired User Value

ユーザーが、自分の環境でどのTTS providerと言語が使えるのか、どこがfallback-onlyなのか、どこから先が承認待ちなのかを確認できるようにする。

## Initial Implementation Shape

- provider metadataを機械可読な形で持つ。
- providerごとに以下を表現する。
  - status: `available`, `optional`, `external-runtime`, `design-only`, `approval-gated`
  - languages: `provider-specific`, `fallback-only`, `unknown`
  - needsModelDownload
  - needsExternalRuntime
  - needsApiKey
  - defaultRouteEligible
  - publicClaimLevel
- `--list-voices` または `--diagnose-routing` の近くで、registry由来の情報を見られるようにする。

## Stop Lines

- 新しいprovider依存を追加しない。
- model downloadしない。
- API callしない。
- secretを保存しない。
- README support claimを強めない。
- Korean / Chineseをdedicated provider supportとしてclaimしない。

## Agent Comments

- 歌澄 音羽: 「声を増やす前に、いま何が使えて何が承認待ちかを一覧化します。」
- 言守 詞葉: 「言語対応は強い言葉に見えやすいので、fallback-onlyをmetadataで明示します。」
- 白瀬 怜奈: 「これはclaimではなくregistryです。実装中もREADMEの表現を強めないでください。」

## Receipt

- decision: `provider_capability_registry`
- owner: `歌澄 音羽 / 言守 詞葉`
- status: done
- result: done
- implementation:
  - `src/provider-capabilities.js` にprovider capability registryを追加。
  - `scripts/pet-rollout-monitor.mjs --list-provider-capabilities` でregistryをJSON表示。
  - `--diagnose-routing` の出力に `capability` を追加し、選ばれたproviderのstatus、languageSupport、model/API/runtime要否を表示。
  - `test/monitor.test.mjs` でprovider-specific / fallback-only / unknownの境界を固定。
  - `docs/research/tts-provider-comparison.md` に確認コマンドと読み方を追加。
- changed_files:
  - `src/provider-capabilities.js`
  - `scripts/pet-rollout-monitor.mjs`
  - `test/monitor.test.mjs`
  - `package.json`
  - `scripts/check-npm-pack.mjs`
  - `docs/research/tts-provider-comparison.md`
- verification:
  - `node scripts/pet-rollout-monitor.mjs --list-provider-capabilities`
  - `node scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ko-zh-rollout.jsonl`
  - `npm run check:all`
- verification_result: pass
- next: `T006 installer/update/uninstall安全設計`へ進む。既存設定、cache、external runtime、rollback境界を先に固める。

## Agent Completion Comments

- 歌澄 音羽: 「声の候補が一覧で見えるようになりました。次にuser preferenceでこの表を使えるようにします。」
- 言守 詞葉: 「韓国語/中国語はfallback-onlyとして診断に出ます。これでsupport claimの言い過ぎを防げます。」
- 白瀬 怜奈: 「依存追加、model download、API call、secret保存は発生していません。次はinstallerの破壊境界を見ます。」
