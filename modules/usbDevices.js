var async = require("async");
var cp = require("child_process");
var ralinkcmd ="/usr/bin/lsusb | /bin/egrep Ralink";
var huaweicmd = "/usr/bin/lsusb | /bin/egrep Huawei";
var cellcmd = "/usr/bin/wvdial IMEI; exit 0";

exports.deviceIds = function(callbackMain){
  async.parallel({
    ralink: function(callback){
      cp.exec(ralinkcmd,function(error,stdout,stderr){
        if (error) throw error;
        if (stdout){
          var str = stdout.toString().trim();
          //console.log(str);
          callback(null,str);
        }
        if (stderr) throw stderr;
      });
    },
    huawei: function(callback){
      cp.exec(huaweicmd,function(error,stdout,stderr){
        if (error) throw error;
        if (stdout){
          var str = stdout.toString().trim();
          //console.log(str);
          callback(null,str);
        }
        if (stderr) throw stderr;
      });
    },
    cell: function(callback){
      cp.exec(cellcmd,function(error,stdout,stderr){
        if (error) throw error;
        if (stdout){
          //console.log("stdout "+stdout);
          var imeiRX= /\nAT\+CGSN\n(\d+)\n/
          var iccidRX = /\^ICCID: (\d+)\n/;
          var imei = stdout.match(imeiRX);
          var iccid = stdout.match(iccidRX);
          if(imei == null || iccid == null){
            callback("no modem");
          }else{
            var obj = {};
            obj["imei"] = imei[1];
            obj["iccid"] = iccid[1];
            callback(null,obj);
            console.log("imei: " + imei[1] + " iccid: " + iccid[1]);
          }

        }
        if (stderr){
          //console.log("Error "+ stderr);
          var imeiRX= /\nAT\+CGSN\n(\d+)\n/
          var iccidRX = /\^ICCID: (\d+)\n/;
          var imei = stderr.match(imeiRX);
          var iccid = stderr.match(iccidRX);
          if(imei == null || iccid == null){
            var obj = {};
            obj["imei"] = null;
            obj["iccid"] = null;
            callback(null,obj);
          }else{
            var obj = {};
            obj["imei"] = imei[1];
            obj["iccid"] = iccid[1];
            callback(null,obj);
            //console.log("imei: " + imei[1] + " iccid: " + iccid[1]);
          }
        }// throw stderr;
      });
    }
},
function(err, results) {
    // results is now equals to: {one: 1, two: 2}
    callbackMain(err,results);
});

}
