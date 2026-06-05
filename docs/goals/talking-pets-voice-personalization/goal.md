# Talking Pets 声と好みの機能開発ゴール

## 目的

Talking Petsを、ユーザーが自分の好みに合わせて声、言語、TTS provider、Voice/API接続、速度/品質、インストール方法を選べるツールへ育てる。

旧HQや旧feature-expansion看板は履歴として残し、この看板では「実際にユーザーが触って嬉しい機能追加」と「性能改善」を優先する。

## 作りたい体験

- ユーザーが、ローカルで使えるTTSと対応言語をすぐ確認できる。
- ユーザーが、声、言語、provider優先度、速度/品質の好みを設定できる。
- 日本語/英語に加えて、韓国語/中国語などをfallback-onlyとprovider-specificに分けて安全に扱える。
- Voice系LLM/APIやOpenAI-compatible local APIを、明示opt-inで接続できる。
- latency、RTF、端末情報、first-audio境界を、協力者が報告しやすい形で出せる。
- installerが、install / update / uninstall / external runtime download / cache cleanup / rollback を安全に説明できる。

## 完了条件

最初の実装波として、以下がmerge済みまたは公開できる証拠つきで揃ったらゴール完了にする。

1. Provider capability registryで、TTS provider、対応言語、fallback-only、外部runtime、model download、API key要否がCLI/docsから確認できる。
2. User preference configで、言語、声、provider優先度、速度/品質、API opt-inを表現できる。
3. local TTS providerを少なくとも1つ改善または追加し、docsとverificationを更新する。
4. 多言語routing diagnosticsで、fallback理由とprovider-specific対応を分けて表示できる。
5. Voice/API provider接続は、secret/privacy/billing境界を守ったopt-in設計または最小実装まで進める。
6. latency benchmarkで、total、RTF、device info、first-audio境界をMarkdown/CSV/JSONで出せる。
7. installerが、update、uninstall、external runtime download/install、config保持、cache削除選択、rollback手順を説明またはdry-runできる。
8. README/README.en/docsに、対応状況、設定例、未対応境界、協力者向け報告方法がある。
9. `npm run check:all` と該当する個別検証が通る。
10. 機能アップデートとしてX/READMEで説明できる短い成果物がある。

## 成功の証拠

- CLIまたはdry-runで、provider選択理由、fallback理由、ユーザー設定の反映結果が見える。
- READMEまたはdocsに、supported / fallback-only / experimental / planned の区別がある。
- installer/update/uninstallのdocsまたはdry-runで、保持される設定、削除候補、cache、external runtime、rollbackが分かる。
- latency結果は1端末の保証値ではなく、端末情報つきの協力者報告フォーマットとして扱われる。
- model download、paid API call、外部endpoint送信、secret保存は明示opt-inなしに発生しない。

## 禁止事項

- 明示承認なしのmodel download。
- 明示承認なしのpaid API call、API key作成、secret保存。
- 韓国語/中国語などを証拠なしにdedicated provider supportとしてclaimすること。
- uninstall/updateで、ユーザー設定、provider設定、cache、external runtimeを確認なしに削除すること。
- 旧HQ/旧feature-expansion看板の履歴を壊すこと。

## 看板

http://goalbuddy.localhost:41737/talking-pets-voice-personalization/

## 関連リンク

- 旧HQ: [../talking-pets-hq-japanese/goal.md](../talking-pets-hq-japanese/goal.md)
- 旧feature expansion: [../talking-pets-feature-expansion/goal.md](../talking-pets-feature-expansion/goal.md)
- Provider comparison: [../../research/tts-provider-comparison.md](../../research/tts-provider-comparison.md)
- Performance docs: [../../performance.md](../../performance.md)
- Install / update / uninstall: [../../install-update-uninstall.md](../../install-update-uninstall.md)
- Verification status: [../../verification-status.md](../../verification-status.md)
- Real-device verification: [../../real-device-verification.md](../../real-device-verification.md)

## 切り替えメモ

- 旧T004 latency benchmark outputの途中成果は、ブランチ `codex/talking-pets-latency-benchmark-output` のcommit `fc131f1` に保存済み。
- 新看板では、既存成果を「再利用候補」として扱い、必要なものだけ小PRでmainへ入れる。
