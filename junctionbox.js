var gpio = require('rpi-gpio');
var SPI = require('spi');
var leds = require("./modules/leds.js");
var tempSensor = require("./modules/am2302.js");
var gasSensors = require("./modules/gasSensors.js");
var mainInterval;
var mainLoopTime = 60000;

leds.setup(gpio);

tempSensor.setup(gpio,function(){
  console.log("tempSensor ready");
})

gasSensors.events.on('ready', function(sensorData) {
  console.log('gasSensors data is ready');
  console.log(JSON.stringify(sensorData));
});
gasSensors.setup(gpio,SPI);

mainInterval = setInterval(mainLoop,mainLoopTime);

function mainLoop(){
  var tempReading = tempSensor.read();
  console.log("Temp: "+tempReading.temperature.toFixed(1) + " Humidity: "+tempReading.humidity.toFixed(1));
}
