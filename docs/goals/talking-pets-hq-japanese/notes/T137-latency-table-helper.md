# T137 latency table helper

## 結論

`[latency]` 行をMarkdownまたはCSVへ変換する `scripts/latency-lines-to-table.mjs` と `npm run latency:table` を追加した。

## 変更

- stdinまたはfileから `[latency]` 行を読む。
- TTS engineは起動しない。
- Markdown tableをdefault出力にする。
- `--format csv` でCSV出力できる。
- `docs/performance.md` に使い方を追加した。

## 検証

- `npm run check:syntax`: pass
- `npm test`: pass
- `npm run check:pack`: pass
- `npm run latency:table --` with two sample latency lines: pass
- `npm run check:docs`: pass
- `npm run check:release`: pass
- `npm run check:sanitize`: pass
- `npm run test:dry-run`: pass

## 状態

active。
