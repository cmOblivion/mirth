module.exports = {
	type:'application',
	content:{
		name:'db',
		options:{
			type:'mongodb', // It can be 'mongodb' only.
			url:'mongodb://127.0.0.1:27017',
			db:'mirth'
		},
		dbList:{
			'mongodb':'./mongodb'
		},
		install(sv,options){
			const dbc = require(this.dbList[options.type]);
			sv.db = dbc.getDB(options);
			console.log(options.type+'数据库'+options.db+'连接成功！');
		}
	}
}