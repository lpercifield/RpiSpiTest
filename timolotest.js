var PythonShell = require('python-shell');


// sends a message to the Python script via stdin
//pyshell.send('hello');
var options = {
  mode: 'json',
  scriptPath: '/home/pi/pi-timolo'
};
var timolo = new PythonShell('pi-timolo.py',options);

timolo.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log("Timolo " + message.hasOwnProperty('timolo'));
  console.log("Motion " + message.hasOwnProperty('motion'));
  console.log("Timelapse " + message.hasOwnProperty('timelapse'));
  console.log(message);
});
timolo.on('error', function (message) {
  console.log(message);
});
timolo.on('close', function (message) {
  console.log(message);
});
setTimeout(function(){
  // end the input stream and allow the process to exit
  timolo.end(function (err) {
    if (err) throw err;
    console.log('finished');
  });
},60000);
//fix
