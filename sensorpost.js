var gpio = require('rpi-gpio');
var SPI = require('spi');
var request = require('request');
var sensorLib = require('node-dht-sensor');

var AM_PIN = 17;
var AM_RESET_PIN = 15;
var mq7pin   = 18;
var onDelay = 60000;
var offDelay = 90000;
var count = 0;
var max   = 3;
var burnIn = true;

gpio.setup(mq7pin, gpio.DIR_OUT,function(){gpio.write(mq7pin, 1, on);});
gpio.setup(AM_RESET_PIN, gpio.DIR_OUT, function(err){
  if (err) throw err;
  console.log("Calling amreset");
  amReset();
});


var spi = new SPI.Spi('/dev/spidev0.0', {
    'mode': SPI.MODE['MODE_0'],  // always set mode as the first option
    'chipSelect': SPI.CS['none'] // 'none', 'high' - defaults to low
  }, function(s){
    s.maxSpeed(1000000);
    s.open();
  });
function on() {
    setTimeout(function() {
        console.log("-----READING BEFORE ON-----")
        var mq7 = getADC(0);
        var mq135 = getADC(1);
        gpio.write(mq7pin, 1, off);
        var json = {"MQ7":mq7,"MQ135":mq135};
        sendPost(json,"air");
        console.log("ON");
        // if(burnIn){
        //   onDelay = 43200000;
        // }else{
        //   onDelay = 60000;
        // }
        count += 1;
    }, offDelay);
}

function off() {
    setTimeout(function() {
        gpio.write(mq7pin, 0, on);
        console.log("OFF");
    }, onDelay);
}
var getADC = function(channel){
  var spiData =  new Buffer([1,(8+channel) << 4,0]);
  var rxbuf = new Buffer([ 0x00, 0x00, 0x00]);
  var ret;
  spi.transfer(spiData, rxbuf, function(device, buf) {
    //var ret=((buf[1] & 3) << 8) + buf[2];
    ret = ((rxbuf [1]<<8)|rxbuf[2])&0x3FF;
    console.log("Channel " +channel +": " +ret);
  });
  return ret;
}
var sendPost = function(jsonData,path){
  request({
      url: "http://192.168.2.210:1880/"+path,
      method: "POST",
      json: jsonData
  }, function (error, response, body) {
  if (!error && response.statusCode === 200) {
      console.log(body)
  }
  else {

      console.log("error: " + error)
      // console.log("response.statusCode: " + response.statusCode)
      // console.log("response.statusText: " + response.statusText)
  }
});
}
var sensor = {
    initialize: function () {
        return sensorLib.initialize(22, AM_PIN);
    },
    read: function () {
        var readout = sensorLib.read();
        var temp = readout.temperature.toFixed(2);
        var humidity = readout.humidity.toFixed(2);
        var tempJson = {"temp":parseFloat(temp),"humidity":parseFloat(humidity)};
        sendPost(tempJson,"temp");
        console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
            'humidity: ' + readout.humidity.toFixed(2) + '%');
        // setTimeout(function () {
        //     sensor.read();
        // }, 2000);
    }
};

var amReset = function(){
  console.log("Starting AMRESET")
  gpio.write(AM_RESET_PIN,1,function(err){
    if (err) throw err;
    console.log('RESETTING AM2302');
  });
  setTimeout(function(){
    gpio.write(AM_RESET_PIN,1,function(err){
      if (err) throw err;
      console.log('Power On AM2302');
      setTimeout(startReadings,5000);
    });
  },5000);
}
var startReadings = function(){
  setInterval(function(){
    if (sensor.initialize()) {
        sensor.read();
    } else {
        console.warn('Failed to initialize sensor');
    }
  },60000);
}
var mq7 = getADC(0);
var mq135 = getADC(1);
var json = {"MQ7":parseInt(mq7),"MQ135":parseInt(mq135)};
sendPost(json,"air");
