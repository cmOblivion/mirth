const TemplateHtmlResponse = require('../response/TemplateHtmlResponse');

module.exports = {
	type:'application',
	content:{
		name:'MirthTemplateEngine',
		options:{

		},
		install(sv,mirth,options){
			mirth.response.TemplateHtmlResponse = TemplateHtmlResponse.TemplateHtmlResponse;
			mirth.setTemplateEngine = function(engine){
				TemplateHtmlResponse.setEngine(engine);
			}
			mirth.template = TemplateHtmlResponse;
		}
	}
}