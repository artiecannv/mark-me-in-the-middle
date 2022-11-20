const searchEl = $("#search");
const reviewEl = $("#reviews");
const locA = $("locA")
const locB = $("#locB");
const searchBtn = $("#searchbtn");

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg";

const mapKey =
  "pk.eyJ1IjoicG9ya2Nob3BweSIsImEiOiJjbGFraWxzangwNm1rM29vNjBsdDUxaWpiIn0.269b_fLGrm2yTyU3RGPsRw"; //mapbox public key

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


mapboxgl.accessToken =
  "pk.eyJ1IjoicG9ya2Nob3BweSIsImEiOiJjbGFraWxzangwNm1rM29vNjBsdDUxaWpiIn0.269b_fLGrm2yTyU3RGPsRw";
function setupMap(center) {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: center,
    zoom: 14,
    projection: "globe",
  });
  // var point1 = turf.point([locA.coords]);
  // var point2 = turf.point([locB.coords]);

  // var midpoint = turf.midpoint(point1, point2);
  // const nav = new mapboxgl.NavigationControl();
  // map.addControl(nav, "top-right");

  var directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
   
  });

  map.addControl(directions, "top-left");

  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: {
      color: "orange",
    },
    mapboxgl: mapboxgl,
  });
console.log(locA);
  map.addControl(geocoder);
  console.log(data)
}
setupMap();

if (!mapboxgl.supported()) {
  alert("Your browser does not support Mapbox GL");
} else {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [-74.5, 40],
    zoom: 9,
  });

  function searchManager(event) {
    event.preventDefault();
    const locAVal = locA.val();
    const locationAUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${locAVal}.json?access_token=${mapKey}`;
    const locBVal = locB.val();
    const locationBUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${locBVal}.json?access_token=${mapKey}`;

    async function getLocationA() {
      const response = await fetch(locationAUrl);
      const data = await response.json();
      console.log(data);
    }
    getLocationA();

    async function getLocationB() {
      const response = await fetch(locationBUrl);
      const data = await response.json();
      console.log(data);
    }
    getLocationB();
  }
}
searchBtn.on("click", searchManager);
