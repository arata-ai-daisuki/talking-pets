# T115 verification intake playbook

## 結論

Issue #23-#26 に検証コメントが来た時の採用基準と返信テンプレを作った。

このメモではIssue返信しない。外部コメントの内容が来るまで `docs/verification-status.md` へ反映しない。

## 採用できる報告

`docs/verification-status.md` へ反映できる目安:

- OS/version が分かる。
- CPU architecture または device/CPU/GPU/RAM が分かる。
- Node.js/npm version が分かる。
- 実行したcommandが分かる。
- TTS pathが分かる。
- `audible: yes` または音が出た/出なかったの明記がある。
- private path、conversation text、credentials、rollout JSONL が貼られていない。
- latencyの場合、playback込みか生成のみかが分かる。

## まだ採用しない報告

- 「動いた」だけで環境やcommandがない。
- private pathや会話本文が残っている。
- generated audio、recording、archive、model fileが添付されている。
- latency total が、再生完了込みか生成待ちか分からない。
- Irodori/VOICEVOXの結果を一般性能保証のように書いている。

## Issue返信テンプレ: 追加情報が必要

```text
Thanks, this is helpful.

Could you add the OS version, Node.js/npm versions, TTS path, and whether the spoken line was audible?

Please redact private paths or conversation text before posting.
```

## Issue返信テンプレ: sanitize依頼

```text
Thanks for testing this.

Could you remove or redact the private path / local log detail from the output?

After that, I can use the result as public verification evidence.
```

## Issue返信テンプレ: 採用できる報告

```text
Thanks, this has the pieces I need: environment, command, TTS path, audible result, and sanitized output.

I'll use this as verification evidence and link it from the verification notes.
```

## Issue返信テンプレ: latencyの切り分け

```text
Thanks, the timing data is useful.

Could you clarify whether the total includes playback completion, or only synthesis/generation time?

For Talking Pets, I'm trying to keep first audio, generated audio duration, and end-to-end time separate.
```

## 反映先

優先順:

1. `docs/verification-status.md`
2. README latency snapshot or platform status, only if the evidence is clear.
3. Related Issue comment with a short maintainer summary.

## 反映時の書き方

- "verified on one contributor machine" と書く。
- "works everywhere" と書かない。
- latencyは端末性能と設定依存であることを残す。
- VOICEVOX/Irodoriはprovider比較の目安で、性能保証ではないと書く。

## 状態

done。
