const dat = newdata;
let markers=[];
var count = 0;
var ser;
let infowindows=[];
document.getElementById("markid").textContent = "Select Marker from Map"
function initMap(){
  map = new google.maps.Map(document.getElementById("map"), {
    mapId: "10d6e92c36a6d403",
    center: { lat: 20.5937, lng: 78.9629 },
    zoom: 4,
  });
  for (let i in dat)
    {
      let marker = new google.maps.Marker({
        position: { lat: parseFloat(dat[i].latitude), lng: parseFloat(dat[i].longitude) },
        map,
        title: dat[i].address,
      });
      let infowindow = new google.maps.InfoWindow({
        content: dat[i].AQMSID+","+dat[i].city+","+dat[i].state+","+dat[i].country,
      });
      infowindows.push(infowindow)
      marker.addListener('click',()=>{
        document.getElementById("markid").textContent = dat[i].AQMSID
        s={
          "AQMSID": (dat[i].AQMSID)
        }
      });
         
      markers.push(marker);
    } 
    seton(map)   
    console.log(markers) 
}
function seton(map){
    for (let i = 0; i < markers.length; i++) {
      
        markers[i].addListener('click',()=>{
        if(ser == 0 ){         
          ser = setInterval(value,1000,s)
        }
        else{
          clearInterval(ser);
          ser = setInterval(value,2000,s);
        }
        infowindows[i].open({
        anchor: markers[i],
        map,
        shouldFocus: false,
      });
      }); 
      markers[i].setMap(map);
    }
}
function value(s){  
  reqss=new $.ajax({
    url:"/",
    type:"POST",
    contentType: "application/json",
    data: JSON.stringify(s)
  });
  reqss.done(function(data){
    document.getElementById("pmh").textContent = data.PM2_5;
    document.getElementById("coh").textContent = data.AIRQ;
  }); 
}
