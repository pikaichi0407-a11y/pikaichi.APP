# ARスタンプラリーアプリ - pikaichi.APP

## プロジェクト概要

スマホブラウザで動作するARスタンプラリーWebアプリ。
各スポットに設置されたQRコードを読み取ることでスタンプを取得し、3DキャラクターをARで閲覧できる。

## 技術スタック

| 技術 | 用途 |
|---|---|
| HTML / CSS / Vanilla JS | フロントエンド |
| A-Frame (1.4.x) | 3Dシーン・WebXR |
| AR.js (3.x) | カメラARトラッキング |
| html5-qrcode | QRコードスキャン |
| localStorage | スタンプ進捗の保存 |
| .glb (Blender) | 3Dキャラクターモデル |

## ファイル構成

```
pikaichi.APP/
├── CLAUDE.md               # このファイル
├── index.html              # ホーム・スタンプ一覧ページ
├── stamp.html              # スタンプ取得・詳細ページ (?id=1〜5)
├── ar.html                 # AR体験ページ (?id=1〜5)
├── css/
│   └── style.css           # 全体スタイル
├── js/
│   ├── app.js              # スタンプ管理ロジック（localStorage）
│   └── stamps-config.js    # スタンプ定義データ（名前・説明・モデルパスなど）
├── assets/
│   ├── models/             # Blenderで作った.glbファイルを配置
│   │   ├── character1.glb
│   │   ├── character2.glb
│   │   ├── character3.glb
│   │   ├── character4.glb
│   │   └── character5.glb
│   ├── markers/            # AR.jsマーカー画像（印刷用・表示用）
│   │   ├── hiro.png        # デフォルトHiroマーカー
│   │   └── kanji.png       # デフォルトKanjiマーカー
│   └── stamps/             # スタンプ画像（UI表示用）
│       └── stamp-*.png
└── qr/                     # 各スポット用QRコード画像（印刷用）
    ├── qr-1.png
    ├── qr-2.png
    ├── qr-3.png
    ├── qr-4.png
    └── qr-5.png
```

## スタンプ仕様

| ID | スポット名 | キャラクター | ARマーカー |
|---|---|---|---|
| 1 | スポット1 | character1.glb | Hiroマーカー |
| 2 | スポット2 | character2.glb | Hiroマーカー |
| 3 | スポット3 | character3.glb | Hiroマーカー |
| 4 | スポット4 | character4.glb | Hiroマーカー |
| 5 | スポット5 | character5.glb | Hiroマーカー |

※スポット名・キャラクター名は `js/stamps-config.js` で自由に変更可能

## ユーザーフロー

```
スポット現地
    ↓ QRコードをスキャン
stamp.html?id=X
    ↓ スタンプ自動取得 (localStorage保存)
スタンプ獲得アニメーション表示
    ↓ 「ARで見る」ボタンをタップ
ar.html?id=X
    ↓ カメラが起動・Hiroマーカーを画面に翳す
3Dキャラクターがリアルに出現
    ↓
index.html でスタンプコレクションを確認
```

## 開発ルール

### コーディング
- バニラJS優先（フレームワーク不使用）
- `localStorage` キー名: `stamp-rally-stamps`（JSON配列で保存）
- スタンプIDは 1〜5 の整数
- モバイルファースト設計（スマホ縦持ちを基準）
- HTTPS環境でのみカメラ・ARが動作する点に注意

### ブランチ戦略
- 開発ブランチ: `claude/ar-stamp-rally-app-FlZwr`
- mainへのマージは機能完成後にPR経由で行う

### AR.js 使用上の注意
- AR.jsはHTTPS必須（またはlocalhost）
- カメラ権限が必要なため、ユーザーへの説明UIを用意する
- iOSはSafariのみWebXR対応（Chromeは非対応の場合あり）
- Hiroマーカーは公式サイトからダウンロードして印刷して使用

### .glbファイルについて
- Blenderでエクスポートする際は「glTF Binary (.glb)」を選択
- ファイルサイズは1つあたり5MB以内を推奨（モバイル転送量を考慮）
- `assets/models/` に配置後、`stamps-config.js` のパスを更新する

## Todoリスト

### フェーズ1: 基盤構築 ✅→進行中
- [x] CLAUDE.md 作成
- [x] index.html（スタンプ一覧）
- [x] stamp.html（スタンプ取得）
- [x] ar.html（AR体験）
- [x] css/style.css
- [x] js/app.js + js/stamps-config.js

### フェーズ2: コンテンツ整備
- [ ] Blenderで5体のキャラクター.glbを作成・配置
- [ ] 各スポット名・説明文をstamps-config.jsに記入
- [ ] QRコードを生成（各stamp.html?id=Xへのリンク）
- [ ] ARマーカー画像を準備・印刷

### フェーズ3: テスト・調整
- [ ] 実機スマホ（iOS Safari / Android Chrome）での動作確認
- [ ] AR表示位置・サイズの調整
- [ ] オフライン対応検討（Service Worker）

### フェーズ4: 公開
- [ ] ホスティング先決定（GitHub Pages / Netlify / Vercel）
- [ ] HTTPS設定確認
- [ ] 公開URL確定 → QRコード再生成

## 参考リンク

- [A-Frame 公式](https://aframe.io/)
- [AR.js 公式](https://ar-js-org.github.io/AR.js-Docs/)
- [AR.js Hiroマーカー](https://github.com/AR-js-org/AR.js/blob/master/data/images/hiro.png)
- [html5-qrcode](https://github.com/mebjas/html5-qrcode)
