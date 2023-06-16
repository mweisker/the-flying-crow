
let mapOptions = {
  // center: [47.252876, -122.444290],
  // zoom: 13
  center: [0, 0],
  zoom: 2
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
    console.log(_pointA)
    markerA = L.marker(_pointA).addTo(map);
  } else if (!_pointB) {

    _pointB = e.latlng;
    markerB = L.marker(_pointB).addTo(map);

    _polyline = L.polyline([_pointA, _pointB], {
      color: "red"
    }).addTo(map);

    console.log(_pointA);
    console.log(_pointB);

    let length = map.distance(_pointA, _pointB);
    console.log(length);
    document.getElementById('length').innerHTML = meterToKm(length);
    document.getElementById('result').style.opacity = '1';
  } else {

    if(_polyline) {
      map.removeLayer(_polyline);
      _polyline = null;
    }
    _pointA = e.latlng;
    console.log(_pointA);

    map.removeLayer(markerA);
    map.removeLayer(markerB);

    _pointB = null;

    markerA = L.marker(_pointA).addTo(map)



  }
})

const meterToKm = (meter) => {
  const rounded = Math.round(meter / 10) * 10;
  return rounded / 1000;
}

const getDistance = document.getElementById('getDistance');
let beginLat = document.getElementById('beginLat');
let beginLng = document.getElementById('beginLng');
let endLat = document.getElementById('endLat');
let endLng = document.getElementById('endLng');



const handleSubmit = (e) => {
  e.preventDefault();

  if (_polyline) {
    map.removeLayer(_polyline);
    _polyline = null;
  }
  if (markerA) map.removeLayer(markerA);
  if (markerB) map.removeLayer(markerB);


  const coordinates = [{lat: null, lng: null}, {lat: null, lng: null}]

  if (beginLat.value && beginLng.value && endLat.value && endLng.value) {
    coordinates[0].lat = beginLat.value;
    coordinates[0].lng = beginLng.value;
    coordinates[1].lat = endLat.value;
    coordinates[1].lng = endLng.value;
  }

  console.log(coordinates);

  _pointA = coordinates[0];
  _pointB = coordinates[1];

  markerA = L.marker(_pointA).addTo(map);
  markerB = L.marker(_pointB).addTo(map);



  _polyline = L.polyline([_pointA, _pointB], {
    color: "red"
  }).addTo(map)

  let length = map.distance(_pointA, _pointB);
  const kmLength = meterToKm(length);
  document.getElementById('length').innerHTML = kmLength;

  const newZoom = findNewZoom(kmLength)


  const newLat = (Number(coordinates[0].lat) + Number(coordinates[1].lat)) / 2;
  const newLng = (Number(coordinates[0].lng) + Number(coordinates[1].lng)) / 2;


  map.setView([newLat, newLng], newZoom)

  document.getElementById('result').style.opacity = '1';


}

const findNewZoom = (length) => {
  if (length > 6800) return 2;
  if (length > 3500) return 3;
  if (length > 800) return 4;
  if (length > 200) return 6;
  if (length > 50) return 8;
  else return 10;
}

endLng.addEventListener('keyPress', function (e) {
  if (e.key === 'Enter') handleSubmit(e);
})