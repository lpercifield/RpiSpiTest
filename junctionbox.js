var gpio = require('rpi-gpio');
var SPI = require('spi');
var leds = require("./modules/leds.js");
var PythonShell = require('python-shell');
var tempSensor = require("./modules/am2302.js");
var gasSensors = require("./modules/gasSensors.js");
var usbDevices = require("./modules/usbDevices.js");
var mainInterval;
var mainLoopTime = 60000;

usbDevices.deviceIds(function(err,results){
  console.log(JSON.stringify(results));
});

// NOTE: setup LEDS
leds.setup(gpio);
// NOTE: setup tempSensor
tempSensor.setup(gpio,function(){
  console.log("tempSensor ready");
});
// // NOTE: options for setting up pi-timolo
// var options = {
//   mode: 'json',
//   scriptPath: '/home/pi/pi-timolo'
// };
// // NOTE: create timolo instance
// var timolo = new PythonShell('pi-timolo.py',options);
//
// // NOTE: register timolo message event
// timolo.on('message', function (message) {
//   // received a message sent from the Python script (a simple "print" statement)
//   console.log("Timolo " + message.hasOwnProperty('timolo'));
//   console.log("Motion " + message.hasOwnProperty('motion'));
//   console.log("Timelapse " + message.hasOwnProperty('timelapse'));
//   console.log(message);
// });

// NOTE: register events from gas sensors
gasSensors.events.on('ready', function(sensorData) {
  console.log('gasSensors data is ready');
  console.log(JSON.stringify(sensorData));
});

// NOTE: setup gas sensor
gasSensors.setup(gpio,SPI);

// NOTE: setup main loop interval
mainInterval = setInterval(mainLoop,mainLoopTime);

// NOTE: function that runs when the main interval expires
function mainLoop(){
  var tempReading = tempSensor.read();
  console.log("Temp: "+tempReading.temperature.toFixed(1) + " Humidity: "+tempReading.humidity.toFixed(1));
}
