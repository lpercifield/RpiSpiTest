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

// var sensor = {
//     initialize: function () {
//         return sensorLib.initialize(22, AM_PIN);
//     },
//     read: function () {
//         var readout = sensorLib.read();
//         readingnumber++;
//         console.log("Reading Number: "+ readingnumber+' Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
//             'humidity: ' + readout.humidity.toFixed(2) + '%');
//         // setTimeout(function () {
//         //     sensor.read();
//         // }, 2000);
//     }
// };
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
              b.humidity.toFixed(1) + "%" + "Errors: " + b.errors);
        }
        // setTimeout(function() {
        //     sensor.read();
        // }, 2000);
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
    sensor.read();
    // if(!sensorLib.initialized){
    //     console.log("inialize sensor")
    //   if (sensor.initialize()) {
    //       sensor.read();
    //   } else {
    //       console.warn('Failed to initialize sensor');
    //       clearInterval(readingInterval);
    //       amReset();
    //   }
    // }else{
    //   sensor.read();
    // }
  },5000);
}
