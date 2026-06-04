# T109 no-download next decision

## 結論

MasterはKokoro model downloadを許可しなかった。

次は、downloadなしで進む別作業としてREADME / README.enに実測レイテンシの短いsnapshotを追加する。

## 判断

Kokoroは保留。

理由:

- `~/.cache/talking-pets/transformers` が無く、初回実行でmodel downloadが走る可能性がある。
- Masterが「ダウンロードしない」と明示した。
- 既にmacOS say、VOICEVOX、Irodoriの比較可能な実測がある。

## 状態

done。
