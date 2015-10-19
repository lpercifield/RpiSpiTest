var fs = require('fs-extra');
var gpio = require('rpi-gpio');
var SPI = require('spi');
var config = require('nconf');
var async = require("async");
var leds = require("./modules/leds.js");
var audio = require("./modules/mic.js");
var PythonShell = require('python-shell');
var tempSensor = require("./modules/am2302.js");
var gasSensors = require("./modules/gasSensors.js");
var usbDevices = require("./modules/usbDevices.js");
var mainInterval;
var mainLoopTime = 60000;
var timolo;
// NOTE: options for setting up pi-timolo
var timoloOptions = {
  mode: 'json',
  scriptPath: '/home/pi/pi-timolo'
};

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
  //console.log('gasSensors have data');
  console.log(JSON.stringify(sensorData));
})
audio.events.on('data',function(audioData){
  console.log(JSON.stringify(audioData));
})
function registerTimoloEvents(){
  // NOTE: register timolo message event
  timolo.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log("Timolo " + message.hasOwnProperty('timolo'));
    console.log("Motion " + message.hasOwnProperty('motion'));
    console.log("Timelapse " + message.hasOwnProperty('timelapse'));
    console.log(message);
  });
  timolo.on('error', function (message) {
    console.error(message);
  });
  timolo.on('close', function (message) {
    console.log(message);
  });
}
//////////////////////////////////////////////////////

//NOTE: Empty timolo directories
fs.emptyDir('/home/pi/pi-timolo/motion', function (err) {
  if (!err) console.log('success!')
})
fs.emptyDir('/home/pi/pi-timolo/timelapse', function (err) {
  if (!err) console.log('success!')
})


async.series({
    am2302: function(callback){
      // NOTE: setup tempSensor
      tempSensor.setup(gpio,function(err){
        if(err){
          console.log("AM2302 failed to initialize");
        }else{
          leds.setFaultStatus("AM2302",true);
          //console.log("tempSensor ready");
          callback(null, true);
        }
      });
    },
    ext: function(callback){
        callback(null, false);
    },
    usb: function(callback){
      usbDevices.deviceIds(function(err,results){
        if(err){
          console.error(err);
          callback(null,false);
        }else{
          //console.log(JSON.stringify(results));
          callback(null, results);
        }
      });
    },
    mic: function(callback){
      audio.setup(SPI,function(status){
        callback(null, status);
      })
    },
    gas: function(callback){
        // NOTE: setup gas sensor
        gasSensors.setup(gpio,SPI,function(result){
          //console.log("waiting for gas sensors");
          callback(null, result);
        });
    },
    camera: function(callback){
      // NOTE: create timolo instance
        timolo = new PythonShell('pi-timolo.py',options);
        timolo.on('message', function (message) {
          if(message.hasOwnProperty('timolo')){
            registerTimoloEvents();
            callback(null, true);
          }
        });
        timolo.on('error', function (message) {
          //console.error(message);
          callback(null, false);
        });
    },
    ethernet: function(callback){
        callback(null, false);
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










function on_exit(){
     console.log('Process Exit');
     //pfio.deinit();
     //monitor.stop();
     //rfid.kill("SIGINT");
     process.exit(0)
 }

 process.on('SIGINT',on_exit);



// NOTE: setup main loop interval
mainInterval = setInterval(mainLoop,mainLoopTime);

// NOTE: function that runs when the main interval expires
function mainLoop(){
  var tempReading = tempSensor.read();
  console.log("Temp: "+tempReading.temperature.toFixed(1) + " Humidity: "+tempReading.humidity.toFixed(1));
}
