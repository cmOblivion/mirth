const http = require('http'),
    url = require('url'),
    Url = require('./builtin/Url'),
    response = require('./response'),
    util = require('./util'),
    FileRouter = require('./builtin/FileRouter'),
    middlewares = require('./middlewares'),
    TemplateHtmlResponse = require('./response/TemplateHtmlResponse'),
    MirthViewEngine = require('./builtin/MirthViewEngine');

function Server(options){
    var sv = {
        options:{},
        router:[],
        middlewares:[]
    };
    sv.options.setOptions(options,{
        port:80,
        errRes:new response.Response({
            msg:'404 Not Found.',
            status:404
        }),
        autoInit:true,
        useCookie:true,
        useCheckMobile:true,
    });
    sv.server = new http.Server();

    function onRequest(req,res){
        res.headers = {};
        res.status = 200;
        res.ended = false;
        req.url = url.parse(req.url,true);
        req.method = req.method.toLowerCase();
        let success = false;
        var ifContinue = true;

        var i = 0;
        function next(){
            i++;
            if(i<sv.middlewares.length){
                sv.middlewares[i](req,res,next);
            } else {
                return;
            }
        }

        if(ifContinue){
            for(let i=0;i<sv.router.length;i++){
                if(!sv.router[i].route(req,res)){
                    success = true;
                    break;
                }
            }
            if(!res.ended){
                res.ended = false;
                if(success){
                    res.end();
                } else {
                    sv.options.errRes.render(req,res);
                    if(!res.ended) res.end();
                }
            }

        }
    }
    sv.server.on('request',onRequest);

    function start() {
        sv.server.listen(sv.options.port);
        console.log(`服务已运行在端口${sv.options.port}上！`);
        return sv;
    }
    sv.start = start;

    function route(options){
        sv.router.push(new Url(options));
        return sv;
    }
    sv.route = route;

    function static(options){
        sv.router.push(new FileRouter(options));
        return sv;
    }
    sv.static = static;

    function use(options){
        options.setOptions(options,{
            type:'middleware',
            content:function(req,res){}
        });
        if(options.type == 'middleware'){
            sv.useMiddleware(options.content);
        }
        return sv;
    }
    sv.use = use;

    function useMiddleware(content){
        if(typeof content == 'string'){
            content = require(content);
        }
        sv.middlewares.push(content);
    }
    sv.useMiddleware = useMiddleware;

    function setViewEngine(options){
        TemplateHtmlResponse.engine.engine = options.engine;
    }
    sv.setViewEngine = setViewEngine;

    function init(){
        if(sv.options.useCookie){
            sv.use(middlewares.cookie);
            delete sv.options.useCookie;
        }
        if(sv.options.useCheckMobile){
            sv.use(middlewares.checkMobile);
            delete sv.options.useCheckMobile;
        }
    }
    sv.init = init;
    if(sv.options.autoInit) init();

    return sv;
}

Object.prototype.setOptions = function (data,options) {
    if(data){
        for(let i in data){
            this[i] = data[i];
        }
    }
    for(let opt in options){
        if(!this[opt]){
            this[opt] = options[opt];
        }
    }
}

http.ServerResponse.prototype.head = function(){
    this.writeHead(this.status,this.headers);
    return this;
};
http.ServerResponse.prototype.send = function(){
    for(let i=0;i<arguments.length;i++){
        this.write(arguments[i]);
    }
    return this
};

Function.prototype.render = function(req,res){
    return this(req,res);
}

exports.Server = Server;
exports.Url = Url;
exports.response = response;
exports.util = util;
exports.FileRouter = FileRouter;
exports.middlewares = middlewares;
exports.MirthViewEngine = MirthViewEngine;