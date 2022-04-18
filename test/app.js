const mirth = require('./../mirth');

var app1 = {
	content:{
		options:{
			data1:1
		},
		install(sv,options){
			sv.route({
				path: /^\/$/i,
				render: new mirth.response.TemplateHtmlResponse({
					filepath:'tmp/index.html',
					data:{
						a:options.data1
					}
				})
			})
		}
	}
}

var sv = mirth.Server()
	.install(app1,{
		data1:2
	})
	.static()
	.start();
