const mirth = require('./../mirth');

var server = new mirth.Server()
	.install('./applications/user')
	.start();