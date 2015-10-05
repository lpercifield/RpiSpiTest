var gpio = require('rpi-gpio');

gpio.on('change', function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
});
gpio.setup(37, gpio.DIR_IN, gpio.EDGE_BOTH);
gpio.setup(35, gpio.DIR_IN, gpio.EDGE_BOTH);
gpio.setup(33, gpio.DIR_IN, gpio.EDGE_BOTH);
