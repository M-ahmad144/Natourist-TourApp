import 'ol/ol.css';
import { Map, View, Overlay } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { boundingExtent } from 'ol/extent';

// Function to display the map with locations
export const displayMap = (locations) => {
  if (!locations || !locations.length) return; // Handle no locations

  // Convert locations to OpenLayers format
  const coordinates = locations.map((loc) =>
    fromLonLat([loc.coordinates[0], loc.coordinates[1]]),
  );

  // Calculate the extent (bounding box) of the coordinates
  const extent = boundingExtent(coordinates);

  // Create a new OpenLayers map
  const map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: fromLonLat([-80.128473, 25.781842]), // Default center if needed
      zoom: 10, // Default zoom level
    }),
  });

  // Adjust the view to fit the extent with some padding
  map.getView().fit(extent, { padding: [50, 50, 50, 50] });

  // Add markers to the map
  locations.forEach((loc) => {
    const marker = document.createElement('div');
    marker.className = 'marker';
    marker.innerHTML = '<span>📍</span>';


    new Overlay({
      position: fromLonLat([loc.coordinates[0], loc.coordinates[1]]),
      element: marker,
      offset: [0, -30],
    }).setMap(map);
  });
};