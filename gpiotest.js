var gpio = require('rpi-gpio');
var SPI = require('spi');

var pin   = 7;
var onDelay = 60000;
var offDelay = 90000;
var count = 0;
var max   = 3;

//gpio.setup(pin, gpio.DIR_OUT, on);

var spi = new SPI.Spi('/dev/spidev0.0', {
    'mode': SPI.MODE['MODE_0'],  // always set mode as the first option
    'chipSelect': SPI.CS['none'] // 'none', 'high' - defaults to low
  }, function(s){
    s.maxSpeed(1000000);
    s.open();
  });
setInterval(function(){
  getADC(0);
  getADC(1);
},500);
// function on() {
//     // if (count >= max) {
//     //     gpio.destroy(function() {
//     //         console.log('Closed pins, now exit');
//     //     });
//     //     return;
//     // }
//
//     setTimeout(function() {
//         gpio.write(pin, 1, off);
//         count += 1;
//     }, onDelay);
// }
//
// function off() {
//     setTimeout(function() {
//         gpio.write(pin, 0, on);
//     }, offDelay);
// }
var getADC = function(channel){
  var spiData =  new Buffer([1,0x80|(channel << 4),0]);
  var rxbuf = new Buffer([ 0x00, 0x00, 0x00]);
  spi.transfer(spiData, rxbuf, function(device, buf) {
    console.log("Channel " +channel +": " +buf.readUInt16BE(0));
  });
}
