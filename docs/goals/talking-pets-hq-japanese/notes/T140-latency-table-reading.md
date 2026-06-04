# T140 latency table reading

## 結論

実機検証docsに、生成されたlatency tableの主要列をどう読むかの短い説明を追加した。

## 変更

- `total` はユーザー目線の経過時間として見ることを明記した。
- `synthesis` はengine生成時間、`audioDuration` は生成WAV長、`rtf` は生成速度の相対指標として見ることを明記した。
- `audioDuration` / `rtf` がない行はpartial latency evidenceとして扱うよう補足した。

## 状態

active。
