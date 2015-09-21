var gpio = require('rpi-gpio');
//var SPI = require('spi');

var amPin   = 22;
var on = 2000;
var count = 0;
var max   = 3;

gpio.setup(amPin, gpio.DIR_OUT, on);

// var spi = new SPI.Spi('/dev/spidev0.0', {
//     'mode': SPI.MODE['MODE_0'],  // always set mode as the first option
//     'chipSelect': SPI.CS['none'] // 'none', 'high' - defaults to low
//   }, function(s){
//     s.maxSpeed(1000000);
//     s.open();
//   });
// setInterval(function(){
//   getADC(0);
//   getADC(1);
// },500);
function on() {
    if (count >= max) {
        gpio.destroy(function() {
            console.log('Closed pins, now exit');
        });
        return;
    }

    setTimeout(function() {
        gpio.write(amPin, 1, off);
        console.log("ON");
        count += 1;
    }, on);
}

function off() {
    setTimeout(function() {
        gpio.write(amPin, 0, on);
        console.log("OFF");
    }, on);
}
// var getADC = function(channel){
//   var spiData =  new Buffer([1,(8+channel) << 4,0]);
//   var rxbuf = new Buffer([ 0x00, 0x00, 0x00]);
//   spi.transfer(spiData, rxbuf, function(device, buf) {
//     var ret=((buf[1] & 3) << 8) + buf[2];
//     console.log("Channel " +channel +": " +ret);
//   });
// }
