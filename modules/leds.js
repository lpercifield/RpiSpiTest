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
blinkpin;
var on = 1;
var faultStatus = {
  "AM2302":true,
"ext1":true,
"ext2":true,
"ext3":true,
"wlan0":true,
"wlan1":true,
"imei":true,
"iccid":true,
"mic":true,
"MQ7":true,
"MQ135":true,
"Camera":true,
"Ethernet":true
}
exports.setup = function(gpio){
  _gpio = gpio;
  _gpio.setup(yellowLed, _gpio.DIR_OUT,yellowReady);
  _gpio.setup(redLed, _gpio.DIR_OUT);
}
exports.setFaultStatus = function(object,status){
  faultStatus[object] = status;
}
function faultCode(){
  for (var status in errorStatus) {
   if (errorStatus.hasOwnProperty(status)) {
     console.log(status + "="+errorStatus[status]);
    }
  }
}
function faultBlink(){

}
function yellowReady(){
  console.log("yellow ready");
  blinkLed(yellowLed,5,250);
}
var blinkLed = function(pin,numblinks,speed){
  blinkpin = pin;
  blinknumber = numblinks;
  blinklength = speed;
  blink();
}
//   var count = 0;
  function blink() {
      if(blinkcount>=blinknumber){
  	     blinkcount=0;
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
