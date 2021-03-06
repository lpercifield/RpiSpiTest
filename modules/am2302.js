var EventEmitter = require('events'),
events = new EventEmitter();
var _gpio;
var sensorLib = require('node-dht-sensor');
var AM_PIN = 17;
var AM_RESET_PIN = 15;
var readingnumber = 0;
var readingInterval;
var readingTime = 60000;
var resetCount = 0;
var maxResets = 2;

exports.events = events;

//console.log("before gpio setup");
//gpio.setup(AM_PIN, gpio.DIR_OUT);
exports.setup = function(gpio,dataPin,resetPin,callback){
  _gpio = gpio;
  //AM_PIN = parseInt(dataPin);
  //AM_PIN = 17;
  //AM_RESET_PIN = parseInt(resetPin);
  //AM_RESET_PIN = 15;
  _gpio.setup(AM_RESET_PIN, _gpio.DIR_OUT, function(err){
    if (err){
      console.error(err);
      callback(false);
    } else{
      checkValues(callback);
    }
    //console.log("Calling amreset");

  });
}
//console.log("after gpio setup");

var sensor = {
    sensors: [ {
        name: "Indoor",
        type: 22,
        pin: AM_PIN
    }],
    read: function() {
        for (var a in this.sensors) {
            var b = sensorLib.readSpec(this.sensors[a].type, this.sensors[a].pin);
            readingnumber++;
            return b;
            // console.log("Reading Number: "+ readingnumber+" " +this.sensors[a].name + ": " +
            //   b.temperature.toFixed(1) + "C, " +
            //   b.humidity.toFixed(1) + "%" + " Errors: " + b.errors + " isValid: " + b.isValid);
        }
    }
};

function checkValues(callback){
  try {
    var reading = sensor.read();
    //console.log("HERE: temp: "+reading.temperature.toFixed(1)+ " humidity: "+reading.humidity.toFixed(1));
    if(reading.temperature.toFixed(1)==0.0 || reading.humidity.toFixed(1) ==0.0){
      amReset(function(){
        var reading2 = sensor.read();
        //console.log("after reset: temp: "+reading2.temperature.toFixed(1)+ " humidity: "+reading2.humidity.toFixed(1));
        if(reading2.temperature.toFixed(1)==0.0 || reading2.humidity.toFixed(1) ==0.0){
          callback(false);
        }else{
          //console.log("calling back from am2302");
          callback();
          startReadings();
        }
      });
    }else{
      //console.log("AM2302 check ok!");
      //var obj = {"temperature":reading.temperature.toFixed(1),"humidity":reading.humidity.toFixed(1)};
      callback();
      startReadings();
      //events.emit('data',obj);
    }
  } catch (e) {
    console.log(e)
    events.emit('error',e);
    //clearInterval(readingInterval);
    amReset(callback);
  }
}
exports.reset = function(callback){
  amReset(callback);
}
exports.read = function(){
  try {
    return sensor.read();
  } catch (e) {
    console.error(e);
    return e;
    //clearInterval(readingInterval);
    //amReset();
  }
}


var amReset = function(callback){
   //console.log("Starting AMRESET")
  _gpio.write(AM_RESET_PIN,0,function(err){
    if (err) callback(err);
    //console.error('RESETTING AM2302');
  });
  setTimeout(function(){
    _gpio.write(AM_RESET_PIN,1,function(err){
      if (err){
        console.error(err);
        callback(err);
      } else{
        //console.log('Power On AM2302');
        resetCount ++;
        setTimeout(function(){
          callback();
        },1000);
        //TODO check sensor values before calling back
      }
    });
  },5000);
}
// TODO: Maybe remove this or maybe use a call back on interval if we dont want to us timer in main loop
var startReadings = function(){
  readingInterval = setInterval(function(){
    try {
      var reading = sensor.read();
      var obj = {"temperature":reading.temperature.toFixed(1),"humidity":reading.humidity.toFixed(1)};
      events.emit('data',obj);
    } catch (e) {
      console.log(e)
      events.emit('error',e);
      clearInterval(readingInterval);
      //amReset();
    }
  },readingTime);
}
