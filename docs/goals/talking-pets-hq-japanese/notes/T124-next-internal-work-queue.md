# T124 next internal work queue

## 結論

T123で投稿後metricsの見方まで準備できた。

外部入力が来るまでの内部作業は、実装よりも小さな整理PRを優先する。

## 次の候補

| Priority | Candidate | Why now | Stop line |
| --- | --- | --- | --- |
| P0 | READMEの手伝う導線をT114/T123の文面と揃える | 投稿後に来た人が迷いにくくなる | 性能claimを強めない |
| P0 | `docs/verification-status.md` の外部報告受け入れ欄をIssue #23-#26に合わせる | 報告が来た時の反映が速くなる | まだ未受領の報告をverified扱いしない |
| P1 | provider比較表に「次に測るなら何を測るか」を1行ずつ足す | local TTS設計が進む | install/model download/API callしない |
| P1 | 多言語fallbackのREADME該当箇所を再度短くする | 初見の誤読を減らす | ko/zh専用provider対応済みclaimを足さない |
| P2 | SNS向けdemo assetの見直し | 投稿の反応改善 | 新規動画生成や重い編集はしない |

## あいちゃん推奨

次は **P0: `docs/verification-status.md` の外部報告受け入れ欄をIssue #23-#26に合わせる**。

理由:

- 投稿URLやIssueコメントを待たずに進められる。
- 反応が来た時、usable evidenceをすぐ反映できる。
- Windows/Linux/VOICEVOX/Irodoriの4本Issueと現在のverification pageを直接つなげられる。

## やらないこと

- SNS投稿
- Issue返信
- model download
- package install
- API call
- performance guarantee
- ko/zh dedicated provider claim

## 状態

active。
