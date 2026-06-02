# Talking Pets ロードマップ

このファイルは、Talking Pets を今後どう育てるかを管理するためのロードマップです。

目的は「アイデアを並べること」ではなく、次に何をするか、誰が見るか、何ができたら完了と言えるかを分かるようにすることです。

## 運用体制

Talking Pets のロードマップ作業は、**STELLAVOX / 星声機構** というAIプロジェクトチームとして管理します。

| メンバー | 役割 | 担当 |
| --- | --- | --- |
| 相庭 愛 / あいちゃん | Producer / HQ / PM | マスターとの対話、優先度決定、担当管理、進捗管理、成果物の統合 |
| 歌澄 音羽 | Voice Provider Lead | TTS provider、声の品質、料金、導入のしやすさ、規約確認 |
| 言守 詞葉 | Multilingual Strategy Lead | 言語判定、多言語ルーティング、fallback、fixture |
| 速水 光莉 | Latency & Benchmark Lead | レイテンシ計測、benchmark、最適化候補 |
| 星宮 未来 | Product Growth & SNS Lead | README、デモ、GitHub Star導線、X投稿、コミュニティ |
| 文月 栞里 | Documentation & Operations Lead | ロードマップ、decision log、implementation notes、進捗表 |
| 白瀬 怜奈 | Quality Judge & Risk Officer | privacy、API課金、公開表現、scope creep、release risk |

## 進捗ステータス

| 状態 | 意味 |
| --- | --- |
| Backlog | まだ着手しない候補 |
| Scouting | 調査中 |
| Ready | 実装または文書化に進める |
| Doing | 作業中 |
| Review | HQ / Judge / マスター確認中 |
| Blocked | 判断、権限、外部要因待ち |
| Done | 証拠つきで完了 |

## 守るルール

- **local-firstを基本にする。** 既定ではローカルTTSを使う。
- **API TTSは任意機能にする。** OpenAI、ElevenLabs、Google、Azure、Polly、外部endpointは明示的に有効化した場合だけ使う。
- **paid APIは勝手に使わない。** 課金が発生しうる経路は、そのターンでマスターが明示承認するまで実行しない。
- **privacyを先に守る。** Codex logs、rollout JSONL、`state_5.sqlite`、生成音声、API keys、credentials、private conversation text を公開issueやreleaseへ載せない。
- **公開表現は正確にする。** 実機確認済みだけを Stable と呼ぶ。未確認のOS、言語、providerは Experimental または fallback と書く。
- **小さいPRを優先する。** `1目的 = 1PR = 1 proof path` を基本にする。
- **早すぎる大改造をしない。** provider abstraction や settings UI は、必要性が見えてから薄く入れる。

## 優先ロードマップ

| 優先 | テーマ | 担当 | 次の一手 | 完了の証拠 | マスター確認 |
| --- | --- | --- | --- | --- | --- |
| P0 | レイテンシの見える化 | 速水 光莉 | Node monitor に `--profile-latency` を追加する | dry-runでparse/format/route時間が見える | Node monitorから始めてよいか |
| P0 | ロードマップと進捗管理 | 文月 栞里 | このロードマップ、GoalBuddy state、receiptを更新し続ける | `check-goal-state` が通り、次PR候補が明確 | この運用体制でよいか |
| P0 | README初見導線 | 星宮 未来 | README冒頭にdemo、Quick Start、Issue/Star導線を控えめに追加する | 初見で試し方と協力方法が分かる | Star導線の強さ |
| P0 | 既存providerの信頼性 | 歌澄 音羽 | VOICEVOX / Kokoro / say のdocs、診断、presetsを揃える | 既存のdry-run/checkが通る | 今のproviderをbaselineにしてよいか |
| P0 | 多言語の表現整理 | 言守 詞葉 | `ko` / `zh` / `other` のdocsと実装状態を一致させる | 未対応言語を過剰に「対応」と書かない | fallbackで読むか、警告するか |
| P1 | TTS helper計測 | 速水 光莉 | Kokoro / VOICEVOX helperにも `--profile-latency` を追加する | provider別の生成時間が見える | 再生時間も計測対象に含めるか |
| P1 | `ko` / `zh` のfirst-class fallback | 言守 詞葉 | 専用provider前にpresetとfixtureを追加する | 韓国語、中国語、曖昧なCJK、fallbackのfixtureがある | `zh` だけか、`zh-Hans` / `zh-Hant` も分けるか |
| P1 | provider request導線 | 歌澄 音羽 | provider要望issueで評価軸を集める | issue templateに言語、規約、privacy、setup項目がある | API provider要望も募集するか |
| P1 | コミュニティ初期タスク | 星宮 未来 | Windows/Linux/demo/provider調査のgood first issue候補を作る | contributorが参加できる小タスクが見える | Issuesだけか、Discussionsも使うか |
| P1 | 手動SNSアウトリーチ | 星宮 未来 | Codex / AI coding / AI VTuber / anime-style AI companion 文脈に合う公開候補へ丁寧に紹介する | 候補リスト、返信テンプレ、outcome trackingがある | 実際に誰へ送るか、どのdemoを使うか |
| P2 | ローカル多言語provider調査 | 歌澄 音羽 / 言守 詞葉 | Piperなどの候補を調べる | license、model size、対応言語、latencyの比較がある | provider shortlistを承認するか |
| P2 | 任意API TTS | 歌澄 音羽 / 白瀬 怜奈 | secretを含めないopt-in境界を設計する | env var、privacy warning、billing warning、dry-run案がある | 実装前に明示承認が必要 |
| P2 | Kokoro warm mode | 速水 光莉 | profiling結果を見て常駐workerを検討する | cold/warm差が数字で分かる | background workerの複雑さを許可するか |
| P2 | release proof package | 星宮 未来 / 文月 栞里 | v0.1.0 release noteに検証コマンドと制限を書く | release draftにproof pathとknown limitsがある | release timing |
| P3 | settings UI / wizard | 文月 栞里 | CLI/install flowが安定してから検討する | setup frictionが残る証拠がある | UI複雑化に価値があるか |
| P3 | npm publish | 文月 栞里 / 白瀬 怜奈 | CLI surfaceとrelease gateが安定してから再検討する | package metadata、license、files、install proofが揃う | publish timing |

## 次のPR候補

| 順番 | 候補 | 担当 | 範囲 | 完了の証拠 |
| --- | --- | --- | --- | --- |
| 1 | レイテンシ計測: Node monitor `--profile-latency` | 速水 光莉 | 最小の計測flagを追加する。最適化はまだしない | `npm run test:dry-run` と fixture dry-runでlatency出力が見える |
| 2 | README初見導線の改善 | 星宮 未来 | demo、Quick Start、Issue/Star導線を控えめに追加する | README linkが通り、demo assetが存在し、公開表現が正確 |
| 3 | 多言語fallbackの整理 | 言守 詞葉 | `ko` / `zh` / `other` をdocsまたはfixtureで整理する | routing/summary fixture、またはfallback表記が明確 |

## TTS Provider 戦略

### 現在のbaseline

- VOICEVOX: 日本語向けの任意provider。
- Kokoro.js: 英語寄りの任意provider。
- OS speech: fallback provider。
- `auto`: ローカルproviderを言語で選ぶrouting層。

### 拡張順序

1. まず既存providerの診断、presets、profilingを強くする。
2. 現在の経路を測れるようにしてから、ローカル多言語provider候補を調べる。
3. API TTSはprivacyとbilling warningつきの明示opt-inとしてだけ検討する。

### API TTSを入れる前の条件

API providerを実装する前に、以下を満たす。

- マスターがproviderとscopeを承認している。
- docsに、送信されるtext、課金、data handlingを書く。
- secretsはlocal envだけに置く。
- 実送信前に、dry-runで「何を送るか」を確認できる。
- 公開READMEではlocal-firstを既定として維持する。

## 多言語戦略

| 言語 | 現状 | 近い方針 |
| --- | --- | --- |
| 日本語 | VOICEVOXまたはOS fallbackの優先経路 | 実機確認済みの範囲だけStable表記する |
| 英語 | Kokoro.jsまたはOS fallbackの優先経路 | 実機確認済みの範囲だけStable表記する |
| 韓国語 | `ko` として検出し、OS speechへ明示fallbackできる。専用providerは未実装 | fallback fixture/docsを維持し、専用provider候補を調べる |
| 中国語 | `zh` として検出し、OS speechへ明示fallbackできる。専用providerは未実装 | 簡体/繁体fixtureを維持し、専用provider候補を調べる |
| その他 | OS fallback | 読む前に警告するかを決める |

## レイテンシ戦略

最適化の前に、まず測る。

最初に測る区間:

- `--interval` によるpoll待ち。
- Codex thread解決。
- rollout JSONLの読み取りとparse。
- speech formattingとsummary生成。
- 言語判定とTTS routing。
- 子プロセスまたはprovider呼び出し時間。
- provider別のsynthesisとplayback。

既存stdoutを壊さないため、latency出力は stderr のJSON Lines を基本にする。

## Product / SNS 戦略

### 現在の強み

- local-firstの説明がはっきりしている。
- 実機デモ録画がある。
- safety / credits docs がある。
- Windows / Linux experimental の表現が正直。

### 近い成長施策

- READMEでは通常速度の実機デモを使う。
- Xではspeed-ramp版の動画を使う。
- README冒頭に、試す、Starする、Issueを開く導線を控えめに置く。
- Windows実機確認、Linux音声再生、多言語fixture、provider調査をgood first issue候補にする。
- Codex、AI coding、AI VTuber、Live2D/VRM、TTS、local-first AI に関心がありそうな公開アカウントや公開プロジェクトへ、手動で丁寧に紹介する。
- 相手の投稿と関係がある時だけ返信する。自動DM、大量mention、private情報収集はしない。

### 手動アウトリーチ戦略

詳細は [docs/research/sns-outreach-strategy.md](research/sns-outreach-strategy.md) に置く。

最初の候補カテゴリ:

- Codex / AI coding を使っている開発者。
- AI VTuber / Live2D / VRM / TTS ツールを作っている開発者。
- 萌えキャラ、anime-style AI companion、local-first AI に反応しそうなtech creator。
- VOICEVOX / Kokoro / local TTS / multilingual TTS に関心がある人。

運用ルール:

- 週3〜5件までの手動返信から始める。
- 返信は短く、相手の文脈に合わせる。
- 最初からStarだけをお願いしない。
- 反応があったら、紹介依頼より先にフィードバックを1つ聞く。
- outcomeはローカルのtracking tableに残す。

### 投稿文のたたき台

英語first:

```text
I made Codex Pet speak using local logs + local TTS.
No Codex patching, no signed app modification.
VOICEVOX / Kokoro / OS speech, with more providers on the roadmap.
```

日本語quote:

```text
Codex Petがしゃべる小さなローカルTTSアドオンを公開しました。
Codex本体は改造せず、ローカルログを読んでVOICEVOX/Kokoro/sayへ渡します。
```

## マスター確認が必要なこと

以下は、あたしが勝手に決めずにマスターへ確認する。

- paid API providerを追加または実行するとき。
- Codex conversation textを外部endpointへ送るとき。
- API TTSをpublic-facing機能として出すとき。
- 韓国語/中国語をfirst-class supportと呼ぶとき。
- READMEに直接的なStar CTAを入れるとき。
- X用demo動画と言語を最終決定するとき。
- Discussionsなど広めのコミュニティ運用を始めるとき。
- npm publishやrelease tagを打つとき。
- long-lived workerや大きめのprovider abstractionを入れるとき。

## Decision Log

| 日付 | 判断 | 状態 |
| --- | --- | --- |
| 2026-06-02 | STELLAVOX / 星声機構を初期HQ/team framingとして使う | いったん採用 |
| 2026-06-02 | 最初のtrancheは実装-heavyではなく、ロードマップとdocs中心にする | 採用 |
| 2026-06-02 | local-firstとno paid API by defaultを強いguardrailにする | 採用 |
| 2026-06-02 | READMEのStar導線は控えめに入れる | マスター承認済み |
