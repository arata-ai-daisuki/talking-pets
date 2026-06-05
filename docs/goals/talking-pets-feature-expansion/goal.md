# Talking Pets 機能拡張ゴール

## 目的

Talking Petsを、ユーザーの好みに合わせて声・言語・TTS/Voice APIを選べるツールへ拡張する。

運用看板ではなく、機能追加と性能向上を進めるためのGoalBuddyゴールとして扱う。

## 作りたい体験

- ユーザーが自分の環境で使えるローカルTTSを確認できる。
- ユーザーが声、言語、provider、速度/品質の優先度を選べる。
- 日本語/英語だけでなく、韓国語/中国語などのfallbackまたはprovider-specific対応を安全に広げられる。
- Voice系LLM/APIやOpenAI-compatible local APIを、明示opt-inで接続できる設計にする。
- latencyやfirst-audioを測り、性能改善をclaimできる証拠を残す。

## 完了条件

短期完了ではなく、以下の最初の実装波が完了したら一区切りにする。

1. Provider capability registryがあり、使えるTTSと言語がCLI/READMEで分かる。
2. User preference configで、言語、声、provider優先度、API opt-inを表現できる。
3. local TTS providerを少なくとも1つ改善または追加する小PRがmergeできる。
4. 多言語routing diagnosticsが、fallback-onlyとprovider-specificを分けて表示できる。
5. Voice/API providerはsecret/privacy/billing境界を守ったopt-in設計または実装PRまで進む。
6. latency benchmarkの出力が、機能アップデートとして公開できる形になる。

## 成功の証拠

- `npm run check:all` が通る。
- READMEまたはdocsに、対応provider、対応言語、設定例、未対応/承認待ち境界がある。
- CLIまたはdry-runで、provider選択理由、fallback理由、ユーザー設定の反映結果が見える。
- model download、paid API call、外部endpoint送信は、明示承認なしに発生しない。

## 禁止事項

- 明示承認なしのmodel download。
- 明示承認なしのpaid API callまたはAPI key作成。
- secretをdocs、logs、fixturesへ保存すること。
- 韓国語/中国語などを証拠なしにdedicated provider supportとしてclaimすること。
- 既存の運用HQ履歴を壊すこと。

## 看板

http://goalbuddy.localhost:41737/talking-pets-feature-expansion/

## 関連リンク

- 既存HQ: [../talking-pets-hq-japanese/goal.md](../talking-pets-hq-japanese/goal.md)
- Agent roster: [agent-roster.md](agent-roster.md)
- Activity log: [activity-log.md](activity-log.md)
- Provider comparison: [../../research/tts-provider-comparison.md](../../research/tts-provider-comparison.md)
- Verification status: [../../verification-status.md](../../verification-status.md)
- Real-device verification: [../../real-device-verification.md](../../real-device-verification.md)
