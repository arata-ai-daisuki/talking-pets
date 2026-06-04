# T193 Local TTS Approval Check

## Objective

scorecard gapはdesign-note質問へ落ちたので、実験へ進む場合のMaster承認範囲を確認できる形にする。

## Scope

- Local TTS候補のapproval gateを再確認した。
- dependency/model/APIなしで、次に聞くべき承認質問だけを整理した。
- README support claimやdefault routingを変えない状態を維持した。

## Stop Lines

- Master承認なしにdependency install、model download、API callをしない。
- sherpa/MeloTTS/Piper/API TTSを対応済みproviderとしてclaimしない。
- 実験を始める場合は別PRに分ける。

## Receipt

- decision: `local_tts_approval_check`
- owner: `歌澄 音羽 / 白瀬 怜奈`
- status: done
- next: outreach reply intake.
