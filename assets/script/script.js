//global variables
const pastBtnEl = $("#pastbtn");
const reviewsContainer = $("#reviews");
const pastEl = $("#pastsearches");
const mapEl = $("#map");
let locA = [];
let locB = [];
let fourUrl = "";
let coords = "";
const searchBtn = $("#searchbtn");
const geoStorage = JSON.parse(localStorage.getItem("middle")) || [];
//access token from mapbox.com
mapboxgl.accessToken = `pk.eyJ1IjoicG9ya2Nob3BweSIsImEiOiJjbGFraWxzangwNm1rM29vNjBsdDUxaWpiIn0.269b_fLGrm2yTyU3RGPsRw`;

//mapbox parameters for successful search of location and high accuracy (within 50 ft)
navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
  enableHighAccuracy: true,
});

//setting up our map with latitude and longitude values from a successful search
function successLocation(position) {
  setupMap([position.coords.longitude, position.coords.latitude]);
}

//if search is unsuccessful, sets a default location on map
function errorLocation() {
  setupMap([-2.24, 53.48]);
}

//alert message if mapbox is not supported by browser
function setupMap(center) {
  if (!mapboxgl.supported()) {
    alert("Your browser does not support Mapbox GL");
  }

  //setting up map with parameters from mapbox.com
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: center,
    zoom: 14,
    projection: "globe",
  });
  const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    controls: {
      instructions: false,
      profileSwitcher: false,
    },
    interactive: false,
  });

  //placement of direction control box
  map.addControl(directions, "top-left");

  //outlining what happens when information is input into direction control box
  directions.on("route", function (e) {
    locA = directions.getOrigin().geometry.coordinates;
    locB = directions.getDestination().geometry.coordinates;
    const point1 = turf.point(locA);
    const point2 = turf.point(locB);

    //obtaining midpoint between location A and location B and placing marker on map
    const midpoint = turf.midpoint(point1, point2);
    const space = "%2C";
    const coords = midpoint.geometry.coordinates;
    let lat = coords[1];
    let lng = coords[0];
    fourUrl = `https://api.foursquare.com/v3/places/nearby?ll=${lat}${space}${lng}`;
    marker = new mapboxgl.Marker()
      .setLngLat(midpoint.geometry.coordinates)
      .addTo(map);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "fsq3oS7mve89jEM85Pb6sm0CO/tlhFcvxCt0DJYiG1icqUQ=",
      },
    };

    //Calls FourSquare and returns the locations around the specified middle point
    async function fourSquare() {
      const response = await fetch(fourUrl, options);
      const data = await response.json();
      try {
        cardRenderer(data);
        coords.push(data.results[0].name);
        geoStorage.push(coords);
        localStorage.setItem("middle", JSON.stringify(geoStorage));
      }
      catch (error) {
        console.error(error);
      }
      //Creates elements with the businesses that are nearby the location given in Lat/Lon coordinates
      async function cardRenderer(places) {
        try {
          const createCard = (placeName, address) => {
            const cardContainer = document.createElement("div");
            cardContainer.classList.add(
              "card",
              "border",
              "border-danger",
              "border-4",
              "rounded",
              "fs-5",
            );
            cardContainer.style.backgroundColor = "#ad803d";
            const nameEl = document.createElement("h1");
            nameEl.textContent = placeName;
            nameEl.classList.add("card-title");
            nameEl.style.backgroundColor = "#ad803d";
            const addressEl = document.createElement("p");
            addressEl.textContent = address;
            addressEl.classList.add("card-text");
            addressEl.style.backgroundColor = "#ad803d";
            cardContainer.appendChild(nameEl);
            cardContainer.appendChild(addressEl);
            return cardContainer;
          };
          const cardList = document.getElementById("card-list");
          cardList.innerHTML = "";
          for (let i = 0; i < places.results.length; i++) {
            let place = places.results[i];
            let address = place?.location?.formatted_address;
            let placeName = place?.name;
            let placeCard = createCard(placeName, address);
            cardList.appendChild(placeCard);
          }
        }
        catch (error) {
            console.error(error);
          }
        }
    }
      fourSquare();
    });
}
// Stores and updates the the previous search results in localStorage
function pastSearch() {
  const pastList = $("<ul>");
  geoStorage.forEach(function (file) {
    const pastPlace = $("<li>");
    pastPlace.text(file[2]);
    pastPlace.addClass("pastCards");
    pastPlace.appendTo(pastList);
  });
  pastList.appendTo(pastEl);
}

pastBtnEl.one("click", pastSearch);
