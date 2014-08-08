var mapboxId = 'examples.map-i86knfo3';
var mapboxUrl = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';
var mapboxLayer = L.tileLayer(mapboxUrl, {
  id: mapboxId,
  maxZoom: 18
});

var map = L.map('map', {
  center: [51.505, -0.09],
  zoom: 13,
  layers: [mapboxLayer],
  attributionControl: false
});

var imageUrl = './images/logo.png';
L.controllableImageOverlay(imageUrl).addTo(map);
