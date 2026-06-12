# T002 verification matrix

## 結論

検証設計スキルの最初の artifact として、`docs/verification-matrix.md` を追加した。

この doc は、検証を次の5種類に分ける。

1. fixture check
2. stateful local check
3. audible real-device check
4. sandbox-sensitive check
5. opt-in external check

## 作ったもの

- routine local proof の command matrix
- stateful / real-device proof の boundary
- sandbox で落ちやすい check と clean fallback
- OpenAI-compatible local、remote OpenAI TTS、外部runtime、Kokoro、uninstall automation の opt-in 境界
- PR 前の verification recipe

## 根拠

- PR `#181` は OpenAI-compatible local と remote API opt-in を分けた。
- PR `#182` は localhost TTS smoke と installer update flow の verification を足した。
- `implementation-notes.md` には localhost listen / npm registry access が sandbox 内で制限された記録がある。
- `docs/public-repo-review-checklist.md` には release gate があるが、routine proof / stateful proof / sandbox-sensitive proof の違いは一覧化されていなかった。

## 今回やらないこと

- 実際の paid API call はしない。
- destructive uninstall はしない。
- Windows / Linux の実機 status claim は変えない。
- README の機能 claim は強めない。

## 検証

- `ruby -e 'require "yaml"; YAML.load_file("docs/goals/talking-pets-skill-growth-map/state.yaml"); puts "yaml: ok"'`
- `npm run check:docs`
