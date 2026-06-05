# T003 User Preference Config

## Objective

user preference configの最小schemaを追加し、language、voice/provider優先度、speed/quality preference、API opt-inをdry-runで反映できるようにする。

## Desired User Value

ユーザーが「日本語はこの声、英語はこのprovider、速さ優先、APIは使わない」のような好みを、手元の設定で安全に表現できるようにする。

## Initial Shape

- provider capability registryを参照する。
- secret値は保存しない。
- API opt-inはbooleanやprovider idだけを保存し、API key本体は環境変数や外部secret storeに残す。
- `--dry-run` または `--diagnose-routing` で、どのpreferenceが使われたかを表示する。

## Stop Lines

- API keyをdocs、fixtures、logs、configへ保存しない。
- API opt-in未設定時に外部送信しない。
- provider-specific evidenceがない言語をdedicated supportとして扱わない。
- installerで既存configを確認なしに上書きしない。

## Agent Comments

- 相庭 愛: 「ここから“好みを反映できるTalking Pets”に入ります。」
- 歌澄 音羽: 「声とprovider優先度はregistryとつなげます。存在しないproviderは診断で止めます。」
- 白瀬 怜奈: 「API opt-inは形だけ先に作り、secretと外部送信は別PRの承認ゲートにします。」

## Receipt

- decision: `user_preference_config`
- owner: `相庭 愛 / 歌澄 音羽`
- status: active
- result: pending
- next: 既存 `.talking-pets.local.env` / presets / config validator / routing diagnosticsを読んで、最小schemaとdry-run表示を設計・実装する。
