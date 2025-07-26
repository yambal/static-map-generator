const { StaticMap } = require('../dist/index');
const fs = require('fs');

async function generateMap() {
  const map = new StaticMap({
    center: { lat: 35.6762, lng: 139.6503 }, // Tokyo
    zoom: 12,
    size: { width: 800, height: 600 },
    format: 'png',
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

  try {
    const imageBuffer = await map.render();
    fs.writeFileSync('tokyo_map.png', imageBuffer);
    console.log('Map generated successfully: tokyo_map.png');
  } catch (error) {
    console.error('Error generating map:', error);
  }
}

generateMap();