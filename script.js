var landingLocation = [
  {
    name: "Amsterdam",
    location: { lat: 52.3667, lng: 4.8945 },
    ranking: 3,
  },
  {
    name: "Rotterdam",
    location: { lat: 51.9244, lng: 4.4777 },
    ranking: 4,
  },
  {
    name: "Den Haag",
    location: { lat: 52.0705, lng: 4.3007 },
    ranking: 5,
  },
  {
    name: "Utrecht",
    location: { lat: 52.0907, lng: 5.1214 },
    ranking: 2,
  },
  {
    name: "Eindhoven",
    location: { lat: 51.4416, lng: 5.4697 },
    ranking: 1,
  },
];

// var icons = [
//   "images/thumbsDown.png",
//   "images/thumbsUp.png",
//   "images/ribbon.png",
//   "images/medal.png",
//   "images/fancyMedal.png",
//   "images/trophy.png",
// ];

function initMap() {
  // map styles
  var mapStyles = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];

  //map options
  var mapOptions = {
    zoom: 8,
    center: { lat: 52.0705, lng: 4.3007 },
  };

  // new map
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  for (i = 0; i < landingLocation.length; i++) {
    addMarker(landingLocation[i]);
  }

  // add marker function
  function addMarker(landing) {
    var marker = new google.maps.Marker({
      position: landing.location,
      map: map,
      title: landing.name + " " + landing.ranking + "/5",
      // icon: icons[landing.ranking],
    });
    console.log(landing.name + " added to map");
  }
}
