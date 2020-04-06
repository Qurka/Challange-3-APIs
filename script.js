function initMap() {
  //map options
  var options = {
    zoom: 11,
    center: { lat: 52.0705, lng: 4.3007 },
  };
  // new map
  var map = new google.maps.Map(document.getElementById("map"), options);

  //add marker
  var marker = new google.maps.Marker({
    position: { lat: 52.0247, lng: 4.2741 },
    map: map,
  });
}
