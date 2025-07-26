# StaticMap デモガイド

## 🎯 デモの概要

StaticMapライブラリのデモンストレーションを確認するための手順とファイル構成です。

## 📁 デモファイル構成

```
staticmap/
├── demo/
│   ├── demo.js          # JavaScript版デモ（4つの地図を生成）
│   ├── demo.ts          # TypeScript版デモ（型安全なMapDemoクラス）
│   └── demo.html        # 生成された地図画像を表示するWebページ
├── demo-viewer.html     # デモプレビューページ（実行前でも確認可能）
├── simple-demo.js       # ライブラリの基本動作確認用
└── test-demo.js         # クイックテスト用
```

## 🚀 デモの実行方法

### 方法1: 完全なデモ実行

```bash
# 1. 依存関係をインストール
npm install

# 2. TypeScriptをビルド
npm run build

# 3. JavaScriptデモの実行
npm run demo
# または
node demo/demo.js

# 4. TypeScriptデモの実行
npm run demo:ts
# または
npx ts-node demo/demo.ts
```

### 方法2: プレビュー確認

依存関係のインストール前でも、以下のファイルをブラウザで開いて機能概要を確認できます：

```
demo-viewer.html
```

### 方法3: 基本動作確認

```bash
# ライブラリの基本構造を確認
node simple-demo.js

# 実際の地図生成テスト（要依存関係）
node test-demo.js
```

## 🗺️ 生成される地図

### 1. 東京エリア（tokyo.png）
- **中心**: 東京駅 (35.6762, 139.6503)
- **ズーム**: 12
- **マーカー**: 東京駅、スカイツリー、浅草

### 2. ニューヨーク（newyork.png）
- **中心**: タイムズスクエア (40.7589, -73.9851)
- **ズーム**: 13
- **マーカー**: タイムズスクエア、エンパイアステート、ペンステーション

### 3. パリ（paris.png）
- **中心**: パリ市内 (48.8566, 2.3522)
- **ズーム**: 12
- **マーカー**: エッフェル塔、ルーブル美術館、ノートルダム大聖堂

### 4. 高解像度東京（tokyo_hd.png）
- **中心**: 東京駅 (35.6762, 139.6503)
- **ズーム**: 15
- **スケール**: 2（Retina対応）
- **サイズ**: 400x300 → 実際は 800x600px

## 📋 TypeScript版デモの特徴

`demo/demo.ts` では以下の高度な機能を実装：

- **型安全なMapDemoクラス**
- **Promise.allSettled**による並列地図生成
- **カスタムマーカーファクトリー**
- **エラーハンドリングと結果集計**
- **比較用地図生成**（異なるズームレベル）

## 🔧 トラブルシューティング

### 依存関係エラー
```bash
npm install canvas axios
```

### TypeScriptビルドエラー
```bash
npm install -D typescript @types/node
npm run build
```

### 画像生成エラー
- インターネット接続を確認（OpenStreetMapタイル取得のため）
- Canvasライブラリの依存関係を確認

### Windows環境でのcygpathエラー
- PowerShellまたはコマンドプロンプトを使用
- WSL（Windows Subsystem for Linux）の利用を検討

## 📊 出力結果

成功すると以下のファイルが生成されます：

```
demo/output/
├── tokyo.png       # 東京の地図
├── newyork.png     # ニューヨークの地図
├── paris.png       # パリの地図
└── tokyo_hd.png    # 高解像度東京地図

demo/demo.html      # 結果表示用Webページ
```

## 🌐 Webでの確認

生成後、`demo/demo.html`をブラウザで開くと、すべての地図画像を美しいレイアウトで確認できます。

## ⚡ パフォーマンス

- **並列処理**: 複数の地図を同時生成
- **タイルキャッシュ**: 同一タイルの重複ダウンロード回避
- **メモリ効率**: Canvasバッファーの適切な管理

## 📝 カスタマイズ

デモファイルを参考に、以下をカスタマイズできます：

- 地図の中心座標
- ズームレベル
- マーカーの色・サイズ・ラベル
- 出力画像サイズ・フォーマット
- 高解像度設定

---

StaticMapライブラリで美しい静的地図画像を生成しましょう！ 🗺️✨