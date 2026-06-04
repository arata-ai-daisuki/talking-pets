# T150 Provider Feedback Intake

## Objective

Provider feedback askへ返事が来た時に、Piper/MeloTTSの設計判断へつながる形で記録できる受け皿を作る。

## Added

- `docs/research/tts-provider-comparison.md` に `Provider Feedback Intake` を追加した。
- feedback areaを `license` / `runtime` / `cache` / `measurement` / `platform` に分類できるようにした。
- 返事だけでREADME claimや実装へ進まず、provider-specific design noteとMaster判断へ渡す停止線を追加した。

## Guardrails

- private contact detailsは集めない。
- generated audio filesは求めない。
- provider対応済みclaimは追加しない。
- dependency、model download、implementationへ進まない。

## Receipt

- decision: `provider_feedback_intake`
- result: done
- next: 実際の返信が来たら、この表へ要点だけ記録し、設計note化が必要か判断する。
