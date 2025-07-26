# Static Map Generator

OpenStreetMapタイルを使用して静的地図画像を生成するNode.jsライブラリです。

## ⚠️ 重要な注意事項

**このライブラリはNode.js環境専用です。ブラウザでは動作しません。**

- **Node.js環境**: ✅ 対応（サーバーサイド、CLI、Electron等）
- **ブラウザ環境**: ❌ 非対応（Webページ内で直接実行不可）

## 機能

- OpenStreetMapタイルから静的地図画像を生成
- カスタムマーカー（ラベル・色付き）の追加
- 複数の画像フォーマット対応（PNG・JPG）
- TypeScript完全対応
- カスタマイズ可能な地図サイズとズームレベル
- **NEW!** 境界指定による自動中心点・ズーム計算

## インストール

```bash
npm install static-map-generator
```

## 使用方法

### 基本的な使用方法

```typescript
import { StaticMap } from 'static-map-generator';

async function generateMap() {
  const map = new StaticMap({
    center: { lat: 35.6762, lng: 139.6503 }, // 東京駅
    zoom: 12,
    size: { width: 800, height: 600 },
    format: 'png'
  });

  try {
    const imageBuffer = await map.render();
    // 画像バッファーを保存または使用
    console.log('✅ 地図が生成されました！');
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

generateMap();
```

### マーカー付き地図

```typescript
import { StaticMap } from 'static-map-generator';

async function generateMapWithMarkers() {
  const map = new StaticMap({
    center: { lat: 35.6762, lng: 139.6503 },
    zoom: 12,
    size: { width: 800, height: 600 },
    markers: [
      {
        coordinate: { lat: 35.6762, lng: 139.6503 },
        color: '#FF0000',
        size: 'large',
        label: '東京駅'
      },
      {
        coordinate: { lat: 35.6585, lng: 139.7454 },
        color: '#00FF00',
        size: 'medium',
        label: 'スカイツリー'
      }
    ]
  });

  try {
    const imageBuffer = await map.render();
    console.log('✅ マーカー付き地図が生成されました！');
    return imageBuffer;
  } catch (error) {
    console.error('❌ エラー:', error);
    throw error;
  }
}

generateMapWithMarkers();
```

### パス（経路）描画（新機能！）

緯度経度の配列を受け取って、ルートやコースを地図上に描画できます：

```typescript
import { StaticMap } from 'static-map-generator';

async function generateMapWithPath() {
  const route = [
    { lat: 35.6762, lng: 139.6503 }, // 東京駅
    { lat: 35.6785, lng: 139.6823 }, // 皇居
    { lat: 35.7148, lng: 139.7967 }, // 浅草
    { lat: 35.7101, lng: 139.8107 }  // スカイツリー
  ];

  const map = new StaticMap({
    bounds: {
      north: 35.720,
      south: 35.670, 
      east: 139.820,
      west: 139.640
    },
    size: { width: 800, height: 600 },
    paths: [
      {
        coordinates: route,
        color: '#FF0066',    // パスの色
        width: 4,            // 線の太さ
        opacity: 0.8,        // 透明度
        dashPattern: [10, 5] // 破線パターン（オプション）
      }
    ],
    markers: [
      { coordinate: route[0], color: '#FF0000', size: 'large', label: 'スタート' },
      { coordinate: route[route.length - 1], color: '#00FF00', size: 'large', label: 'ゴール' }
    ]
  });

  try {
    const imageBuffer = await map.render();
    console.log('✅ パス付き地図が生成されました！');
    return imageBuffer;
  } catch (error) {
    console.error('❌ エラー:', error);
    throw error;
  }
}

generateMapWithPath();
```

### 境界指定による自動フィット（新機能！）

指定した領域に自動的にフィットするように中心点とズームを計算します：

```typescript
import { StaticMap } from 'static-map-generator';

async function generateAutoFitMap() {
  const map = new StaticMap({
    bounds: {
      north: 35.7000,  // 北端の緯度
      south: 35.6000,  // 南端の緯度  
      east: 139.8000,   // 東端の経度
      west: 139.7000    // 西端の経度
    },
    size: { width: 800, height: 600 },
    padding: 20,  // 境界からの余白（ピクセル）
    markers: [
      { coordinate: { lat: 35.6762, lng: 139.6503 }, label: '東京駅' }
    ]
  });

  try {
    const imageBuffer = await map.render();

    // 自動計算された値を取得
    console.log('✅ 自動フィット地図が生成されました！');
    console.log('📍 中心点:', map.getCalculatedCenter());
    console.log('🔍 ズームレベル:', map.getCalculatedZoom());
    
    return imageBuffer;
  } catch (error) {
    console.error('❌ エラー:', error);
    throw error;
  }
}

generateAutoFitMap();
```

## API

### StaticMap(options)

新しいStaticMapインスタンスを作成します。

#### 2つの使用パターン

**パターン1: 手動で中心点・ズーム指定**
```typescript
const map = new StaticMap({
  center: { lat: 35.6762, lng: 139.6503 },
  zoom: 12,
  size: { width: 800, height: 600 }
});
```

**パターン2: 境界指定による自動計算**
```typescript
const map = new StaticMap({
  bounds: {
    north: 35.7000,
    south: 35.6000,
    east: 139.8000,
    west: 139.7000
  },
  size: { width: 800, height: 600 }
});
```

#### オプション

**必須項目（いずれか選択）:**
- `center` + `zoom`: 手動位置指定
- `bounds`: 自動計算による位置指定

**共通オプション:**
- `size` (Size): 出力画像の幅と高さ
- `format` (string, オプション): 出力フォーマット（'png' または 'jpg'、デフォルト: 'png'）
- `scale` (number, オプション): スケール係数（1 または 2、デフォルト: 1）
- `markers` (Marker[], オプション): 表示するマーカーの配列
- `tileServer` (string, オプション): カスタムタイルサーバーのURL

**境界指定専用オプション:**
- `padding` (number, オプション): 境界からの余白（ピクセル、デフォルト: 20）

#### 型定義

```typescript
interface Coordinate {
  lat: number;  // 緯度
  lng: number;  // 経度
}

interface Size {
  width: number;   // 幅
  height: number;  // 高さ
}

interface Bounds {
  north: number;  // 北端の緯度
  south: number;  // 南端の緯度
  east: number;   // 東端の経度
  west: number;   // 西端の経度
}

interface Marker {
  coordinate: Coordinate;                    // マーカーの座標
  color?: string;                           // マーカーの色
  size?: 'small' | 'medium' | 'large';      // マーカーのサイズ
  label?: string;                           // マーカーのラベル
}

interface Path {
  coordinates: Coordinate[];                 // パスの座標配列
  color?: string;                           // パスの色（デフォルト: '#0066FF'）
  width?: number;                           // 線の太さ（デフォルト: 2）
  opacity?: number;                         // 透明度 0-1（デフォルト: 1）
  lineCap?: 'butt' | 'round' | 'square';    // 線の端の形状
  lineJoin?: 'miter' | 'round' | 'bevel';   // 線の結合部の形状
  dashPattern?: number[];                   // 破線パターン（例: [5, 5]）
}

interface StaticMapOptions {
  center?: Coordinate;    // boundsが未指定時に必須
  zoom?: number;          // boundsが未指定時に必須（0-18）
  bounds?: Bounds;        // centerとzoomの代替
  size: Size;
  format?: 'png' | 'jpg';
  scale?: 1 | 2;
  markers?: Marker[];
  paths?: Path[];         // 描画するパス（経路）の配列
  tileServer?: string;
  padding?: number;       // bounds使用時（デフォルト: 20）
}
```

### メソッド

#### render(): Promise&lt;Buffer&gt;

地図をレンダリングし、画像バッファーに解決されるPromiseを返します。

#### getCalculatedCenter(): Coordinate

レンダリングに使用された中心点を返します（bounds使用時に便利）。

#### getCalculatedZoom(): number

レンダリングに使用されたズームレベルを返します（bounds使用時に便利）。

## 使用例

### 完全な使用例

#### 1. 基本的な地図（手動中心点・ズーム）
```javascript
const { StaticMap } = require('static-map-generator');
const fs = require('fs');

async function generateBasicMap() {
  const map = new StaticMap({
    center: { lat: 35.6762, lng: 139.6503 }, // 東京駅
    zoom: 12,
    size: { width: 800, height: 600 },
    format: 'png'
  });

  try {
    const imageBuffer = await map.render();
    fs.writeFileSync('tokyo.png', imageBuffer);
    console.log('✅ 東京の地図が生成されました！');
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

// 実行
generateBasicMap();
```

#### 2. 境界指定による自動フィット地図
```javascript
const { StaticMap } = require('static-map-generator');
const fs = require('fs');

async function generateBoundsMap() {
  const map = new StaticMap({
    bounds: {
      north: 35.7000,  // 北端境界
      south: 35.6000,  // 南端境界
      east: 139.8000,   // 東端境界
      west: 139.7000    // 西端境界
    },
    size: { width: 800, height: 600 },
    padding: 30,  // 境界から30pxの余白
    markers: [
      {
        coordinate: { lat: 35.6762, lng: 139.6503 },
        color: '#FF0000',
        size: 'large',
        label: '東京駅'
      }
    ]
  });

  try {
    const imageBuffer = await map.render();
    fs.writeFileSync('tokyo-bounds.png', imageBuffer);
    
    // 自動計算された値を取得
    console.log('自動計算された中心点:', map.getCalculatedCenter());
    console.log('自動計算されたズーム:', map.getCalculatedZoom());
    console.log('✅ 境界指定地図が生成されました！');
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

// 実行
generateBoundsMap();
```

#### 3. 高解像度地図（複数マーカー）
```javascript
const { StaticMap } = require('static-map-generator');
const fs = require('fs');

async function generateHDMap() {
  const map = new StaticMap({
    center: { lat: 35.6762, lng: 139.6503 },
    zoom: 14,
    size: { width: 400, height: 300 },
    scale: 2,  // 高解像度（実際は800x600ピクセル）
    format: 'png',
    markers: [
      {
        coordinate: { lat: 35.6762, lng: 139.6503 },
        color: '#FF0000',
        size: 'large',
        label: '東京駅'
      },
      {
        coordinate: { lat: 35.6585, lng: 139.7454 },
        color: '#00FF00',
        size: 'medium',
        label: 'スカイツリー'
      },
      {
        coordinate: { lat: 35.6586, lng: 139.7016 },
        color: '#0000FF',
        size: 'small',
        label: '浅草'
      }
    ]
  });

  try {
    const imageBuffer = await map.render();
    fs.writeFileSync('tokyo-hd.png', imageBuffer);
    console.log('✅ 高解像度地図が生成されました！');
    console.log(`📄 実際のサイズ: 800x600px (scale: 2)`);
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

// 実行
generateHDMap();
```

#### 4. エリアカバー地図（観光ルート）
```javascript
const { StaticMap } = require('static-map-generator');
const fs = require('fs');

async function generateTouristRouteMap() {
  // 観光スポットを定義
  const touristSpots = [
    { lat: 35.6762, lng: 139.6503, name: '東京駅' },
    { lat: 35.6585, lng: 139.7454, name: 'スカイツリー' },
    { lat: 35.6586, lng: 139.7016, name: '浅草' },
    { lat: 35.6785, lng: 139.6823, name: '皇居' }
  ];

  // 全スポットを含む境界を計算
  const lats = touristSpots.map(spot => spot.lat);
  const lngs = touristSpots.map(spot => spot.lng);

  const map = new StaticMap({
    bounds: {
      north: Math.max(...lats) + 0.005,  // 小さなマージンを追加
      south: Math.min(...lats) - 0.005,
      east: Math.max(...lngs) + 0.005,
      west: Math.min(...lngs) - 0.005
    },
    size: { width: 1000, height: 800 },
    padding: 40,
    markers: touristSpots.map((spot, index) => ({
      coordinate: { lat: spot.lat, lng: spot.lng },
      color: ['#FF0000', '#00FF00', '#0000FF', '#FF6600'][index],
      size: 'large',
      label: spot.name
    }))
  });

  try {
    const imageBuffer = await map.render();
    fs.writeFileSync('tokyo-tourist-route.png', imageBuffer);
    
    console.log(`✅ 観光ルート地図が生成されました！`);
    console.log(`🔍 地図のズームレベル: ${map.getCalculatedZoom()}`);
    console.log(`📍 中心座標: ${map.getCalculatedCenter().lat.toFixed(4)}, ${map.getCalculatedCenter().lng.toFixed(4)}`);
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

// 実行
generateTouristRouteMap();
```

### 実行方法

```bash
# 依存関係をインストール
npm install

# ライブラリをビルド
npm run build

# 基本構造テスト（依存関係不要）
npm run test:simple
# または npm test

# 実際の画像生成テスト
npm run test:generate

# 境界指定デモを実行
npm run test:bounds

# ズームレベルテストを実行
npm run test:zoom

# パス描画デモを実行
npm run test:path

# awaitテストを実行
npm run test:await
```

### テスト・デモファイル

- `tests/simple-test.js` - ライブラリ基本構造テスト（依存関係不要）
- `tests/generate-image-demo.js` - 基本的な画像生成デモ
- `tests/bounds-demo.js` - 境界指定による自動計算デモ  
- `tests/zoom-test.js` - ズームレベルテスト
- `tests/path-demo.js` - パス（経路）描画デモ
- `tests/test-await.js` - awaitを使った画像生成テスト
- `demo-viewer.html` - ブラウザプレビュー（実行不要）

**出力**: 全ての画像は `tests/output/` ディレクトリに保存されます。

## Tips（ヒント）

### ズームレベルの選択
- **0-2**: 大陸・国レベル
- **3-6**: 都市・地域レベル
- **7-12**: 市街地レベル  
- **13-16**: 近隣・建物レベル
- **17-18**: 建物詳細レベル（最大）

### 境界指定 vs 中心点・ズーム指定の使い分け
- **境界指定**を使う場合: 特定のエリアが確実に表示されることを保証したい
- **中心点・ズーム指定**を使う場合: ビューを精密にコントロールしたい
- 境界指定はエリアにフィットする最適なズームを自動計算します

### パフォーマンスのヒント
- 小さな画像サイズの方が高速にレンダリングされます
- 低いズームレベルほど必要なタイル数が少なくなります
- 境界指定時は適切なpaddingを使用してエッジのクロッピングを避けましょう

## よくある質問

### Q: ズームレベルの最大値は？
A: OpenStreetMapの一般的な最大ズームレベルは18です。19以上は通常利用できません。

### Q: ブラウザで使用できますか？
A: いいえ、このライブラリはNode.js専用です。ブラウザで地図を表示したい場合は、Leaflet、Google Maps API、Mapboxなどのブラウザ対応ライブラリを使用してください。

### Q: オフラインで使用できますか？
A: いいえ、このライブラリはOpenStreetMapタイルをオンラインで取得します。オフライン使用にはローカルタイルサーバーが必要です。

### Q: 商用利用は可能ですか？
A: はい、MITライセンスの下で商用利用可能です。ただし、OpenStreetMapの利用規約に従ってください。

### Q: どのような用途に適していますか？
A: 以下のような用途に適しています：
- **サーバーサイド**: Web APIでの地図画像生成
- **自動化スクリプト**: バッチ処理での地図生成
- **レポート生成**: PDFやドキュメントへの地図埋め込み
- **デスクトップアプリ**: Electronアプリでの地図機能

## ライセンス

MIT