# T182 Provider Feedback Capture Next

## Objective

MeloTTS/Piper/sherpaなどprovider feedbackが来た時に、Search Review Logとprovider scorecardへ手動で反映する導線を更新する。

## Scope

- 外部返信を自動取得しない。
- private contact、private logs、DM本文全文は記録しない。
- providerのruntime/cache/license/latency evidenceだけを要約して、次の設計判断へつなぐ。

## Stop Lines

- 自動投稿、DM、follow、like、mentionをしない。
- 未検証providerをREADMEやrelease docsで対応済みclaimにしない。
- 返信がないことをblockerにしない。

## Receipt

- decision: `provider_feedback_capture_next`
- owner: `星宮 未来`
- status: active
- next: update Search Review Log / provider scorecard capture fields.
