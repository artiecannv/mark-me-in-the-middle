const searchEl = $("#search");
const reviewEl = $("#reviews");
let locA = [];
let locB = [];
const searchBtn = $("#searchbtn");

mapboxgl.accessToken = `pk.eyJ1IjoicG9ya2Nob3BweSIsImEiOiJjbGFraWxzangwNm1rM29vNjBsdDUxaWpiIn0.269b_fLGrm2yTyU3RGPsRw`;

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
  enableHighAccuracy: true,
});

function successLocation(position) {
  console.log(position);
  setupMap([position.coords.longitude, position.coords.latitude]);
}

function errorLocation() {
  setupMap([-2.24, 53.48]);
}

function setupMap(center) {
  if (!mapboxgl.supported()) {
    alert("Your browser does not support Mapbox GL");
  }
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: center,
    zoom: 14,
    projection: "globe",
  });

  var directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    controls: {
      instructions: false,
      profileSwitcher: false
    }
  });

  map.addControl(directions, "top-left");

  directions.on("route", function (e) {
    locA = directions.getOrigin().geometry.coordinates;
    locB = directions.getDestination().geometry.coordinates;
    const point1 = turf.point(locA);
    const point2 = turf.point(locB);

    const midpoint = turf.midpoint(point1, point2);
    marker = new mapboxgl.Marker()
      .setLngLat(midpoint.geometry.coordinates)
      .addTo(map);
  });
}

// function searchManager(event) {
//     event.preventDefault();
//     const locAVal = locA.val();
//     const locationAUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${locAVal}.json?access_token=${mapKey}`;
//     const locBVal = locB.val();
//     const locationBUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${locBVal}.json?access_token=${mapKey}`;
//     async function getLocationA() {
//       const response = await fetch(locationAUrl);
//       const data = await response.json();
//       console.log(data);
//     }
//     getLocationA();
//     async function getLocationB() {
//       const response = await fetch(locationBUrl);
//       const data = await response.json();
//       console.log(data);
//     }
//     getLocationB();
//   }
// }

//searchBtn.on("click", searchManager);
