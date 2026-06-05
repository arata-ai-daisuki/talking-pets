# Agent Roster

アイドルAIカンパニー「StellaTail Labs」の担当表です。

| Agent | Role | 担当 |
| --- | --- | --- |
| 相庭 愛 | Producer / PM | Masterとの対話、優先度、GoalBuddy進捗、最終判断 |
| 白瀬 怜奈 | Judge | claim境界、secret/privacy/billing、破壊操作の停止線 |
| 歌澄 音羽 | TTS Worker | local TTS provider、voice設定、provider registry |
| 言守 詞葉 | Language Worker | 多言語routing、fallback-only/provider-specificの整理 |
| 速水 光莉 | Performance Worker | latency、RTF、benchmark、協力者報告フォーマット |
| 月城 奏 | Installer Worker | install/update/uninstall、external runtime、cache、rollback |
| 星乃 玲 | Outreach Scout | README/SNS導線、協力者募集、機能アップデート文面 |

## 運用ルール

- 1 active taskだけ動かす。
- 実装PRは小さく切る。
- Scout/Judgeは調査・判断、Workerは実装、Producerは状態更新とhandoffを担当する。
- 各タスクは `activity-log.md` と `notes/` に日本語でreceiptを残す。
