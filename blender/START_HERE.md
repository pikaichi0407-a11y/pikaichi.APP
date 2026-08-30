# PC版 Claude Code に貼り付ける最初の指示

Windows PC の Claude Code デスクトップ版で新しい会話を開き、
下の「---」から下を丸ごとコピーして貼り付けてください。

（PCにまだリポジトリが無い場合は、先に下記をクローンしてください）

```
git clone https://github.com/pikaichi0407-a11y/pikaichi.APP
cd pikaichi.APP
git checkout claude/blender-3d-modeling-d4txeq
```

---

このPCにインストールされている Blender を、あなたが直接コマンドで動かして
3Dモデルを作ってください。私（ユーザー）に実行を頼まず、あなた自身で
実行・確認・修正まで進めてください。

## 前提

- このリポジトリは AR スタンプラリーの Web アプリです（詳細は CLAUDE.md）
- `assets/models/character1.glb` 〜 `character5.glb` が必要です
- モデルは「釣った魚（シイラ）を掲げる釣り人」がモチーフ
- モバイル AR 用なので、ローポリ・1体5MB以内が目標

## すでにあるもの

- `blender/fisherman.py` … bpy でモデルを生成し .glb を書き出すスクリプト
  （まだ一度も実行検証されていません。エラーが出たら直してください）
- `blender/run_blender.ps1` / `run_blender.bat` … Blender 自動検出ランチャー

## やってほしいこと

1. このPCの `blender.exe` の場所を特定する
   （Program Files / Steam / winget / PATH などを探す）

2. ヘッドレスで実行してモデルを書き出す:

   ```
   blender.exe --background --factory-startup --python blender\fisherman.py -- --out <リポジトリ>\assets\models\character1.glb
   ```

3. エラーが出たら `blender/fisherman.py` を修正して、通るまで繰り返す

4. `.glb` が生成されたら、ファイルサイズを確認する（5MB以内か）

5. **見た目を目視で確認する** — Blender で正面・斜めからプレビュー画像を
   PNG にレンダリングし、その画像をあなた自身が開いて見てください。
   人体のプロポーション、魚の形、ポーズが破綻していないか確認し、
   おかしければスクリプトを直して再生成してください。
   納得いく形になるまで繰り返してください。

6. 完成したら、レンダリング画像を私に見せてください

## 進め方

- 各ステップで何をしたか簡潔に報告してください
- 実行したコマンドと、実際のエラー出力は省略せず見せてください
- 動かないものを「動いた」と言わないでください
- 5体分のバリエーション展開は、1体目が固まってから相談しましょう
