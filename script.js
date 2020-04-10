// mapbox map
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-74.5, 40],
  zoom: 9,
});

// google maps
// var landingLocation = [
//   {
//     name: "Amsterdam",
//     location: { lat: 52.3667, lng: 4.8945 },
//     ranking: 2,
//   },
//   {
//     name: "Rotterdam",
//     location: { lat: 51.9244, lng: 4.4777 },
//     ranking: 4,
//   },
//   {
//     name: "Den Haag",
//     location: { lat: 52.0705, lng: 4.3007 },
//     ranking: 5,
//   },
//   {
//     name: "Utrecht",
//     location: { lat: 52.0907, lng: 5.1214 },
//     ranking: 3,
//   },
//   {
//     name: "Eindhoven",
//     location: { lat: 51.4416, lng: 5.4697 },
//     ranking: 1,
//   },
// ];

// var icons = [
//   "images/thumbsDown.png",
//   "images/thumbsUp.png",
//   "images/ribbon.png",
//   "images/medal.png",
//   "images/fancyMedal.png",
//   "images/trophy.png",
// ];

// function initMap() {
//   // map styles
//   var mapStyles = [
//     {
//       featureType: "poi",
//       elementType: "labels",
//       stylers: [{ visibility: "off" }],
//     },
//   ];

//   //map options
//   var mapOptions = {
//     zoom: 8,
//     center: { lat: 52.0705, lng: 4.3007 },
//   };

//   // new map
//   var map = new google.maps.Map(document.getElementById("map"), mapOptions);
//   for (i = 0; i < landingLocation.length; i++) {
//     addMarker(landingLocation[i]);
//   }

//   // add marker function
//   function addMarker(landing) {
//     var marker = new google.maps.Marker({
//       position: landing.location,
//       map: map,
//       title: landing.name + " " + landing.ranking + "/5",
//       // icon: icons[landing.ranking],
//     });
//     console.log(landing.name + " added to map");
//   }
// }

function getAPIdata() {
  // get current weather //&units=metric = IN CELSIUS
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=52.0705&lon=4.3007&appid=98c0e0f9ae5e210e231891ab690aab1e"
  )
    // parse to JSON format
    .then(function (response) {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    })

    // render weather per day
    .then(function (response) {
      // render weatherCondition
      console.log(response);
      onAPISucces(response);
    })

    // catch error
    .catch(function (error) {
      onAPIError(error);
    });
}

function onAPISucces(response) {
  // get type of weather in string format
  var type = response.weather[0].description;

  // get temperature in Celcius
  var degC = Math.floor(response.main.temp - 273.15);

  // render weather in DOM
  var weatherBox = document.getElementById("weather");
  weatherBox.innerHTML = degC + "&#176;C <br>" + type;
}

function onAPIError(error) {
  console.error("Request failed", error);
  var weatherBox = document.getElementById("weather");
  weatherBox.className = "hidden";
}

// init data stream
getAPIdata();
