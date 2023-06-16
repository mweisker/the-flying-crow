
let mapOptions = {
  center: [47.252876, -122.444290],
  zoom: 13
};

let map = L.map('map', mapOptions);
let layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

map.addLayer(layer);

let _pointA,
    _pointB,
    _polyline,
    markerA= null,
    markerB = null;

map.on('click', (e) => {
   
  if (!_pointA) {
    _pointA = e.latlng;
    markerA = L.marker(_pointA).addTo(map);
  } else if (!_pointB) {

    _pointB = e.latlng;
    markerB = L.marker(_pointB).addTo(map);

    _polyline = L.polyline([_pointA, _pointB], {
      color: "red"
    }).addTo(map);

    let length = map.distance(_pointA, _pointB);
    document.getElementById('length').innerHTML = length;
  } else {

    if(_polyline) {
      map.removeLayer(_polyline);
      _polyline = null;
    }
    _pointA = e.latlng;

    map.removeLayer(markerA);
    map.removeLayer(markerB);

    _pointB = null;

    markerA = L.marker(_pointA).addTo(map)
  }
})