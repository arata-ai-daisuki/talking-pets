# T228 Local TTS Approval Cycle Watch

## Objective

T227のoutreach waiting lane cycle refresh後に、local TTSの承認境界へ戻る。

## Scope

- Local TTS Approval Cycle Refreshを確認する。
- MasterがB/C/APIを明示していなければ、A: VOICEVOX / Irodori evidence-firstを維持する。
- sherpa / MeloTTS / API TTSはapproval-gatedのまま扱う。

## Stop Lines

- `sherpa-onnx-node`をinstallしない。
- MeloTTSのPython/Docker/model/unidic setupをしない。
- model download、API call、生成音声、README support claim変更をしない。

## Receipt

- decision: `local_tts_approval_cycle_watch`
- owner: `歌澄 音羽 / 白瀬 怜奈`
- status: active
- next: recheck local TTS approval boundary without implementation.
