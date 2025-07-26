import { Canvas, createCanvas, CanvasRenderingContext2D, Image } from 'canvas';
import axios from 'axios';
import { Coordinate, Size, Marker, StaticMapOptions, TileCoordinate, Bounds, Path } from './types';

export class StaticMap {
  private options: StaticMapOptions;
  private canvas: Canvas;
  private ctx: CanvasRenderingContext2D;
  private tileSize = 256;

  constructor(options: StaticMapOptions) {
    // boundsが指定された場合は自動計算
    if (options.bounds) {
      const viewport = this.calculateOptimalViewport(options.bounds, options.size, options.padding || 20);
      this.options = {
        format: 'png',
        scale: 1,
        tileServer: 'https://tile.openstreetmap.org',
        padding: 20,
        ...options,
        center: viewport.center,
        zoom: viewport.zoom
      };
    } else {
      // 従来通りcenterとzoomを必須とする
      if (!options.center || options.zoom === undefined) {
        throw new Error('center and zoom are required when bounds is not specified');
      }
      this.options = {
        format: 'png',
        scale: 1,
        tileServer: 'https://tile.openstreetmap.org',
        ...options
      };
    }

    const canvasWidth = this.options.size.width * this.options.scale!;
    const canvasHeight = this.options.size.height * this.options.scale!;
    
    this.canvas = createCanvas(canvasWidth, canvasHeight);
    this.ctx = this.canvas.getContext('2d');
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private rad2deg(rad: number): number {
    return rad * (180 / Math.PI);
  }

  private latLngToTile(lat: number, lng: number, zoom: number): TileCoordinate {
    const latRad = this.deg2rad(lat);
    const n = Math.pow(2, zoom);
    const x = Math.floor((lng + 180) / 360 * n);
    const y = Math.floor((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2 * n);
    return { x, y, z: zoom };
  }

  private tileToLatLng(x: number, y: number, zoom: number): Coordinate {
    const n = Math.pow(2, zoom);
    const lng = x / n * 360 - 180;
    const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)));
    const lat = this.rad2deg(latRad);
    return { lat, lng };
  }

  private async fetchTile(x: number, y: number, z: number): Promise<Image> {
    try {
      const url = `${this.options.tileServer}/${z}/${x}/${y}.png`;
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const img = new Image();
      img.src = Buffer.from(response.data);
      return img;
    } catch (error) {
      throw new Error(`Failed to fetch tile: ${error}`);
    }
  }

  private latLngToPixel(lat: number, lng: number, centerLat: number, centerLng: number, zoom: number): { x: number; y: number } {
    const scale = Math.pow(2, zoom);
    const worldWidth = this.tileSize * scale;
    const worldHeight = this.tileSize * scale;

    const centerX = (centerLng + 180) * worldWidth / 360;
    const centerY = worldHeight / 2 - worldWidth * Math.log(Math.tan((90 + centerLat) * Math.PI / 360)) / (2 * Math.PI);

    const x = (lng + 180) * worldWidth / 360;
    const y = worldHeight / 2 - worldWidth * Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (2 * Math.PI);

    return {
      x: x - centerX + this.options.size.width / 2,
      y: y - centerY + this.options.size.height / 2
    };
  }

  async render(): Promise<Buffer> {
    const { center, zoom, size } = this.options;
    
    if (!center || zoom === undefined) {
      throw new Error('Center and zoom must be defined');
    }
    
    const centerTile = this.latLngToTile(center.lat, center.lng, zoom);
    const tilesNeeded = Math.ceil(Math.max(size.width, size.height) / this.tileSize) + 1;
    
    const startX = centerTile.x - Math.floor(tilesNeeded / 2);
    const endX = centerTile.x + Math.ceil(tilesNeeded / 2);
    const startY = centerTile.y - Math.floor(tilesNeeded / 2);
    const endY = centerTile.y + Math.ceil(tilesNeeded / 2);

    this.ctx.fillStyle = '#f0f0f0';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        try {
          const tile = await this.fetchTile(x, y, zoom);
          const tileTopLeft = this.tileToLatLng(x, y, zoom);
          const pixelPos = this.latLngToPixel(
            tileTopLeft.lat,
            tileTopLeft.lng,
            center.lat,
            center.lng,
            zoom
          );

          this.ctx.drawImage(
            tile,
            Math.round(pixelPos.x),
            Math.round(pixelPos.y),
            this.tileSize,
            this.tileSize
          );
        } catch (error) {
          console.warn(`Failed to load tile ${x},${y}:`, error);
        }
      }
    }

    // パス（コース）を描画
    if (this.options.paths) {
      this.drawPaths();
    }

    // マーカーを描画（パスの上に表示）
    if (this.options.markers) {
      this.drawMarkers();
    }

    const format = this.options.format === 'jpg' ? 'image/jpeg' : 'image/png';
    return this.canvas.toBuffer(format as any);
  }

  private drawMarkers(): void {
    if (!this.options.markers || !this.options.center || this.options.zoom === undefined) return;

    for (const marker of this.options.markers) {
      const pixelPos = this.latLngToPixel(
        marker.coordinate.lat,
        marker.coordinate.lng,
        this.options.center.lat,
        this.options.center.lng,
        this.options.zoom
      );

      if (pixelPos.x < 0 || pixelPos.x > this.options.size.width ||
          pixelPos.y < 0 || pixelPos.y > this.options.size.height) {
        continue;
      }

      this.drawMarker(pixelPos.x, pixelPos.y, marker);
    }
  }

  private drawMarker(x: number, y: number, marker: Marker): void {
    const size = marker.size === 'small' ? 8 : marker.size === 'large' ? 16 : 12;
    const color = marker.color || '#FF0000';

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y - size / 2, size / 2, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    if (marker.label) {
      this.ctx.fillStyle = '#000000';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(marker.label, x, y - size - 5);
    }
  }

  private drawPaths(): void {
    if (!this.options.paths || !this.options.center || this.options.zoom === undefined) return;

    for (const path of this.options.paths) {
      this.drawPath(path);
    }
  }

  private drawPath(path: Path): void {
    if (path.coordinates.length < 2) return; // 最低2点必要

    // パス設定
    const color = path.color || '#0066FF';
    const width = path.width || 2;
    const opacity = path.opacity !== undefined ? path.opacity : 1;
    const lineCap = path.lineCap || 'round';
    const lineJoin = path.lineJoin || 'round';

    // 透明度を適用した色を設定
    this.ctx.globalAlpha = opacity;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.lineCap = lineCap;
    this.ctx.lineJoin = lineJoin;

    // 破線パターンがある場合は設定
    if (path.dashPattern && path.dashPattern.length > 0) {
      this.ctx.setLineDash(path.dashPattern);
    } else {
      this.ctx.setLineDash([]); // 実線
    }

    // パスの開始
    this.ctx.beginPath();

    let isFirstPoint = true;
    for (const coordinate of path.coordinates) {
      const pixelPos = this.latLngToPixel(
        coordinate.lat,
        coordinate.lng,
        this.options.center!.lat,
        this.options.center!.lng,
        this.options.zoom!
      );

      // 画面外の点もパスに含める（線が繋がるため）
      if (isFirstPoint) {
        this.ctx.moveTo(pixelPos.x, pixelPos.y);
        isFirstPoint = false;
      } else {
        this.ctx.lineTo(pixelPos.x, pixelPos.y);
      }
    }

    // パスを描画
    this.ctx.stroke();

    // 設定をリセット
    this.ctx.globalAlpha = 1.0;
    this.ctx.setLineDash([]);
  }

  private calculateOptimalViewport(bounds: Bounds, size: Size, padding: number): { center: Coordinate; zoom: number } {
    // 境界の中心点を計算
    const centerLat = (bounds.north + bounds.south) / 2;
    const centerLng = (bounds.east + bounds.west) / 2;
    const center: Coordinate = { lat: centerLat, lng: centerLng };

    // 境界の幅と高さを計算
    const latDiff = bounds.north - bounds.south;
    const lngDiff = bounds.east - bounds.west;

    // メルカトル投影を考慮した実際の距離を計算
    const latRad = this.deg2rad(centerLat);
    const lngDiffAdjusted = lngDiff * Math.cos(latRad);

    // 各ズームレベルでテストして最適なものを見つける
    let optimalZoom = 1;
    
    for (let zoom = 1; zoom <= 18; zoom++) {
      const scale = Math.pow(2, zoom);
      const worldWidth = this.tileSize * scale;
      const worldHeight = this.tileSize * scale;

      // 境界をピクセル座標に変換
      const northPixel = this.latLngToPixelAtZoom(bounds.north, centerLng, centerLat, centerLng, zoom);
      const southPixel = this.latLngToPixelAtZoom(bounds.south, centerLng, centerLat, centerLng, zoom);
      const westPixel = this.latLngToPixelAtZoom(centerLat, bounds.west, centerLat, centerLng, zoom);
      const eastPixel = this.latLngToPixelAtZoom(centerLat, bounds.east, centerLat, centerLng, zoom);

      const requiredWidth = Math.abs(eastPixel.x - westPixel.x) + padding * 2;
      const requiredHeight = Math.abs(northPixel.y - southPixel.y) + padding * 2;

      // 境界が画像サイズに収まるかチェック
      if (requiredWidth <= size.width && requiredHeight <= size.height) {
        optimalZoom = zoom;
      } else {
        break;
      }
    }

    // 最低でもズーム1、最高でも18に制限
    optimalZoom = Math.max(1, Math.min(optimalZoom, 18));

    return { center, zoom: optimalZoom };
  }

  private latLngToPixelAtZoom(lat: number, lng: number, centerLat: number, centerLng: number, zoom: number): { x: number; y: number } {
    const scale = Math.pow(2, zoom);
    const worldWidth = this.tileSize * scale;
    const worldHeight = this.tileSize * scale;

    const centerX = (centerLng + 180) * worldWidth / 360;
    const centerY = worldHeight / 2 - worldWidth * Math.log(Math.tan((90 + centerLat) * Math.PI / 360)) / (2 * Math.PI);

    const x = (lng + 180) * worldWidth / 360;
    const y = worldHeight / 2 - worldWidth * Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (2 * Math.PI);

    return {
      x: x - centerX,
      y: y - centerY
    };
  }

  // 計算された中心点とズームレベルを取得するためのメソッド
  public getCalculatedCenter(): Coordinate {
    if (!this.options.center) {
      throw new Error('Center is not defined');
    }
    return this.options.center;
  }

  public getCalculatedZoom(): number {
    if (this.options.zoom === undefined) {
      throw new Error('Zoom is not defined');
    }
    return this.options.zoom;
  }
}

export * from './types';