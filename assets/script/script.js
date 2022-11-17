const searchEl = $("#search")
const reviewEl = $("#reviews")
const locA = $("#locA")
const locB = $("#locB")
const searchBtn = $("#search")
const mapKey = "pk.eyJ1IjoicG9ya2Nob3BweSIsImEiOiJjbGFraWxzangwNm1rM29vNjBsdDUxaWpiIn0.269b_fLGrm2yTyU3RGPsRw";//mapbox public key
let locationA = locA.val();


  async function searchManager(){
    const response = await fetch();
    const data = await response.json();
    console.log(data);
  }

  searchBtn.on("click", searchManager)