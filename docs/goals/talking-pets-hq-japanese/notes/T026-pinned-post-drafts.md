# T026 固定ポスト下書き

Owner role: 星宮 未来

## 目的

Talking Petsの見え方を整えるため、手動投稿用の固定ポスト/告知ポスト下書きを作る。

このメモでは投稿しない。自動投稿、自動DM、自動follow、自動likeはしない。

## 方針

- 英語ポストと日本語補足を分ける。
- 1投稿に英日を混ぜない。
- video/demo hookを先頭に置く。
- `local-first`、`no Codex patching`、`latency measurement` を軸にする。
- Star依頼は控えめにする。
- `under 1s` などの性能保証は書かない。
- `ko` / `zh` は専用TTS対応ではなくfallback/routing検証として扱う。

## English pinned post draft

### Option A: concise

```text
I made Talking Pets: a small local-first voice add-on for Codex Pet.

It reads recent local Codex assistant output and routes it to local TTS without patching Codex.app or modifying the signed app bundle.

Current focus:
- latency profiling
- routing diagnostics
- local TTS provider experiments
- careful multilingual fallback

Demo: <demo link>
Repo: https://github.com/arata-ai-daisuki/talking-pets
```

### Option B: more character-forward

```text
Tiny Codex companion experiment:

Talking Pets lets Codex Pet speak recent assistant output through local TTS.

No Codex.app patching. No cloud TTS by default. Just local logs -> routing -> local voice.

I'm measuring latency now and exploring what makes a coding companion feel useful instead of distracting.

Demo: <demo link>
Repo: https://github.com/arata-ai-daisuki/talking-pets
```

### Option C: feedback ask

```text
I’m building Talking Pets, a local-first Codex Pet voice add-on.

It reads recent local assistant output and sends short lines to local TTS without patching Codex.app.

I’m looking for feedback from people building or using:
- Codex workflows
- local TTS
- AI avatars / VTubers
- developer companions

Demo: <demo link>
Repo: https://github.com/arata-ai-daisuki/talking-pets
```

## Japanese quote/support post draft

### Option A: 開発者向け

```text
Codex PetをローカルTTSでしゃべらせる小さなOSS実験、Talking Petsを作っています。

Codex本体は改造せず、ローカルに保存されたassistant出力を読んで、VOICEVOX / Kokoro / OS標準音声へ渡す方向です。

いまはレイテンシ計測とrouting診断を整えているところ。

Demo: <demo link>
Repo: https://github.com/arata-ai-daisuki/talking-pets
```

### Option B: キャラ/AI companion文脈

```text
「開発中にAIが少しだけ隣にいる感じ」を作りたくて、Talking Petsを育てています。

Codex Pet / Codex assistantの最近の出力を、ローカルTTSで短く読み上げるアドオンです。

便利さと邪魔にならなさの境目を、レイテンシ計測しながら探っています。

Repo: https://github.com/arata-ai-daisuki/talking-pets
```

### Option C: 日本語圏向け短文

```text
Talking Petsという、Codex Petをしゃべらせる小さなOSSを作っています。

Codex本体は改造せず、ローカルログとローカルTTSを使う方針です。

VOICEVOX / Kokoro / OS標準音声のroutingと、レイテンシ計測を進めています。

Repo: https://github.com/arata-ai-daisuki/talking-pets
```

## Star導線

固定ポストでは強く言わない。

必要ならスレッド末尾にだけ:

```text
If this direction is useful or fun, a GitHub Star helps me prioritize the next TTS and latency work.
```

日本語:

```text
方向性が面白そうなら、GitHub Starしてもらえると次のTTS/レイテンシ改善の優先度づけの参考になります。
```

## 投稿前チェック

- [ ] demo linkが実際に見られる。
- [ ] repo linkが正しい。
- [ ] `under 1s` などの保証を書いていない。
- [ ] `ko` / `zh` を専用TTS対応済みとして書いていない。
- [ ] Star依頼が強すぎない。
- [ ] 英語ポストと日本語ポストを混ぜていない。
- [ ] 自動投稿ではなくMasterが手動投稿する。

## あいちゃん推奨

最初はこの組み合わせ:

```text
English: Option B
Japanese: Option A
Star導線: なし、またはスレッド末尾に控えめに
```

理由:

- 英語版はAI companion感が出る。
- 日本語版は技術説明が自然。
- どちらも性能claimを盛っていない。
