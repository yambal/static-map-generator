export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Marker {
  coordinate: Coordinate;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  label?: string;
}

export interface Path {
  coordinates: Coordinate[];   // パスの座標配列
  color?: string;             // パスの色（デフォルト: '#0066FF'）
  width?: number;             // パスの線幅（デフォルト: 2）
  opacity?: number;           // パスの透明度 0-1（デフォルト: 1）
  lineCap?: 'butt' | 'round' | 'square';  // 線の端の形状（デフォルト: 'round'）
  lineJoin?: 'miter' | 'round' | 'bevel';  // 線の結合部の形状（デフォルト: 'round'）
  dashPattern?: number[];     // 破線パターン（例: [5, 5] で点線）
}

export interface Bounds {
  north: number;  // 北端の緯度
  south: number;  // 南端の緯度
  east: number;   // 東端の経度  
  west: number;   // 西端の経度
}

export interface StaticMapOptions {
  center?: Coordinate;  // boundsが指定された場合はオプション
  zoom?: number;        // boundsが指定された場合はオプション
  bounds?: Bounds;      // 表示したい領域の境界
  size: Size;
  format?: 'png' | 'jpg';
  scale?: 1 | 2;
  markers?: Marker[];
  paths?: Path[];       // 描画するパス（コース・経路）の配列
  tileServer?: string;
  padding?: number;     // bounds使用時の余白（ピクセル、デフォルト: 20）
}

export interface TileCoordinate {
  x: number;
  y: number;
  z: number;
}