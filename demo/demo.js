const { StaticMap } = require('../dist/index');
const fs = require('fs');
const path = require('path');

// デモ用の地図生成関数
async function generateDemoMaps() {
  console.log('Generating demo maps...');

  // 出力ディレクトリを作成
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. 東京の地図（マーカー付き）
  const tokyoMap = new StaticMap({
    center: { lat: 35.6762, lng: 139.6503 },
    zoom: 12,
    size: { width: 800, height: 600 },
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
        size: 'medium',
        label: '浅草'
      }
    ]
  });

  // 2. ニューヨークの地図
  const nyMap = new StaticMap({
    center: { lat: 40.7589, lng: -73.9851 },
    zoom: 13,
    size: { width: 800, height: 600 },
    format: 'png',
    markers: [
      {
        coordinate: { lat: 40.7589, lng: -73.9851 },
        color: '#FF6B35',
        size: 'large',
        label: 'Times Square'
      },
      {
        coordinate: { lat: 40.7484, lng: -73.9857 },
        color: '#F7931E',
        size: 'medium',
        label: 'Empire State'
      },
      {
        coordinate: { lat: 40.7505, lng: -73.9934 },
        color: '#FFD23F',
        size: 'medium',
        label: 'Penn Station'
      }
    ]
  });

  // 3. パリの地図
  const parisMap = new StaticMap({
    center: { lat: 48.8566, lng: 2.3522 },
    zoom: 12,
    size: { width: 800, height: 600 },
    format: 'png',
    markers: [
      {
        coordinate: { lat: 48.8584, lng: 2.2945 },
        color: '#E74C3C',
        size: 'large',
        label: 'Eiffel Tower'
      },
      {
        coordinate: { lat: 48.8606, lng: 2.3376 },
        color: '#9B59B6',
        size: 'medium',
        label: 'Louvre'
      },
      {
        coordinate: { lat: 48.8530, lng: 2.3499 },
        color: '#3498DB',
        size: 'medium',
        label: 'Notre-Dame'
      }
    ]
  });

  // 4. 高解像度地図（scale: 2）
  const highResMap = new StaticMap({
    center: { lat: 35.6762, lng: 139.6503 },
    zoom: 15,
    size: { width: 400, height: 300 },
    scale: 2,
    format: 'png',
    markers: [
      {
        coordinate: { lat: 35.6762, lng: 139.6503 },
        color: '#FF0000',
        size: 'large',
        label: 'HD'
      }
    ]
  });

  try {
    // 地図を生成して保存
    const maps = [
      { map: tokyoMap, filename: 'tokyo.png', name: '東京' },
      { map: nyMap, filename: 'newyork.png', name: 'ニューヨーク' },
      { map: parisMap, filename: 'paris.png', name: 'パリ' },
      { map: highResMap, filename: 'tokyo_hd.png', name: '東京（高解像度）' }
    ];

    for (const { map, filename, name } of maps) {
      console.log(`Generating ${name} map...`);
      const imageBuffer = await map.render();
      const filePath = path.join(outputDir, filename);
      fs.writeFileSync(filePath, imageBuffer);
      console.log(`✓ ${name} map saved: ${filePath}`);
    }

    console.log('\n✅ All demo maps generated successfully!');
    console.log(`Check the output directory: ${outputDir}`);

  } catch (error) {
    console.error('❌ Error generating maps:', error);
  }
}

// HTMLデモページ生成
function generateDemoHTML() {
  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StaticMap Demo</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
        }
        .map-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        .map-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: transform 0.3s ease;
        }
        .map-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.2);
        }
        .map-card img {
            width: 100%;
            height: auto;
            display: block;
        }
        .map-info {
            padding: 20px;
        }
        .map-title {
            font-size: 1.4em;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        .map-description {
            color: #666;
            line-height: 1.6;
        }
        .feature-list {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .feature-list h2 {
            color: #333;
            margin-bottom: 20px;
        }
        .feature-list ul {
            list-style-type: none;
            padding: 0;
        }
        .feature-list li {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
            position: relative;
            padding-left: 25px;
        }
        .feature-list li:before {
            content: "✓";
            color: #27ae60;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        .code-example {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 20px;
            border-radius: 5px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🗺️ StaticMap Demo</h1>
        <p>Node.jsライブラリで生成された静的地図画像のデモンストレーション</p>
    </div>

    <div class="map-grid">
        <div class="map-card">
            <img src="output/tokyo.png" alt="Tokyo Map">
            <div class="map-info">
                <div class="map-title">🏯 東京</div>
                <div class="map-description">
                    東京駅、東京スカイツリー、浅草にマーカーを配置した地図。
                    日本の首都の主要観光スポットを表示しています。
                </div>
            </div>
        </div>

        <div class="map-card">
            <img src="output/newyork.png" alt="New York Map">
            <div class="map-info">
                <div class="map-title">🏙️ ニューヨーク</div>
                <div class="map-description">
                    タイムズスクエア、エンパイアステートビル、ペンステーションの
                    マーカー付きマンハッタンの地図。
                </div>
            </div>
        </div>

        <div class="map-card">
            <img src="output/paris.png" alt="Paris Map">
            <div class="map-info">
                <div class="map-title">🗼 パリ</div>
                <div class="map-description">
                    エッフェル塔、ルーブル美術館、ノートルダム大聖堂を
                    マークしたパリの観光地図。
                </div>
            </div>
        </div>

        <div class="map-card">
            <img src="output/tokyo_hd.png" alt="Tokyo HD Map">
            <div class="map-info">
                <div class="map-title">📱 東京（高解像度）</div>
                <div class="map-description">
                    scale: 2 オプションを使用した高解像度版。
                    Retinaディスプレイ等に最適化された鮮明な画像。
                </div>
            </div>
        </div>
    </div>

    <div class="feature-list">
        <h2>🚀 主な機能</h2>
        <ul>
            <li>OpenStreetMapタイルを使用した地図生成</li>
            <li>カスタムマーカー（色・サイズ・ラベル対応）</li>
            <li>PNG/JPEG出力フォーマット対応</li>
            <li>高解像度出力（Retina対応）</li>
            <li>TypeScript完全対応</li>
            <li>座標変換とタイル計算の自動処理</li>
        </ul>

        <h2>💻 使用例</h2>
        <div class="code-example">
const { StaticMap } = require('staticmap');

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

const imageBuffer = await map.render();
        </div>
    </div>
</body>
</html>`;

  const htmlPath = path.join(__dirname, 'demo.html');
  fs.writeFileSync(htmlPath, html);
  console.log(`📄 Demo HTML generated: ${htmlPath}`);
}

// メイン実行
async function main() {
  await generateDemoMaps();
  generateDemoHTML();
  console.log('\n🎉 Demo generation completed!');
  console.log('Open demo/demo.html in your browser to view the results.');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateDemoMaps, generateDemoHTML };