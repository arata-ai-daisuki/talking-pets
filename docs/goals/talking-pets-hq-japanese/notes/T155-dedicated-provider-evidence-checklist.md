# T155 Dedicated Provider Evidence Checklist

## Objective

多言語fallback evidenceとdedicated provider evidenceを混同しないよう、READMEから確認条件へ誘導する。

## Added

- `docs/verification-status.md` に `Dedicated Provider Evidence Checklist` を追加した。
- `README.md` と `README.en.md` の Language And Device Limits から checklist へリンクした。
- `ko` / `zh` はfirst-class fallbackのままにし、専用provider対応claimへ上げる条件を外部実機証跡として明記した。

## Guardrails

- Korean / Chinese dedicated provider support claimは追加していない。
- provider実装、依存追加、model download、API callはしていない。
- private Codex text、credentials、generated audio attachmentを求めていない。

## Receipt

- decision: `dedicated_provider_evidence_checklist`
- result: done
- next: 外部issueでprovider-specific evidenceが来たら、このchecklistでreviewしてverification-statusへ反映する。
