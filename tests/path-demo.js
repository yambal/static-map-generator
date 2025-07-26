// パス（コース・経路）描画機能のデモ
const { StaticMap } = require('../dist/index');
const fs = require('fs');
const path = require('path');

async function pathDrawingDemo() {
  console.log('🛣️ パス描画機能のデモ開始');
  console.log('');

  // 出力ディレクトリを作成
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // 1. 基本的なパス（東京駅→皇居→浅草→スカイツリー）
    console.log('📍 基本パスの地図を生成中...');
    
    const basicRoute = [
      { lat: 35.6762, lng: 139.6503 }, // 東京駅
      { lat: 35.6785, lng: 139.6823 }, // 皇居
      { lat: 35.7148, lng: 139.7967 }, // 浅草
      { lat: 35.7101, lng: 139.8107 }, // スカイツリー
    ];

    const basicPathMap = new StaticMap({
      bounds: {
        north: 35.720,
        south: 35.670,
        east: 139.820,
        west: 139.640
      },
      size: { width: 800, height: 600 },
      padding: 30,
      paths: [
        {
          coordinates: basicRoute,
          color: '#FF0066',
          width: 4,
          opacity: 0.8
        }
      ],
      markers: [
        { coordinate: basicRoute[0], color: '#FF0000', size: 'large', label: 'スタート' },
        { coordinate: basicRoute[basicRoute.length - 1], color: '#00FF00', size: 'large', label: 'ゴール' }
      ]
    });

    const basicBuffer = await basicPathMap.render();
    fs.writeFileSync(path.join(outputDir, 'path-basic.png'), basicBuffer);
    
    console.log('✅ 基本パス地図生成完了！');
    console.log(`   ファイル: path-basic.png (${basicBuffer.length} bytes)`);
    console.log(`   ズーム: ${basicPathMap.getCalculatedZoom()}`);
    console.log('');

    // 2. 複数のパスと異なるスタイル
    console.log('📍 複数パスの地図を生成中...');
    
    const route1 = [
      { lat: 35.6762, lng: 139.6503 }, // 東京駅
      { lat: 35.6586, lng: 139.7016 }, // 浅草
      { lat: 35.6585, lng: 139.7454 }  // スカイツリー
    ];

    const route2 = [
      { lat: 35.6762, lng: 139.6503 }, // 東京駅
      { lat: 35.6785, lng: 139.6823 }, // 皇居
      { lat: 35.6950, lng: 139.6917 }  // 神保町
    ];

    const multiPathMap = new StaticMap({
      center: { lat: 35.6762, lng: 139.6903 },
      zoom: 13,
      size: { width: 800, height: 600 },
      paths: [
        {
          coordinates: route1,
          color: '#FF0066',
          width: 5,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round'
        },
        {
          coordinates: route2,
          color: '#0066FF',
          width: 3,
          opacity: 0.7,
          dashPattern: [10, 5] // 破線
        }
      ],
      markers: [
        { coordinate: { lat: 35.6762, lng: 139.6503 }, color: '#333333', size: 'large', label: '東京駅' },
        { coordinate: { lat: 35.6585, lng: 139.7454 }, color: '#FF0066', size: 'medium', label: 'ルート1' },
        { coordinate: { lat: 35.6950, lng: 139.6917 }, color: '#0066FF', size: 'medium', label: 'ルート2' }
      ]
    });

    const multiBuffer = await multiPathMap.render();
    fs.writeFileSync(path.join(outputDir, 'path-multi.png'), multiBuffer);
    
    console.log('✅ 複数パス地図生成完了！');
    console.log(`   ファイル: path-multi.png (${multiBuffer.length} bytes)`);
    console.log('');

    // 3. ハイキングコースのシミュレーション（山手線の一部）
    console.log('📍 ハイキングコース風地図を生成中...');
    
    const hikingRoute = [
      { lat: 35.6762, lng: 139.6503 }, // 東京駅
      { lat: 35.6809, lng: 139.6664 }, // 大手町
      { lat: 35.6959, lng: 139.6917 }, // 神保町
      { lat: 35.7056, lng: 139.7081 }, // 上野
      { lat: 35.7148, lng: 139.7967 }, // 浅草
      { lat: 35.7101, lng: 139.8107 }, // スカイツリー周辺
      { lat: 35.6961, lng: 139.8103 }, // 錦糸町
      { lat: 35.6759, lng: 139.7632 }  // 両国
    ];

    const hikingMap = new StaticMap({
      bounds: {
        north: 35.720,
        south: 35.670,
        east: 139.820,
        west: 139.640
      },
      size: { width: 1000, height: 800 },
      padding: 40,
      paths: [
        {
          coordinates: hikingRoute,
          color: '#228B22',
          width: 6,
          opacity: 0.8,
          lineCap: 'round',
          lineJoin: 'round'
        },
        // 補助ライン（薄い色で）
        {
          coordinates: hikingRoute,
          color: '#90EE90',
          width: 8,
          opacity: 0.3,
          lineCap: 'round',
          lineJoin: 'round'
        }
      ],
      markers: [
        { coordinate: hikingRoute[0], color: '#FF4500', size: 'large', label: 'START' },
        { coordinate: hikingRoute[2], color: '#FFA500', size: 'medium', label: '神保町' },
        { coordinate: hikingRoute[4], color: '#FFA500', size: 'medium', label: '浅草' },
        { coordinate: hikingRoute[5], color: '#32CD32', size: 'large', label: 'GOAL' }
      ]
    });

    const hikingBuffer = await hikingMap.render();
    fs.writeFileSync(path.join(outputDir, 'path-hiking.png'), hikingBuffer);
    
    console.log('✅ ハイキングコース地図生成完了！');
    console.log(`   ファイル: path-hiking.png (${hikingBuffer.length} bytes)`);
    console.log(`   ズーム: ${hikingMap.getCalculatedZoom()}`);
    console.log('');

    // 4. 異なる線スタイルのデモ
    console.log('📍 線スタイルデモ地図を生成中...');
    
    const baseRoute = [
      { lat: 35.6762, lng: 139.6503 },
      { lat: 35.6785, lng: 139.6823 },
      { lat: 35.6950, lng: 139.6917 }
    ];

    const styleDemo = new StaticMap({
      center: { lat: 35.6832, lng: 139.6710 },
      zoom: 14,
      size: { width: 600, height: 600 },
      paths: [
        // 実線（太い）
        {
          coordinates: baseRoute,
          color: '#FF0000',
          width: 8,
          opacity: 1.0
        },
        // 破線
        {
          coordinates: baseRoute.map(p => ({lat: p.lat + 0.002, lng: p.lng})),
          color: '#00FF00',
          width: 4,
          opacity: 0.8,
          dashPattern: [15, 10]
        },
        // 点線
        {
          coordinates: baseRoute.map(p => ({lat: p.lat + 0.004, lng: p.lng})),
          color: '#0000FF',
          width: 3,
          opacity: 0.6,
          dashPattern: [3, 7]
        },
        // 薄い線
        {
          coordinates: baseRoute.map(p => ({lat: p.lat + 0.006, lng: p.lng})),
          color: '#FF00FF',
          width: 2,
          opacity: 0.4
        }
      ],
      markers: [
        { coordinate: { lat: 35.6762, lng: 139.6503 }, color: '#FF0000', size: 'small', label: '実線' },
        { coordinate: { lat: 35.6764, lng: 139.6503 }, color: '#00FF00', size: 'small', label: '破線' },
        { coordinate: { lat: 35.6766, lng: 139.6503 }, color: '#0000FF', size: 'small', label: '点線' },
        { coordinate: { lat: 35.6768, lng: 139.6503 }, color: '#FF00FF', size: 'small', label: '薄線' }
      ]
    });

    const styleBuffer = await styleDemo.render();
    fs.writeFileSync(path.join(outputDir, 'path-styles.png'), styleBuffer);
    
    console.log('✅ 線スタイルデモ地図生成完了！');
    console.log(`   ファイル: path-styles.png (${styleBuffer.length} bytes)`);
    console.log('');

    console.log('🎉 パス描画デモ完了！');
    console.log('');
    console.log('📁 生成されたファイル:');
    console.log('   - path-basic.png    (基本的なパス描画)');
    console.log('   - path-multi.png    (複数パス・異なるスタイル)');
    console.log('   - path-hiking.png   (ハイキングコース風)');
    console.log('   - path-styles.png   (様々な線スタイル)');
    console.log('');
    console.log(`✨ 全ての画像は ${outputDir} に保存されました`);

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    console.error('詳細:', error);
  }
}

// 使用例の表示
console.log('💡 パス描画機能の使用方法:');
console.log('');
console.log('const map = new StaticMap({');
console.log('  center: { lat: 35.6762, lng: 139.6503 },');
console.log('  zoom: 13,');
console.log('  size: { width: 800, height: 600 },');
console.log('  paths: [');
console.log('    {');
console.log('      coordinates: [');
console.log('        { lat: 35.6762, lng: 139.6503 },');
console.log('        { lat: 35.6785, lng: 139.6823 },');
console.log('        { lat: 35.7148, lng: 139.7967 }');
console.log('      ],');
console.log('      color: "#FF0066",        // パスの色');
console.log('      width: 4,                // 線の太さ');
console.log('      opacity: 0.8,            // 透明度');
console.log('      dashPattern: [5, 3]      // 破線パターン（オプション）');
console.log('    }');
console.log('  ]');
console.log('});');
console.log('');

pathDrawingDemo();