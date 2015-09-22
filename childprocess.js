var cp = require("child_process");
var cmd = "/usr/bin/lsusb | /bin/egrep Huawei";
cp.exec(cmd,function(error,stdout,stderr){
  if (error) throw error;
  if (stout) console.log(stdout);
  if (stderr) throw stderr;
});
