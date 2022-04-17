const http = require('http');

module.exports = {
	type:'middleware',
	content:function(req,res,next){
		req.cookie = {};
		let ckstr = req.headers.cookie;
		if(ckstr){
			ckstr.split(';').forEach(item=>{
				if(!item){
					return;
				}
				let arr=item.split('=');
				req.cookie[arr[0]] = arr[1];
			});
		}
		next();
	}
}

http.ServerResponse.prototype.cookie = function(options){
	this.headers['Set-Cookie'] = '';
	for(let i in options){
		if(options.hasOwnProperty(i)){
			if(i=='expires'){
				let time = new Date();
				time.setTime(time.getTime()+1000*60*60*24*options[i]);
				this.headers['Set-Cookie'] += 'expires' + '=' + time.toGMTString() + ';';
			} else{
				this.headers['Set-Cookie'] += i + '=' + options[i] + ';';
			}
		}
	}
	console.log(this.headers)
	return this;
}