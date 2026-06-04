# T142 multilingual issue guidance

## 結論

Platform verification issue templateに、多言語fallback検証の任意欄を追加した。

## 変更

- `--speech-language ko` / `--speech-language zh` / auto routingの検証時に、source text、speech-language、chosen TTS path、audible result、fallback-onlyかdedicated provider evidenceかを記録できるようにした。
- `docs/verification-status.md` に、ko/zh fallback evidenceと将来のdedicated-provider evidenceを分けて扱う説明を追加した。
- Korean / Chinese OS speech fallbackを専用TTS provider対応済みとして扱わない境界をIssueテンプレ側にも置いた。

## 状態

active。
