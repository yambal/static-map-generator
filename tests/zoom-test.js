// ズームレベルのテストデモ
const { StaticMap } = require('../dist/index');
const fs = require('fs');
const path = require('path');

async function testZoomLevels() {
  console.log('🔍 ズームレベルのテストを開始...');
  console.log('');

  // 出力ディレクトリを作成
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const testZooms = [
    { zoom: 8, name: '地域レベル' },
    { zoom: 12, name: '市街地レベル' },
    { zoom: 15, name: '建物レベル' },
    { zoom: 18, name: '最高詳細レベル' },
    { zoom: 20, name: '制限オーバー（エラーテスト）' }
  ];

  for (const test of testZooms) {
    try {
      console.log(`📍 Zoom ${test.zoom} (${test.name}) をテスト中...`);
      
      const map = new StaticMap({
        center: { lat: 35.6762, lng: 139.6503 }, // 東京駅
        zoom: test.zoom,
        size: { width: 300, height: 200 },
        format: 'png',
        markers: [{
          coordinate: { lat: 35.6762, lng: 139.6503 },
          color: '#FF0000',
          size: 'medium',
          label: `Z${test.zoom}`
        }]
      });

      const buffer = await map.render();
      const filename = `zoom-${test.zoom}.png`;
      const filePath = path.join(outputDir, filename);
      fs.writeFileSync(filePath, buffer);
      
      console.log(`✅ 成功: ${filename} (${buffer.length} bytes)`);
      
    } catch (error) {
      console.log(`❌ 失敗: Zoom ${test.zoom} - ${error.message}`);
    }
    console.log('');
  }

  console.log('📊 ズームレベルテスト完了！');
  console.log('');
  console.log(`💡 画像ファイルは ${outputDir} に保存されました`);
  console.log('💡 推奨ズーム範囲:');
  console.log('   - 都市全体: 8-10');
  console.log('   - 市街地: 11-13');  
  console.log('   - 建物詳細: 14-16');
  console.log('   - 最高詳細: 17-18');
  console.log('');
  console.log('⚠️ Zoom 19以上は通常利用できません');
}

testZoomLevels().catch(console.error);