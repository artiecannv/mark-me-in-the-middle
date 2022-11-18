const searchEl = $("#search");
const reviewEl = $("#reviews");
const locA = $("#locA");
const locB = $("#locB");
const searchBtn = $("#searchbtn");
const mapKey =
  "pk.eyJ1IjoicG9ya2Nob3BweSIsImEiOiJjbGFraWxzangwNm1rM29vNjBsdDUxaWpiIn0.269b_fLGrm2yTyU3RGPsRw"; //mapbox public key

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
