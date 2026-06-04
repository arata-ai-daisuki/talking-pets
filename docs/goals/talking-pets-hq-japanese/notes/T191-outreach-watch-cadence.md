# T191 Outreach Watch Cadence

## Objective

送信後は返信待ちで止まらず、手動ログと2週間ルールだけを保つ。

## Scope

- Ready-To-Send QueueとSearch Review Logの状態を確認する。
- user-sentの相手へ再送しない。
- 返信が来た時だけ、public URL / evidence type / next actionを記録する。

## Stop Lines

- 自動投稿、自動DM、自動mentionをしない。
- 返信待ちだけを理由にlocal TTSや多言語docs作業を止めない。
- private DM本文や個人情報をdocsへ貼らない。

## Receipt

- decision: `outreach_watch_cadence`
- owner: `星宮 未来`
- status: active
- next: verify sent/watch/reply-later state without sending messages.
