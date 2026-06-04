# HQ Backlog Board

Last updated: 2026-06-04

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
| README/SNS route tune-up | 星宮 未来 | Active | Star導線、verification issue導線、SNS copyが現在地に合っているか再点検する。 |

## Next

| Card | Owner | Why next | Done when |
| --- | --- | --- | --- |
| Backlog refresh | 相庭 愛 / 文月 栞里 | T181-T184でMeloTTS、多言語、SNS導線が進んだ後、Backlog/Next/Activeを再整理する。 | 完了波が畳まれ、次に進めるlocal TTS / outreach / docs作業が見える。 |

## Backlog

| Card | Owner | Current shape | Stop line |
| --- | --- | --- | --- |
| Provider調査 | 歌澄 音羽 / 言守 詞葉 | Piper、MeloTTS、sherpa、API TTSはdesign noteとscorecardで整理済み。B/Cはdesign-onlyで深掘り中。 | 依存追加、model download、API call、README support claimはMaster承認までしない。 |
| README/SNS導線 | 星宮 未来 | READMEにはdemo、Quick Start、Issue導線がある。SNS側は手動候補と返信文がある。 | Star依頼を強くしすぎない。自動投稿/DM/mentionをしない。 |
| Latency最適化 | 速水 光莉 | VOICEVOX/IrodoriのRTFとlatency table導線はある。 | 1端末の数字を性能保証にしない。first-audioとtotalを混同しない。 |
| Release proof package | 文月 栞里 / 白瀬 怜奈 | verification-statusとrelease templateがある。 | Windows/Linuxを実機証拠なしにstableへ上げない。 |
| API TTS opt-in | 歌澄 音羽 / 白瀬 怜奈 | privacy/billing/secret境界は設計済み。 | API key作成、paid call、外部endpoint送信は明示承認なしにしない。 |
| MeloTTS opt-in installer | 歌澄 音羽 / 白瀬 怜奈 | external runtime接続が先。installerでPython/Docker/model/dictionary downloadまで行うのは後段。 | 明示opt-in、cache path、cleanup、license、size、network/download承認が揃うまで実装しない。 |

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
| T175 | sherpa optional npm install trial。 | [T175 receipt](notes/T175-sherpa-optional-npm-install.md), `package.json`, `package-lock.json` |
| T176 | MeloTTS external runtime helper design。 | [T176 receipt](notes/T176-melotts-external-runtime-helper-design.md) |
| T177 | MeloTTS detect/connect-only implementation card。 | [T177 receipt](notes/T177-melotts-detect-connect-card.md) |
| T178 | MeloTTS health-only helper skeleton。 | [T178 receipt](notes/T178-melotts-health-helper-skeleton.md), `scripts/tts-melotts.mjs` |
| T179 | MeloTTS next integration choice。 | [T179 receipt](notes/T179-melotts-next-integration-choice.md) |
| T180 | MeloTTS monitor health integration。 | [T180 receipt](notes/T180-melotts-monitor-health-integration.md), `scripts/pet-rollout-monitor.mjs` |
| T181 | MeloTTS installer detect-only wording。 | [T181 receipt](notes/T181-melotts-installer-detect-only-next.md), `install.command`, `install.sh`, `install.ps1` |
| T182 | Provider feedback capture。 | [T182 receipt](notes/T182-provider-feedback-capture-next.md), [Outreach targets](../../research/x-outreach-targets.md#provider-feedback-capture), [Provider comparison](../../research/tts-provider-comparison.md#provider-feedback-intake) |
| T183 | Multilingual evidence refresh。 | [T183 receipt](notes/T183-multilingual-evidence-refresh-next.md), [Real-device verification](../../real-device-verification.md#minimal-multilingual-report-form), [Verification status](../../verification-status.md#multilingual-routing-evidence-boundary) |

## Operating Rules

- Backlogは「未実施候補」であり、doneではない。
- Nextは、Master判断または小PR化が近いものだけにする。
- Activeは原則1つにする。
- Doneは証拠リンクがあるものだけにする。
- 依存追加、model download、API call、自動SNS操作はこのボードだけでは許可されない。
