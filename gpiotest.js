var gpio = require('rpi-gpio');


var yellowLed = 40;
var redLed = 38;
var onTime = 2000;
var count = 0;
var max   = 3;


gpio.setup(yellowLed, gpio.DIR_OUT);
gpio.setup(redLed, gpio.DIR_OUT,on);

function on() {
    if (count >= max) {
        gpio.destroy(function() {
            console.log('Closed pins, now exit');
        });
        return;
    }

    setTimeout(function() {
      gpio.write(yellowLed, true, function(err) {
        gpio.write(redLed,false);
        if (err) throw err;
        console.log('Written to pin');
        console.log("ON");
        count += 1;
        off();
      });
    }, onTime);
}

function off() {
    setTimeout(function() {
      gpio.write(yellowLed, false, function(err) {
        gpio.write(redLed,true);
        if (err) throw err;
        console.log('Written to pin');
        console.log("OFF");
        on();
      });
    }, onTime);
}
