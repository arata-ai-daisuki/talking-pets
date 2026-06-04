# T116 next public verification loop

## 結論

T112の協力者入口、T113の実Issue作成、T114の募集文面、T115の採用基準まで揃った。

次のactive taskは、外部から検証結果を受け取るための公開検証ループにする。

## 次にやること

1. MasterがT114の文面から手動で投稿する。
2. 投稿URLが分かったらT007へ送信ログを追加する。
3. Issue #23-#26に報告が来たらT115で採用可否を判定する。
4. 採用できる結果だけ `docs/verification-status.md` へ反映する。
5. 反映時は小PRに分ける。

## まだやらないこと

- 自動投稿
- 自動DM
- 返信代行
- model download
- npm install
- API call
- VOICEVOX/Irodoriを性能保証として書くこと

## Masterに投げる判断

今すぐ外向きに動くなら:

```text
T114の日本語短縮版で投稿したよ。URLはこれ: <投稿URL>
```

または:

```text
T114のEnglish postで投稿したよ。URLはこれ: <投稿URL>
```

技術側へ戻るなら:

```text
公開検証は待ちで、次はdownloadなしのprovider比較表を整えて。
```

## 状態

active。
