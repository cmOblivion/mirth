const Response = require('./Response');
const MirthViewEngine = require('./../builtin/MirthTemplateEngine');

engine = {
	engine:MirthViewEngine
}

autoData = [];

function TemplateHtmlResponse(options){
	this.setOptions(options,{
		filepath:'',
		errRes:new Response({
			msg:'404 Not Found!',
			status:404
		}),
		data:function(){
			return {};
		}
	});
}

TemplateHtmlResponse.prototype.render = function(req,res){
	res.headers['Content-Type'] = 'text/html';
	res.head();
	res.send(engine.engine.render(req,res,this.filepath,this.makeData(req,res)));
}

TemplateHtmlResponse.prototype.makeData = function(req,res){
	if(typeof this.data=='function'){
		data = this.data(req,res);
	} else {
		data = this.data;
	}
	for(let i in autoData){
		if(autoData.hasOwnProperty(i)){
			if(typeof this.data=='function'){
				data.setOptions(data,autoData[i](req,res));
			} else {
				data.setOptions(data,autoData[i]);
			}
		}
	}
	return data;
}

exports.setEngine = function(e){
	engine.engine = e;
}
exports.addAutoData = function(data){
	autoData.push(data);
}
exports.autoData = autoData;
exports.TemplateHtmlResponse = TemplateHtmlResponse;
exports.engine = engine;