const mirth = require('./../mirth');

var sv = mirth.Server()
	.route({
		path:/^\/$/i,
		render:new mirth.response.JsonResponse({
			data(){
				return {test:'ha!!'};
			}
		})
	})
	.static()
	.start();