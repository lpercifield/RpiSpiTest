var cp = require("child_process");
var cmd = "/usr/bin/lsusb | /bin/egrep Huawei";
var cmd2 = "/usr/bin/wvdial IMEI; exit 0";
cp.exec(cmd,function(error,stdout,stderr){
  if (error) throw error;
  if (stdout) console.log(stdout);
  if (stderr) throw stderr;
});
cp.exec(cmd2,function(error,stdout,stderr){
  if (error) throw error;
  if (stdout) console.log(stdout);
  if (stderr) throw stderr;
});
