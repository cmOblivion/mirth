function Url(options){
	this.setOptions(options,{
		path:/\//i,
		render:function(req,res){
			res.head().send('Hello!');
			return true;
		},
		name:'homepage',
		method:null,
	});
}

Url.prototype.route = function(req,res){
	if(this.method){
		if(this.method==req.method){
			return this.response(req,res);
		} else {
			return true;
		}
	}
	else{
		return this.response(req,res);
	}
}
Url.prototype.response = function(req,res){
	let matchResult = req.url.path.match(this.path);
	if(matchResult){
		if(matchResult.length>1){
			req.props = matchResult.slice(1,matchResult.length);
		} else {
			req.props = [];
		}
		return this.render.render(req,res);
	} else {
		return true;
	}
}

module.exports = Url;