// Geo Location 

function geoLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

}
 

function showPosition(position) {
  console.log("Show position ...");
  var latlon = position.coords.latitude + "," + position.coords.longitude;
  var img_url = "http://maps.googleapis.com/maps/api/staticmap?center=" + latlon + "&zoom=14&size=400x100&sensor=true";

  document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";
  
}

