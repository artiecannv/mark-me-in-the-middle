const searchEl = $("#search");
const reviewEl = $("#reviews");
const locA = $("#locA");
const locB = $("#locB");
const searchBtn = $("#searchbtn");
const mapKey =
  "pk.eyJ1IjoicG9ya2Nob3BweSIsImEiOiJjbGFraWxzangwNm1rM29vNjBsdDUxaWpiIn0.269b_fLGrm2yTyU3RGPsRw"; //mapbox public key




  navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true
  })

  function successLocation(position){
    console.log(position)
    setupMap([position.coords.longitude, position.coords.latitude]);
  }


    function errorLocation(){
      setupMap([-2.24, 53.48])
    }
mapboxgl.accessToken =
  "pk.eyJ1IjoicG9ya2Nob3BweSIsImEiOiJjbGFraWxzangwNm1rM29vNjBsdDUxaWpiIn0.269b_fLGrm2yTyU3RGPsRw";
function setupMap(center){
  const map = new mapboxgl.Map({
    container: "map", 
    style: "mapbox://styles/mapbox/streets-v11", 
    center: [-74.5, 40], 
    zoom: 14, 
    projection: "globe", 
  })

  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav, "top-right");

  var directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
  });
  
  map.addControl(directions, 'top-left');
}
setupMap()

  

function searchManager(event) {
  event.preventDefault()
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

searchBtn.on("click", searchManager);
