const FileResponse = require('./FileResponse');

function HtmlResponse(options){
	new_options = {};
	new_options.setOptions(options,{});
	new_options.filetype = 'text/html';
	return new FileResponse(new_options);
}

module.exports = HtmlResponse;