# Static Map Generator

A Node.js library for generating static map images using OpenStreetMap tiles with markers, paths, and smart bounds fitting.

## Features

- 🗺️ Generate static map images from OpenStreetMap tiles
- 📍 Add custom markers with labels and colors  
- 🛣️ Draw paths/routes from coordinate arrays
- 📏 Smart bounds fitting with auto-calculated center and zoom
- 🖼️ Support for different image formats (PNG, JPG)
- 📱 High-resolution output (Retina support)
- 💻 Full TypeScript support
- ⚙️ Customizable map size and zoom levels

## Installation

```bash
npm install static-map-generator
```

## Usage

### Basic Usage

```typescript
import { StaticMap } from 'static-map-generator';

const map = new StaticMap({
  center: { lat: 35.6762, lng: 139.6503 }, // Tokyo
  zoom: 12,
  size: { width: 800, height: 600 },
  format: 'png'
});

const imageBuffer = await map.render();
// Save or use the image buffer
```

### With Markers

```typescript
import { StaticMap } from 'static-map-generator';

const map = new StaticMap({
  center: { lat: 35.6762, lng: 139.6503 },
  zoom: 12,
  size: { width: 800, height: 600 },
  markers: [
    {
      coordinate: { lat: 35.6762, lng: 139.6503 },
      color: '#FF0000',
      size: 'large',
      label: 'Tokyo'
    },
    {
      coordinate: { lat: 35.6585, lng: 139.7454 },
      color: '#00FF00',
      size: 'medium',
      label: 'Skytree'
    }
  ]
});

const imageBuffer = await map.render();
```

### Auto-fit with Bounds (New!)

Automatically calculate center and zoom to fit a specified area:

```typescript
import { StaticMap } from 'static-map-generator';

const map = new StaticMap({
  bounds: {
    north: 35.7000,  // Northern latitude
    south: 35.6000,  // Southern latitude  
    east: 139.8000,   // Eastern longitude
    west: 139.7000    // Western longitude
  },
  size: { width: 800, height: 600 },
  padding: 20,  // Padding from bounds (pixels)
  markers: [
    { coordinate: { lat: 35.6762, lng: 139.6503 }, label: 'Tokyo' }
  ]
});

const imageBuffer = await map.render();

// Get auto-calculated values
console.log('Center:', map.getCalculatedCenter());
console.log('Zoom:', map.getCalculatedZoom());
```

## API

### StaticMap(options)

Creates a new StaticMap instance.

#### Two Usage Patterns

**Pattern 1: Manual Center & Zoom**
```typescript
const map = new StaticMap({
  center: { lat: 35.6762, lng: 139.6503 },
  zoom: 12,
  size: { width: 800, height: 600 }
});
```

**Pattern 2: Auto-fit with Bounds**
```typescript
const map = new StaticMap({
  bounds: {
    north: 35.7000,
    south: 35.6000,
    east: 139.8000,
    west: 139.7000
  },
  size: { width: 800, height: 600 }
});
```

#### Options

**Required (choose one):**
- `center` + `zoom`: Manual positioning
- `bounds`: Auto-calculated positioning

**Common Options:**
- `size` (Size): Width and height of the output image
- `format` (string, optional): Output format ('png' or 'jpg', default: 'png')
- `scale` (number, optional): Scale factor (1 or 2, default: 1)
- `markers` (Marker[], optional): Array of markers to display
- `tileServer` (string, optional): Custom tile server URL

**Bounds-specific Options:**
- `padding` (number, optional): Padding from bounds in pixels (default: 20)

#### Types

```typescript
interface Coordinate {
  lat: number;
  lng: number;
}

interface Size {
  width: number;
  height: number;
}

interface Bounds {
  north: number;  // Northern latitude
  south: number;  // Southern latitude
  east: number;   // Eastern longitude
  west: number;   // Western longitude
}

interface Marker {
  coordinate: Coordinate;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  label?: string;
}

interface StaticMapOptions {
  center?: Coordinate;    // Required when bounds not specified
  zoom?: number;          // Required when bounds not specified (0-18)
  bounds?: Bounds;        // Alternative to center/zoom
  size: Size;
  format?: 'png' | 'jpg';
  scale?: 1 | 2;
  markers?: Marker[];
  tileServer?: string;
  padding?: number;       // Used with bounds (default: 20)
}
```

### Methods

#### render(): Promise&lt;Buffer&gt;

Renders the map and returns a Promise that resolves to an image buffer.

#### getCalculatedCenter(): Coordinate

Returns the center point used for rendering (useful when using bounds).

#### getCalculatedZoom(): number

Returns the zoom level used for rendering (useful when using bounds).

## Examples

### Complete Usage Examples

#### 1. Basic Map with Manual Center/Zoom
```javascript
const { StaticMap } = require('static-map-generator');
const fs = require('fs');

const map = new StaticMap({
  center: { lat: 35.6762, lng: 139.6503 }, // Tokyo Station
  zoom: 12,
  size: { width: 800, height: 600 },
  format: 'png'
});

const imageBuffer = await map.render();
fs.writeFileSync('tokyo.png', imageBuffer);
```

#### 2. Auto-fit Map using Bounds
```javascript
const { StaticMap } = require('static-map-generator');
const fs = require('fs');

const map = new StaticMap({
  bounds: {
    north: 35.7000,  // Northern boundary
    south: 35.6000,  // Southern boundary
    east: 139.8000,   // Eastern boundary
    west: 139.7000    // Western boundary
  },
  size: { width: 800, height: 600 },
  padding: 30,  // 30px padding from boundaries
  markers: [
    {
      coordinate: { lat: 35.6762, lng: 139.6503 },
      color: '#FF0000',
      size: 'large',
      label: 'Tokyo'
    }
  ]
});

const imageBuffer = await map.render();
fs.writeFileSync('tokyo-bounds.png', imageBuffer);

// Get the auto-calculated values
console.log('Auto-calculated center:', map.getCalculatedCenter());
console.log('Auto-calculated zoom:', map.getCalculatedZoom());
```

#### 3. High-Resolution Map with Multiple Markers
```javascript
const { StaticMap } = require('static-map-generator');
const fs = require('fs');

const map = new StaticMap({
  center: { lat: 35.6762, lng: 139.6503 },
  zoom: 14,
  size: { width: 400, height: 300 },
  scale: 2,  // High-resolution (800x600 actual pixels)
  format: 'png',
  markers: [
    {
      coordinate: { lat: 35.6762, lng: 139.6503 },
      color: '#FF0000',
      size: 'large',
      label: 'Tokyo Station'
    },
    {
      coordinate: { lat: 35.6585, lng: 139.7454 },
      color: '#00FF00',
      size: 'medium',
      label: 'Skytree'
    },
    {
      coordinate: { lat: 35.6586, lng: 139.7016 },
      color: '#0000FF',
      size: 'small',
      label: 'Asakusa'
    }
  ]
});

const imageBuffer = await map.render();
fs.writeFileSync('tokyo-hd.png', imageBuffer);
```

#### 4. Area Coverage Map (Tourist Route)
```javascript
const { StaticMap } = require('static-map-generator');
const fs = require('fs');

// Define tourist spots
const touristSpots = [
  { lat: 35.6762, lng: 139.6503, name: 'Tokyo Station' },
  { lat: 35.6585, lng: 139.7454, name: 'Skytree' },
  { lat: 35.6586, lng: 139.7016, name: 'Asakusa' },
  { lat: 35.6785, lng: 139.6823, name: 'Imperial Palace' }
];

// Calculate bounds to include all spots
const lats = touristSpots.map(spot => spot.lat);
const lngs = touristSpots.map(spot => spot.lng);

const map = new StaticMap({
  bounds: {
    north: Math.max(...lats) + 0.005,  // Add small margin
    south: Math.min(...lats) - 0.005,
    east: Math.max(...lngs) + 0.005,
    west: Math.min(...lngs) - 0.005
  },
  size: { width: 1000, height: 800 },
  padding: 40,
  markers: touristSpots.map((spot, index) => ({
    coordinate: { lat: spot.lat, lng: spot.lng },
    color: ['#FF0000', '#00FF00', '#0000FF', '#FF6600'][index],
    size: 'large',
    label: spot.name
  }))
});

const imageBuffer = await map.render();
fs.writeFileSync('tokyo-tourist-route.png', imageBuffer);

console.log(`Map covers area from zoom level: ${map.getCalculatedZoom()}`);
console.log(`Centered at: ${map.getCalculatedCenter().lat}, ${map.getCalculatedCenter().lng}`);
```

### Running the Examples

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run basic demo
node generate-image-now.js

# Run bounds demo
node bounds-demo.js

# Run zoom level test
node zoom-test.js
```

### Demo Files

- `generate-image-now.js` - Basic image generation demo
- `bounds-demo.js` - Bounds-based auto-calculation demo  
- `zoom-test.js` - Zoom level testing
- `demo-viewer.html` - Browser preview (no execution required)

## Tips

### Choosing Zoom Levels
- **0-2**: Continental/country level
- **3-6**: City/region level
- **7-12**: Urban area level  
- **13-16**: Neighborhood/building level
- **17-18**: Building detail level (maximum)

### Using Bounds vs Center/Zoom
- Use **bounds** when you want to ensure specific areas are visible
- Use **center/zoom** when you want precise control over the view
- Bounds automatically calculates the optimal zoom to fit the area

### Performance Tips
- Smaller image sizes render faster
- Lower zoom levels require fewer tiles
- Use appropriate padding with bounds to avoid edge cropping

## License

MIT