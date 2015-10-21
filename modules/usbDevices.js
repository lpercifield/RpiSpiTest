var async = require("async");
var cp = require("child_process");
var ralinkcmd ="/usr/bin/lsusb | /bin/egrep Ralink";
var huaweicmd = "/usr/bin/lsusb | /bin/egrep Huawei";
var cellcmd = "/usr/bin/wvdial IMEI; exit 0";
var getserial = "cat /proc/cpuinfo | grep Serial | cut -d ':' -f 2";
var diskspacecmd = "df -h | grep -E '^/dev/root' | grep -E ' /$' | awk '{ print $5+0}'";

exports.deviceIds = function(callbackMain){
  async.series({
    ralink: function(callback){
      cp.exec(ralinkcmd,function(error,stdout,stderr){
        if (error){
          callback(null,false);
        }else if (stdout){
          var str = stdout.toString().trim();
          var ralinkObj = {};
          var lines = str.split(/(\r?\n)/g);
          if(lines.length > 1){
            lines.splice(1,1);
            //console.log(lines.toString());
          }
            for (var i=0; i<lines.length; i++) {
              var str = "wlan"+i;
              // Process the line, noting it might be incomplete.
              ralinkObj[str] = lines[i];
            }
            if(lines.length <=1){
              ralinkObj.wlan1 = false;
            }
          //TODO: check for second device
          //console.log(str);
          callback(null,ralinkObj);
        }
        else if (stderr) callback(null,false);
      });
    },
    huawei: function(callback){
      cp.exec(huaweicmd,function(error,stdout,stderr){
        if (error) callback(null,false);
        if (stdout){
          var str = stdout.toString().trim();
          //console.log(str);
          callback(null,str);
        }
        if (stderr) callback(null,false);
      });
    },
    cell: function(callback){
      cp.exec(cellcmd,function(error,stdout,stderr){
        if (error) {
          //console.log("error "+error);
          var imeiRX= /\nAT\+CGSN\n(\d+)\n/
          var iccidRX = /\^ICCID: "(\d+)\n/;
          var imei = stdout.match(imeiRX);
          var iccid = stdout.match(iccidRX);
          var obj = {};
          if(imei == null){
            obj["imei"] = false;
          }else{
            obj["imei"] = imei[1];
          }
          if(iccid == null){
            obj["iccid"] = false;
          }else{
            obj["iccid"] = iccid[1];
          }
          callback(null,obj);
        }
        if (stdout){
          //console.log("stdout "+stdout);
          var imeiRX= /\nAT\+CGSN\n(\d+)\n/
          var iccidRX = /\^ICCID: "(\d+)\n/;
          var imei = stdout.match(imeiRX);
          var iccid = stdout.match(iccidRX);
          var obj = {};
          if(imei == null){
            obj["imei"] = false;
          }else{
            obj["imei"] = imei[1];
          }
          if(iccid == null){
            obj["iccid"] = false;
          }else{
            obj["iccid"] = iccid[1];
          }
          callback(null,obj);

        }
        if (stderr){
          //console.log("stderr "+ stderr);
          var imeiRX= /\nAT\+CGSN\n(\d+)\n/
          var iccidRX = /\^ICCID: "(\d+)"\n/;
          var imei = stderr.match(imeiRX);
          var iccid = stderr.match(iccidRX);
          var obj = {};
          if(imei == null){
            obj["imei"] = false;
          }else{
            obj["imei"] = imei[1];
          }
          if(iccid == null){
            obj["iccid"] = false;
          }else{
            obj["iccid"] = iccid[1];
          }
          callback(null,obj);
        }// throw stderr;
      });
    },
    serial: function getSerial(callback) {
      cp.exec(getserial,function(error,stdout,stderr){
        if (error){
          console.error(error);
          callback(error);
        }
        if (stdout){

          var str = stdout.toString().trim();
          //serial = str;
          //console.log(str);
          callback(null,str);
        }
        if (stderr){
          console.error(stderr);
          callback(stderr);
        }
      });
    }
},
function(err, results) {
    // results is now equals to: {one: 1, two: 2}
    callbackMain(err,results);
});

}

exports.getDiskSpace = function(){
  cp.exec(diskspacecmd,function(error,stdout,stderr){
    if(error) console.error(error)
    if(stderr) console.error(stderr);
    if(stdout){
      return stdout.toString();
    }
  }
}
