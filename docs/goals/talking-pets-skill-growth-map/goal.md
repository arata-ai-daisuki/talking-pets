# Talking Pets スキル育成順マップ

## 目的

Talking Pets を進める中で、実装より先に詰まりやすい能力を「育てる順」に並べ、小さなブランチ単位で強化していく。

この看板では一般論の勉強計画は作らない。実際にこの repo で何度も起きた review / CI / docs drift / verification boundary を材料にして、次の PR が楽になる順にスキルを伸ばす。

## 育成順

1. 検証設計スキル
2. 公開ドキュメント同期スキル
3. small-PR preflight / 赤信号抽出スキル

## この順番にする理由

- まず「何をどう確かめれば安全か」を切れないと、README や docs の更新も自信を持って出せない。
- 次に docs 同期を固めると、README / README.en / verification / release / issue template のズレを減らせる。
- 最後に preflight を磨くと、PR 前に claim 過大、private 情報混入、範囲逸脱を止めやすくなる。

## ブランチ育成プラン

### Branch 1

- branch: `codex/talking-pets-skill-growth-map`
- skill: 育成順の見える化
- outcome:
  - 育てる順の根拠を repo 証拠つきで固定する
  - 次に切る branch 名、対象ファイル、完了条件を先に決める

### Branch 2

- branch: `codex/talking-pets-verification-matrix`
- skill: 検証設計スキル
- outcome:
  - sandbox 内でできる確認
  - sandbox 外が必要な確認
  - dry-run で代替できる確認
  - localhost / npm cache / installer / API opt-in の verify path

### Branch 3

- branch: `codex/talking-pets-release-doc-sync`
- skill: 公開ドキュメント同期スキル
- outcome:
  - 1つの仕様変更で触る docs 一覧
  - README / README.en / verification / release / issue template の同期表
  - claim 変更時の update checklist

### Branch 4

- branch: `codex/talking-pets-pr-preflight-kit`
- skill: small-PR preflight / 赤信号抽出スキル
- outcome:
  - 5分 preflight テンプレ
  - `claim過大` `private情報混入` `PR範囲逸脱` の赤信号表
  - stage 前の最小確認コマンド

## 完了条件

以下が揃ったら、この看板は一旦 done にする。

1. 3つの中核スキルが、それぞれ専用 branch で1回以上 artifact 化されている。
2. 各 branch に「何を作るか」「何を作らないか」「どう確認するか」が書かれている。
3. 次の人が見ても、次に切る branch と最初の1手が迷わない。

## 禁止事項

- 抽象的な一般論だけを書いて終わること。
- 1つの branch に複数スキルを混ぜること。
- 実装証拠なしに「できるようになった」と判定すること。

## 最初の証拠

- PR `#175`: latency benchmark の出力形式、device info、first-audio 境界を整えた。
- PR `#181`: OpenAI-compatible local / remote opt-in provider と安全境界を追加した。
- PR `#182`: installer update flow と localhost TTS smoke test を固めた。
- `docs/goals/talking-pets-hq-japanese/notes/T009-T011`: PR ごとの review 観点と赤信号が繰り返し記録されている。
- `docs/goals/talking-pets-hq-japanese/notes/T068-pr9-ci-followup.md`: 公開文書に絶対パスが残って CI で落ちた実例がある。
