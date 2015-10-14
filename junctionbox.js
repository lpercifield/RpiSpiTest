var gpio = require('rpi-gpio');
var leds = require("./modules/leds.js");
var tempSensor = require("./modules/am2302.js");
var mainInterval;
var mainLoopTime = 60000;

leds.setup(gpio);
tempSensor.setup(gpio,function(){
  console.log("tempSensor ready");
})
mainInterval = setInterval(mainLoop,mainLoopTime);

function mainLoop(){
  var tempReading = tempSensor.read();
  console.log("Temp: "+tempReading.temperature.toFixed(1) + " Humidity: "+tempReading.humidity.toFixed(1));
}
