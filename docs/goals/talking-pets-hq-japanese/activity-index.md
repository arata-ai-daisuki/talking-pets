# HQ Activity Index

Last updated: 2026-06-05

This page is a readable snapshot of the Japanese HQ state. The authoritative source remains `docs/goals/talking-pets-hq-japanese/state.yaml`.

## GoalBuddy Kanban

- Board URL: `http://goalbuddy.localhost:41737/talking-pets-hq-japanese/`
- Local board files: `docs/goals/talking-pets-hq-japanese/.goalbuddy-board/`
- Current active task: `T234`
- Current focus: local TTS設計の境界へ戻る。

## Kanban Snapshot

| Column | Count | Meaning |
| --- | ---: | --- |
| Done | 234 | 完了済みの小PR、調査、判断カード、検証receipt。 |
| Active | 1 | いまHQが追っている作業。 |
| Blocked | 0 | 同じ停止条件が継続しており、Master判断なしに進めないもの。 |

## Agent Activity Summary

| Agent | Role | Done | Active | Main lane |
| --- | --- | ---: | ---: | --- |
| 相庭 愛 | HQ Producer | 63 | 0 | 判断カード、全体整理、Master確認。 |
| 星宮 未来 | Outreach Lead | 47 | 0 | SNS/outreach、候補表、返信ドラフト、送信後記録。 |
| 白瀬 怜奈 | Risk / Review Lead | 48 | 1 | claim境界、license/privacy/API、セルフレビュー。 |
| 歌澄 音羽 | Voice Provider Lead | 40 | 1 | TTS provider、VOICEVOX/Irodori/sherpa/Melo/API設計。 |
| 言守 詞葉 | Multilingual Lead | 28 | 0 | ko/zh fallback、多言語fixture、dedicated provider evidence境界。 |
| 速水 光莉 | Latency Lead | 14 | 0 | latency診断、RTF、table helper、測定読み方。 |
| 文月 栞里 | Docs / Operations Lead | 18 | 0 | docs整備、hygiene、activity index、運用導線。 |
| 愛坂 あい | Pet / Persona Lead | 2 | 0 | キャラクター/会話体験の方向づけ。 |
| 月城 奏 | Release Support | 1 | 0 | release補助。 |

## Recent Wave

| Task | Agent | Status | Outcome |
| --- | --- | --- | --- |
| `T150` | 文月 栞里 | done | Provider feedback intake tableを追加。 |
| `T151` | 歌澄 音羽 | done | provider design note templateを追加。 |
| `T152` | 白瀬 怜奈 | done | Piper design noteを追加。 |
| `T153` | 歌澄 音羽 | done | MeloTTS design noteを追加。 |
| `T154` | 白瀬 怜奈 | done | API TTS design noteを追加。 |
| `T155` | 言守 詞葉 | done | dedicated provider evidence checklist導線を追加。 |
| `T156` | 星宮 未来 | done | dedicated provider outreach copyを追加。 |
| `T157` | 歌澄 音羽 | done | sherpa design noteをtemplate観点へ整列。 |
| `T158` | 相庭 愛 | done | sherpa実験前のMaster approval cardを追加。 |
| `T159` | 星宮 未来 | done | multilingual tester outreach targetsを追加。 |
| `T160` | 星宮 未来 | done | Search Review Logを追加。 |
| `T161` | 星宮 未来 | done | Search Review Logのdecision flowを追加。 |
| `T162` | 星宮 未来 | done | MeloTTS / MeloTTS.cpp / MOSS-TTS-Nano / CPU benchmark候補を記録。 |
| `T163` | 星宮 未来 | done | 候補別の手動返信ドラフトを追加。 |
| `T164` | 歌澄 音羽 | done | Provider Experiment Scorecardを追加。 |
| `T165` | 歌澄 音羽 | done | Next Provider Decision Cardを追加。 |
| `T166` | 文月 栞里 | done | HQ Activity Indexを追加。 |
| `T167` | 言守 詞葉 | done | Minimal Multilingual Report Formを追加。 |
| `T168` | 星宮 未来 | done | 多言語report form follow-up文を追加。 |
| `T169` | 文月 栞里 | done | HQ Backlog Boardを追加。 |
| `T170` | 星宮 未来 | done | Ready-To-Send Queueを追加。 |
| `T171` | 歌澄 音羽 | done | Local TTS Master Choice Cardを追加。 |
| `T172` | 歌澄 音羽 | done | VOICEVOX/Irodori evidence askを追加。 |
| `T173` | 歌澄 音羽 | done | MeloTTS Cのruntime/cache boundaryを具体化。 |
| `T174` | 言守 詞葉 | done | Minimal Multilingual Test Packを追加。 |
| `T175` | 歌澄 音羽 | done | sherpa optional npm installだけを確認。 |
| `T176` | 歌澄 音羽 | done | MeloTTS external runtime helper設計を整理。 |
| `T177` | 歌澄 音羽 | done | MeloTTS detect/connect-only実装カードを追加。 |
| `T178` | 歌澄 音羽 | done | MeloTTS health-only helper skeletonを追加。 |
| `T179` | 相庭 愛 | done | MeloTTS次PR候補を整理し、monitor health integrationを推奨。 |
| `T180` | 歌澄 音羽 | done | MeloTTS health-only helperをmonitorの`--list-voices`へ接続。 |
| `T181` | 白瀬 怜奈 | done | installer/configにMeloTTS external runtime health-check案内だけを追加。 |
| `T182` | 星宮 未来 | done | provider feedback capture導線をSearch Review Logとprovider intakeへ追加。 |
| `T183` | 言守 詞葉 | done | 多言語検証フォームと小テスト導線をprovider feedback intakeへ接続。 |
| `T184` | 星宮 未来 | done | README/SNS導線を多言語証跡フォームと現行Issue導線へ接続。 |
| `T185` | 相庭 愛 / 文月 栞里 | done | T175-T184の波を畳み、Next/Backlogを再整理。 |
| `T186` | 歌澄 音羽 / 白瀬 怜奈 | done | local TTS次候補とMaster承認境界を再評価。 |
| `T187` | 歌澄 音羽 / 白瀬 怜奈 | done | Provider Experiment Scorecardを証跡gapと承認gateつきに更新。 |
| `T188` | 星宮 未来 | done | Ready-To-Send Queueと送信後記録導線を現行化。 |
| `T189` | 言守 詞葉 | done | 多言語証跡の処理順をwatch手順として整理。 |
| `T190` | 歌澄 音羽 / 白瀬 怜奈 | done | Scorecard evidence gapをdesign-note質問へ整理。 |
| `T191` | 星宮 未来 | done | Outreach watch cadenceを送信済み/催促禁止日つきで整理。 |
| `T192` | 言守 詞葉 | done | 多言語証跡の記録先とstop lineを整理。 |
| `T193` | 歌澄 音羽 / 白瀬 怜奈 | done | Local TTS approval-only cardを追加。 |
| `T194` | 星宮 未来 | done | Outreach reply intake playbookを追加。 |
| `T195-T199` | 文月 栞里 / 星宮 未来 / 歌澄 音羽 / 言守 詞葉 / 白瀬 怜奈 | done | Proof/outreach/local TTS/multilingual intake refreshを完了。 |
| `T200` | 相庭 愛 / 文月 栞里 | done | T195-T199の完了波を畳み、Next/Backlogを再整理。 |
| `T201` | 文月 栞里 / 白瀬 怜奈 | done | Issue #23-#26 later watchをclaim変更なしで記録。 |
| `T202` | 星宮 未来 / 白瀬 怜奈 | done | Outreach Waiting Lane Snapshotを追加。 |
| `T203` | 歌澄 音羽 / 白瀬 怜奈 | done | Local TTS Approval Decision Cardを追加。 |
| `T204` | 言守 詞葉 / 白瀬 怜奈 | done | Multilingual Verification Watch Snapshotを追加。 |
| `T205` | 相庭 愛 / 文月 栞里 | done | T203-T204の波を畳み、次activeをT206へ進行。 |
| `T206` | 相庭 愛 / 文月 栞里 | done | Public Proof Route Selectorを追加。 |
| `T207` | 文月 栞里 / 白瀬 怜奈 | done | Public Proof Hubを追加し、README日英から接続。 |
| `T208` | 相庭 愛 / 文月 栞里 | done | T206-T207のpublic proof導線整備を畳み、次activeをT209へ進行。 |
| `T209` | 星宮 未来 / 白瀬 怜奈 | done | Outreach Waiting Lane Snapshotを返信watchとして更新。 |
| `T210` | 歌澄 音羽 / 白瀬 怜奈 | done | Local TTS Approval Response Watchを追加し、A: evidence-firstを維持。 |
| `T211` | 言守 詞葉 / 白瀬 怜奈 | done | Multilingual Verification Follow-Up Snapshotを追加し、fallback-only境界を維持。 |
| `T212` | 星宮 未来 / 白瀬 怜奈 | done | Outreach Later Watchを追加し、再送・催促なしでwaitを維持。 |
| `T213` | 歌澄 音羽 / 白瀬 怜奈 | done | Local TTS Approval Later Watchを追加し、A: evidence-firstを維持。 |
| `T214` | 言守 詞葉 / 白瀬 怜奈 | done | Multilingual Verification Later Watchを追加し、fallback-only境界を維持。 |
| `T215` | 星宮 未来 / 白瀬 怜奈 | done | Outreach Next Watchを追加し、再送・催促なしでwaitを維持。 |
| `T216` | 歌澄 音羽 / 白瀬 怜奈 | done | Local TTS Approval Next Watchを追加し、A: evidence-firstを維持。 |
| `T217` | 言守 詞葉 / 白瀬 怜奈 | done | Multilingual Verification Next Watchを追加し、fallback-only境界を維持。 |
| `T218` | 星宮 未来 / 白瀬 怜奈 | done | Outreach Waiting Lane Follow-Up Watchを追加し、判定不能のままwaitを維持。 |
| `T219` | 歌澄 音羽 / 白瀬 怜奈 | done | Local TTS Approval Follow-Up Resultを追加し、A: evidence-firstを維持。 |
| `T220` | 言守 詞葉 / 白瀬 怜奈 | done | Multilingual Verification Follow-Up Watchを追加し、fallback-only境界を維持。 |
| `T221` | 星宮 未来 / 白瀬 怜奈 | done | Outreach Waiting Lane Next Cycleを追加し、判定不能のままwaitを維持。 |
| `T222` | 歌澄 音羽 / 白瀬 怜奈 | done | Local TTS Approval Next Cycle Resultを追加し、A: evidence-firstを維持。 |
| `T223` | 言守 詞葉 / 白瀬 怜奈 | done | Multilingual Verification Next Cycle Watchを追加し、fallback-only境界を維持。 |
| `T224` | 星宮 未来 / 白瀬 怜奈 | done | Outreach Post-merge next-cycle watchを追加し、判定不能のままwaitを維持。 |
| `T225` | 歌澄 音羽 / 白瀬 怜奈 | done | Local TTS Approval Cycle Refreshを追加し、A: evidence-firstを維持。 |
| `T226` | 言守 詞葉 / 白瀬 怜奈 | done | Multilingual Verification Cycle Refreshを追加し、fallback-only境界を維持。 |
| `T227` | 星宮 未来 / 白瀬 怜奈 | done | Outreach Cycle refresh watchを追加し、判定不能のままwaitを維持。 |
| `T228` | 歌澄 音羽 / 白瀬 怜奈 | done | Local TTS Approval Cycle Watch Resultを追加し、A: evidence-firstを維持。 |
| `T229` | 言守 詞葉 / 白瀬 怜奈 | done | Multilingual Verification Cycle Watch Resultを追加し、fallback-only境界を維持。 |
| `T230` | 星宮 未来 / 白瀬 怜奈 | done | Outreach Cycle watchを追加し、判定不能のままwaitを維持。 |
| `T231` | 歌澄 音羽 / 白瀬 怜奈 | done | Local TTS Approval Boundary Watch Resultを追加し、A: evidence-firstを維持。 |
| `T232` | 言守 詞葉 / 白瀬 怜奈 | done | Multilingual Verification Boundary Watch Resultを追加し、fallback-only境界を維持。 |
| `T233` | 星宮 未来 / 白瀬 怜奈 | done | Outreach waiting lane boundary watchを追加し、再送・催促なしでwaitを維持。 |
| `T234` | 歌澄 音羽 / 白瀬 怜奈 | active | local TTS設計の境界をinstall/model/APIなしで再確認中。 |

## Where To Look Next

| Need | File |
| --- | --- |
| Kanban source of truth | `docs/goals/talking-pets-hq-japanese/state.yaml` |
| Backlog / Next / Active / Done board | `docs/goals/talking-pets-hq-japanese/hq-backlog-board.md` |
| Board page | `docs/goals/talking-pets-hq-japanese/.goalbuddy-board/index.html` |
| Outreach targets and reply drafts | `docs/research/x-outreach-targets.md` |
| Provider comparison and next decision | `docs/research/tts-provider-comparison.md` |
| Verification status | `docs/verification-status.md` |
| Real-device reporting commands | `docs/real-device-verification.md` |

## Notes

- This is a snapshot, not a replacement for GoalBuddy.
- Counts should be refreshed when a new task lands.
- Completed waves stay visible as history so Master can see momentum without reading the full `state.yaml`.
