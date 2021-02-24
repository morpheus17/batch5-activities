let map;
let service;
let infowindow;

function initMap() {
  const manila = new google.maps.LatLng(14.5964879, 120.9095193);
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: manila,
    zoom: 16,
  });

  /*
  
  Location functionality
  
  */ 

  const locationButton = document.createElement("button");
  locationButton.textContent = "Center to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infowindow.setPosition(pos);
          infowindow.setContent("Your Current Location");
          infowindow.open(map);
          map.setCenter(pos);
          map.setZoom(16);
          // console.log(position.coords.latitude+","+position.coords.longitude);
        },
        () => {
          handleLocationError(true, infowindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infowindow, map.getCenter());
    }
  });

}

let MapMarkers = [];

let TestCenters = [];

function TestCenter(number="",region="",province="",MunOrCity="",name="",ownersType="",testingType="",contact="",license="",
                lat=0,lng=0,pcr_cost=-1,antigen_cost=-1,payment_modes="",results_available_pcr="",results_available_antigen="",how_to_avail="",info=""){
  this.number=number;
  this.region=region;
  this.province=province;
  this.MunOrCity=MunOrCity;
  this.name=name;
  this.ownersType=ownersType;
  this.testingType=testingType;
  this.contact=contact;
  this.license=license;
  this.lat=lat;
  this.lng=lng;
  this.pcr_cost=pcr_cost;
  this.antigen_cost=antigen_cost;
  this.payment_modes=payment_modes;
  this.results_available_pcr=results_available_pcr;
  this.results_available_antigen=results_available_antigen;
  this.how_to_avail=how_to_avail;
  this.info=info;
}



//Get DOH licensed testing centers sheet

let myPromise = new Promise(function(myResolve, myReject) {
  let req = new XMLHttpRequest();
  
  req.open('GET', "https://docs.google.com/spreadsheets/d/e/2PACX-1vQcV9VNy4QeKxwgxqIWu5VEp9C_BNMR_F9_GILC2xlL9m5IPgnIcTYllubiR0SfMzqerucpN4Bgo-S1/pubhtml?gid=1065758412&single=true");
  req.onload = function() {
    if (req.status == 200) {

      myResolve(addTestCenter(this));
    } else {
      myReject("File not Found");
    }
  };
  req.responseType = "document";
  req.send();
});

myPromise.then(
  function(value) {console.log("promise done");},
  function(error) {myDisplayer(error);}
);

function addTestCenter(xml){
  let xmlDoc = xml.response;
  let tbody = xmlDoc.getElementsByTagName("TBODY")[0];
  
  //console.log(tbody.getElementsByTagName("TR").length);
  for(i=3;i<tbody.getElementsByTagName("TR").length;i++){
    let tr = tbody.getElementsByTagName("TR")[i];
    let td0 = tr.getElementsByTagName("TD")[0].innerHTML;
    let td1 = tr.getElementsByTagName("TD")[1].innerHTML;
    let td2 = tr.getElementsByTagName("TD")[2].innerHTML;
    let td3 = tr.getElementsByTagName("TD")[3].innerHTML;
    let td4 = tr.getElementsByTagName("TD")[4].innerHTML;
    let td5 = tr.getElementsByTagName("TD")[5].innerHTML;
    let td6 = tr.getElementsByTagName("TD")[6].innerHTML;
    let td7 = tr.getElementsByTagName("TD")[7].innerHTML;
    let td8 = tr.getElementsByTagName("TD")[8].innerHTML;

    let TestCenterObj = new TestCenter(td0,td1,td2,td3,td4,td5,td6,td7,td8);
    TestCenters.push(TestCenterObj);  
  }

  // fetch testing centers lat, lng, pcr_cost, antigen_cost, results_available, info from list.xml

  let xmlhttp;
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString( xmlhttp.response, "text/xml");
      console.log(xmlDoc);
      // console.log(xmlDoc.getElementsByTagName("number").length);
      let i=0;
      for (TestCenterObj of TestCenters){
        if(TestCenterObj.name.trim().includes(xmlDoc.getElementsByTagName("name")[i].innerHTML.trim())){
          
          TestCenterObj.number=xmlDoc.getElementsByTagName("number")[i].innerHTML;
          TestCenterObj.name=xmlDoc.getElementsByTagName("name")[i].innerHTML;
          TestCenterObj.lat=parseFloat(xmlDoc.getElementsByTagName("lat")[i].innerHTML);
          TestCenterObj.lng=parseFloat(xmlDoc.getElementsByTagName("lng")[i].innerHTML);
          TestCenterObj.pcr_cost=parseInt(xmlDoc.getElementsByTagName("pcr_cost")[i].innerHTML.replace(",","").replace(".",""));
          TestCenterObj.antigen_cost=parseInt(xmlDoc.getElementsByTagName("antigen_cost")[i].innerHTML.replace(",","").replace(".",""));
          TestCenterObj.payment_modes=xmlDoc.getElementsByTagName("payment_modes")[i].innerHTML;
          TestCenterObj.results_available_pcr=xmlDoc.getElementsByTagName("results_available_pcr")[i].innerHTML;
          TestCenterObj.results_available_antigen=xmlDoc.getElementsByTagName("results_available_antigen")[i].innerHTML;
          TestCenterObj.how_to_avail=xmlDoc.getElementsByTagName("how_to_avail")[i].innerHTML;
          TestCenterObj.info=xmlDoc.getElementsByTagName("info")[i].innerHTML;
          i++;
        }else{
          console.log("skipping DOH data "+TestCenterObj.number+" "+TestCenterObj.name+" coordinates not set");
          console.log(i+" "+xmlDoc.getElementsByTagName("name")[i].innerHTML+" "+xmlDoc.getElementsByTagName("number")[i].innerHTML);
          // console.log("coordinates not set");

        }
      }

      showAllMarkers();

      const request = {
        query: "Manila City Hall",
        fields: ["name", "geometry"],
      };
      service = new google.maps.places.PlacesService(map);
      service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          // for (let i = 0; i < results.length; i++) {
          //   createMarker(results[i]);
          // }
          // console.log((JSON.stringify(results[0].geometry.location)));
          // console.log(typeof(results[0].geometry.location.lat));
          // console.log(results[0].geometry.location["lng"]);
          map.setCenter(results[0].geometry.location);
        }
      });
    }
  };
  xmlhttp.open("GET", "https://raw.githubusercontent.com/morpheus17/batch5-activities/main/Covid/list.xml");
  xmlhttp.responseType = "";
  xmlhttp.send();
  
}


function createMarker(TestObj) {
  // console.log(TestObj.lat+" "+TestObj.lng);

  let coordinates={
    lat:TestObj.lat,
    lng:TestObj.lng
  }

  if(TestObj.lat!==0 && TestObj.lng!==0){
    // console.log(coordinates);
    const marker = new google.maps.Marker({
      map: map,
      position: coordinates,
    });

    const contentString =
          '<div id="content">' +
          '<div id="siteNotice">' +
          "</div>" +
          '<h3 id="firstHeading" class="firstHeading">'+TestObj.name+'</h3>' +
          '<div id="bodyContent">' +
          '<ul>' +
          '<li>' + '<h5 style="display:inline;">Region:  </h5>' + TestObj.region +'</li>' +
          '<li>' + '<h5 style="display:inline;">Province:  </h5>' + TestObj.province +'</li>' +
          '<li>' + '<h5 style="display:inline;">Municipality Or City:  </h5>' + TestObj.MunOrCity +'</li>' +
          '<li>' + '<h5 style="display:inline;">Contact:  </h5>' + TestObj.contact +'</li>' +
          '<li>' + '<h5 style="display:inline;">Swab test price:  </h5>' + TestObj.pcr_cost +'</li>' +
          '<li>' + '<h5 style="display:inline;">Antigen test price:  </h5>' + TestObj.antigen_cost +'</li>' +
          '<li>' + '<h5 style="display:inline;">Payment modes:  </h5>' + TestObj.payment_modes +'</li>' +
          '<li>' + '<h5 style="display:inline;">Results available (PCR):  </h5>' + TestObj.results_available_pcr +'</li>' +
          '<li>' + '<h5 style="display:inline;">Results available (antigen):  </h5>' + TestObj.results_available_antigen +'</li>' +
          '<li>' + '<h5 style="display:inline;">How to avail:  </h5>' + TestObj.how_to_avail +'</li>' +
          '<li>' + '<h5 style="display:inline;">Other info:  </h5>' + TestObj.info +'</li>' +
          '</ul>' +
          "</div>" +
          "</div>";

    google.maps.event.addListener(marker, "click", () => {
      // infowindow.setContent(TestObj.name || "");
      infowindow.setContent(contentString);
      infowindow.open(map,marker);
      
      map.setCenter(coordinates);
    });

    MapMarkers.push(marker);
    map.setCenter(coordinates);
  }
}

// Sets the map on all markers in the array.
function showAllMarkers(){
  //create map marker for all test centers
  deleteMarkers();
  for(i of TestCenters){
    // console.log(i.number);
    createMarker(i);
    
  }
}

function showMarkersRegion(region){
  deleteMarkers();
  for(i of TestCenters){
    if(i.region===region){
      // console.log(i.name);
      createMarker(i);
      map.setZoom(10);
    }
  }
}

function showMarkerSingle(name){
  deleteMarkers();
  for(i of TestCenters){
    if(i.name===name){
      // console.log(i.name);
      createMarker(i);
      map.setZoom(14);
    }
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  for (i of MapMarkers) {
    i.setMap(null);
    
  }
}


// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  MapMarkers = [];
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infowindow.setPosition(pos);
  infowindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infowindow.open(map);
}

function showOnlyMenu(menu_elem){
    for(i of document.querySelector(".row").children){
      document.getElementById("map").style.display = "none";
      document.getElementById("search").style.display = "none";
      document.getElementById("contacts").style.display = "none";
      document.getElementById("about").style.display = "none";
    }
    
    document.getElementById(menu_elem).style.display = "block";
}

function showCards(){
  for(i of TestCenters){
    document.getElementById("search_content").innerHTML += 
    '<div class="card w-75" style="border:1px solid gray;padding:5px;">'+
    '<div class="card-body">'+
    '<h3 class="card-title">'+i.name+'</h3>'+
    '<p class="card-text">'+'<strong>Region: </strong>'+i.region+'</p>'+
    '<p class="card-text">'+'<strong>Municipality or City: </strong>'+i.MunOrCity+'</p>'+
    '<p class="card-text">'+'<strong>Swab test cost: </strong>'+i.pcr_cost+'</p>'+
    '<p class="card-text">'+'<strong>Antigen test cost: </strong>'+i.antigen_cost+'</p>'+
    "<a href='#' class='btn btn-primary' onclick='showOnlyMenu(&quot;map&quot;); showMarkerSingle(&quot;"+i.name+"&quot;);return false;'>Go to Location</a>"+
    '</div>'+
    '</div>';
  }
}

function realtimeSearch(){
  // var input, filter, ul, li, a, i;
  // input = document.getElementById("mySearch");
  // filter = input.value.toUpperCase();
  // ul = document.getElementById("myMenu");
  // li = ul.getElementsByTagName("li");
  // for (i = 0; i < li.length; i++) {
  //   a = li[i].getElementsByTagName("a")[0];
  //   if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
  //     li[i].style.display = "";
  //   } else {
  //     li[i].style.display = "none";
  //   }
  // }

  var input, filter, ul, li, a, i;
  input = document.getElementById("mySearch");
  filter = input.value.toUpperCase();

  for (i of document.getElementsByClassName("card-body")) {
    a = i.getElementsByTagName("h3")[0];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
      i.parentNode.style.display = "";
    } else {
      i.parentNode.style.display = "none";
    }
  }

}



function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}