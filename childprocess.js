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
    var search = "^AT\\+CGSN\\n(\\d+)\\n";
    var search2 = "\^ICCID: \"(\\d+)\"";
    var wvdialres = stdout.match(search);
    var iccres = stdout.match(search2);
    console.log("wvdialres: " + wvdialres.toString() + " iccres: " + iccres.toString());
  }
  if (stderr){
    var search = "^AT\\+CGSN\\n(\\d+)\\n";
    var search2 = "\^ICCID: \"(\\d+)\"";
    var wvdialres = stderr.match(search);
    var iccres = stderr.match(search2);
    console.log("wvdialres: " + wvdialres.toString() + " iccres: " + iccres.toString());
  }// throw stderr;
});
