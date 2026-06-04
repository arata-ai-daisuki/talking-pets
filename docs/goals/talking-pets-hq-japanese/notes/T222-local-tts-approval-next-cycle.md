# T222 Local TTS Approval Next Cycle

## Objective

T221のoutreach返信待ちlane確認後に、local TTSのA/B/C承認境界へ戻る。

## Scope

- Local TTS Approval Follow-Up Resultを確認する。
- MasterがB/Cを明示していなければ、A: VOICEVOX / Irodori evidence-firstを維持する。
- sherpa / MeloTTS / API TTSはapproval-gatedのまま扱う。
- repo記録上、`sherpa metadata review only` / `MeloTTS external-runtime design only` / API TTSなどB/C相当の明示承認は増えていないことを確認した。
- `docs/research/tts-provider-comparison.md` にLocal TTS Approval Next Cycle Resultを追加した。
- 次は多言語検証watchへ戻る。

## Stop Lines

- `sherpa-onnx-node`をinstallしない。
- MeloTTSのPython/Docker/model/unidic setupをしない。
- model download、API call、生成音声、README support claim変更をしない。

## Receipt

- decision: `local_tts_approval_next_cycle`
- owner: `歌澄 音羽 / 白瀬 怜奈`
- status: done
- next: return to multilingual verification cycle.
