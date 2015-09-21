var gpio = require('rpi-gpio');
var SPI = require('spi');

var mq7pin   = 24;
var onDelay = 60000;
var offDelay = 90000;
var count = 0;
var max   = 3;
var burnIn = true;

gpio.setup(mq7pin, gpio.DIR_OUT,function(){gpio.write(mq7pin, 1, on);});


var spi = new SPI.Spi('/dev/spidev0.0', {
    'mode': SPI.MODE['MODE_0'],  // always set mode as the first option
    'chipSelect': SPI.CS['none'] // 'none', 'high' - defaults to low
  }, function(s){
    s.maxSpeed(1000000);
    s.open();
  });
// setInterval(function(){
//   getADC(0);
//   getADC(1);
// },500);
function on() {
    // if (count >= max) {
    //     gpio.destroy(function() {
    //         console.log('Closed pins, now exit');
    //     });
    //     return;
    // }

    setTimeout(function() {
        gpio.write(mq7pin, 1, off);
        console.log("ON");
        // if(burnIn){
        //   onDelay = 43200000;
        // }else{
        //   onDelay = 60000;
        // }
        count += 1;
    }, onDelay);
}

function off() {
    setTimeout(function() {
        console.log("-----READING BEFORE OFF-----")
        getADC(0);
        getADC(1);
        gpio.write(mq7pin, 0, on);
        console.log("OFF");
    }, offDelay);
}
var getADC = function(channel){
  var spiData =  new Buffer([1,(8+channel) << 4,0]);
  var rxbuf = new Buffer([ 0x00, 0x00, 0x00]);
  spi.transfer(spiData, rxbuf, function(device, buf) {
    //var ret=((buf[1] & 3) << 8) + buf[2];
    var ret = ((rxbuf [1]<<8)|rxbuf[2])&0x3FF;
    console.log("Channel " +channel +": " +ret);
  });
}
