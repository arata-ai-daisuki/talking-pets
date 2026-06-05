# T001 Feature Expansion Sequence

## Objective

機能拡張ゴールの最初の実装順序を決める。

## Scope

対象は、対応ローカルTTS、対応言語、Voice系LLM/API、ユーザー好み反映、性能改善、インストーラー高度化、更新、アンインストール。

## Draft Direction

最初の小PR候補は、provider capability registryを追加すること。

理由:

- ユーザー設定、言語対応、diagnostics、README claim、latency表の土台になる。
- 依存追加やmodel downloadなしで進められる。
- 機能アップデートとして「Talking Pets can now show what voice providers and languages are available on your setup」と言いやすい。

ただしinstaller/update/uninstallは、provider registryの後に早めにJudgeする。

理由:

- providerごとにmodel cache、external runtime、API secret、config保持の扱いが違う。
- uninstall/update設計がないままproviderを増やすと、後から削除/更新の責任境界が曖昧になる。
- 初見ユーザーにとって「消せる」「更新できる」は機能追加と同じくらい安心材料になる。

## Stop Lines

- 依存追加しない。
- model downloadしない。
- API callしない。
- secretを保存しない。
- Korean / Chineseをdedicated provider supportとしてclaimしない。
- uninstall/updateで既存設定やcacheを確認なしに削除しない。

## Receipt

- decision: `feature_expansion_sequence`
- owner: `相庭 愛 / 白瀬 怜奈`
- status: done
- result: feature expansion sequence decided
- decision summary: 最初の小PRはprovider capability registryにする。直後にinstaller/update/uninstall安全設計をJudgeカードとして切る。
- evidence:
  - `scripts/pet-rollout-monitor.mjs` にprovider選択、言語routing、`--list-voices`、`--diagnose-routing` が集まっている。
  - `presets/voices.json` と `scripts/check-config-files.mjs` は既に言語別engine境界を持っている。
  - `install.command` / `install.sh` / `install.ps1` はprovider configを書けるが、update/uninstall導線はまだ薄い。
  - `scripts/check-installer-configs.mjs` はinstaller出力と生成envを検証しているため、今後のupdate/uninstall検証の足場になる。
- first small PR:
  - provider capability registryを `presets/provider-capabilities.json` か `src/provider-capabilities.js` に追加する。
  - CLI/dry-runから参照し、providerごとの言語、status、download/API要否、fallback-only/provider-specific境界を表示する。
  - 依存追加、model download、API call、README support claim変更はしない。
- next sequence:
  - T002: provider capability registry最小実装。
  - T006: installer/update/uninstall安全設計。
  - T003: user preference config。
  - T004: latency benchmark出力改善。
  - T005: Voice/API opt-in境界調査。
- agent comments:
  - 相庭 愛: 「最初はregistryです。ここがないと設定、言語、latency、installerの責任境界が全部ふわっとします。」
  - 歌澄 音羽: 「provider一覧を機械可読にすると、VOICEVOX/Irodori/Kokoro/Melo/sherpa/APIの扱いを同じ画面で説明できます。」
  - 月城 奏: 「installerは二番手で設計します。provider cacheやexternal runtimeの扱いをregistryと接続したいです。」
  - 白瀬 怜奈: 「registryはsupport claimではありません。claimを強めず、現状と承認待ちを明示します。」
- next: T002 provider capability registryをactiveにする。
