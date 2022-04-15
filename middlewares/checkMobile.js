const checkStr = /Android|webOS|iPhone|iPod|BlackBerry/i;

module.exports = {
	type:'middleware',
	content:function(req,res){
		req.isMobile = checkStr.test(req.headers['user-agent']);
	}
}