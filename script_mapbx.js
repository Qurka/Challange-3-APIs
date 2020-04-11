// Set api token for mapbox
mapboxgl.accessToken =
  "pk.eyJ1IjoicXVya2EiLCJhIjoiY2s4cjhnNnZ0MDBlaDNmcGw1Zmlzb2s2eCJ9.W_dyWeo-ul3pk4jqh5EYbQ";

// api token for openWeatherMap
var openWeatherMapUrl = "https://api.openweathermap.org/data/2.5/weather";
var openWeatherMapUrlApiKey = "98c0e0f9ae5e210e231891ab690aab1e";

// Determine cities
var cities = [
  {
    name: "Amsterdam",
    coordinates: [4.895168, 52.370216],
  },
  {
    name: "Rotterdam",
    coordinates: [4.47917, 51.9225],
  },
  {
    name: "Den Haag",
    coordinates: [4.3007, 52.0705],
  },
  {
    name: "Utrecht",
    coordinates: [5.1214, 52.0907],
  },
  {
    name: "Groningen",
    coordinates: [6.56667, 53.21917],
  },
  {
    name: "Eindhoven",
    coordinates: [5.4697, 51.4416],
  },
];

// Initiate map
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/qurka/ck8vpljop0tio1io321ujknk5",
  center: [4.3007, 52.0705],
  zoom: 12,
  pitch: 45,
  bearing: -17.6,
  container: "map",
  antialias: true,
});

map.on("load", function () {
  // Insert the layer beneath any symbol layer.
  var layers = map.getStyle().layers;

  var labelLayerId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === "symbol" && layers[i].layout["text-field"]) {
      labelLayerId = layers[i].id;
      break;
    }
  }

  map.addLayer(
    {
      id: "3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 15,
      paint: {
        "fill-extrusion-color": "#aaa",

        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "height"],
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "min_height"],
        ],
        "fill-extrusion-opacity": 0.6,
      },
    },
    labelLayerId
  );
});
// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Voeg de zoekbalk toe
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  }),
  "top-left"
);

// get weather data and plot on map
map.on("load", function () {
  cities.forEach(function (city) {
    // Usually you do not want to call an api multiple times, but in this case we have to
    // because the openWeatherMap API does not allow multiple lat lon coords in one request.
    var request =
      openWeatherMapUrl +
      "?" +
      "appid=" +
      openWeatherMapUrlApiKey +
      "&lon=" +
      city.coordinates[0] +
      "&lat=" +
      city.coordinates[1];

    // Get current weather based on cities' coordinates
    fetch(request)
      .then(function (response) {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then(function (response) {
        // Then plot the weather response + icon on MapBox
        console.log(response);
        plotImageOnMap(response.weather[0].icon, city);
      })
      .catch(function (error) {
        console.log("ERROR:", error);
      });
  });
});

function plotImageOnMap(icon, city) {
  map.loadImage("http://openweathermap.org/img/w/" + icon + ".png", function (
    error,
    image
  ) {
    if (error) throw error;
    map.addImage("weatherIcon_" + city.name, image);
    map.addSource("point_" + city.name, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: city.coordinates,
            },
          },
        ],
      },
    });
    map.addLayer({
      id: "points_" + city.name,
      type: "symbol",
      source: "point_" + city.name,
      layout: {
        "icon-image": "weatherIcon_" + city.name,
        "icon-size": 1.3,
      },
    });
  });
}

// // get weather data and plot on map
// map.on("load", function () {
//   cities.forEach(function (city) {
//     // Usually you do not want to call an api multiple times, but in this case we have to
//     // because the openWeatherMap API does not allow multiple lat lon coords in one request.
//     var request =
//       openWeatherMapUrl +
//       "?" +
//       "appid=" +
//       openWeatherMapUrlApiKey +
//       "&lon=" +
//       city.coordinates[0] +
//       "&lat=" +
//       city.coordinates[1] +
//       "&units=metric";

//     // Get current weather based on cities' coordinates
//     fetch(request)
//       .then(function (response) {
//         if (!response.ok) throw Error(response.statusText);
//         return response.json();
//       })
//       .then(function (response) {
//         var weatherBox = document.getElementById("weather");
//         var type = response.weather[0].description;
//         var placeName = response.name;
//         weatherBox.innerHTML =
//           placeName +
//           "</br>" +
//           type +
//           "</br>" +
//           "&#176;C" +
//           Math.floor(response.main.temp);
//       })
//       .catch(function (error) {
//         console.log("ERROR:", error);
//       });
//   });
// });

// Get current weather based on cities' coordinates
var request =
  openWeatherMapUrl +
  "?" +
  "appid=" +
  openWeatherMapUrlApiKey +
  "&lon=4.895168" +
  "&lat=52.370216" +
  "&units=metric";

fetch(request)
  .then(function (response) {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  })
  .then(function (response) {
    var weatherBox = document.getElementById("weather");
    var type = response.weather[0].description;
    var placeName = response.name;
    weatherBox.innerHTML =
      placeName +
      "</br>" +
      type +
      "</br>" +
      "&#176;C" +
      Math.floor(response.main.temp);
  })
  .catch(function (error) {
    console.log("ERROR:", error);
  });

// Get current weather based on cities' coordinates
var request =
  openWeatherMapUrl +
  "?" +
  "appid=" +
  openWeatherMapUrlApiKey +
  "&lon=4.47917" +
  "&lat=51.9225" +
  "&units=metric";

fetch(request)
  .then(function (response) {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  })
  .then(function (response) {
    var weatherBox = document.getElementById("weather1");
    var type = response.weather[0].description;
    var placeName = response.name;
    weatherBox.innerHTML =
      placeName +
      "</br>" +
      type +
      "</br>" +
      "&#176;C" +
      Math.floor(response.main.temp);
  })
  .catch(function (error) {
    console.log("ERROR:", error);
  });

// Get current weather based on cities' coordinates
var request =
  openWeatherMapUrl +
  "?" +
  "appid=" +
  openWeatherMapUrlApiKey +
  "&lon=4.3007" +
  "&lat=52.0705" +
  "&units=metric";

fetch(request)
  .then(function (response) {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  })
  .then(function (response) {
    var weatherBox = document.getElementById("weather2");
    var type = response.weather[0].description;
    var placeName = response.name;
    weatherBox.innerHTML =
      placeName +
      "</br>" +
      type +
      "</br>" +
      "&#176;C" +
      Math.floor(response.main.temp);
  })
  .catch(function (error) {
    console.log("ERROR:", error);
  });

// Get current weather based on cities' coordinates
var request =
  openWeatherMapUrl +
  "?" +
  "appid=" +
  openWeatherMapUrlApiKey +
  "&lon=5.1214" +
  "&lat=52.0907" +
  "&units=metric";

fetch(request)
  .then(function (response) {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  })
  .then(function (response) {
    var weatherBox = document.getElementById("weather3");
    var type = response.weather[0].description;
    var placeName = response.name;
    weatherBox.innerHTML =
      placeName +
      "</br>" +
      type +
      "</br>" +
      "&#176;C" +
      Math.floor(response.main.temp);
  })
  .catch(function (error) {
    console.log("ERROR:", error);
  });

6.56667, 53.21917;

5.4697, 51.4416;

// Get current weather based on cities' coordinates
var request =
  openWeatherMapUrl +
  "?" +
  "appid=" +
  openWeatherMapUrlApiKey +
  "&lon=6.56667" +
  "&lat=53.21917" +
  "&units=metric";

fetch(request)
  .then(function (response) {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  })
  .then(function (response) {
    var weatherBox = document.getElementById("weather4");
    var type = response.weather[0].description;
    var placeName = response.name;
    weatherBox.innerHTML =
      placeName +
      "</br>" +
      type +
      "</br>" +
      "&#176;C" +
      Math.floor(response.main.temp);
  })
  .catch(function (error) {
    console.log("ERROR:", error);
  });

// Get current weather based on cities' coordinates
var request =
  openWeatherMapUrl +
  "?" +
  "appid=" +
  openWeatherMapUrlApiKey +
  "&lon=5.4697" +
  "&lat=51.4416" +
  "&units=metric";

fetch(request)
  .then(function (response) {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  })
  .then(function (response) {
    var weatherBox = document.getElementById("weather5");
    var type = response.weather[0].description;
    var placeName = response.name;
    weatherBox.innerHTML =
      placeName +
      "</br>" +
      type +
      "</br>" +
      "&#176;C" +
      Math.floor(response.main.temp);
  })
  .catch(function (error) {
    console.log("ERROR:", error);
  });
