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
  function(value) {console.log("promise done");addMarkers();},
  function(error) {myDisplayer(error);}
);

let TestCenters = [];

function TestCenter(number,region,province,MunOrCity,name,ownersType,testingType,contact,license,lat=0,lng=0,pcr_cost=-1,antigen_cost=-1,results_available="",info=""){
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
  this.results_available=results_available;
  this.info=info;
}


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
  xmlhttp.open("GET", "list.xml", false);
  xmlhttp.send();
  xmlDoc = xmlhttp.responseXML;

  for (i=0;i<TestCenters.length;i++){
    TestCenters[i].pcr_cost=xmlDoc.getElementsByTagName("pcr_cost")[i].childNodes[0].nodeValue;
    TestCenters[i].antigen_cost=xmlDoc.getElementsByTagName("antigen_cost")[i].childNodes[0].nodeValue;
    TestCenters[i].payment_modes=xmlDoc.getElementsByTagName("payment_modes")[i].childNodes[0].nodeValue;
    TestCenters[i].results_available_pcr=xmlDoc.getElementsByTagName("results_available_pcr")[i].childNodes[0].nodeValue;
    TestCenters[i].results_available_antigen=xmlDoc.getElementsByTagName("results_available_antigen")[i].childNodes[0].nodeValue;
    TestCenters[i].how_to_avail=xmlDoc.getElementsByTagName("how_to_avail")[i].childNodes[0].nodeValue;
    TestCenters[i].info=xmlDoc.getElementsByTagName("info")[i].childNodes[0].nodeValue;
  }


  
}


// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIwzALxUPNbatRBj3Xi1Uhp0fFzwWNBkE&libraries=places">
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
  locationButton.textContent = "Pan to Current Location";
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
          console.log(position.coords.latitude+","+position.coords.longitude);
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

  /*
  
  Get Testing centers functionality
  
  */ 

  //set markers to all testing centers
  // let x = TestCenters[0].name;
    const request = {
      query: "Manila City Hall",
      fields: ["name", "geometry"],
    };
    service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
        // console.log(JSON.parse(JSON.stringify(results[0].geometry.location)));
        // console.log(typeof(results[0].geometry.location.lat));
        // console.log(results[0].geometry.location["lng"]);
        map.setCenter(results[0].geometry.location);
      }
    });
  
  

  // const request2 = {
  //   query: "National Kidney and Transplant Institute",
  //   fields: ["name", "geometry"],
  // };
  // service = new google.maps.places.PlacesService(map);
  // service.findPlaceFromQuery(request2, (results, status) => {
  //   if (status === google.maps.places.PlacesServiceStatus.OK && results) {
  //     for (let i = 0; i < results.length; i++) {
  //       console.log(results[i]);
  //       createMarker(results[i]);
  //     }
  //     map.setCenter(results[0].geometry.location);
  //   }
  // });

  // const request3 = {
  //   query: "Chinese General Hospital",
  //   fields: ["name", "geometry"],
  // };
  // service = new google.maps.places.PlacesService(map);
  // service.findPlaceFromQuery(request3, (results, status) => {
  //   if (status === google.maps.places.PlacesServiceStatus.OK && results) {
  //     for (let i = 0; i < results.length; i++) {
  //       console.log(results[i]);
  //       createMarker(results[i]);
  //     }
  //     map.setCenter(results[0].geometry.location);
  //   }
  // });
}



function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });
  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map,marker);
  });
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

function addMarkers(){
  // for(i of TestCenters){
    console.log(i.number);
    const request = {
      query: "Hi-Precision Diagnostic Center",
      fields: ["name", "geometry"],
    };
    service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
        console.log((JSON.stringify(results[0].geometry.location)));
        // console.log(typeof(results[0].geometry.location.lat));
        // console.log(results[0].geometry.location["lng"]);
        map.setCenter(results[0].geometry.location);
      }
    });
  // }
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