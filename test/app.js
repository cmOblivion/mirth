const mirth = require('./../mirth');

var sv = mirth.Server()
	.route({
		path: /^\/$/i,
		render: function (req,res) {
			console.log(req.body);
		}
	})
	.static()
	.start();