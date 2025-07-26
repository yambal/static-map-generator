// Bounds（境界）を指定して自動計算する地図生成デモ
const { StaticMap } = require('../dist/index');
const fs = require('fs');
const path = require('path');

async function boundsDemo() {
  console.log('🌍 Bounds指定による地図自動生成デモ');
  console.log('');

  // 出力ディレクトリを作成
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // 1. 東京都心エリア（皇居〜東京駅〜スカイツリー）
    console.log('📍 東京都心エリアの地図を生成中...');
    const tokyoAreaMap = new StaticMap({
      bounds: {
        north: 35.6950, // 皇居北端
        south: 35.6550, // 東京駅南
        east: 139.7600,  // スカイツリー東
        west: 139.6300   // 皇居西端
      },
      size: { width: 800, height: 600 },
      format: 'png',
      padding: 30,
      markers: [
        { coordinate: { lat: 35.6762, lng: 139.6503 }, color: '#FF0000', size: 'large', label: '東京駅' },
        { coordinate: { lat: 35.6585, lng: 139.7454 }, color: '#00FF00', size: 'large', label: 'スカイツリー' },
        { coordinate: { lat: 35.6785, lng: 139.6823 }, color: '#0066FF', size: 'medium', label: '皇居' }
      ]
    });

    const tokyoBuffer = await tokyoAreaMap.render();
    fs.writeFileSync(path.join(outputDir, 'bounds-tokyo-area.png'), tokyoBuffer);
    
    console.log('✅ 東京エリア生成完了！');
    console.log(`   計算された中心点: ${tokyoAreaMap.getCalculatedCenter().lat.toFixed(4)}, ${tokyoAreaMap.getCalculatedCenter().lng.toFixed(4)}`);
    console.log(`   計算されたズーム: ${tokyoAreaMap.getCalculatedZoom()}`);
    console.log(`   ファイル: bounds-tokyo-area.png (${tokyoBuffer.length} bytes)`);
    console.log('');

    // 2. 山手線内側エリア（より狭い範囲）
    console.log('📍 山手線内側エリアの地図を生成中...');
    const yamanoteMap = new StaticMap({
      bounds: {
        north: 35.7350, // 上野
        south: 35.6280, // 品川  
        east: 139.7800,  // 錦糸町
        west: 139.6100   // 新宿
      },
      size: { width: 600, height: 600 },
      format: 'png',
      padding: 20,
      markers: [
        { coordinate: { lat: 35.6762, lng: 139.6503 }, color: '#FF0000', size: 'medium', label: '東京' },
        { coordinate: { lat: 35.6586, lng: 139.7016 }, color: '#FF6600', size: 'medium', label: '上野' },
        { coordinate: { lat: 35.6280, lng: 139.7394 }, color: '#00AA00', size: 'medium', label: '品川' },
        { coordinate: { lat: 35.6896, lng: 139.7006 }, color: '#0066FF', size: 'medium', label: '新宿' }
      ]
    });

    const yamanoteBuffer = await yamanoteMap.render();
    fs.writeFileSync(path.join(outputDir, 'bounds-yamanote.png'), yamanoteBuffer);
    
    console.log('✅ 山手線エリア生成完了！');
    console.log(`   計算された中心点: ${yamanoteMap.getCalculatedCenter().lat.toFixed(4)}, ${yamanoteMap.getCalculatedCenter().lng.toFixed(4)}`);
    console.log(`   計算されたズーム: ${yamanoteMap.getCalculatedZoom()}`);
    console.log(`   ファイル: bounds-yamanote.png (${yamanoteBuffer.length} bytes)`);
    console.log('');

    // 3. 関東エリア（広域）
    console.log('📍 関東エリア（広域）の地図を生成中...');
    const kantoMap = new StaticMap({
      bounds: {
        north: 36.2000, // 茨城北部
        south: 35.0000, // 神奈川南部
        east: 140.8000,  // 千葉東部
        west: 138.7000   // 山梨東部
      },
      size: { width: 800, height: 600 },
      format: 'png',
      padding: 40,
      markers: [
        { coordinate: { lat: 35.6762, lng: 139.6503 }, color: '#FF0000', size: 'large', label: '東京' },
        { coordinate: { lat: 35.4478, lng: 139.6425 }, color: '#00AA00', size: 'medium', label: '横浜' },
        { coordinate: { lat: 35.6074, lng: 140.1065 }, color: '#0066FF', size: 'medium', label: '千葉' },
        { coordinate: { lat: 36.3911, lng: 139.0608 }, color: '#FF6600', size: 'medium', label: '宇都宮' }
      ]
    });

    const kantoBuffer = await kantoMap.render();
    fs.writeFileSync(path.join(outputDir, 'bounds-kanto.png'), kantoBuffer);
    
    console.log('✅ 関東エリア生成完了！');
    console.log(`   計算された中心点: ${kantoMap.getCalculatedCenter().lat.toFixed(4)}, ${kantoMap.getCalculatedCenter().lng.toFixed(4)}`);
    console.log(`   計算されたズーム: ${kantoMap.getCalculatedZoom()}`);
    console.log(`   ファイル: bounds-kanto.png (${kantoBuffer.length} bytes)`);
    console.log('');

    // 4. 縦長エリアのテスト（東海道）
    console.log('📍 東海道エリア（縦長テスト）の地図を生成中...');
    const tokaidoMap = new StaticMap({
      bounds: {
        north: 35.7000, // 東京北部
        south: 34.9500, // 小田原南部
        east: 139.8000,  // 東京湾
        west: 139.0000   // 箱根
      },
      size: { width: 400, height: 800 }, // 縦長サイズ
      format: 'png',
      padding: 25,
      markers: [
        { coordinate: { lat: 35.6762, lng: 139.6503 }, color: '#FF0000', size: 'large', label: '東京' },
        { coordinate: { lat: 35.4478, lng: 139.6425 }, color: '#00AA00', size: 'medium', label: '横浜' },
        { coordinate: { lat: 35.2612, lng: 139.1537 }, color: '#0066FF', size: 'medium', label: '小田原' }
      ]
    });

    const tokaidoBuffer = await tokaidoMap.render();
    fs.writeFileSync(path.join(outputDir, 'bounds-tokaido.png'), tokaidoBuffer);
    
    console.log('✅ 東海道エリア生成完了！');
    console.log(`   計算された中心点: ${tokaidoMap.getCalculatedCenter().lat.toFixed(4)}, ${tokaidoMap.getCalculatedCenter().lng.toFixed(4)}`);
    console.log(`   計算されたズーム: ${tokaidoMap.getCalculatedZoom()}`);
    console.log(`   ファイル: bounds-tokaido.png (${tokaidoBuffer.length} bytes)`);
    console.log('');

    console.log('🎉 Boundsデモ完了！');
    console.log('');
    console.log('📁 生成されたファイル:');
    console.log('   - bounds-tokyo-area.png   (800x600, 都心エリア)');
    console.log('   - bounds-yamanote.png     (600x600, 山手線内)');
    console.log('   - bounds-kanto.png        (800x600, 関東広域)');
    console.log('   - bounds-tokaido.png      (400x800, 縦長テスト)');
    console.log('');
    console.log(`✨ 全ての画像は ${outputDir} に保存されました`);
    console.log('✨ 各地図で境界がはみ出すことなく表示されています！');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    console.error('詳細:', error);
  }
}

// 使用例の表示
console.log('💡 Bounds機能の使用方法:');
console.log('');
console.log('const map = new StaticMap({');
console.log('  bounds: {');
console.log('    north: 35.7000,  // 北端の緯度');
console.log('    south: 35.6000,  // 南端の緯度'); 
console.log('    east: 139.8000,   // 東端の経度');
console.log('    west: 139.7000    // 西端の経度');
console.log('  },');
console.log('  size: { width: 800, height: 600 },');
console.log('  padding: 20  // 境界からの余白（ピクセル）');
console.log('});');
console.log('');
console.log('// 自動計算された値を取得');
console.log('console.log(map.getCalculatedCenter());');
console.log('console.log(map.getCalculatedZoom());');
console.log('');

boundsDemo();