const https = require('http');

var i = 0;
while(true){
	console.log(++i);
	https.get('http://suzhouzhenhua.com/',function(res){
		res.resume();
		res.end();
	});
}