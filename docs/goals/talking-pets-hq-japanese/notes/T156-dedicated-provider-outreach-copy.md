# T156 Dedicated Provider Outreach Copy

## Objective

Dedicated Provider Evidence Checklistを、外部検証者へ手動でお願いできる文面につなげる。

## Added

- `docs/research/sns-outreach-strategy.md` に `Dedicated provider evidence ask` を追加した。
- Korean/Chineseなどのmultilingual TTSについて、OS speech fallbackとprovider-specific evidenceを分けて依頼できるようにした。
- generated audio、private Codex text、credentials、local private pathsを求めない文面にした。

## Guardrails

- 自動投稿や自動DMは追加していない。
- Korean / Chinese dedicated provider support claimは追加していない。
- provider実装、依存追加、model download、API callはしていない。
- private contact収集は追加していない。

## Receipt

- decision: `dedicated_provider_outreach_copy`
- result: done
- next: provider-specific multilingual testerが見つかったら、この文面とPlatform verification issue templateを手動で送る。
