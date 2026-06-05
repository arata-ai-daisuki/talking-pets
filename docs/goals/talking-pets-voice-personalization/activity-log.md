# Voice Personalization Activity Log

声と好みの機能開発ゴールの活動ログです。

## 2026-06-05

### Reboot

- 相庭 愛: 「方針を機能開発中心へ切り替えました。旧看板は履歴として残し、新看板で声、言語、TTS/API、installer、性能改善を追います。」
- 白瀬 怜奈: 「claim境界は引き続き厳しめに見ます。特にAPI、secret、model download、support表現は停止線を置きます。」
- 歌澄 音羽: 「provider registryとpreferencesは既に土台があります。次はlocal TTSをユーザー体験に近づけます。」
- 言守 詞葉: 「多言語は増やすだけでなく、fallback-onlyとprovider-specificを分けるのが大事です。」
- 速水 光莉: 「T004のlatency出力改善はチェックポイント保存済みです。必要なら新ゴールで再利用します。」
- 月城 奏: 「installerは高度化、更新、アンインストール、external runtime download/installまで段階的に扱います。」
- 星乃 玲: 「機能アップデートとして見える成果を、READMEとXで説明できる形にしていきます。」

### Handoff

Next active task: `T001 worktree-goal-switch-audit`

ProducerからJudgeへ:

> 旧feature-expansionの途中成果、現在のブランチ、旧GoalBuddyを棚卸しし、新しいvoice-personalization看板へ安全に切り替えてください。破壊操作はせず、再利用候補と畳む候補を分けること。

### T001 Judge Result

- 相庭 愛: 「新しいGoalBuddyを `talking-pets-voice-personalization` として切りました。旧HQと旧feature-expansionは履歴として残します。」
- 白瀬 怜奈: 「T004 latency成果は削除せず、`codex/talking-pets-latency-benchmark-output` のcommit `fc131f1` に保存しました。」
- 速水 光莉: 「次はこのcheckpointを新ゴールのT002としてmainへ取り込み、性能改善の見える成果にします。」

Handoff:

> T002 Workerへ: 保存済みlatency benchmark output改善を新ゴールへ取り込んでください。実音声、model download、外部API callはしないこと。1端末の数字を保証値として書かず、協力者報告フォーマットとして扱ってください。

### T002 Worker Result

- 速水 光莉: 「latency benchmarkがJSON/Markdown/CSVで出せるようになりました。device infoも入ります。」
- 白瀬 怜奈: 「dry-runでは音を鳴らさないので、first audioは `not_measured` と明記しています。性能保証にはしていません。」
- 星乃 玲: 「Markdown/CSVは協力者からの報告やREADME用の下書きに使いやすい形です。」

Handoff:

> T003 Workerへ: 次はlocal TTS providerと言語対応を、provider registry、preferences、routing diagnostics、READMEへ接続してください。新規providerは証拠なしにsupportedとclaimせず、model downloadが必要なものはdry-run/docs境界から始めること。

### T003 Worker Result

- 歌澄 音羽: 「preferencesのprovider優先度が、routing diagnosticsの `providerSelection` として見えるようになりました。」
- 言守 詞葉: 「候補providerごとの `supportLevel` と `selectable` を出します。未検証providerは `unknown` のままなので、対応済みclaimにはなりません。」
- 白瀬 怜奈: 「fallback-onlyとprovider-specificの境界を守ったまま、なぜそのproviderが選ばれたかを説明できます。」

Handoff:

> T004 Scoutへ: Voice系LLM/API providerのopt-in境界を調査してください。remote API、OpenAI-compatible local API、secret/privacy/billingを分け、paid call/API key作成/secret保存はしないこと。

### T004 Scout Result

- 白瀬 怜奈: 「OpenAI-compatible local endpointとremote OpenAI TTS APIをregistry上で分けました。」
- 歌澄 音羽: 「local endpointは外部runtime所有、remote APIはAPI key/課金/text送信/disclosure境界つきです。」
- 相庭 愛: 「公式OpenAI TTS docsは確認しましたが、API call、API key作成、secret保存、依存追加はしていません。」

Handoff:

> T005 Workerへ: installer高度化へ進んでください。update、uninstall、external runtime download/install、config保持、cache削除選択、rollbackをdocsまたはdry-runで安全に見える化してください。削除やuninstall実行はしないこと。

### T005 Worker Result

- 月城 奏: 「`npm run maintenance:plan -- --update --dry-run` と `--uninstall --dry-run` を追加しました。」
- 白瀬 怜奈: 「削除、download、config変更、secret探索は一切しません。計画を出すだけです。」
- 相庭 愛: 「保持される設定、削除候補、external runtime、cache、rollbackが表とJSONで見えます。」

Handoff:

> T006 Scoutへ: 機能アップデートとして見えるREADME/SNS導線を整理してください。latency、providerSelection、API boundary、maintenance dry-runを短く説明できる形にし、未検証の性能claimはしないこと。

### T006 Scout Result

- 星乃 玲: 「機能アップデートまとめを `docs/feature-update-voice-personalization.md` に作りました。」
- 相庭 愛: 「README/README.enから辿れます。X投稿下書きもありますが、投稿はMaster手動です。」
- 白瀬 怜奈: 「性能保証、API TTS対応済み、多言語provider対応済みのような誤解は避けています。」

### T999 Final Audit Result

- 相庭 愛: 「10条件を現在のmainで監査しました。証拠はT999 noteに残しています。」
- 白瀬 怜奈: 「API call、secret保存、model download、削除操作は発生していません。未検証claimも避けています。」
- 星乃 玲: 「機能アップデートとしてREADMEから辿れる成果物もあります。」

Result:

> Voice personalization feature wave is complete. The next wave can choose between deeper local provider work, API opt-in implementation, or installer automation beyond dry-run.
