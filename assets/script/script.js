//global variables
const searchEl = $("#search");
const reviewEl = $("#reviews");
const pastEl = $("#pastsearches");
let locA = [];
let locB = [];
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
  console.log(position);
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
    const fourURL = `https://api.foursquare.com/v3/places/nearby?ll=${lat}${space}${lng}`;

    marker = new mapboxgl.Marker()
      .setLngLat(midpoint.geometry.coordinates)
      .addTo(map);

    // if (midpoint.geometry.type === 'Point') {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'fsq3oS7mve89jEM85Pb6sm0CO/tlhFcvxCt0DJYiG1icqUQ=',
      }
    }

    //setting up function for the data obtained through foursquare api
    async function fourSquare() {
      const response = await fetch(fourURL, options);
      const data = await response.json();
      cardRenderer(data);
      console.log(data);
      coords.push(data.results[0].location[0]);
      geoStorage.push(coords);
      localStorage.setItem("middle", JSON.stringify(geoStorage));
    }
    //calling function
    fourSquare()
    async function cardRenderer(places) {
      const reviewsContainer = document.getElementById('reviews')
      const createCard = (placeName, address) => {
        
        console.log(placeName);
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card');
        const nameEl = document.createElement('h1');
        nameEl.textContent = placeName;
        const addressEl = document.createElement('p');
        addressEl.textContent = address;
        cardContainer.appendChild(nameEl);
        cardContainer.appendChild(addressEl);
        return cardContainer;
      };
      const cardList = document.getElementById('card-list');
      for (let i = 0; i < places.results.length; i++) {
        let place = places.results[i];
        let address = place?.location?.formatted_address;
        let placeName = place?.name;
        let placeCard = createCard(placeName, address);
        // reviewsContainer.appendChild(placeCard);
        cardList.appendChild(placeCard);
      };
      
    };
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


function pastSearch() {
  geoStorage.forEach(function (file) {
    const pastButtons = $("<button>");
  });
}

//searchBtn.on("click", searchManager);
