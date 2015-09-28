var PythonShell = require('python-shell');
var timolo = new PythonShell('~/pi-timolo/pi-timolo.py');

// sends a message to the Python script via stdin
//pyshell.send('hello');

timolo.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
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
