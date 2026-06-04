# T151 Provider Design Note Template

## Objective

Piper/MeloTTSなどのprovider-specific design noteを、毎回同じ観点で書けるテンプレにする。

## Added

- `docs/research/provider-design-note-template.md` を追加した。
- dependency、model download、cache、license、privacy、platform、measurement、README wordingを必ず確認する形にした。
- `docs/research/tts-provider-comparison.md` からテンプレへの導線を追加した。

## Guardrails

- テンプレ記入はimplementation approvalではない。
- dependency install、model download、API usage、generated audio attachmentはしない。
- README support claimやdefault provider routingへ進まない。

## Receipt

- decision: `provider_design_note_template`
- result: done
- next: provider feedbackやMaster判断が来たら、このテンプレを複製してPiper/MeloTTSなどの個別design noteへ落とす。
