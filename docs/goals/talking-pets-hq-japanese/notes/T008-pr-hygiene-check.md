# T008 PR前hygiene確認メモ

Owner role: 文月 栞里

## 結果

完了。

PR分割前に、不要ファイルが混ざらないか確認した。

## 確認したこと

`.gitignore` にはすでに以下が含まれている。

```text
.DS_Store
```

そのため、以下は `git status --short --ignored` では ignored として出る。

```text
!! .DS_Store
!! docs/.DS_Store
!! docs/goals/.DS_Store
```

## 実行したこと

- `.DS_Store` は削除していない。
- `git add` はしていない。
- commit はしていない。
- `.gitignore` の変更は不要だったため行っていない。

## PR化時の注意

`docs/goals/` 配下をまとめてstageする場合でも、`.DS_Store` はignoreされるため通常は混ざらない。

ただし、手動で `git add -f docs/goals/.DS_Store` しないこと。

## demo素材

次のdemo素材はignoredではないため、PR化時に明示判断が必要。

```text
docs/demo/talking-pets-overlay-2026-05-28-x-1280x720-speedramps-x4.mp4
docs/demo/talking-pets-overlay-2026-05-28-x-1280x720.mp4
docs/demo/talking-pets-overlay-2026-05-28-x4-frame.png
```

あいちゃん推奨:

- 今回のPR 1-3には含めない。
- demo素材PRを別に作るか、README demo導線の更新時にまとめる。
