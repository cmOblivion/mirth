const fs = require('fs'),
	path = require('path');

function FileRouter(options){
	this.setOptions(options,{
		url:/\/static/i,
		localpath:'static',
		errRes:function(req,res){
			res.status = 404;
			res.head();
			res.send('404 Not Found!');
		}
	})
}

FileRouter.prototype.route = function(req,res){
	if(req.url.path.match(this.url)){
		let filepath = path.join(this.localpath,req.url.path.replace(this.url,''));
		let file = fs.createReadStream(filepath);
		errRes = this.errRes;
		function error(err){
			errRes.render(req,res);
			res.end();
		}
		file.on('error',error)
		file.pipe(res);
		res.ended = true;
	} else {
		return true;
	}
}

module.exports = FileRouter