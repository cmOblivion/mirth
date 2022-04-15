function Response(options){
	this.setOptions(options,{
		msg:'Hi!This is the class Response!',
		status:200
	});
}

Response.prototype.render = function(req,res){
	res.status = this.status;
	res.head();
	res.send(this.msg);
}

module.exports = Response;