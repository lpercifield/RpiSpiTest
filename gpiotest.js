var gpio = require('rpi-gpio');


var greenLed = 38;
var redLed = 39;
var on = 2000;
var count = 0;
var max   = 3;

gpio.setup(greenLed, gpio.DIR_OUT,on);
gpio.setup(redLed, gpio.DIR_OUT,on);

function on() {
    if (count >= max) {
        gpio.destroy(function() {
            console.log('Closed pins, now exit');
        });
        return;
    }

    setTimeout(function() {
      gpio.write(greenLed, true, function(err) {
        gpio.write(redLed,false);
        if (err) throw err;
        console.log('Written to pin');
        console.log("ON");
        count += 1;
      });
    }, on);
}

function off() {
    setTimeout(function() {
      gpio.write(greenLed, false, function(err) {
        gpio.write(redLed,true);
        if (err) throw err;
        console.log('Written to pin');
        console.log("OFF");
      });
    }, on);
}
