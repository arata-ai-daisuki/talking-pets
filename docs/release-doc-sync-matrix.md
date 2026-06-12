# Release Doc Sync Matrix

Last updated: 2026-06-12

Use this matrix when a change affects public wording, release evidence, install/update behavior, TTS provider behavior, platform status, or issue intake.

The goal is to keep user-facing claims, verification evidence, release notes, and issue templates in sync without strengthening claims beyond the evidence.

## Sync Rules

| Change type | Primary files | Also check | Required proof |
| --- | --- | --- | --- |
| User-facing behavior | `README.md`, `README.en.md` | `CHANGELOG.md`, `implementation-notes.md`, `.github/pull_request_template.md` | `npm run check:docs`, `npm run check:release` |
| Platform status or release evidence | `docs/verification-status.md`, `docs/real-device-verification.md`, `docs/release-notes-template.md` | `README.md`, `README.en.md`, `.github/ISSUE_TEMPLATE/platform_verification.yml` | Sanitized Platform verification issue with `audible: yes` when graduating status |
| Install, update, or uninstall behavior | `docs/install-update-uninstall.md`, `README.md`, `README.en.md` | `.github/ISSUE_TEMPLATE/install_trouble.yml`, `docs/verification-matrix.md` | `npm run check:installers`, `npm run maintenance:plan -- --update --dry-run`, `npm run maintenance:plan -- --uninstall --dry-run` |
| Public package scope | `package.json`, `scripts/check-npm-pack.mjs` | `docs/public-repo-review-checklist.md`, linked packaged docs | `npm run check:pack` |
| TTS provider or API boundary | `README.md`, `README.en.md`, `SECURITY.md`, `docs/verification-status.md` | `CREDITS.md`, `.github/ISSUE_TEMPLATE/tts_provider_request.yml`, `docs/research/tts-provider-comparison.md` | Explicit opt-in proof, no secret storage, and provider-specific evidence before stronger support wording |
| Multilingual support wording | `docs/verification-status.md`, `docs/real-device-verification.md`, `README.md`, `README.en.md` | `docs/research/tts-provider-comparison.md`, `.github/ISSUE_TEMPLATE/platform_verification.yml` | Fallback-only or provider-specific evidence classification |
| Public log or sanitizer behavior | `SECURITY.md`, `CONTRIBUTING.md`, `docs/real-device-verification.md`, `docs/release-notes-template.md` | `.github/ISSUE_TEMPLATE/*`, `scripts/check-public-output-sanitizer.mjs` | `npm run check:sanitize` and manual review wording |
| Contributor intake fields | `.github/ISSUE_TEMPLATE/*`, `CONTRIBUTING.md` | `README.md`, `README.en.md`, `docs/real-device-verification.md` | The requested fields match release evidence requirements |

## Claim Change Checklist

Before changing public support wording:

1. Identify whether the claim is about routing, fixture compatibility, audible speech, platform stability, provider-specific support, latency, or install safety.
2. Find the matching evidence row in `docs/verification-status.md` or create one only after sanitized evidence exists.
3. Update README Japanese and English wording together.
4. Update release notes or release evidence rows only after verification status is current.
5. Update issue templates only when the new evidence field should be collected from users.
6. Run `npm run check:release` and `npm run check:docs`.

## Do Not Sync

Do not update public claim wording when the new information is only:

- a fixture-only diagnostic for audible or provider-specific support
- `npm run check:compat -- --no-state` for stateful Codex compatibility
- a private or unsanitized message
- a local benchmark from one device presented as a universal performance result
- a design-only provider note without runtime, license, privacy, cache, and audible evidence

## Minimal PR Body Note

Use this shape when the PR changes public wording:

```md
Docs sync:
- README / README.en: <changed or not needed>
- verification-status: <changed or not needed>
- release notes template: <changed or not needed>
- issue templates: <changed or not needed>
- evidence boundary: <fixture|stateful|audible|opt-in external>
```
