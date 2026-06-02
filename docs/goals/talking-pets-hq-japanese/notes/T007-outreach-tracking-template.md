# T007 outreach追跡テンプレ

Owner role: 星宮 未来

## 目的

Masterが手動でoutreachを送った後、反応や次アクションを忘れず追えるようにする。

このテンプレは記録用。自動投稿、自動DM、自動follow、自動likeはしない。

## 送信前チェック

- [ ] 相手の投稿文脈がTalking Petsに合っている。
- [ ] 初回でStar依頼していない。
- [ ] DMではなく公開返信、または相手がDMを明示歓迎している。
- [ ] 同じ文面を複数人へ連投していない。
- [ ] day-1の送信数は最大2件。
- [ ] 返信先URLを控えた。

## 送信ログ

| 日付 | 優先 | 相手/Project | Surface | URL | 送信文 | 状態 | 次アクション |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  | P0 | OpenClaw / Sogni Voice | X |  |  | 未送信 | 投稿文脈を確認 |
|  | P0 | V1GPT | Reddit/GitHub/X確認後 |  |  | 未送信 | 公式XがなければReddit public threadのみ |
|  | P0 | V1R4 | Reddit/GitHub/X確認後 |  |  | 未送信 | GitHub Issueを宣伝欄にしない |

## 反応ログ

| 日付 | 相手/Project | 反応 | 次に返すか | 返答案 | 注意 |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## 状態ラベル

- `未送信`: まだ送っていない。
- `送信済み`: 1回送った。催促しない。
- `返信あり`: 相手から反応あり。
- `保留`: 文脈が合わない、または送らない方がよい。
- `完了`: 返信不要、または次アクションなし。

## 2週間ルール

返信がない場合、最低2週間は同じ相手へ催促しない。

例:

```text
送信日: 2026-06-02
次に触ってよい日: 2026-06-16以降
```

## 返信が来た時の基本方針

1. まずお礼。
2. 相手の具体的な指摘を1つ拾う。
3. 必要ならIssue/PR/README改善へつなぐ。
4. Star依頼はしない。
5. 技術的に未検証の性能claimはしない。

## 返信テンプレ

```text
Thanks, that's helpful. I'm keeping this local-first for now, so your point about latency/voice timing is exactly the kind of feedback I wanted.

I'll try to capture this in the README or a small benchmark note rather than overclaiming it.
```

## 日本語返信テンプレ

```text
ありがとうございます、かなり参考になります。

今はlocal-firstで、音声が便利になるタイミングと邪魔になるタイミングの境目を見たいと思っています。いただいた観点はREADMEかベンチメモに反映します。
```
