// シンプルなテスト - 依存関係なしでライブラリをテスト
const path = require('path');
const fs = require('fs');

console.log('🗺️ StaticMap ライブラリ基本テスト');
console.log('');

// ライブラリの基本構造を確認
try {
  const lib = require('../dist/index.js');
  console.log('✅ ライブラリの読み込み成功');
  console.log('📦 エクスポートされた要素:', Object.keys(lib));
  
  // StaticMapクラスの確認
  if (lib.StaticMap) {
    console.log('✅ StaticMapクラスが利用可能');
    
    // 基本的なインスタンス作成テスト
    const mapOptions = {
      center: { lat: 35.6762, lng: 139.6503 },
      zoom: 12,
      size: { width: 400, height: 300 },
      format: 'png'
    };
    
    const map = new lib.StaticMap(mapOptions);
    console.log('✅ StaticMapインスタンス作成成功');
    console.log('');
    
    // オプションの確認
    console.log('📋 設定オプション:');
    console.log('   中心座標: 東京駅 (35.6762, 139.6503)');
    console.log('   ズームレベル:', mapOptions.zoom);
    console.log('   サイズ:', mapOptions.size.width + 'x' + mapOptions.size.height);
    console.log('   フォーマット:', mapOptions.format);
    console.log('');
    
    // 境界指定テスト
    console.log('🧪 境界指定テスト...');
    try {
      const boundsMap = new lib.StaticMap({
        bounds: {
          north: 35.7000,
          south: 35.6500,
          east: 139.8000,
          west: 139.6000
        },
        size: { width: 400, height: 300 }
      });
      
      console.log('✅ 境界指定インスタンス作成成功');
      console.log(`   自動計算された中心点: ${boundsMap.getCalculatedCenter().lat.toFixed(4)}, ${boundsMap.getCalculatedCenter().lng.toFixed(4)}`);
      console.log(`   自動計算されたズーム: ${boundsMap.getCalculatedZoom()}`);
      console.log('');
      
    } catch (boundsError) {
      console.log('❌ 境界指定テスト失敗:', boundsError.message);
    }
    
    // メソッドの確認
    console.log('🔧 利用可能なメソッド:');
    console.log('   - render(): 地図画像を生成（非同期）');
    console.log('   - getCalculatedCenter(): 計算された中心点を取得');
    console.log('   - getCalculatedZoom(): 計算されたズームを取得');
    console.log('');
    
    console.log('⚠️ 実際の地図生成には以下が必要です:');
    console.log('   1. インターネット接続 (OpenStreetMapタイル取得)');
    console.log('   2. canvas, axios依存関係');
    console.log('');
    
    console.log('🚀 使用例:');
    console.log(`
const { StaticMap } = require('staticmap');

async function generateMap() {
  const map = new StaticMap({
    center: { lat: 35.6762, lng: 139.6503 },
    zoom: 12,
    size: { width: 800, height: 600 },
    markers: [{
      coordinate: { lat: 35.6762, lng: 139.6503 },
      color: '#FF0000',
      size: 'large',
      label: '東京駅'
    }]
  });

  try {
    const imageBuffer = await map.render();
    fs.writeFileSync('map.png', imageBuffer);
    console.log('✅ 地図が生成されました！');
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}
    `);
    
  } else {
    console.log('❌ StaticMapクラスが見つかりません');
  }
  
} catch (error) {
  console.log('❌ ライブラリの読み込みエラー:', error.message);
  console.log('');
  console.log('📝 解決方法:');
  console.log('   1. npm run build でTypeScriptをビルド');
  console.log('   2. npm install で依存関係をインストール');
}

console.log('');
console.log('📁 プロジェクト構造:');
console.log('   src/          - TypeScriptソースコード');
console.log('   dist/         - コンパイル済みJavaScript');
console.log('   tests/        - テスト・デモファイル');
console.log('   example/      - 使用例');
console.log('');
console.log('🎯 次のステップ:');
console.log('   1. npm install');
console.log('   2. npm run build');
console.log('   3. node tests/generate-image-demo.js');
console.log('   4. tests/output/ フォルダで生成された画像を確認');