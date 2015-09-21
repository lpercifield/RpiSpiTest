var gpio = require('rpi-gpio');
var SPI = require('spi');

var amPin = 22;
var on = 2000;
var count = 0;
var max   = 3;

gpio.setup(amPin, gpio.DIR_OUT,function(){gpio.write(amPin, 1, on);});

function on() {
    if (count >= max) {
        gpio.destroy(function() {
            console.log('Closed pins, now exit');
        });
        return;
    }

    setTimeout(function() {
        gpio.write(amPin, true, off);
        console.log("ON");
        count += 1;
    }, on);
}

function off() {
    setTimeout(function() {
        gpio.write(amPin, false, on);
        console.log("OFF");
    }, on);
}
