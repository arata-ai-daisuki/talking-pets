# T177 MeloTTS Detect/Connect-Only Card

## Objective

T176のMeloTTS external runtime helper designを受けて、次に実装するならどこまでを小PRにするかを固定する。

## Recommended Small PR

最初の実装PRは「detect/connect-only」に限定する。

| Area | In scope | Out of scope |
| --- | --- | --- |
| CLI surface | `scripts/tts-melotts.mjs --health` のようなhealth-only helper skeleton | Text synthesis, audio generation, playback |
| Config | Explicit command path or local server URL only | Python env auto-discovery, package install prompts |
| Network | User-configured localhost health endpoint only | Model download, dictionary download, remote API TTS |
| Runtime | User-managed external runtime | Bundled MeloTTS, Docker setup, Python helper setup |
| Failure | `not_configured`, `unavailable`, `timeout`, `non_zero_exit` | Treat missing MeloTTS as install failure |
| Docs wording | Candidate / external runtime / experimental health check | README support claim or dedicated ko/zh provider claim |

## Acceptance Criteria

- Normal `npm ci` and `npm run check:all` still work when MeloTTS is absent.
- No new dependency or optional dependency is added.
- No installer downloads or installs MeloTTS.
- No model, dictionary, voice, or language asset is downloaded.
- Health check can fail cleanly without stack traces or private paths.
- GoalBuddy board keeps Active/Next/Backlog in Japanese.

## Suggested Next Files

- `scripts/tts-melotts.mjs`
- `package.json`
- `test/monitor.test.mjs`
- `docs/research/melotts-design-note.md`
- `docs/goals/talking-pets-hq-japanese/*`

## Stop Lines

- Stop if implementation requires Python/Torch/Docker/MeloTTS install.
- Stop if a test needs real MeloTTS or generated audio.
- Stop if README wording would imply supported multilingual provider status.
- Stop if a public contributor would be asked to share generated audio files.

## Receipt

- decision: `melotts_detect_connect_card_ready`
- result: active
- next: implement health-only helper skeleton, or pause implementation and gather external provider feedback first.
