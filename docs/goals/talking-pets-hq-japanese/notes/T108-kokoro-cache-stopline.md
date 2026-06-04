# T108 Kokoro cache stopline

## 結論

Kokoro測定へ進む前に、既存cacheの有無だけ確認した。

`~/.cache/talking-pets/transformers` は見つからなかった。

## 判断

Kokoro測定はここで保留。

理由:

- 初回Kokoro実行はmodel downloadが走る可能性がある。
- 今回の作業範囲は package install / model download なし。
- Master承認なしにmodel取得へ進まない。

## 実行した確認

```text
no-kokoro-cache
```

## 次

Kokoroを測るなら、Masterが明示的に以下を許可してから。

```text
Kokoroのmodel downloadを許可。cold/warm latencyを測って。
```

## 状態

done。
