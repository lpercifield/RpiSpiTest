var gpio = require('rpi-gpio');
var leds = require("./modules/leds.js");

leds.setup(gpio);
