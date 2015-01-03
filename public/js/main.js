
$(document).ready(function(){
 
console.log("ready");

// Create a client instance
var host = "wsquake.ngrok.com";
var port = 80;
var clientId = new Date();
console.log(clientId.getMilliseconds());
console.log(String(Number(clientId)));
client = new Paho.MQTT.Client(host, Number(port), String(clientId));

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
  client.subscribe("$SYS/clients/connected");
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

var clientConnections = 0;
// called when a message arrives
function onMessageArrived(message) {
  // System Messages
  if (message.destinationName == '$SYS/clients/connected'){
    console.log(message.payloadString);  
    clientConnections = message.payloadString;
  }
  
  // Earthquake Info
  if (message.destinationName == 'quakes/lasthour') {
    data = JSON.parse(message.payloadString);
    console.log('processing quakes/lasthour');
    if (data.quakes.length > 0) {
      var html = [];
      for(i=0;i < data.quakes.length;i++){
        var quake = data.quakes[i];
        var quakeTime = new Date(Number(quake.time));
        var urlInfo = "http://earthquake.usgs.gov/learn/topics/measure.php"
        var magnitude = '<a target="_blank" href="' + urlInfo + '">' 
        magnitude +=  quake.magnitude + '</a>'; 
        // Build array 
        html.push('<h4>' + magnitude + ' @ ');
        html.push(quakeTime.toLocaleTimeString() + "</h4>");
        html.push('<a target="_blank" href="' + quake.url + '">' ); 
        html.push(quake.location + '</a>');
        html.push('<hr>');
      }
      $('#quakes').html(html.join(''));
      d = new Date();
      var status = "Last Updated: " + d  + "<br>";
      status += "Client Connections: " + clientConnections + "<br>";
      $('#status').html(status);
    } 
    else
    {
      console.log('No Data');
      $('#quakes').html('No Data is available'); 
    }

  } // quakes/lasthour
    
    
}
  
});