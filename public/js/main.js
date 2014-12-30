

$(document).ready(function(){
 console.log("ready");    

// Create a client instance
var host = "wsquake.ngrok.com";
var port = 80;
client = new Paho.MQTT.Client(host, Number(port), "clientId");

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect});

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  console.log("http://" + location.hostname + ':' + location.port);
  client.subscribe("quakes/lasthour");
  
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
    var html = [
      'Conection has been lost ',
      '<a href="http://' + location.hostname + ':' + location.port + '" >',
      'Refresh </a>'
      
    ]
    $('#status').html(html.join(''));
    
    
  }
}

// called when a message arrives
function onMessageArrived(message) {
  //console.log("onMessageArrived:"+message.payloadString);
    data = JSON.parse(message.payloadString);
    console.log(data);
    var html = [];
    $('#progress').html("Updating<br>");
    for(i=0;i < data.quakes.length;i++){
        var quake = data.quakes[i];
        console.log("Quake:" + quake);
        var quakeTime = new Date(Number(quake.time));
        var urlInfo = "http://earthquake.usgs.gov/learn/topics/measure.php"
        var magnitude = '<a target="_blank" href="' + urlInfo + '">' 
        magnitude +=  quake.magnitude + '</a>'; 
        html.push('<h4>' + magnitude + ' @ ');
        html.push(quakeTime.toLocaleTimeString() + "</h4>");
        html.push(quake.location + "<br>");
        html.push('<a target="_blank" href="' + quake.url + '">' + quake.url + '</a>');
        html.push('<hr><br>');
        
    }
    $('#quakes').html(html.join(''));
    d = new Date();
    $('#progress').html("Last Updated: " + d  + "<br><br>");
}    

});

