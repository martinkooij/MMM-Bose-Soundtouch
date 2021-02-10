/* Magic Mirror
 * Module: MagicMirror-Bose-Module
 *
 * By SpoturDeal https://github.com/
 * list enhancement & got rid of deprecated "request" dependency
 * MIT Licensed.
 */
var NodeHelper = require('node_helper');
var getBose = require('node-fetch');

module.exports = NodeHelper.create({
  start: function () {
    console.log('Bose helper started ...');
  },
  
  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, url) {
    if (notification === 'BOSE_READ') {
        console.log(notification, url);
		const result = this.readAllboses(url);
        if (result.res != "error") {
		  console.log(result.body);
		  self.sendSocketNotification('BOSE_DATA', result.body);
		}
      }
  },
  
  readOnebose: async function(endpoint) {
	const regexp = /source="INVALID_SOURCE"|source="STANDBY"/ ;
	try {
		const res = await getBose(endpoint) ;
		const data = await res.text;
		console.log(endpoint, "=" , data) ;
		if (data.search(regexp) != -1) {
			return {res: "empty" , body: data} ;
		}
		return {res: "full" , body: data} ;
	} catch (err) {
		return {res: "error" , body: err};
	}
  },
	  
  readAllboses: function (iplist) {
  if (!Array.isArry(urllist)) { iplist = [iplist] } ;
  var firstanswer ;
  (async () => {
	  var answer ;
	  for (let ip in iplist) {
		  console.log("ip = ", ip) ;
		  answer = await this.readOnebose("http://"+ ip + ":8090/now_playing") ;
		  if (answer.res === "full") { break} ;
	  }
	  firstanswer = answer ;
  })() ;
  return firstanswer ;
  }
	 
  
});