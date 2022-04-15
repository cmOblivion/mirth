const Response = require('./Response');
const MirthViewEngine = require('./../MirthViewEngine');

engine = {
	engine:MirthViewEngine
}

function TemplateHtmlResponse(options){
	this.setOptions(options,{
		filepath:'',
		errRes:new Response({
			msg:'404 Not Found!',
			status:404
		}),
		data:function(){
			return {};
		},
		templateOptions:{

		}
	});
}

TemplateHtmlResponse.prototype.render = function(req,res){
	res.headers['Content-Type'] = 'text/html';
	if(typeof this.data=='function'){
		data = this.data(req,res);
	} else {
		data = this.data;
	}
	res.head();
	res.send(engine.engine.render(req,res,this.filepath,data,this.templateOptions));
}

exports.TemplateHtmlResponse = TemplateHtmlResponse;
exports.engine = engine;