# HQ Backlog Board

Last updated: 2026-06-05

Talking Pets 日本語HQの未実施全体像を見るためのボードです。GoalBuddy本体の代替ではなく、Masterが「次に何が残っているか」を一画面で掴むためのsnapshotです。

## Links

- GoalBuddy看板: `http://goalbuddy.localhost:41737/talking-pets-hq-japanese/`
- HQ Activity Index: [activity-index.md](activity-index.md)
- ROADMAP: [../../ROADMAP.md](../../ROADMAP.md)
- Provider comparison: [../../research/tts-provider-comparison.md](../../research/tts-provider-comparison.md)
- Verification status: [../../verification-status.md](../../verification-status.md)
- Real-device verification: [../../real-device-verification.md](../../real-device-verification.md)
- Outreach targets: [../../research/x-outreach-targets.md](../../research/x-outreach-targets.md)

## Active

| Card | Owner | Status | Proof / Link |
| --- | --- | --- | --- |
| Local TTS boundary watch | 歌澄 音羽 / 白瀬 怜奈 | Active | VOICEVOX / Irodori evidence-firstを維持し、Kokoro / sherpa / MeloTTS / APIは承認なしに進めない。 |

## Next

| Card | Owner | Why next | Done when |
| --- | --- | --- | --- |
| Verification issue later watch | 文月 栞里 / 白瀬 怜奈 | Issue #23-#26は返信待ちなので、定期的にclaim変更なしで確認できる。 | 新しいpublic evidenceがあれば記録し、なければ待ちを維持する。 |
| Outreach waiting lane refresh | 星宮 未来 / 白瀬 怜奈 | OpenClaw/V1GPTの催促禁止日までは返信が来た時だけsafe intakeする。 | 再送なしで、待機状態が最新になる。 |
| Local TTS approval response | 歌澄 音羽 / 白瀬 怜奈 | MasterがB/Cを明示した時だけ、sherpa/MeloTTSのdesign-only follow-upへ進める。 | 実装・依存・model downloadなしで次カードを切れる。 |

## Backlog

| Card | Owner | Current shape | Stop line |
| --- | --- | --- | --- |
| Local TTS設計 | 歌澄 音羽 / 白瀬 怜奈 | VOICEVOX/Irodoriは実装済み。MeloTTSはhealth-only detect/connect、Piper/sherpa/APIはdesign noteとscorecardで整理済み。 | 依存追加、model download、API call、README support claimはMaster承認までしない。 |
| Outreach送信準備 | 星宮 未来 | Ready-To-Send Queue、Search Review Log、候補別draft、SNS strategyの実リンクが揃った。 | Star依頼を強くしすぎない。自動投稿/DM/mentionをしない。 |
| 多言語検証 | 言守 詞葉 | Minimal Multilingual Report Form/Test Pack、Dedicated Provider Evidence Checklist、README導線が揃った。 | OS speech fallbackを韓国語/中国語専用provider対応としてclaimしない。 |
| Latency最適化 | 速水 光莉 | VOICEVOX/IrodoriのRTFとlatency table導線はある。協力者データ待ちでも内部の測定読み方は改善可能。 | 1端末の数字を性能保証にしない。first-audioとtotalを混同しない。 |
| Release proof package | 文月 栞里 / 白瀬 怜奈 | verification-statusとrelease templateがある。公開証跡はIssue #23-#26中心。 | Windows/Linuxを実機証拠なしにstableへ上げない。 |
| API TTS opt-in | 歌澄 音羽 / 白瀬 怜奈 | privacy/billing/secret境界は設計済み。まだ実装候補ではなく保留。 | API key作成、paid call、外部endpoint送信は明示承認なしにしない。 |

## Done History

完了済みの波はここでは畳み、詳細は [activity-index.md](activity-index.md) と `state.yaml` を見る。

| Wave | Summary | Evidence |
| --- | --- | --- |
| T150-T154 | provider feedback intake、provider design note template、Piper/Melo/API design notes。 | [Provider comparison](../../research/tts-provider-comparison.md) |
| T155-T158 | dedicated provider evidence checklist、outreach copy、sherpa template alignment、sherpa approval card。 | [Verification status](../../verification-status.md), [sherpa design](../../research/sherpa-onnx-design.md) |
| T159-T163 | multilingual tester targets、Search Review Log、decision flow、候補記録、候補別返信draft。 | [Outreach targets](../../research/x-outreach-targets.md) |
| T164-T165 | Provider Experiment Scorecard、Next Provider Decision Card。 | [Provider comparison](../../research/tts-provider-comparison.md#provider-experiment-scorecard) |
| T166-T172 | HQ Activity Index、Minimal Multilingual Report Form、report form follow-up copy、HQ Backlog Board、Ready-To-Send Queue、Local TTS Master Choice Card、VOICEVOX/Irodori evidence ask。 | [Activity Index](activity-index.md), [Real-device verification](../../real-device-verification.md#minimal-multilingual-report-form), [HQ Backlog Board](hq-backlog-board.md), [Outreach targets](../../research/x-outreach-targets.md#ready-to-send-queue), [Provider comparison](../../research/tts-provider-comparison.md#local-tts-master-choice-card), [SNS strategy](../../research/sns-outreach-strategy.md) |
| T173 | MeloTTS runtime/cache boundary。 | [MeloTTS design](../../research/melotts-design-note.md#c-runtime-design-only-scope), [Provider comparison](../../research/tts-provider-comparison.md#bc-design-follow-up) |
| T174 | Minimal Multilingual Test Pack。 | [Real-device verification](../../real-device-verification.md#minimal-multilingual-test-pack), [Outreach targets](../../research/x-outreach-targets.md#minimal-multilingual-test-pack) |
| T175-T181 | sherpa optional install確認、MeloTTS external runtime / detect-connect / health-only / monitor / installer detect-onlyの波。 | [T175 receipt](notes/T175-sherpa-optional-npm-install.md), [T181 receipt](notes/T181-melotts-installer-detect-only-next.md), `scripts/tts-melotts.mjs`, `install.command`, `install.sh`, `install.ps1` |
| T182-T184 | provider feedback capture、多言語evidence refresh、README/SNS route tune-upの波。 | [T182 receipt](notes/T182-provider-feedback-capture-next.md), [T183 receipt](notes/T183-multilingual-evidence-refresh-next.md), [T184 receipt](notes/T184-readme-sns-route-tuneup-next.md), [Outreach targets](../../research/x-outreach-targets.md#provider-feedback-capture), [Real-device verification](../../real-device-verification.md#minimal-multilingual-report-form), [README](../../../README.md) |
| T185-T186 | Backlog refreshとLocal TTS next choice refreshの波。 | [T185 receipt](notes/T185-backlog-refresh-next.md), [T186 receipt](notes/T186-local-tts-next-choice-refresh.md), [Provider comparison](../../research/tts-provider-comparison.md#local-tts-next-choice-refresh) |
| T187 | Provider Experiment Scorecard refresh。 | [T187 receipt](notes/T187-provider-experiment-scorecard-refresh.md), [Provider scorecard](../../research/tts-provider-comparison.md#provider-experiment-scorecard) |
| T188 | Outreach send queue refresh。 | [T188 receipt](notes/T188-outreach-send-queue-refresh.md), [Ready-To-Send Queue](../../research/x-outreach-targets.md#ready-to-send-queue), [SNS strategy](../../research/sns-outreach-strategy.md#next-actions) |
| T189 | Multilingual evidence watch。 | [T189 receipt](notes/T189-multilingual-evidence-watch.md), [Handling order](../../real-device-verification.md#multilingual-evidence-handling-order), [Verification status](../../verification-status.md#multilingual-evidence-handling-order) |
| T190 | Scorecard evidence follow-up。 | [T190 receipt](notes/T190-scorecard-evidence-follow-up.md), [Evidence Gap Question Queue](../../research/tts-provider-comparison.md#evidence-gap-question-queue), [Piper questions](../../research/piper-design-note.md#evidence-gap-questions), [API TTS questions](../../research/api-tts-design-note.md#evidence-gap-questions) |
| T191 | Outreach watch cadence。 | [T191 receipt](notes/T191-outreach-watch-cadence.md), [Current Outreach Cadence Snapshot](../../research/x-outreach-targets.md#current-outreach-cadence-snapshot), [SNS watch cadence](../../research/sns-outreach-strategy.md#current-outreach-watch-cadence) |
| T192 | Multilingual intake follow-up。 | [T192 receipt](notes/T192-multilingual-intake-follow-up.md), [Real-device routing matrix](../../real-device-verification.md#multilingual-intake-routing-matrix), [Verification routing matrix](../../verification-status.md#multilingual-intake-routing-matrix), [Provider feedback intake](../../research/tts-provider-comparison.md#provider-feedback-intake) |
| T193 | Local TTS approval check。 | [T193 receipt](notes/T193-local-tts-approval-check.md), [Local TTS Approval-Only Card](../../research/tts-provider-comparison.md#local-tts-approval-only-card) |
| T194 | Outreach reply intake。 | [T194 receipt](notes/T194-outreach-reply-intake.md), [Outreach Reply Intake Playbook](../../research/x-outreach-targets.md#outreach-reply-intake-playbook), [Provider Feedback Intake](../../research/tts-provider-comparison.md#provider-feedback-intake) |
| T195-T199 | Proof/outreach/local TTS/multilingual intake refresh。 | [T195](notes/T195-verification-issue-watch.md), [T196](notes/T196-release-proof-package-refresh.md), [T197](notes/T197-outreach-cadence-later-check.md), [T198](notes/T198-local-tts-approval-follow-up.md), [T199](notes/T199-multilingual-evidence-queue-check.md), [Issue Watch Snapshot](../../verification-status.md#issue-watch-snapshot), [Release Proof Package Index](../../verification-status.md#release-proof-package-index), [Reply Waiting Intake Queue](../../research/x-outreach-targets.md#reply-waiting-intake-queue), [Local TTS Approval Follow-Up Snapshot](../../research/tts-provider-comparison.md#local-tts-approval-follow-up-snapshot), [Multilingual Evidence Intake Queue](../../real-device-verification.md#multilingual-evidence-intake-queue) |
| T201 | Verification issue later watch。 | [T201 receipt](notes/T201-verification-issue-later-watch.md), [Issue Watch Snapshot](../../verification-status.md#issue-watch-snapshot) |
| T202 | Outreach waiting lane refresh。 | [T202 receipt](notes/T202-outreach-waiting-lane-refresh.md), [Outreach Waiting Lane Snapshot](../../research/x-outreach-targets.md#outreach-waiting-lane-snapshot) |
| T203 | Local TTS approval decision。 | [T203 receipt](notes/T203-local-tts-approval-decision.md), [Local TTS Approval Decision Card](../../research/tts-provider-comparison.md#local-tts-approval-decision-card) |
| T204 | Multilingual verification watch。 | [T204 receipt](notes/T204-multilingual-verification-watch.md), [Multilingual Verification Watch Snapshot](../../verification-status.md#multilingual-verification-watch-snapshot) |
| T205 | HQ wave refresh after local / multilingual。 | [T205 receipt](notes/T205-hq-wave-refresh-after-local-multilingual.md), [HQ Activity Index](activity-index.md) |
| T206 | Public proof route selector。 | [T206 receipt](notes/T206-public-proof-route-selector.md), [Public Proof Route Selector](../../research/sns-outreach-strategy.md#public-proof-route-selector) |
| T207 | Public proof hub polish。 | [T207 receipt](notes/T207-public-proof-hub-polish.md), [Public Proof Hub](../../contributor-entrypoints.md#public-proof-hub) |
| T208 | HQ wave refresh after proof hub。 | [T208 receipt](notes/T208-hq-wave-refresh-after-proof-hub.md), [HQ Activity Index](activity-index.md) |
| T209 | Outreach reply watch。 | [T209 receipt](notes/T209-outreach-reply-watch.md), [Outreach Waiting Lane Snapshot](../../research/x-outreach-targets.md#outreach-waiting-lane-snapshot) |
| T210 | Local TTS approval response watch。 | [T210 receipt](notes/T210-local-tts-approval-response-watch.md), [Local TTS Approval Response Watch](../../research/tts-provider-comparison.md#local-tts-approval-response-watch) |
| T211 | Multilingual verification follow-up。 | [T211 receipt](notes/T211-multilingual-verification-follow-up.md), [Verification follow-up](../../verification-status.md#multilingual-verification-follow-up-snapshot), [Real-device follow-up](../../real-device-verification.md#multilingual-verification-follow-up-snapshot) |
| T212 | Outreach waiting lane later watch。 | [T212 receipt](notes/T212-outreach-waiting-lane-later-watch.md), [Outreach Waiting Lane Snapshot](../../research/x-outreach-targets.md#outreach-waiting-lane-snapshot), [SNS later watch](../../research/sns-outreach-strategy.md#current-outreach-watch-cadence) |
| T213 | Local TTS approval later watch。 | [T213 receipt](notes/T213-local-tts-approval-later-watch.md), [Local TTS Approval Later Watch](../../research/tts-provider-comparison.md#local-tts-approval-later-watch) |
| T214 | Multilingual verification later watch。 | [T214 receipt](notes/T214-multilingual-verification-later-watch.md), [Verification later watch](../../verification-status.md#multilingual-verification-later-watch), [Real-device later watch](../../real-device-verification.md#multilingual-verification-later-watch) |
| T215 | Outreach waiting lane next watch。 | [T215 receipt](notes/T215-outreach-waiting-lane-next-watch.md), [Outreach Waiting Lane Snapshot](../../research/x-outreach-targets.md#outreach-waiting-lane-snapshot), [SNS watch cadence](../../research/sns-outreach-strategy.md#current-outreach-watch-cadence) |
| T216 | Local TTS approval next watch。 | [T216 receipt](notes/T216-local-tts-approval-next-watch.md), [Local TTS Approval Next Watch](../../research/tts-provider-comparison.md#local-tts-approval-next-watch) |
| T217 | Multilingual verification next watch。 | [T217 receipt](notes/T217-multilingual-verification-next-watch.md), [Verification next watch](../../verification-status.md#multilingual-verification-next-watch), [Real-device next watch](../../real-device-verification.md#multilingual-verification-next-watch) |
| T218 | Outreach waiting lane follow-up watch。 | [T218 receipt](notes/T218-outreach-waiting-lane-follow-up-watch.md), [Outreach Waiting Lane Snapshot](../../research/x-outreach-targets.md#outreach-waiting-lane-snapshot), [SNS follow-up watch](../../research/sns-outreach-strategy.md#current-outreach-watch-cadence) |
| T219 | Local TTS approval follow-up watch。 | [T219 receipt](notes/T219-local-tts-approval-follow-up-watch.md), [Local TTS Approval Follow-Up Result](../../research/tts-provider-comparison.md#local-tts-approval-follow-up-result) |
| T220 | Multilingual verification follow-up watch。 | [T220 receipt](notes/T220-multilingual-verification-follow-up-watch.md), [Verification follow-up watch](../../verification-status.md#multilingual-verification-follow-up-watch), [Real-device follow-up watch](../../real-device-verification.md#multilingual-verification-follow-up-watch) |
| T221 | Outreach waiting lane next cycle。 | [T221 receipt](notes/T221-outreach-waiting-lane-next-cycle.md), [Outreach Waiting Lane Snapshot](../../research/x-outreach-targets.md#outreach-waiting-lane-snapshot), [SNS next-cycle watch](../../research/sns-outreach-strategy.md#current-outreach-watch-cadence) |
| T222 | Local TTS approval next cycle。 | [T222 receipt](notes/T222-local-tts-approval-next-cycle.md), [Local TTS Approval Next Cycle Result](../../research/tts-provider-comparison.md#local-tts-approval-next-cycle-result) |
| T223 | Multilingual verification next cycle。 | [T223 receipt](notes/T223-multilingual-verification-next-cycle.md), [Verification next-cycle watch](../../verification-status.md#multilingual-verification-next-cycle-watch), [Real-device next-cycle watch](../../real-device-verification.md#multilingual-verification-next-cycle-watch) |
| T224 | Outreach waiting lane next cycle。 | [T224 receipt](notes/T224-outreach-waiting-lane-next-cycle.md), [Outreach Waiting Lane Snapshot](../../research/x-outreach-targets.md#outreach-waiting-lane-snapshot), [SNS post-merge watch](../../research/sns-outreach-strategy.md#current-outreach-watch-cadence) |
| T225 | Local TTS approval cycle refresh。 | [T225 receipt](notes/T225-local-tts-approval-next-cycle.md), [Local TTS Approval Cycle Refresh](../../research/tts-provider-comparison.md#local-tts-approval-cycle-refresh) |
| T226 | Multilingual verification cycle refresh。 | [T226 receipt](notes/T226-multilingual-verification-cycle-refresh.md), [Verification cycle refresh](../../verification-status.md#multilingual-verification-cycle-refresh), [Real-device cycle refresh](../../real-device-verification.md#multilingual-verification-cycle-refresh) |
| T227 | Outreach waiting lane cycle refresh。 | [T227 receipt](notes/T227-outreach-waiting-lane-cycle-refresh.md), [Outreach Waiting Lane Snapshot](../../research/x-outreach-targets.md#outreach-waiting-lane-snapshot), [SNS cycle refresh watch](../../research/sns-outreach-strategy.md#current-outreach-watch-cadence) |
| T228 | Local TTS approval cycle watch。 | [T228 receipt](notes/T228-local-tts-approval-cycle-watch.md), [Local TTS Approval Cycle Watch Result](../../research/tts-provider-comparison.md#local-tts-approval-cycle-watch-result) |
| T229 | Multilingual verification cycle watch。 | [T229 receipt](notes/T229-multilingual-verification-cycle-watch.md), [Verification cycle watch result](../../verification-status.md#multilingual-verification-cycle-watch-result), [Real-device cycle watch result](../../real-device-verification.md#multilingual-verification-cycle-watch-result) |
| T230 | Outreach waiting lane cycle watch。 | [T230 receipt](notes/T230-outreach-waiting-lane-cycle-watch.md), [Outreach Waiting Lane Snapshot](../../research/x-outreach-targets.md#outreach-waiting-lane-snapshot), [SNS cycle watch](../../research/sns-outreach-strategy.md#current-outreach-watch-cadence) |
| T231 | Local TTS approval boundary watch。 | [T231 receipt](notes/T231-local-tts-approval-boundary-watch.md), [Local TTS Approval Boundary Watch Result](../../research/tts-provider-comparison.md#local-tts-approval-boundary-watch-result) |
| T232 | Multilingual verification boundary watch。 | [T232 receipt](notes/T232-multilingual-verification-boundary-watch.md), [Verification boundary watch result](../../verification-status.md#multilingual-verification-boundary-watch-result), [Real-device boundary watch result](../../real-device-verification.md#multilingual-verification-boundary-watch-result) |
| T233 | Outreach waiting lane boundary watch。 | [T233 receipt](notes/T233-outreach-waiting-lane-boundary-watch.md), [Outreach Waiting Lane Snapshot](../../research/x-outreach-targets.md#outreach-waiting-lane-snapshot), [SNS boundary watch](../../research/sns-outreach-strategy.md#current-outreach-watch-cadence) |
| T234 | Local TTS boundary watch。 | [T234 receipt](notes/T234-local-tts-boundary-watch.md), [Local TTS Boundary Watch Result](../../research/tts-provider-comparison.md#local-tts-boundary-watch-result) |
| T235 | Multilingual verification boundary watch。 | [T235 receipt](notes/T235-multilingual-verification-boundary-watch.md), [Verification boundary watch result 2](../../verification-status.md#multilingual-verification-boundary-watch-result-2), [Real-device boundary watch result 2](../../real-device-verification.md#multilingual-verification-boundary-watch-result-2) |
| T236 | Outreach waiting lane boundary watch。 | [T236 receipt](notes/T236-outreach-waiting-lane-boundary-watch.md), [Outreach Waiting Lane Snapshot](../../research/x-outreach-targets.md#outreach-waiting-lane-snapshot), [SNS boundary watch 2](../../research/sns-outreach-strategy.md#current-outreach-watch-cadence) |
| T237 | Local TTS boundary watch。 | [T237 receipt](notes/T237-local-tts-boundary-watch.md), [Local TTS Boundary Watch Result 2](../../research/tts-provider-comparison.md#local-tts-boundary-watch-result-2) |
| T238 | Multilingual verification boundary watch。 | [T238 receipt](notes/T238-multilingual-verification-boundary-watch.md), [Verification boundary watch result 3](../../verification-status.md#multilingual-verification-boundary-watch-result-3), [Real-device boundary watch result 3](../../real-device-verification.md#multilingual-verification-boundary-watch-result-3) |
| T239 | Outreach waiting lane boundary watch。 | [T239 receipt](notes/T239-outreach-waiting-lane-boundary-watch.md), [Outreach Waiting Lane Snapshot](../../research/x-outreach-targets.md#outreach-waiting-lane-snapshot), [SNS boundary watch 3](../../research/sns-outreach-strategy.md#current-outreach-watch-cadence) |
| T240 | Local TTS boundary watch。 | [T240 receipt](notes/T240-local-tts-boundary-watch.md), [Local TTS Boundary Watch Result 3](../../research/tts-provider-comparison.md#local-tts-boundary-watch-result-3) |
| T241 | Multilingual verification boundary watch。 | [T241 receipt](notes/T241-multilingual-verification-boundary-watch.md), [Verification boundary watch result 4](../../verification-status.md#multilingual-verification-boundary-watch-result-4), [Real-device boundary watch result 4](../../real-device-verification.md#multilingual-verification-boundary-watch-result-4) |
| T242 | Outreach waiting lane boundary watch。 | [T242 receipt](notes/T242-outreach-waiting-lane-boundary-watch.md), [SNS boundary watch 4](../../research/sns-outreach-strategy.md#current-outreach-watch-cadence) |
| T243 | Local TTS boundary watch。 | [T243 receipt](notes/T243-local-tts-boundary-watch.md), [Local TTS Boundary Watch Result 4](../../research/tts-provider-comparison.md#local-tts-boundary-watch-result-4) |
| T244 | Multilingual verification boundary watch。 | [T244 receipt](notes/T244-multilingual-verification-boundary-watch.md), [Verification boundary watch result 5](../../verification-status.md#multilingual-verification-boundary-watch-result-5), [Real-device boundary watch result 5](../../real-device-verification.md#multilingual-verification-boundary-watch-result-5) |
| T245 | Outreach waiting lane boundary watch。 | [T245 receipt](notes/T245-outreach-waiting-lane-boundary-watch.md), [SNS boundary watch 5](../../research/sns-outreach-strategy.md#current-outreach-watch-cadence), [Outreach targets boundary watch 5](../../research/x-outreach-targets.md#outreach-waiting-lane-snapshot) |
| T246 | Local TTS boundary watch。 | [T246 receipt](notes/T246-local-tts-boundary-watch.md), [Local TTS Boundary Watch Result 5](../../research/tts-provider-comparison.md#local-tts-boundary-watch-result-5) |
| T247 | Multilingual verification boundary watch。 | [T247 receipt](notes/T247-multilingual-verification-boundary-watch.md), [Verification boundary watch result 6](../../verification-status.md#multilingual-verification-boundary-watch-result-6), [Real-device boundary watch result 6](../../real-device-verification.md#multilingual-verification-boundary-watch-result-6) |
| T248 | Outreach waiting lane boundary watch。 | [T248 receipt](notes/T248-outreach-waiting-lane-boundary-watch.md), [SNS boundary watch 6](../../research/sns-outreach-strategy.md#current-outreach-watch-cadence), [Outreach targets boundary watch 6](../../research/x-outreach-targets.md#outreach-waiting-lane-snapshot) |

## Operating Rules

- Backlogは「未実施候補」であり、doneではない。
- Nextは、Master判断または小PR化が近いものだけにする。
- Activeは原則1つにする。
- Doneは証拠リンクがあるものだけにする。
- 依存追加、model download、API call、自動SNS操作はこのボードだけでは許可されない。
