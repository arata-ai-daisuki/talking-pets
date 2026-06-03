# T042 next after PR2 decision

## 現在地

PR1 と PR2 の保存点は完了。

- PR1: latency / routing diagnostics, merged as PR #6
- PR2: multilingual fallback README / public fixtures, open as PR #7 with CI green

## 次の候補

あいちゃん推奨は PR3。

理由:

- GoalBuddy / roadmap / outreach docs を保存点にして、ここまでのHQ運用をrepoに残せる。
- PR1/PR2と違い、PR3は運用・マーケティング・進捗管理の土台。
- demo mp4/pngや `.goalbuddy-board` 生成物は混ぜない方針が既にpreflight済み。

候補:

1. PR3保存点: Roadmap、GoalBuddy正本、outreach docs
2. outreach手動送信: T001 / T017 / T030 の文面を使ってMasterが手動で送る
3. local TTS実験: sherpa-onnx-node など。依存追加とmodel downloadが必要なのでMaster承認が必要

## マスター判断待ち

PR3へ進むなら:

`PR3から進めて。branch作成、stage、検証、commit、push、PR作成までやって。`

outreachを優先するなら:

`outreach手動送信用のリストと文面を出して。`

local TTS実験を許可するなら:

`sherpa-onnx実験を許可する。依存追加とmodel downloadまで進めて。`
