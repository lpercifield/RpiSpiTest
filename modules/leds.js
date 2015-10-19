var _ = require('underscore-node');
var _gpio,
  yellowLed = 40,
  redLed = 38,
  heartbeatDelayTime = 5000,
  heartbeatOnTime = 1000;
var fault = true;
var faultCount = 0;
var faultTotal = 13;
var blinklength = 100,
blinknumber = 1,
blinkcount = 0,
blinkpin,
blinkcallback;
var on = 1;
var deviceStatus = {
  "am2302":false,
  "ext":false,
  "usb":{
    "cell":{"imei":false,"iccid":false},
    "ralink":false,
    "huawei":false
  },
  "mic":false,
  "gas":{"mq7":false,"mq135":false},
  "camera":false,
  "ethernet":false}
exports.setup = function(gpio){
  _gpio = gpio;
  _gpio.setup(yellowLed, _gpio.DIR_OUT,yellowReady);
  _gpio.setup(redLed, _gpio.DIR_OUT);
}
exports.setFaultStatus = function(object,status){
  deviceStatus[object] = status;
}
exports.initFaultStatus = function(status){
  deviceStatus = status;
  var result = [];
  _.chain(deviceStatus).filter(_.isObject).each(function(t) {
      _(t).each(function(val, key) {
          //if(val === true)
          result.push(t['item' + key.charAt(0).toUpperCase() + key.substr(1)])
      })
  });
  console.log(result.toString());
}
exports.faultCode = function(){
  for (var status in deviceStatus) {
   if (deviceStatus.hasOwnProperty(status)) {
     console.log(status + "="+deviceStatus[status]);
    }
  }
}
function faultBlink(){

}
function yellowReady(){
  //console.log("yellow ready");
  blinkLed(yellowLed,5,250,function(){});
  //faultCode();
}
var blinkLed = function(pin,numblinks,speed,callback){
  blinkpin = pin;
  blinknumber = numblinks;
  blinklength = speed;
  blinkcallback = callback;
  blink();
}
//   var count = 0;
  function blink() {
      if(blinkcount>=blinknumber){
  	     blinkcount=0;
         blinkcallback();
  	     return;
      }
      _gpio.write(blinkpin, 1);
      setTimeout(function() {
          _gpio.write(blinkpin, 0, blinkoff);
          blinkcount += 1;
      }, blinklength);
  }

  function blinkoff() {
    setTimeout(function(){
      _gpio.write(blinkpin, 0,blink);
    },blinklength);
  }
// }

function heartbeat(){
  //_gpio.write(yellowLed, false);
  setTimeout(function() {
    _gpio.write(yellowLed, true, function(err) {
      if (err) throw err;
      off();
    });
  }, heartbeatDelayTime);
}
function off() {
    setTimeout(function() {
      _gpio.write(yellowLed, false, function(err) {
        if (err) throw err;
        heartbeat();
      });
    }, heartbeatOnTime);
}
