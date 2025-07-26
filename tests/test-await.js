// awaitでの画像生成テスト
const { StaticMap } = require('../dist/index');
const fs = require('fs');
const path = require('path');

async function testAwaitImageGeneration() {
  console.log('🧪 awaitでの画像生成テスト開始...');
  console.log('');

  try {
    // 1. StaticMapインスタンスを作成（同期）
    console.log('📍 StaticMapインスタンスを作成中...');
    const map = new StaticMap({
      center: { lat: 35.6762, lng: 139.6503 }, // 東京駅
      zoom: 14,
      size: { width: 400, height: 300 },
      format: 'png',
      markers: [
        {
          coordinate: { lat: 35.6762, lng: 139.6503 },
          color: '#FF0000',
          size: 'large',
          label: '東京駅'
        }
      ]
    });
    console.log('✅ インスタンス作成完了（同期処理）');
    console.log('');

    // 2. 画像レンダリング（非同期）
    console.log('🎨 awaitで画像を生成中...');
    const startTime = Date.now();
    
    const imageBuffer = await map.render();  // ← awaitで画像取得
    
    const endTime = Date.now();
    console.log('✅ 画像生成完了！');
    console.log(`⏱️ 処理時間: ${endTime - startTime}ms`);
    console.log('');

    // 3. バッファーの確認
    console.log('📊 取得した画像バッファーの情報:');
    console.log(`   - 型: ${typeof imageBuffer}`);
    console.log(`   - インスタンス: ${imageBuffer instanceof Buffer ? 'Buffer' : 'その他'}`);
    console.log(`   - サイズ: ${imageBuffer.length} bytes`);
    console.log(`   - 最初の数バイト: ${Array.from(imageBuffer.slice(0, 8)).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
    console.log('');

    // 4. ファイルに保存
    const fileName = path.join(__dirname, 'output', 'test-await-result.png');
    
    // 出力ディレクトリを作成
    const outputDir = path.dirname(fileName);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(fileName, imageBuffer);
    console.log(`💾 画像を保存しました: ${fileName}`);
    
    // 5. 保存されたファイルの確認
    const fileStats = fs.statSync(fileName);
    console.log(`📄 保存されたファイル情報:`);
    console.log(`   - サイズ: ${fileStats.size} bytes`);
    console.log(`   - 作成日時: ${fileStats.birthtime}`);
    console.log('');

    console.log('🎉 awaitでの画像生成テスト成功！');
    console.log('💡 結論: await map.render() で正常に画像バッファーを取得できます');

    return imageBuffer;

  } catch (error) {
    console.error('❌ テスト失敗:', error.message);
    console.error('📝 詳細エラー:', error);
    throw error;
  }
}

// 複数の画像生成テスト
async function testMultipleImageGeneration() {
  console.log('');
  console.log('🔄 複数画像生成テスト開始...');

  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const testCases = [
    {
      name: '小さい地図',
      options: { center: { lat: 35.6762, lng: 139.6503 }, zoom: 10, size: { width: 200, height: 150 } }
    },
    {
      name: '大きい地図', 
      options: { center: { lat: 35.6762, lng: 139.6503 }, zoom: 12, size: { width: 600, height: 400 } }
    },
    {
      name: '境界指定地図',
      options: { 
        bounds: { north: 35.69, south: 35.66, east: 139.78, west: 139.63 },
        size: { width: 400, height: 300 }
      }
    }
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n📋 テストケース${i + 1}: ${testCase.name}`);
    
    try {
      const map = new StaticMap(testCase.options);
      const startTime = Date.now();
      
      const imageBuffer = await map.render();  // ← await使用
      
      const endTime = Date.now();
      const fileName = path.join(outputDir, `test-case-${i + 1}.png`);
      
      fs.writeFileSync(fileName, imageBuffer);
      
      console.log(`   ✅ 成功 - ${endTime - startTime}ms, ${imageBuffer.length} bytes, ${path.basename(fileName)}`);
      
    } catch (error) {
      console.log(`   ❌ 失敗 - ${error.message}`);
    }
  }

  console.log('\n🏁 複数画像生成テスト完了');
}

// メイン実行
async function main() {
  try {
    await testAwaitImageGeneration();
    await testMultipleImageGeneration();
  } catch (error) {
    console.error('メインテスト失敗:', error);
  }
}

// 実行
console.log('🚀 awaitテストスクリプト開始');
main();