# T204 Multilingual Verification Watch

## Objective

Local TTS承認判断カードの次に、多言語検証の新しいpublic evidenceが来た場合の受け口を確認する。

## Scope

- Minimal Multilingual Report FormとMultilingual Evidence Intake Queueを確認する。
- 新しい報告がなければ、fallback-only claimを維持したままwatch状態を更新する。
- 報告が来ている場合だけ、public URLまたはMaster承認済みprivate summaryとして記録する。

## Stop Lines

- OS speech fallbackを韓国語/中国語専用provider対応としてclaimしない。
- private contact、未承認DM、生成音声ファイルをrepoに保存しない。
- README support claimを強めない。

## Receipt

- decision: `multilingual_verification_watch`
- owner: `言守 詞葉 / 白瀬 怜奈`
- status: active
- next: check multilingual intake surfaces without changing provider claims.
