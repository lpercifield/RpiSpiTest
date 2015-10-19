var fs = require('fs-extra');
var gpio = require('rpi-gpio');
var SPI = require('spi');
var config = require('nconf');
var async = require("async");
var PythonShell = require('python-shell');

var leds = require("./modules/leds.js");
var audio = require("./modules/mic.js");
var tempSensor = require("./modules/am2302.js");
var gasSensors = require("./modules/gasSensors.js");
var usbDevices = require("./modules/usbDevices.js");
var dataObject = {};
var mainInterval;
var mainLoopTime = 60000;
var timolo;
/**
 * [timoloOptions description]
 * @type {Object}
 */
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
//register events from gas sensors
/**
 * [on description]
 * @param  {[type]} 'data'              [description]
 * @param  {[type]} function(sensorData [description]
 * @return {[type]}                     [description]
 */
gasSensors.events.on('data', function(sensorData) {
  //console.log('gasSensors have data');
  console.log(JSON.stringify(sensorData));
  dataObject.gas = sensorData;
})

tempSensor.events.on('data',function(sensorData){
  console.log(JSON.stringify(sensorData));
  dataObject.am2302 = sensorData;
});
audio.events.on('data',function(audioArray){
  //console.log(audioArray.toString());
  console.log(JSON.stringify(audioArray));
})
function registerTimoloEvents(){
  // NOTE: register timolo message event
  timolo.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    // console.log("Timolo " + message.hasOwnProperty('timolo'));
    // console.log("Motion " + message.hasOwnProperty('motion'));
    // console.log("Timelapse " + message.hasOwnProperty('timelapse'));
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

//Empty timolo directories
fs.emptyDir('/home/pi/pi-timolo/motion', function (err) {
  if (err) console.error(err)
})
fs.emptyDir('/home/pi/pi-timolo/timelapse', function (err) {
  if (err) console.error(err)
})


async.series({
    am2302: function(callback){
      // NOTE: setup tempSensor
      tempSensor.setup(gpio,config.get("am2302_data_pin"),config.get("am2302_reset_pin"),function(err){
        if(err){
          //console.log("AM2302 failed to initialize");
          callback(null, false);
        }else{
          //leds.setFaultStatus("AM2302",true);
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
      audio.setup(SPI,config.get("microphone_spi_bus"),function(status){
        callback(null, status);
      })
    },
    gas: function(callback){
        // NOTE: setup gas sensor
        gasSensors.setup(gpio,SPI,config.get("gas_spi_bus"),function(result){
          //console.log("waiting for gas sensors");
          callback(null, result);
        });
    },
    camera: function(callback){
      // NOTE: create timolo instance
        timolo = new PythonShell('pi-timolo.py',timoloOptions);
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
    leds.initFaultStatus(results);
    console.log(JSON.stringify(results));
});

function on_exit(){
     console.log('Process Exit');
     //SPI.close();
     gpio.destroy();
     timolo.end(function (err) {
       if (err) throw err;
       console.log('TIMOLO finished');
     });
     process.exit(0)
 }

 process.on('SIGINT',on_exit);



// NOTE: setup main loop interval
mainInterval = setInterval(mainLoop,mainLoopTime);

// NOTE: function that runs when the main interval expires
function mainLoop(){
  //var tempReading = tempSensor.read();
  //console.log("Temp: "+tempReading.temperature.toFixed(1) + " Humidity: "+tempReading.humidity.toFixed(1));
}
