const Response = require('./Response'),
	fs = require('fs');

function FileResponse(options){
	this.setOptions(options,{
		filepath:'',
		errRes:new Response({
			msg:'404 Not Found!',
			status:404
		}),
		filetype:null,
	});
}

FileResponse.prototype.render = function(req,res){
	let file = fs.createReadStream(this.filepath);
	if(this.filetype){
		res.headers['Content-Type'] = this.filetype;
	}
	res.head();
	errRes = this.errRes;
	function error(err){
		errRes.render(req,res);
		res.end();
	}
	file.on('error',error);
	file.pipe(res);
	res.ended = true;
}

module.exports = FileResponse;