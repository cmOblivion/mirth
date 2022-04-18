function JsonResponse(options){
	this.setOptions(options,{
        data:function(req,res){
            return {};
        }
	});
}

JsonResponse.prototype.render = function(req,res){
    if(typeof this.data=='function'){
        data = this.data(req,res);
    } else {
        data = this.data;
    }
    res.headers['Content-Type'] = 'application/json';
    res.head().send(JSON.stringify(data));
}

module.exports = JsonResponse;