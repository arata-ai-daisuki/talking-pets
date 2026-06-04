# T228 Local TTS Approval Cycle Watch

## Objective

T227のoutreach waiting lane cycle refresh後に、local TTSの承認境界へ戻る。

## Scope

- Local TTS Approval Cycle Refreshを確認する。
- MasterがB/C/APIを明示していなければ、A: VOICEVOX / Irodori evidence-firstを維持する。
- sherpa / MeloTTS / API TTSはapproval-gatedのまま扱う。
- `docs/research/tts-provider-comparison.md` にLocal TTS Approval Cycle Watch Resultを追加した。
- repo記録上、B/C/API実装へ進む明示承認は増えていないため、A: evidence-firstを維持した。
- 次は多言語検証watchへ戻す。

## Stop Lines

- `sherpa-onnx-node`をinstallしない。
- MeloTTSのPython/Docker/model/unidic setupをしない。
- model download、API call、生成音声、README support claim変更をしない。

## Receipt

- decision: `local_tts_approval_cycle_watch`
- owner: `歌澄 音羽 / 白瀬 怜奈`
- status: done
- next: return to multilingual verification boundary without support-claim changes.
