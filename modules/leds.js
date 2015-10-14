var _gpio,
  yellowLed = 40,
  redLed = 38,
  heartbeatDelayTime = 5000,
  heartbeatOnTime = 250;
exports.setup = function(gpio){
  _gpio = gpio;
  _gpio.setup(yellowLed, _gpio.DIR_OUT,heartbeat);
  _gpio.setup(redLed, _gpio.DIR_OUT);
}
function heartbeat(){
  _gpio.write(yellowLed, false);
  setTimeout(function() {
    _gpio.write(yellowLed, false, function(err) {
      if (err) throw err;
      off();
    });
  }, heartbeatDelayTime);
}
function off() {
    setTimeout(function() {
      _gpio.write(yellowLed, true, function(err) {
        if (err) throw err;
        on();
      });
    }, heartbeatOnTime);
}
