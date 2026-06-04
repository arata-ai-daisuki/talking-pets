# T188 Outreach Send Queue Refresh

## Objective

README/SNS導線とprovider scorecardが現行化されたので、手動送信候補の優先順と送信後の記録場所を再点検する。

## Scope

- Ready-To-Send Queueが現行リンクと現在のaskを使っているか確認する。
- 返信待ちをblockerにしない形で、次の手動候補を見える化する。
- Star依頼やDMを強めず、public reply firstの境界を保つ。

## Stop Lines

- 自動投稿、DM、follow、like、mentionをしない。
- private contact detailsを集めない。
- 送信済み扱いはMasterが実際に投稿したURLを渡した時だけにする。

## Receipt

- decision: `outreach_send_queue_refresh`
- owner: `星宮 未来`
- status: active
- next: refresh Ready-To-Send Queue and Search Review Log guidance.
