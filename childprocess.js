var cp = require("child_process");
var ralink ="/usr/bin/lsusb | /bin/egrep Ralink";
var huawei = "/usr/bin/lsusb | /bin/egrep Huawei";
var cmd2 = "/usr/bin/wvdial IMEI; exit 0";

cp.exec(ralink,function(error,stdout,stderr){
  if (error) throw error;
  if (stdout) console.log(stdout);
  if (stderr) throw stderr;
});
cp.exec(huawei,function(error,stdout,stderr){
  if (error) throw error;
  if (stdout) console.log(stdout);
  if (stderr) throw stderr;
});
cp.exec(cmd2,function(error,stdout,stderr){
  if (error) throw error;
  if (stdout){
    console.log(stderr);
    var wvdialresRX= /\nAT\+CGSN\n(\d+)\n/
    var iccresRX = /\^ICCID: (\d+)\n/;
    var wvdialres = stdout.match(wvdialresRX);
    var iccres = stdout.match(iccresRX);
    console.log("wvdialres: " + wvdialres[1] + " iccres: " + iccres[1]);
  }
  if (stderr){
    console.log(stderr);
    var wvdialresRX= /\nAT\+CGSN\n(\d+)\n/
    var iccresRX = /\^ICCID: (\d+)\n/;
    var wvdialres = stderr.match(wvdialresRX);
    var iccres = stderr.match(iccresRX);
    console.log("wvdialres: " + wvdialres[1] + " iccres: " + iccres[1]);
  }// throw stderr;
});
