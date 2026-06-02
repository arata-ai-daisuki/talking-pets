# T073 API TTS opt-in boundary

## 結論

API TTSはP2の任意機能として扱う。

今は実装しない。API callもしない。secretも作らない。

## 既存方針との整合

README / README.en / ROADMAP は、次の方針で整合している。

- 既定はlocal-first。
- 既定ではOpenAI APIや外部LLMへ要約リクエストを送らない。
- カスタムTTS endpointを指定する場合、会話文がそのendpointへ送られる可能性がある。
- OpenAI APIはChatGPTプランとは別課金。
- API TTSはprivacyとbilling warningつきの明示opt-inとしてだけ検討する。

## API TTSを入れる前の最低条件

実装前にMaster確認が必要:

- provider名
- 送信するtextの範囲
- endpoint URLの扱い
- API key / secretの置き場所
- billing warningの表示場所
- privacy warningの表示場所
- dry-runで「送信予定text」を確認する方法
- logsやpublic issueへ送信textを漏らさない方法

## 実装するなら最小形

最初の実装は、provider固有実装ではなく generic endpoint helper がよい。

想定:

```text
scripts/tts-api-endpoint.mjs
```

最小CLI案:

```bash
node scripts/tts-api-endpoint.mjs \
  --text "Benchmark ready." \
  --endpoint-env TALKING_PETS_TTS_ENDPOINT \
  --api-key-env TALKING_PETS_TTS_API_KEY \
  --out /tmp/talking-pets-api.wav \
  --dry-run
```

必須:

- `--dry-run` ではnetwork callしない。
- `--dry-run` では送信予定の文字数、endpoint env名、output pathだけを出す。
- 実textは既定でstdout/stderrへ出さない。
- API key値は絶対に表示しない。
- default routingには組み込まない。

## README claim境界

実装前に書いてよい:

- API TTS is being considered as explicit opt-in.
- local-first remains the default.

実装前に書かない:

- OpenAI TTS対応済み
- ElevenLabs対応済み
- Google / Azure / Polly対応済み
- cloud TTS is recommended by default
- external endpoint is safe for all conversation text

## 停止条件

次のどれかなら止める。

- Masterの同一ターン明示承認なしにAPI callが必要。
- secret値をrepo、logs、issue、PR bodyへ出しそうになる。
- conversation textを外部へ送る範囲が説明できない。
- billing warningをREADME / CLI / docsのどこへ出すか決まっていない。
- local-firstの既定が弱くなる。

## 現時点の判断

今はAPI TTSより、次のどちらかを優先する。

1. outreach手動送信
2. sherpa-onnx-nodeのinstall-only実験

API TTSは、反応やprovider要望が出てから再評価する。

## 状態

done。

API call、secret作成、依存追加、model download、実装変更はしていない。
