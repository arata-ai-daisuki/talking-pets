# T182 Provider Feedback Capture Next

## Objective

MeloTTS/Piper/sherpaなどprovider feedbackが来た時に、Search Review Logとprovider scorecardへ手動で反映する導線を更新する。

## Scope

- Search Review LogにProvider Feedback Capture欄を追加した。
- provider comparisonのProvider Feedback Intakeに転記先、decision impact rules、private summary境界を追加した。
- providerのruntime/cache/license/latency evidenceだけを要約して、次の設計判断へつなぐ。

## Stop Lines

- 自動投稿、DM、follow、like、mentionをしない。
- 未検証providerをREADMEやrelease docsで対応済みclaimにしない。
- 返信がないことをblockerにしない。

## Receipt

- decision: `provider_feedback_capture_next`
- owner: `星宮 未来`
- status: done
- next: multilingual evidence refresh.
