var gpio = require('rpi-gpio');

gpio.on('change', function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
});

gpio.setup(37, gpio.DIR_IN, gpio.EDGE_BOTH, readInput37);
gpio.setup(35, gpio.DIR_IN, gpio.EDGE_BOTH, readInput35);
gpio.setup(33, gpio.DIR_IN, gpio.EDGE_BOTH, readInput33);

function readInput37() {
    gpio.read(37, function(err, value) {
        console.log('The value of 37 is ' + value);
    });
}
function readInput35() {
    gpio.read(35, function(err, value) {
        console.log('The value of 37 is ' + value);
    });
}
function readInput33() {
    gpio.read(33, function(err, value) {
        console.log('The value of 37 is ' + value);
    });
}
