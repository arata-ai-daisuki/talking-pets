# T057 multilingual current claim audit

## 結論

現行worktreeのfixtureで、多言語routing claimを再確認した。

READMEへ書いてよい最新claim:

- Japanese and English are prioritized.
- Korean and Chinese are first-class fallback paths.
- Korean and Chinese currently route to OS speech fallback, not dedicated TTS providers.
- `--speech-language ja|en|ko|zh|other` can force the spoken language.

READMEへ書かないclaim:

- Korean dedicated TTS support.
- Chinese dedicated TTS support.
- production-ready multilingual TTS.
- quality guarantee for Korean / Chinese speech.

## 現行fixture

過去メモT049では `ko-zh-rollout.jsonl` を使っていたが、現在のworktreeではfixtureが分離されている。

現行の正本:

- `test/fixtures/ko-rollout.jsonl`
- `test/fixtures/zh-rollout.jsonl`
- `test/fixtures/zh-traditional-rollout.jsonl`

## 再検証結果

| case | fixture | detectedLanguage | effectiveLanguage | chosenEngine | fallbackReason |
| --- | --- | --- | --- | --- | --- |
| Korean auto | `ko-rollout.jsonl` | `ko` | `ko` | `say` | `ko uses OS speech fallback; no dedicated provider is configured.` |
| Simplified Chinese auto | `zh-rollout.jsonl` | `zh` | `zh` | `say` | `zh uses OS speech fallback; no dedicated provider is configured.` |
| Traditional Chinese auto | `zh-traditional-rollout.jsonl` | `zh` | `zh` | `say` | `zh uses OS speech fallback; no dedicated provider is configured.` |

## README整合性

README / README.en は、次の現行claimと整合している。

- 日本語 / 英語を優先。
- 韓国語 / 中国語 / その他はOS標準音声fallback。
- `ko` / `zh` は専用TTS providerではなく first-class fallback。

`implementation-notes.md` には過去の作業ログとして古い `ja|en|ko|other` 表記が残っている箇所があるが、後続ログでは `ja|en|ko|zh|other` に更新されている。implementation notesは履歴なので、今回のclaim正本はREADME / README.en / FUTURE_PLAN / このT057 receiptとする。

## 実行コマンド

```bash
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ko-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-traditional-rollout.jsonl
rg -n "multilingual|language|speech-language|Korean|Chinese|VOICEVOX|claim|fallback|dry-run" README.md README.en.md FUTURE_PLAN.md implementation-notes.md
```

## 状態

done。

音声再生、外部API、依存追加、model download、commit、pushはしていない。
