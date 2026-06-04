# T180 MeloTTS Monitor Health Integration

## Objective

MeloTTS health-only helperをmonitorの`--list-voices`導線へ接続し、外部runtimeがあるかだけを安全に確認できるようにする。

## Scope

- `scripts/pet-rollout-monitor.mjs` に `--tts melotts` と `--melotts-*` health optionsを追加した。
- `--tts melotts --list-voices` で `scripts/tts-melotts.mjs --health` を呼ぶ。
- 未設定時は `tts-melotts: not_configured` としてclean failureする。
- 明示した `--melotts-command <node>` ではhealth okになる。
- 通常speech pathではMeloTTSを合成/再生しない。

## Stop Lines

- MeloTTS、Python packages、Docker images、model、dictionary、language assetsはinstall/downloadしていない。
- READMEの対応provider claimは増やしていない。
- default routing、language routing、自動fallbackには入れていない。
- 音声合成、音声再生、generated audioは行っていない。

## Verification

- `node --check scripts/pet-rollout-monitor.mjs`
- `npm test`
- `npm run monitor:node -- --tts melotts --list-voices` expected clean failure with exit 2.
- `npm run monitor:node -- --tts melotts --list-voices --melotts-command "$(command -v node)"`
- `npm run check:release`
- `CLANG_MODULE_CACHE_PATH=/private/tmp/talking-pets-clang-module-cache npm run check:all`

## Receipt

- decision: `melotts_monitor_health_integration`
- owner: `歌澄 音羽`
- status: done after local verification.
- next: after merge, choose installer detect-only wording or provider feedback capture.
