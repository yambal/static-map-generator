// 実際に地図画像を生成するデモ
const { StaticMap } = require('../dist/index');
const fs = require('fs');
const path = require('path');

async function generateMapNow() {
  console.log('🗺️ 実際の地図画像を生成します...');
  console.log('');

  // 出力ディレクトリを作成
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // 1. 東京の地図を生成
    console.log('📍 東京の地図を生成中...');
    const tokyoMap = new StaticMap({
      center: { lat: 35.6762, lng: 139.6503 }, // 東京駅
      zoom: 18,
      size: { width: 200, height: 200 },
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
        }
      ]
    });

    const tokyoBuffer = await tokyoMap.render();
    fs.writeFileSync(path.join(outputDir, 'tokyo-demo.png'), tokyoBuffer);
    console.log('✅ 東京の地図が生成されました！ -> tokyo-demo.png');
    console.log(`   ファイルサイズ: ${tokyoBuffer.length} bytes`);
    console.log('');

    // 2. 小さな地図を生成（高速テスト用）
    console.log('📍 シンプルな地図を生成中...');
    const simpleMap = new StaticMap({
      center: { lat: 35.6762, lng: 139.6503 },
      zoom: 10,
      size: { width: 300, height: 200 },
      format: 'png',
      markers: [
        {
          coordinate: { lat: 35.6762, lng: 139.6503 },
          color: '#0066FF',
          size: 'large',
          label: '東京'
        }
      ]
    });

    const simpleBuffer = await simpleMap.render();
    fs.writeFileSync(path.join(outputDir, 'simple-demo.png'), simpleBuffer);
    console.log('✅ シンプルな地図が生成されました！ -> simple-demo.png');
    console.log(`   ファイルサイズ: ${simpleBuffer.length} bytes`);
    console.log('');

    // 3. 高解像度地図を生成
    console.log('📍 高解像度地図を生成中...');
    const hdMap = new StaticMap({
      center: { lat: 35.6762, lng: 139.6503 },
      zoom: 14,
      size: { width: 400, height: 300 },
      scale: 2, // 高解像度
      format: 'png',
      markers: [
        {
          coordinate: { lat: 35.6762, lng: 139.6503 },
          color: '#FF6600',
          size: 'large',
          label: 'HD'
        }
      ]
    });

    const hdBuffer = await hdMap.render();
    fs.writeFileSync(path.join(outputDir, 'hd-demo.png'), hdBuffer);
    console.log('✅ 高解像度地図が生成されました！ -> hd-demo.png');
    console.log(`   実際のサイズ: 800x600px (scale: 2)`);
    console.log(`   ファイルサイズ: ${hdBuffer.length} bytes`);
    console.log('');

    console.log('🎉 すべての地図画像の生成が完了しました！');
    console.log('');
    console.log('📁 生成されたファイル:');
    console.log('   - tokyo-demo.png     (200x200, マーカー2個)');
    console.log('   - simple-demo.png    (300x200, マーカー1個)');
    console.log('   - hd-demo.png        (800x600, 高解像度)');
    console.log('');
    console.log(`💡 これらの画像ファイルは ${outputDir} に保存されました`);
    console.log('💡 画像ビューアーで確認してください！');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    console.error('');
    console.error('🔧 考えられる原因:');
    console.error('   - インターネット接続の問題');
    console.error('   - OpenStreetMapサーバーの応答問題');
    console.error('   - canvasライブラリの問題');
    console.error('');
    console.error('📝 詳細なエラー:', error);
  }
}

// すぐに実行
generateMapNow();