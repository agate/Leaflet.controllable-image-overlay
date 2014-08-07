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

var bounds = map.getBounds();
var ne = map.latLngToLayerPoint(bounds.getNorthEast());
var sw = map.latLngToLayerPoint(bounds.getSouthWest());
var width = ne.x - sw.x;
var height = sw.y - ne.y;

var tr = map.layerPointToLatLng(L.point(3 / 4 * width, 1 / 4 * height)),
    bl = map.layerPointToLatLng(L.point(1 / 4 * width, 3 / 4 * height));


function getImageInfo (imgUrl, callback) {
  var img = new Image();
  img.src = imgUrl;
  img.onload = function () {
    callback({
      width: img.width,
      height: img.height
    });
  }
}


var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
    imageBounds = [bl, tr];

getImageInfo(imageUrl, function (info) {
});

L.imageOverlay(imageUrl, imageBounds).addTo(map);

var imageControl = new L.control.image();
imageControl.addTo(map);
