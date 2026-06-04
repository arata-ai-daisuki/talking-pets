# T153 MeloTTS Design Note

## Objective

MeloTTSを実装前のprovider-specific design noteへ落とし、Python/Docker/unidic/cacheの停止線を明確にする。

## Added

- `docs/research/melotts-design-note.md` を追加した。
- MeloTTSはL0 design-only / runtime-review candidateとして扱った。
- user-managed external runtimeのみを将来候補にし、normal install pathへ混ぜない停止線を明記した。
- `docs/research/tts-provider-comparison.md` からMeloTTS design noteへ導線を追加した。

## Guardrails

- MeloTTS installはしていない。
- Python/Torch/audio/NLP dependencies、Docker setup、`python -m unidic download`は実行していない。
- model、dictionary、voice、language assetはdownloadしていない。
- README support wordingやdefault routingは追加していない。

## Receipt

- decision: `melotts_design_note`
- result: done
- next: provider feedbackまたはMaster判断が来たら、runtime/cache-focused review noteへ進めるか、MeloTTSをdesign-onlyのまま保留する。
