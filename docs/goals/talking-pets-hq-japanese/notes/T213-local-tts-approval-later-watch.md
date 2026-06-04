# T213 Local TTS Approval Later Watch

## Objective

T212のoutreach待機確認後に、local TTSのA/B/C承認判断へ戻る。

## Scope

- Local TTS Approval Response Watchを確認する。
- MasterがB/Cを明示していなければ、A: evidence-firstを維持する。
- 次に進める内部作業だけを整理する。
- repo記録上、`sherpa metadata review only` / `MeloTTS external-runtime design only` などB/Cの明示承認は増えていないことを確認した。
- `docs/research/tts-provider-comparison.md` にLocal TTS Approval Later Watchを追加した。
- VOICEVOX/Irodoriは証拠収集継続、sherpa/MeloTTSはapproval-gatedのままにした。

## Stop Lines

- `sherpa-onnx-node`をinstallしない。
- MeloTTSのPython/Docker/model/unidic setupをしない。
- model download、API call、生成音声、README support claim変更をしない。

## Receipt

- decision: `local_tts_approval_later_watch`
- owner: `歌澄 音羽 / 白瀬 怜奈`
- status: done
- next: return to multilingual verification intake/watch.
