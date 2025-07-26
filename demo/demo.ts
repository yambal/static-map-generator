import { StaticMap, Coordinate, Marker, StaticMapOptions } from '../src/index';
import * as fs from 'fs';
import * as path from 'path';

// TypeScript デモ用の型安全な地図生成クラス
class MapDemo {
  private outputDir: string;

  constructor(outputDir: string = './demo/output') {
    this.outputDir = outputDir;
    this.ensureOutputDirectory();
  }

  private ensureOutputDirectory(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  // 都市の地図設定を定義
  private readonly cityMaps: Array<{
    name: string;
    filename: string;
    options: StaticMapOptions;
  }> = [
    {
      name: '東京',
      filename: 'tokyo_ts.png',
      options: {
        center: { lat: 35.6762, lng: 139.6503 },
        zoom: 12,
        size: { width: 800, height: 600 },
        format: 'png',
        markers: [
          {
            coordinate: { lat: 35.6762, lng: 139.6503 },
            color: '#E74C3C',
            size: 'large',
            label: '東京駅'
          },
          {
            coordinate: { lat: 35.6585, lng: 139.7454 },
            color: '#2ECC71',
            size: 'medium',
            label: 'スカイツリー'
          }
        ]
      }
    },
    {
      name: 'ロンドン',
      filename: 'london_ts.png',
      options: {
        center: { lat: 51.5074, lng: -0.1278 },
        zoom: 11,
        size: { width: 800, height: 600 },
        format: 'png',
        markers: [
          {
            coordinate: { lat: 51.5074, lng: -0.1278 },
            color: '#3498DB',
            size: 'large',
            label: 'London Bridge'
          },
          {
            coordinate: { lat: 51.4994, lng: -0.1244 },
            color: '#F39C12',
            size: 'medium',
            label: 'Big Ben'
          },
          {
            coordinate: { lat: 51.5045, lng: -0.0865 },
            color: '#9B59B6',
            size: 'medium',
            label: 'Tower Bridge'
          }
        ]
      }
    }
  ];

  // カスタムマーカーのファクトリー関数
  private createMarker(
    lat: number, 
    lng: number, 
    label: string, 
    color: string = '#FF0000', 
    size: 'small' | 'medium' | 'large' = 'medium'
  ): Marker {
    return {
      coordinate: { lat, lng },
      color,
      size,
      label
    };
  }

  // 複数の地図を一括生成
  async generateAllMaps(): Promise<void> {
    console.log('🗺️ TypeScript Demo: 地図を生成中...');

    const results = await Promise.allSettled(
      this.cityMaps.map(async ({ name, filename, options }) => {
        try {
          console.log(`📍 ${name}の地図を生成中...`);
          
          const map = new StaticMap(options);
          const imageBuffer = await map.render();
          
          const filePath = path.join(this.outputDir, filename);
          fs.writeFileSync(filePath, imageBuffer);
          
          console.log(`✅ ${name}の地図が保存されました: ${filePath}`);
          return { name, filePath, success: true };
          
        } catch (error) {
          console.error(`❌ ${name}の地図生成に失敗: ${error}`);
          return { name, error, success: false };
        }
      })
    );

    // 結果の集計
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;
    
    console.log(`\n📊 生成結果: 成功 ${successful}件, 失敗 ${failed}件`);
  }

  // カスタム地図の作成例
  async generateCustomMap(): Promise<void> {
    console.log('🎨 カスタム地図を生成中...');

    // 観光スポット用のマーカー配列を型安全に作成
    const touristSpots: Marker[] = [
      this.createMarker(35.6586, 139.7016, '浅草寺', '#E74C3C', 'large'),
      this.createMarker(35.6762, 139.6503, '東京駅', '#3498DB', 'large'),
      this.createMarker(35.6785, 139.6823, '皇居', '#2ECC71', 'medium'),
      this.createMarker(35.6619, 139.7041, '上野', '#F39C12', 'medium'),
      this.createMarker(35.6598, 139.7006, '秋葉原', '#9B59B6', 'small')
    ];

    const customOptions: StaticMapOptions = {
      center: { lat: 35.6762, lng: 139.6903 },
      zoom: 13,
      size: { width: 1000, height: 800 },
      format: 'png',
      scale: 2, // 高解像度
      markers: touristSpots
    };

    try {
      const customMap = new StaticMap(customOptions);
      const imageBuffer = await customMap.render();
      
      const customPath = path.join(this.outputDir, 'tokyo_custom_ts.png');
      fs.writeFileSync(customPath, imageBuffer);
      
      console.log(`✅ カスタム地図が保存されました: ${customPath}`);
      
    } catch (error) {
      console.error(`❌ カスタム地図の生成に失敗: ${error}`);
    }
  }

  // 異なる設定での比較地図を生成
  async generateComparisonMaps(): Promise<void> {
    console.log('🔍 比較用地図を生成中...');

    const baseCoordinate: Coordinate = { lat: 35.6762, lng: 139.6503 };
    const baseMarker: Marker = this.createMarker(
      baseCoordinate.lat, 
      baseCoordinate.lng, 
      '東京駅', 
      '#FF0000', 
      'large'
    );

    const comparisons = [
      { name: 'ズーム10', zoom: 10, filename: 'tokyo_zoom10_ts.png' },
      { name: 'ズーム12', zoom: 12, filename: 'tokyo_zoom12_ts.png' },
      { name: 'ズーム14', zoom: 14, filename: 'tokyo_zoom14_ts.png' }
    ];

    for (const { name, zoom, filename } of comparisons) {
      try {
        const options: StaticMapOptions = {
          center: baseCoordinate,
          zoom,
          size: { width: 600, height: 400 },
          format: 'png',
          markers: [baseMarker]
        };

        const map = new StaticMap(options);
        const imageBuffer = await map.render();
        
        const filePath = path.join(this.outputDir, filename);
        fs.writeFileSync(filePath, imageBuffer);
        
        console.log(`✅ ${name}の地図が保存されました`);
        
      } catch (error) {
        console.error(`❌ ${name}の地図生成に失敗: ${error}`);
      }
    }
  }

  // メイン実行関数
  async runDemo(): Promise<void> {
    console.log('🚀 TypeScript StaticMap Demo を開始します\n');

    try {
      await this.generateAllMaps();
      await this.generateCustomMap();
      await this.generateComparisonMaps();
      
      console.log('\n🎉 TypeScript Demo完了!');
      console.log(`📁 出力ディレクトリ: ${this.outputDir}`);
      
    } catch (error) {
      console.error('❌ Demo実行中にエラーが発生:', error);
    }
  }
}

// 実行
async function main(): Promise<void> {
  const demo = new MapDemo();
  await demo.runDemo();
}

// このファイルが直接実行された場合のみmain関数を実行
if (require.main === module) {
  main().catch(console.error);
}

export { MapDemo };