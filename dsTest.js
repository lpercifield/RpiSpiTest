var sensor = require('ds18x20');
var isLoaded = sensor.isDriverLoaded();
console.log(isLoaded);
if(!isLoaded){
  try {
    sensor.loadDriver();
    console.log('driver is loaded');
  } catch (err) {
      console.log('something went wrong loading the driver:', err)
  }
}
var listOfDeviceIds = sensor.list();
console.log(listOfDeviceIds);
var tempObj = sensor.getAll();
console.log(tempObj);
