var EventEmitter = require('events'),
events = new EventEmitter();
var average = [];
var lastAverage;
var averageNumber = 600;
var averageCount =0;
var signalMax = 0;
var signalMin = 4096;
var peakToPeak;
var localSpi;
var sampleinterval;
var sampleCounter = 1;
var averageinterval;
var audioArray = [];
var eventIntervalTime = 120000; //120000
var eventInterval;
var audioDataIntervalTime = 30000;
var audioDataInterval;
var maxPeak = 0;
var minPeak = 4096;

var txbuf = new Buffer([ 0x23, 0x48, 0xAF, 0x19, 0x19, 0x19 ]);
var rxbuf = new Buffer([ 0x00, 0x00, 0x00]);
exports.events = events;
exports.setup = function(SPI,spi_bus,callback){
  localSpi = new SPI.Spi(spi_bus.toString(), {
      'mode': SPI.MODE['MODE_0'],  // always set mode as the first option
      'chipSelect': SPI.CS['none'] // 'none', 'high' - defaults to low
    }, function(s){
      s.maxSpeed(6000000);
      try{
        s.open();
      }catch(e){
        console.error("MIC SPI error")
        callback(false)
      }
    });
  checkValues(callback);
  //startReadings();
}
function checkValues(callback){
  localSpi.read(rxbuf, function(device, buf) {
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
    localSpi.read(rxbuf, function(device, buf) {
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
   if(peakToPeak < minPeak){
     minPeak = peakToPeak;
   }
   average.push(peakToPeak);
   if(average.length == averageNumber){
     var first = average.shift();
   }
   signalMax = 0;
   signalMin = 4096;
  },50);
  eventInterval = setInterval(function(){
    events.emit('data',audioArray.slice(0));
    audioArray = [];
    sampleCounter=1;
  },eventIntervalTime);
  audioDataInterval = setInterval(function(){
    var value = medianFun(average.slice(0));
    // var outString = "median value is " + value;
    // for(var i = 0; i<maxPeak/10;i++){
    //  outString += " ";
    // }
    // outString += "*";
    // console.log(outString);
    var micData = {"sample":sampleCounter,"median":value,"max":maxPeak,"min":minPeak};
    sampleCounter++;
    maxPeak = 0;
    minPeak = 4096;
    average = [];
    audioArray.push(micData);
  },audioDataIntervalTime)
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
function on_exit(){
  console.log("closing mic spi");
  localSpi.close();
}

 process.on('SIGINT',on_exit);
