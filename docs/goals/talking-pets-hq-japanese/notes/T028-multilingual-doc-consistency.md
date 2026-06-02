# T028 多言語docs整合性チェック

Owner role: 言守 詞葉

## 目的

README / README.en / FUTURE_PLAN / ROADMAP / implementation-notes の多言語説明が、現在の `ko` / `zh` first-class fallback 実装と矛盾しないようにする。

## 確認したこと

- README / README.en は、韓国語・中国語を専用TTS providerではなく OS speech fallback として説明している。
- `--speech-language ja|en|ko|zh|other` の説明は README / README.en / FUTURE_PLAN で揃っている。
- `docs/ROADMAP.md` だけ、中国語を「未実装」と読める古い表現が残っていた。
- `implementation-notes.md` の 2026-05-28 セクションだけ、古い `ja|en|ko|other` 表記が残っていた。

## 変更

- `docs/ROADMAP.md` の多言語戦略表を更新した。
  - 韓国語: `ko` として検出し、OS speechへ明示fallbackできる。専用providerは未実装。
  - 中国語: `zh` として検出し、OS speechへ明示fallbackできる。専用providerは未実装。
- `implementation-notes.md` の古い `--speech-language ja|en|ko|other` を `ja|en|ko|zh|other` に更新した。

## claim boundary

言ってよい:

- `ko` / `zh` は first-class fallback として扱っている。
- 韓国語・中国語は現時点では OS speech fallback。
- 専用providerは今後の検討対象。

言わない:

- 韓国語専用TTS対応済み。
- 中国語専用TTS対応済み。
- 多言語TTSがproduction-ready。

## 検証

```text
rg -n "中国語|韓国語|Korean|Chinese|zh|ko|未実装|専用TTS|fallback|フォールバック" docs/ROADMAP.md README.md README.en.md FUTURE_PLAN.md docs/research docs/performance.md implementation-notes.md
```

## 状態

done。

T006のMaster判断待ちは継続。PR stage / commit / push / 投稿はしていない。
