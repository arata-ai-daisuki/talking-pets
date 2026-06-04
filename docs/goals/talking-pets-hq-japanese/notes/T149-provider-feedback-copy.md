# T149 Provider Feedback Copy

## Objective

Piper/MeloTTSの調査結果を、TTS providerに詳しい人へ手動で聞けるSNS文面へ変換する。

## Added

- `docs/research/sns-outreach-strategy.md` に `Provider feedback ask` を追加した。
- 依存追加、model download、生成音声添付、install testを相手に要求しない文面にした。
- Piperはlicense-sensitive、MeloTTSはruntime-sensitiveという現時点の境界を、断定しすぎない形で質問にした。

## Guardrails

- 自動投稿や自動DMは追加しない。
- private contact収集は追加しない。
- Piper/MeloTTS対応済みclaimは追加しない。
- 法的助言として断定しない。
- 依存追加、model download、API key、生成音声は不要。

## Receipt

- decision: `provider_feedback_copy`
- result: done
- next: 手動outreachで詳しい人に聞いた回答を、license/runtime/cache/measurementのどこへ効くか分類して記録する。
