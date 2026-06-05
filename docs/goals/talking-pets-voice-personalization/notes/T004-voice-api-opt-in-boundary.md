# T004 Voice/API Opt-In Boundary

## 担当

- 白瀬 怜奈: Scout / Judge

## 目的

Voice系LLM/API providerの接続可能性を調査し、OpenAI-compatible local API、remote API、secret/privacy/billingの境界を整理する。

## 期待する成果

- API接続をlocal-firstのまま扱う場合の設計候補。
- secretを保存しない設定方針。
- paid API callや外部送信を明示opt-inに閉じる方針。
- provider registry / preferences / diagnosticsへ接続する場合の最小schema候補。

## 停止線

- API keyを作成しない。
- paid API callをしない。
- remote endpointへテキストを送信しない。
- secretをdocs、fixtures、logs、preferencesへ保存しない。

## 調査結果

- OpenAI-compatible local endpointとremote OpenAI TTS APIをregistry上で分ける。
- local endpointは外部runtime所有で、まずURL/config/dry-run診断のみを許可する。
- remote OpenAI TTS APIはAPI key、課金、text送信、AI音声 disclosure が絡むため、実装前にprovider-specific noteとMaster承認が必要。
- `apiOptIn: false` を既定にし、preferencesにはsecretを入れない方針を維持する。

## 参考

- OpenAI Text to speech guide: https://platform.openai.com/docs/guides/text-to-speech
- OpenAI Audio API reference: https://platform.openai.com/docs/api-reference/audio/create
