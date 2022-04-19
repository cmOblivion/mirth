const mirth = require('./../mirth');

var sv = mirth.Server()
	.install('db')
	.static()
	.start();
