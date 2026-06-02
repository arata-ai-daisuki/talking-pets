# T027 social投稿前素材チェック

Owner role: 星宮 未来

## 目的

固定ポスト/告知ポストをMasterが手動投稿する前に、demo link、repo link、claim、Star導線を確認できるようにする。

このメモでは投稿しない。自動投稿、自動DM、自動follow、自動likeはしない。

## 利用できる素材

README標準demo:

```text
docs/demo/talking-pets-overlay-2026-05-28.mov
docs/demo/talking-pets-overlay-2026-05-28-frame.png
```

X向け候補:

```text
docs/demo/talking-pets-overlay-2026-05-28-x-1280x720.mp4
docs/demo/talking-pets-overlay-2026-05-28-x-1280x720-speedramps-x4.mp4
docs/demo/talking-pets-overlay-2026-05-28-x4-frame.png
```

注意:

- X向けmp4/pngは未追跡。投稿素材として使う判断はできるが、PR 1/2/3には混ぜない。
- README標準demoは既存READMEで参照されている。
- 実投稿前に動画がローカルで開けるか確認する。

## link候補

Repo:

```text
https://github.com/arata-ai-daisuki/talking-pets
```

Demo:

```text
https://github.com/arata-ai-daisuki/talking-pets/blob/main/docs/demo/talking-pets-overlay-2026-05-28.mov
```

注意:

- `main` 上にdemoが存在するか、投稿直前に確認する。
- PR前なら、demo linkはREADME内の相対linkではなくrepo linkを使うか、動画を添付する。
- Xに直接動画を添付する場合、repo demo linkは省略してもよい。

## 投稿claimチェック

書いてよい:

- local-first
- no Codex.app patching
- local logs / local assistant output
- local TTS routing
- latency profiling in progress
- routing diagnostics
- `ko` / `zh` fallback/routing検証

書かない:

- `under 1s`
- guaranteed low latency
- dedicated Korean TTS support
- dedicated Chinese TTS support
- production-ready
- official Codex integration
- cloud/API TTS enabled by default

## Star導線

OK:

```text
If this direction is useful or fun, a GitHub Star helps me prioritize the next TTS and latency work.
```

避ける:

```text
Please star this now.
Star before trying.
Help me grow by starring.
```

日本語OK:

```text
方向性が面白そうなら、GitHub Starしてもらえると次のTTS/レイテンシ改善の優先度づけの参考になります。
```

## 投稿前チェック

- [ ] 動画またはdemo linkが開ける。
- [ ] repo linkが正しい。
- [ ] 英語ポストと日本語ポストを混ぜていない。
- [ ] `under 1s` などの保証を書いていない。
- [ ] `ko` / `zh` を専用TTS対応済みとして書いていない。
- [ ] Star導線が控えめ。
- [ ] X向け未追跡mp4/pngをPR stage対象に混ぜていない。
- [ ] 投稿はMaster手動。

## あいちゃん推奨

初回固定ポスト:

```text
T026 English Option B + X向けmp4添付
```

日本語補足:

```text
T026 Japanese Option A
```

理由:

- 動画hookを先頭に置ける。
- 英語版はAI companion感が出る。
- 日本語版は技術的な説明が自然。
- 性能claimを盛らない。
