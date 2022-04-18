const mirth = require('./../mirth');

var sv = mirth.Server()
	.route({
		path: /^\/$/i,
		render: new mirth.response.TemplateHtmlResponse({
			filepath:'tmp/index.html'
		})
	})
	.static()
	.start();
