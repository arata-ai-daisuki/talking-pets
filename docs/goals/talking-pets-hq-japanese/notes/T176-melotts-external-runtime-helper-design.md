# T176 MeloTTS External Runtime Helper Design

## Objective

MeloTTSをTalking Petsに直接installさせず、ユーザーが別途用意したexternal runtimeへ安全に接続するためのhelper設計を固める。

## Current Decision

- T175の`sherpa-onnx-node` optional install trialは完了扱いにする。
- 次のActiveはMeloTTS external runtime helper designに移す。
- このカードではinstaller download、Python/Docker setup、`python -m unidic download`、model download、README support claimはしない。

## Helper Shape

最初の実装候補は、MeloTTSを「存在すれば使える外部runtime」として扱うだけにする。

| Area | Design |
| --- | --- |
| Runtime ownership | User-managed external runtime. Talking Pets does not install MeloTTS. |
| Discovery | Read explicit config only, such as a command path or local server URL. No auto-search of Python environments. |
| Health check | Verify configured command/server is reachable without synthesis or download. |
| Failure | Return `unavailable`, `not_configured`, `timeout`, or `non_zero_exit` and fall back to existing providers. |
| Cache | Talking Pets does not create or own a MeloTTS cache in this stage. |
| Measurement | Future helper may emit health, synthesis timing, audio duration, RTF, playback flag, and sanitized latency lines. |
| Public wording | Keep MeloTTS as `candidate` / `external runtime` / `design-only`; do not claim Korean or Chinese dedicated support. |

## Installer Boundary

Installer work should be split into later opt-in cards:

1. Detect-only: explain that MeloTTS is not configured and point to a design note.
2. Connect-only: accept an already-running local server or configured command.
3. Install/download: only after Master explicitly approves Python/Docker, model, dictionary, cache path, cleanup, size, and license review.

## Stop Lines

- Do not install MeloTTS, Python packages, Docker images, model files, dictionary files, or language assets.
- Do not add MeloTTS to default routing.
- Do not request generated audio files from contributors.
- Do not use paid or external API TTS as a substitute for this local-runtime design.

## Receipt

- decision: `melotts_external_runtime_helper_design_active`
- result: active
- next: turn this design into a tiny detect/connect-only implementation card, or keep gathering provider-specific multilingual evidence first.
