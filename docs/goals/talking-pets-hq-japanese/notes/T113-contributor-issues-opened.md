# T113 contributor issues opened

## 結論

外部協力者が参加しやすい検証Issueを4本作成した。

- https://github.com/arata-ai-daisuki/talking-pets/issues/23
- https://github.com/arata-ai-daisuki/talking-pets/issues/24
- https://github.com/arata-ai-daisuki/talking-pets/issues/25
- https://github.com/arata-ai-daisuki/talking-pets/issues/26

## 作成したIssue

| Issue | 目的 | Labels |
| --- | --- | --- |
| #23 `[Verify]: Ubuntu 24.04 x64 audible TTS` | Linux実機でinstall/check/音声再生を確認してもらう | `help wanted`, `good first issue`, `verification`, `linux` |
| #24 `[Verify]: Windows 11 x64 audible TTS` | Windows実機でinstall/check/音声再生を確認してもらう | `help wanted`, `good first issue`, `verification`, `windows` |
| #25 `[Verify]: Irodori latency on another GPU or CPU` | Irodoriの別CPU/GPU環境でレイテンシを集める | `help wanted`, `good first issue`, `verification`, `latency`, `tts` |
| #26 `[Verify]: VOICEVOX latency on another machine` | VOICEVOXの別端末レイテンシを集める | `help wanted`, `good first issue`, `verification`, `latency`, `tts` |

## 追加したlabels

- `verification`
- `latency`
- `windows`
- `linux`
- `tts`

## 実行していないこと

- 自動投稿
- 自動DM
- model download
- npm install
- API call
- PR作成

## 次の自然な順番

1. Issue URLをSNS投稿や返信で使う。
2. 反応が来たら、sanitize済みoutputかどうか確認する。
3. 有効な検証結果だけ `docs/verification-status.md` に反映する。
4. T061のlocal TTS判断に戻る。

## 状態

done。
