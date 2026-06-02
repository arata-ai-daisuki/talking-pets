# T079 HQ one-screen current state

## 結論

今の最短アクションはこれ。

1. PR #9をmergeする。
2. T071から最大2件だけ手動outreachを送る。
3. 送信後、T007へ送信ログを貼る。

あいちゃん推奨は **outreach優先**。

## 現在地

| 項目 | 状態 | 次 |
| --- | --- | --- |
| PR #9 | OPEN / MERGEABLE / 3OS CI success | merge待ち |
| active task | T061 | Master判断待ち |
| outreach | T071 / T077 ready | Master手動送信 |
| local TTS | T066 / T069 ready | optionalDependencies案でinstall-only可能 |
| multilingual | T072 done | README claim変更不要 |
| API TTS | T073 done | P2 opt-in境界のみ |
| next savepoint | T078 ready | PR #9 merge後にT069-T078 only |

## Master判断

### 推奨: outreach優先

使う文:

```text
model downloadはまだしない。local TTSは保留してoutreachを優先して。
```

やること:

- V1GPT Reddit public comment
- OpenClaw / Sogni Voice X public reply
- 文脈が合わなければV1R4へ差し替え
- 送信後T007に記録
- 返信が来たらT077から返答

やらない:

- 自動投稿
- 自動DM
- follow / like / mention代行
- 初手Star依頼

### 代替: local TTS install-only

使う文:

```text
package確認とlicense公開情報はOK。npm installだけ試して。model downloadはまだしない。optionalDependencies案で進めて。
```

やること:

- main base worktreeで新branch
- `sherpa-onnx-node` をoptionalDependenciesに追加
- `package.json` / `package-lock.json` 差分確認
- `npm run check:all`
- GitHub CI確認

やらない:

- model download
- helper実装
- audio generation
- default routing
- README対応済みclaim

## あいちゃん判断

スターや使ってくれる人を増やす目的なら、今はoutreach優先がいちばん効く。

local TTSは設計・package確認・license公開情報・install-only preflightまで済んでいるので、少し待たせても崩れない。

## 状態

done。

PR #9 merge、outreach送信、返信送信、Issue作成、npm install、model download、API callはしていない。
