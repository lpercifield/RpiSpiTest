var gpio = require('rpi-gpio');
var sensorLib = require('node-dht-sensor');
var AM_PIN = 17;
var AM_RESET_PIN = 15;

console.log("before gpio setup");
//gpio.setup(AM_PIN, gpio.DIR_OUT);
gpio.setup(AM_RESET_PIN, gpio.DIR_OUT, function(err){
  if (err) throw err;
  console.log("Calling amreset");
  amReset();
});
console.log("after gpio setup");

var sensor = {
    initialize: function () {
        return sensorLib.initialize(22, AM_PIN);
    },
    read: function () {
        var readout = sensorLib.read();
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
    if(!sensor.initialized){
      if (sensor.initialize()) {
          sensor.read();
      } else {
          console.warn('Failed to initialize sensor');
      }
    }else{
      sensor.read();
    }
  },5000);
}
