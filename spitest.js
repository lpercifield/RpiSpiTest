var SPI = require('spi');
var median = require('median')
var average = new Array(20);
var lastAverage;
var averageCount =0;
var signalMax = 0;
var signalMin = 4096;
var peakToPeak;

var spi = new SPI.Spi('/dev/spidev0.1', {
    'mode': SPI.MODE['MODE_0'],  // always set mode as the first option
    'chipSelect': SPI.CS['none'] // 'none', 'high' - defaults to low
  }, function(s){
    s.maxSpeed(6000000);
    s.open();
  });

var txbuf = new Buffer([ 0x23, 0x48, 0xAF, 0x19, 0x19, 0x19 ]);
var rxbuf = new Buffer([ 0x00, 0x00, 0x00]);

setInterval(function(){
  spi.read(rxbuf, function(device, buf) {
    //console.log(buf.readUInt16BE(0));
    var sample = buf.readUInt16BE(0);
    if (sample > signalMax)
         {
            signalMax = sample;  // save just the max levels
         }
         else if (sample < signalMin)
         {
            signalMin = sample;  // save just the min levels
         }
  });
},1);

setInterval(function(){
 peakToPeak = 0;
 peakToPeak = signalMax - signalMin;  // max - min = peak-peak amplitude
 average.push(peakToPeak);
 if(average.length == 20){
   var first = average.shift();
 }
 var outString = "";
 for(var i = 0; i<peakToPeak/10;i++){
   outString += " ";
 }
 outString += "*";
 var averageToMedian = new Array();
 averageToMedian = average
 var value = median(averageToMedian);
 console.log("median value is " + value + " First was: "+ first+ " Last was: "+ peakToPeak + " Array: " + average.toString());
 //console.log(outString);
 signalMax = 0;
 signalMin = 4096;
},50);
