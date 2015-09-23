var request = require('request');
var sendPost = function(jsonData,path){
  request({
      url: 192.168.2.210:1880/path,
      method: "POST",
      json: jsonData
  }, function (error, response, body) {
  if (!error && response.statusCode === 200) {
      console.log(body)
  }
  else {

      console.log("error: " + error)
      console.log("response.statusCode: " + response.statusCode)
      console.log("response.statusText: " + response.statusText)
  }
});
}
var json = {"MQ7":1234,"MQ135":5678};
sendPost(json,"air");
