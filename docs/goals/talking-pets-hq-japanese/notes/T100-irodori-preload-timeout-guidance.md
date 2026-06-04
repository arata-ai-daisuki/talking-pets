# T100 Irodori preload timeout guidance

## 結論

Irodori初回request timeout対策として、README / README.en にpreloadとserver timeout設定の導線を追加した。

## 追加した内容

- `IRODORI_PRELOAD=true` でserver起動時にruntime loadできること
- `IRODORI_MODEL_LOAD_TIMEOUT` / `IRODORI_SYNTHESIS_WAIT_TIMEOUT` を必要に応じて伸ばせること
- これらはTalking Petsの `.talking-pets.local.env` ではなく、Irodori-TTS-Server側の起動環境に設定すること
- Talking Pets側では `npm run tts:irodori -- --health --profile-latency` と `/health` の `runtime.loaded` / `runtime.loading` で切り分けること

## 確認した根拠

Irodori-TTS-Serverのローカルcloneで以下を確認した。

- `.env.example`
- `README.md`
- `src/irodori_openai_tts/config.py`
- `src/irodori_openai_tts/app.py`
- `src/irodori_openai_tts/runtime.py`

## 状態

done。
