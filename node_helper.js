/* Magic Mirror
 * Module: MagicMirror-Bose-Module
 *
 * By SpoturDeal https://github.com/
 * list enhancement & got rid of deprecated "request" dependency
 * MIT Licensed.
 */
var NodeHelper = require('node_helper');
var getBose = require('node-fetch');
var updateInterval = 10000 ;
var iplist = [] ;

module.exports = NodeHelper.create({
  start: function () {
    console.log('Bose helper started ...');
  },
  
  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
	if (notification === 'BOSE_READ') {
		updateInterval = payload.interval ;
		iplist = payload.boselist ;
		this.boseFetcher() ;
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
	  
  readAllboses: async function (iplist) {
	if (!Array.isArray(iplist)) { iplist = [iplist] } ;
	console.log("DEBUG in readALLBoses:", iplist) ;
	var answer ;
	for (let ip of iplist) {
		  console.log("ip = ", ip) ;
//		  answer = await this.readOnebose("http://"+ ip + ":8090/now_playing") ;
		answer = { res : "empty" , body: ("DEBUG info on MUSIC:" + ip) };
		  if (answer.res === "full") { break} ;
	};
	console.log('RETURN: ', answer) ;
	return answer ;
  },
	
	boseFetcher: function() {
		var self = this ;
		(async () => {
			console.log('ASK for result:', iplist);
			const result = await this.readAllboses(iplist);
			console.log('GOTTEN result', result);
			if (result.res != "error") {
				console.log("I now send to module: ", result.body);
				this.sendSocketNotification('BOSE_DATA', result.body);
			}
		})();
		setTimeout(function(){ self.boseFetcher();}, updateInterval )
	},	
  
});