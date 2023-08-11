
var map = L.map('map').setView([20.5937, 78.9629],4)
L.tileLayer("https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=w2C7yLr8RxmLuzkeX0UR",{
     attribution : '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'}).addTo(map);
   

function empty(){
    let wildid = document.getElementById('aqid').value;

    if(wildid!=""){
        document.getElementById("locate").removeAttribute("disabled");
        
        console.log("hi")
    }
}


function clicklocatee(){
    if ('geolocation' in navigator) {
      console.log('geolocation available');
      let lat = "";
      let lon = "";
      navigator.geolocation.getCurrentPosition(position => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;        
        s= { "lat": lat, "long": lon}
        req = $.ajax({
          url:"/location",
          type:"POST",
          contentType: "application/json",
          data: JSON.stringify(s)
      });
      req.done(function(data){
        document.getElementById('address').value = data.address
        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lon;
        L.marker([lat,lon]).bindPopup(data.address).openPopup().addTo(map);
      });
      });
    }
    else {
      console.log('geolocation not available');
    }
    document.getElementById("submit").removeAttribute("disabled");
}



function sub(){
  let dev = document.getElementById('aqid').value;
  let lat = document.getElementById('latitude').value;
  let lon = document.getElementById('longitude').value;
  let add = document.getElementById('address').value;
  s = {
    "Aqmsid":dev,
    "lat":lat,
    "long":lon,
    "add":add
  }
  console.log(JSON.stringify(s));
  reqs=$.ajax({
    url:"/deploy",
    type:"POST",
    contentType: "application/json",
    data: JSON.stringify(s)
  });
  reqs.done(function(data){
    console.log(data)
      if (data=="success"){
        window.alert("successfully deployed")
        location.reload();
      }
      else{
        window.alert("deployement unsuccessful")
        location.reload();
      }
  });
  

}