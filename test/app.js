const dart = require('./../dart');

var sv = dart.Server()
	.route({
		path:/^\/$/i,
		render:new dart.response.TemplateHtmlResponse({
			filepath:'tmp/index.html',
			data(req,res){
				return {
					isMobile:req.isMobile
				};
			}
		})
	})
	.static()
	.start();