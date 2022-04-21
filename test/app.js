const mirth = require('./../mirth');

function getUser(req){
	if(req.cookie.username&&req.cookie.password){
		return {
			user:{
				logined:true,
				username:req.cookie.username
			}
		}
	} else {
		return {
			user:{
				logined:false,
			}
		}
	}
}

var sv = new mirth.Server()
	.route({
		path:/^\/$/,
		render:new mirth.response.TemplateHtmlResponse({
			filepath:'tmp/index.html',
			data(req,res){
				return {
					dt:[1,7,'Oh!"\'\'\'\'""']
				}
			}
		}),
		method:'get'
	})
	.route({
		path:/^\/login$/,
		render:new mirth.response.TemplateHtmlResponse({
			filepath:'tmp/login.html',
			data(req,res){
				return {

				}
			}
		}),
		method:'get'
	})
	.install('db')
	.static()
	.start();

mirth.template.addAutoData(getUser);