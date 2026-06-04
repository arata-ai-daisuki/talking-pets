# T178 MeloTTS Health-Only Helper Skeleton

## Objective

T177のdetect/connect-only境界に沿って、MeloTTS本体をinstall/downloadせずにhealth-only helper skeletonを追加する。

## Result

- `scripts/tts-melotts.mjs` を追加した。
- `npm run tts:melotts -- --health` で、未設定時は `not_configured` としてclean failureする。
- `MELOTTS_URL` または `--url` が明示された場合だけ、外部runtimeのhealth URLへ接続する。
- `MELOTTS_COMMAND` または `--command` が明示された場合だけ、外部commandのhealth checkを実行する。
- URLログはquery/hashを伏せる。
- `package.json` に `tts:melotts` とsyntax checkを追加した。
- package/release/pack testsの必須ファイル一覧を更新した。

## Guardrails Kept

- MeloTTS、Python packages、Docker images、model、dictionary、voice、language assetsはinstall/downloadしていない。
- 音声合成、音声再生、default routing、README support claimは追加していない。
- Python environment auto-discoveryはしていない。
- Missing runtimeはTalking Petsのinstall failureではなく、external runtime `not_configured` として扱う。

## Verification

- `node --check scripts/tts-melotts.mjs`
- `npm test`
- `npm run tts:melotts -- --health --profile-latency` expected clean failure with exit 2.
- `npm run tts:melotts -- --health --command /usr/bin/true --profile-latency`
- `npm run check:pack`
- `npm run check:release`
- `CLANG_MODULE_CACHE_PATH=/private/tmp/talking-pets-clang-module-cache npm run check:all`

## Next

Choose one:

1. Keep MeloTTS as standalone health-only helper and gather external provider feedback.
2. Add monitor list/check integration without routing speech to MeloTTS.
3. Add installer detect-only wording, still with no install/download.

## Receipt

- decision: `melotts_health_helper_skeleton_done`
- result: done
- next: decide between feedback, monitor health integration, or installer detect-only wording.
