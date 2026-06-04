# T232 Multilingual Verification Boundary Watch

## Objective

T231のlocal TTS approval boundary watch後に、多言語検証の境界へ戻る。

## Scope

- `docs/verification-status.md` と `docs/real-device-verification.md` の多言語検証境界を確認する。
- 韓国語・中国語はOS speech fallback中心の検証として扱う。
- provider-specificな韓国語・中国語対応claimは、sanitized contributor evidenceが来るまで保留する。

## Stop Lines

- Korean / Chinese dedicated provider supportをclaimしない。
- private logs、private rollout、生成音声、DM全文を保存しない。
- README support claimを強めない。
- model download、API call、生成音声をしない。

## Receipt

- decision: `multilingual_verification_boundary_watch`
- owner: `言守 詞葉 / 白瀬 怜奈`
- status: active
- next: recheck multilingual verification boundary without support-claim changes.
