

let TestCenters = [];

function TestCenter(number,region,province,MunOrCity,name,ownersType,testingType,contact,license,
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
      // console.log(xmlDoc);
      // console.log(xmlDoc.getElementsByTagName("payment_modes")[0].innerHTML);
      for (i=0;i<TestCenters.length;i++){
        TestCenters[i].lat=parseFloat(xmlDoc.getElementsByTagName("lat")[i].innerHTML);
        TestCenters[i].lng=parseFloat(xmlDoc.getElementsByTagName("lng")[i].innerHTML);
        TestCenters[i].pcr_cost=parseInt(xmlDoc.getElementsByTagName("pcr_cost")[i].innerHTML.replace(",","").replace(".",""));
        TestCenters[i].antigen_cost=parseInt(xmlDoc.getElementsByTagName("antigen_cost")[i].innerHTML.replace(",","").replace(".",""));
        TestCenters[i].payment_modes=xmlDoc.getElementsByTagName("payment_modes")[i].innerHTML;
        TestCenters[i].results_available_pcr=xmlDoc.getElementsByTagName("results_available_pcr")[i].innerHTML;
        TestCenters[i].results_available_antigen=xmlDoc.getElementsByTagName("results_available_antigen")[i].innerHTML;
        TestCenters[i].how_to_avail=xmlDoc.getElementsByTagName("how_to_avail")[i].innerHTML;
        TestCenters[i].info=xmlDoc.getElementsByTagName("info")[i].innerHTML;
      }

      console.log(xmlDoc.getElementsByTagName("number").length);

      //create map marker for all test centers
      for(i of TestCenters){
        // console.log(i.number);
        createMarker(i);
        
      }
    }
  };
  xmlhttp.open("GET", "https://raw.githubusercontent.com/morpheus17/batch5-activities/main/Covid/list.xml");
  xmlhttp.responseType = "";
  xmlhttp.send();
  
}


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



function createMarker(TestObj) {
  
  let coordinates={
    lat:TestObj.lat,
    lng:TestObj.lng
  }

  // console.log(coordinates);
  const marker = new google.maps.Marker({
    map,
    position: coordinates,
  });
  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(TestObj.name || "");
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