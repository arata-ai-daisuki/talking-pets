# T179 MeloTTS Next Integration Choice

## Objective

T178のhealth-only helper skeleton後に、次の小PRをどこへ進めるかを決める。

## Recommendation

あいちゃん推奨は **A: monitor health integration**。

理由:

- `scripts/tts-melotts.mjs --health` が既にあるので、音声routingへ進まずに到達確認だけを既存CLI導線へつなげられる。
- installer detect-onlyより先に、runtime healthの表示形を固めた方が後続docsがぶれにくい。
- provider feedbackだけに戻るより、local TTS設計の成果がユーザーの手元で確認しやすくなる。

## Options

| Option | Scope | Done when | Stop line |
| --- | --- | --- | --- |
| A: monitor health integration | `pet-rollout-monitor.mjs --list-voices` 相当のhealth pathへMeloTTS候補を接続する。 | MeloTTS absentでもclean failureし、speech routing/default routingは変わらない。 | 音声合成、playback、default route、README support claimをしない。 |
| B: installer detect-only | installerでMeloTTSをinstallせず、external runtime候補として案内だけ出す。 | download/installなしの案内文とconfig keyだけが増える。 | Python/Docker/model/dictionary downloadへ進まない。 |
| C: provider feedback | MeloTTS/Piper詳しい人への手動質問を追加で磨く。 | runtime/cache/measurementについて聞く文面が増える。 | 自動DM、自動mention、生成音声要求をしない。 |

## Recommended Next PR Boundary

- Add no new dependencies.
- Do not edit README support claims.
- Do not add MeloTTS to `--tts auto`.
- Do not synthesize or play audio.
- Keep all health output sanitized.

## Receipt

- decision: `melotts_next_integration_choice`
- result: active
- recommended_next: `monitor_health_integration`
