  var regex = /^AT\\+CGSN\\n(\\d+)\\n$/
  var regex2 = /\nAT\+CGSN\n(\d+)\n/
  var stringToTest = "--> Sending: AT+CGSN\nAT+CGSN\n355270047442322\nOK\n---> Sending: AT^ICCID?\nAT^ICCID?\n^ICCID: 98555023010073579185\nOK";
  var search2 = /\^ICCID: (\d+)\n/;
  var wvdialres = stringToTest.match(regex2);
  var iccres = stringToTest.match(search2);
  console.log("wvdialres: " + wvdialres[1] + " iccres: " + iccres[1]);
