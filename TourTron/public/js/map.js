import 'ol/ol.css';
import { Map, View, Overlay } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

export const displayMap = (locations) => {
  if (!locations || !locations.length) return; // Handle no locations

  // Create a new OpenLayers map
  const map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: fromLonLat([-80.128473, 25.781842]),
      zoom: 10,
    }),
  });

  // Add markers to the map
  locations.forEach((loc) => {
    const marker = document.createElement('div');
    marker.className = 'marker';
    // Optional: Add content if needed
    marker.innerHTML = '<span>📍</span>';

    new Overlay({
      position: fromLonLat([loc.coordinates[0], loc.coordinates[1]]),
      element: marker,
      offset: [0, -30],
    }).setMap(map);
  });
};
