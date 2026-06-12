# T004 PR preflight kit

## 結論

small-PR preflight / 赤信号抽出スキルの artifact として、`docs/pr-preflight-kit.md` を追加した。

既存の `T009-T011` のセルフレビュー観点を、次のPRで使いやすい5分版に圧縮した。

## 作ったもの

- Five-Minute Preflight
- Red Flags
- change type ごとの command set
- PR body snippet

## 根拠

- `T009` は latency / diagnostics の red flag を整理していた。
- `T010` は multilingual wording と fixture evidence の赤信号を整理していた。
- `T011` は outreach / roadmap / GoalBuddy generated output の赤信号を整理していた。
- `T068` では local absolute path が公開文書に残って CI が落ちた。

## 今回やらないこと

- PR template を長くしすぎない。
- 既存の issue template field は増やさない。
- 新しい platform / provider claim は追加しない。

## 検証

- `ruby -e 'require "yaml"; YAML.load_file("docs/goals/talking-pets-skill-growth-map/state.yaml"); puts "yaml: ok"'`
- `npm run check:docs`
- `npm run check:pack`
- `node --check scripts/check-npm-pack.mjs`
- `npm run check:release`
