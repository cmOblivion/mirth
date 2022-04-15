const Response = require('./Response'),
	FileResponse = require('./FileResponse'),
	HtmlResponse = require('./HtmlResponse'),
	TemplateHtmlResponse = require('./TemplateHtmlResponse'),
	JsonResponse = require('./JsonResponse');

exports.Response = Response;
exports.FileResponse = FileResponse;
exports.HtmlResponse = HtmlResponse;
exports.TemplateHtmlResponse = TemplateHtmlResponse.TemplateHtmlResponse;
exports.JsonResponse = JsonResponse;