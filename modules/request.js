var request = require('request');
var host;
exports.setup = function(hostinfo){
  host = hostinfo;
}
exports.sendPost = function(jsonData,path,callback){
  request({
      url: host+path,
      method: "POST",
      json: jsonData
  }, function (error, response, body) {
  if (!error && response.statusCode === 200) {
      //console.log(body)
      callback(null,body);
  }
  else {

      console.log("error: " + error)
      callback(error);
      // console.log("response.statusCode: " + response.statusCode)
      // console.log("response.statusText: " + response.statusText)
  }
});
}
