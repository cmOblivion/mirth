module.exports = {
	getDB(options){
		const MongoClient = require('mongodb').MongoClient;
		var client = new MongoClient(options.url);
		client.connect();
		return client.db(options.db);
	}
}