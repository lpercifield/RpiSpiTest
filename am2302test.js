var gpio = require('rpi-gpio');
var sensorLib = require('node-dht-sensor');
var AM_PIN = 17;
var AM_RESET_PIN = 15;
var readingnumber = 0;
var readingInterval;

console.log("before gpio setup");
//gpio.setup(AM_PIN, gpio.DIR_OUT);
gpio.setup(AM_RESET_PIN, gpio.DIR_OUT, function(err){
  if (err) throw err;
  console.log("Calling amreset");
  amReset();
});
console.log("after gpio setup");

var sensor = {
    sensors: [ {
        name: "Indoor",
        type: 22,
        pin: AM_PIN
    }],
    read: function() {
        for (var a in this.sensors) {
            var b = sensorLib.readSpec(this.sensors[a].type, this.sensors[a].pin);
            readingnumber++;
            console.log("Reading Number: "+ readingnumber+" " +this.sensors[a].name + ": " +
              b.temperature.toFixed(1) + "C, " +
              b.humidity.toFixed(1) + "%" + " Errors: " + b.errors + " isValid: " + b.isValid);
        }
    }
};


var amReset = function(){
  console.log("Starting AMRESET")
  gpio.write(AM_RESET_PIN,0,function(err){
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
  readingInterval = setInterval(function(){
    try {
      sensor.read();
    } catch (e) {
      console.log(e)
      clearInterval(readingInterval);
      amReset();
    }
  },5000);
}
