var gpio = require('rpi-gpio');
var SPI = require('spi');
var config = require('nconf');
var async = require("async");
var leds = require("./modules/leds.js");
var PythonShell = require('python-shell');
var tempSensor = require("./modules/am2302.js");
var gasSensors = require("./modules/gasSensors.js");
var usbDevices = require("./modules/usbDevices.js");
var mainInterval;
var mainLoopTime = 60000;
config.use('file', { file: './config/default.json' });

// var faultStatus = {
//   "AM2302":true,
// "ext1":true,
// "ext2":true,
// "ext3":true,
// "wlan0":true,
// "wlan1":true,
// "imei":true,
// "iccid":true,
// "mic":true,
// "MQ7":true,
// "MQ135":true,
// "Camera":true,
// "Ethernet":true
// }
// NOTE: setup LEDS
leds.setup(gpio);

///////////////////// EVENTS /////////////////////////
// NOTE: register events from gas sensors
gasSensors.events.on('data', function(sensorData) {
  console.log('gasSensors have data');
  console.log(JSON.stringify(sensorData));
})
//////////////////////////////////////////////////////

async.series({
    am2302: function(callback){
      // NOTE: setup tempSensor
      tempSensor.setup(gpio,function(err){
        if(err){
          console.log("AM2302 failed to initialize");
        }else{
          leds.setFaultStatus("AM2302",false);
          //console.log("tempSensor ready");
          callback(null, false);
        }
      });
    },
    ext: function(callback){
        callback(null, true);
    },
    usb: function(callback){
      usbDevices.deviceIds(function(err,results){
        if(err){
          console.error(err);
          callback(null,true);
        }else{
          //console.log(JSON.stringify(results));
          callback(null, results);
        }
      });
    },
    mic: function(callback){
        callback(null, true);
    },
    gas: function(callback){
        // NOTE: setup gas sensor
        gasSensors.setup(gpio,SPI,function(result){
          //console.log("waiting for gas sensors");
          callback(null, result);
        });
    },
    camera: function(callback){
        callback(null, true);
    },
    ethernet: function(callback){
        callback(null, true);
    }
},
function(err, results) {
    // results is now equal to: {am2302: 1, ext: 2...}
    if(err) console.error(err);
    console.log(JSON.stringify(results));
});

// usbDevices.deviceIds(function(err,results){
//   if(err){
//     console.error(err);
//   }else{
//     console.log(JSON.stringify(results));
//   }
// });




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





// NOTE: setup main loop interval
mainInterval = setInterval(mainLoop,mainLoopTime);

// NOTE: function that runs when the main interval expires
function mainLoop(){
  var tempReading = tempSensor.read();
  console.log("Temp: "+tempReading.temperature.toFixed(1) + " Humidity: "+tempReading.humidity.toFixed(1));
}
