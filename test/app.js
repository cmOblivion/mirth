const mirth = require('./../mirth');

var server = new mirth.Server()
    .install('db')
    .start();