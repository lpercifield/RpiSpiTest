var EventEmitter = require('events'),
var average = [];
var lastAverage;
var averageNumber = 1200;
var averageCount =0;
var signalMax = 0;
var signalMin = 4096;
var peakToPeak;
var localSpi;
var sampleinterval;
var averageinterval;
var eventIntervalTime = 60000;
var eventInterval;
var maxPeak = 0;

var txbuf = new Buffer([ 0x23, 0x48, 0xAF, 0x19, 0x19, 0x19 ]);
var rxbuf = new Buffer([ 0x00, 0x00, 0x00]);
exports.events = events;
exports.setup = function(SPI,callback){
  localSpi = new SPI.Spi('/dev/spidev0.1', {
      'mode': SPI.MODE['MODE_0'],  // always set mode as the first option
      'chipSelect': SPI.CS['none'] // 'none', 'high' - defaults to low
    }, function(s){
      s.maxSpeed(6000000);
      s.open();
    });
  checkValues(callback);
  //startReadings();
}
function checkValues(callback){
  spi.read(rxbuf, function(device, buf) {
    var sample = buf.readUInt16BE(0);
    if(sample >0 || sample < 4096){
      startReadings();
      callback(true);
    }else{
      callback(false);
    }
  });
}

function startReadings(){
  sampleinterval = setInterval(function(){
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
  averageinterval = setInterval(function(){
   peakToPeak = 0;
   peakToPeak = signalMax - signalMin;  // max - min = peak-peak amplitude
   if(peakToPeak > maxPeak){
     maxPeak = peakToPeak;
   }
   average.push(peakToPeak);
   if(average.length == averageNumber){
     var first = average.shift();
   }
   signalMax = 0;
   signalMin = 4096;
  },50);
  eventInterval = setInterval(function(){
    var value = medianFun(average.slice(0));
    var outString = "median value is " + value;
    for(var i = 0; i<maxPeak/10;i++){
     outString += " ";
    }
    outString += "*";
    maxPeak = 0;
    console.log(outString);
    var micData = {"average":vale,"max":maxPeak};
    events.emit('data',sensorData);
  },eventIntervalTime);
}




// setInterval(function(){
//   spi.read(rxbuf, function(device, buf) {
//     //console.log(buf.readUInt16BE(0));
//     var sample = buf.readUInt16BE(0);
//     if (sample > signalMax)
//          {
//             signalMax = sample;  // save just the max levels
//          }
//          else if (sample < signalMin)
//          {
//             signalMin = sample;  // save just the min levels
//          }
//   });
// },1);

// setInterval(function(){
//  peakToPeak = 0;
//  peakToPeak = signalMax - signalMin;  // max - min = peak-peak amplitude
//  average.push(peakToPeak);
//  if(average.length == 20){
//    var first = average.shift();
//  }
//  var value = medianFun(average.slice(0));
//  var outString = "median value is " + value;
//  //var outString = "";
//  for(var i = 0; i<peakToPeak/10;i++){
//    outString += " ";
//  }
//  outString += "*";
//  //var averageToMedian = average.slice(0);
//  //averageToMedian = average
//  console.log(outString);
//  signalMax = 0;
//  signalMin = 4096;
// },50);

function medianFun(values) {

    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}
