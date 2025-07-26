# Tests & Demos for Static Map Generator

このディレクトリには、Static Map Generatorライブラリのテストファイルとデモスクリプトが含まれています。

## 📁 ファイル構成

### テストファイル
- `simple-test.js` - ライブラリの基本構造テスト（依存関係不要）
- `test-await.js` - awaitを使った画像生成テスト
- `zoom-test.js` - 各ズームレベルのテスト

### デモファイル
- `generate-image-demo.js` - 基本的な地図画像生成デモ
- `bounds-demo.js` - 境界指定による自動計算デモ

## 🚀 実行方法

### 1. 事前準備
```bash
# プロジェクトルートで実行
npm install
npm run build
```

### 2. テスト・デモの実行

#### 基本構造テスト（依存関係不要）
```bash
node tests/simple-test.js
```

#### 実際の画像生成テスト
```bash
# 基本的な画像生成
node tests/generate-image-demo.js

# 境界指定デモ
node tests/bounds-demo.js

# ズームレベルテスト
node tests/zoom-test.js

# awaitテスト
node tests/test-await.js
```

## 📊 出力結果

全ての画像生成テストの出力は `tests/output/` ディレクトリに保存されます：

```
tests/output/
├── tokyo-demo.png
├── simple-demo.png
├── hd-demo.png
├── bounds-tokyo-area.png
├── bounds-yamanote.png
├── bounds-kanto.png
├── bounds-tokaido.png
├── zoom-8.png
├── zoom-12.png
├── zoom-15.png
├── zoom-18.png
├── test-await-result.png
└── test-case-*.png
```

## 🧪 テストの内容

### simple-test.js
- ライブラリの読み込み確認
- StaticMapクラスの基本機能確認
- 境界指定機能の動作確認
- 依存関係なしで実行可能

### generate-image-demo.js
- 基本的な地図生成（東京駅中心）
- シンプルな地図生成
- 高解像度地図生成（scale: 2）

### bounds-demo.js
- 東京都心エリアの境界指定
- 山手線内側エリアの境界指定
- 関東広域エリアの境界指定
- 縦長エリアのテスト（東海道）

### zoom-test.js
- 複数のズームレベル（8, 12, 15, 18, 20）
- 各ズームでの画像生成テスト
- エラーケース（zoom 20）のテスト

### test-await.js
- async/awaitでの画像バッファー取得テスト
- バッファーの詳細情報確認
- 複数の画像生成テスト

## 🔧 トラブルシューティング

### エラー: "Cannot find module '../dist/index'"
```bash
npm run build
```

### エラー: "Failed to fetch tile"
- インターネット接続を確認
- OpenStreetMapサーバーの状態を確認

### エラー: Canvas関連
```bash
npm install canvas
```

## 💡 カスタマイズ

各テストファイルを参考にして、独自の地図生成スクリプトを作成できます：

```javascript
const { StaticMap } = require('../dist/index');

async function myCustomMap() {
  const map = new StaticMap({
    center: { lat: YOUR_LAT, lng: YOUR_LNG },
    zoom: YOUR_ZOOM,
    size: { width: YOUR_WIDTH, height: YOUR_HEIGHT },
    markers: [/* your markers */]
  });
  
  const buffer = await map.render();
  // 画像処理...
}
```

## 🎯 パフォーマンス参考値

- **小さい地図** (200x200): ~1-2秒
- **標準地図** (800x600): ~2-5秒  
- **高解像度** (1600x1200): ~5-10秒

※ネットワーク速度とズームレベルに依存