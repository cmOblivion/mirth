const http = require('http'),
    url = require('url'),
    Url = require('./builtin/Url'),
    response = require('./response'),
    util = require('./util'),
    FileRouter = require('./builtin/FileRouter'),
    TemplateHtmlResponse = require('./response/TemplateHtmlResponse'),
    MirthViewEngine = require('./builtin/MirthViewEngine');

function Server(options){
    var sv = {
        options:{},
        router:[],
        middlewares:[],
        applications:[],
    };
    sv.options.setOptions(options,{
        port:80,
        errRes:new response.Response({
            msg:'404 Not Found.',
            status:404
        }),
        autoInit:true,
        autoMiddlewares:[
            './middlewares/cookie',
            './middlewares/checkMobile',
            './middlewares/body-parser'
        ],
        useMiddlewares:[
            
        ],

    });
    sv.server = new http.Server();

    function onRequest(req,res){
        res.headers = {};
        res.status = 200;
        res.ended = false;
        req.url = url.parse(req.url,true);
        req.method = req.method.toLowerCase();
        let success = false;

        var i = 0;
        function next(){
            i++;
            if(i<sv.middlewares.length){
                sv.middlewares[i](req,res,next);
            } else {
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
        next();
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
        if(typeof options == 'string'){
            options = require(options);
        }
        options.setOptions(options,{
            type:'middleware',
            content:function(req,res,next){}
        });
        useOrInstall(options);
        return sv;
    }
    sv.use = use;

    //安装中间件实际代码
    function useMiddleware(content){
        sv.middlewares.push(content);
    }
    sv.useMiddleware = useMiddleware;

    function install(app,options){
        if(typeof app == 'string'){
            app = require(app);
        }
        app.setOptions(app,{
            type:'application',
            content:function(req,res,next){}
        });
        useOrInstall(app,options);

        return sv;
    }
    sv.install = install;

    //安装应用实际代码
    function installApplication(content,options){
        sv.applications.push(content);
        content.install(sv,{}.setOptions(options,content.options));
    }
    sv.installApplication = installApplication;

    function useOrInstall(c,options){
        if(c.type === 'middleware'){
            sv.useMiddleware(c.content);
        } else if(c.type === 'application') {
            sv.installApplication(c.content,options);
        }
    }

    function setViewEngine(options){
        TemplateHtmlResponse.engine.engine = options.engine;
    }
    sv.setViewEngine = setViewEngine;

    function init(){
        for(let i in sv.options.autoMiddlewares){
            if(sv.options.autoMiddlewares.hasOwnProperty(i)){
                sv.use(sv.options.autoMiddlewares[i]);
            }
        }
        for(let i in sv.options.useMiddlewares){
            if(sv.options.useMiddlewares.hasOwnProperty(i)){
                sv.use(sv.options.useMiddlewares[i]);
            }
        }
    }
    sv.init = init;
    if(sv.options.autoInit) init();

    return sv;
}

Object.prototype.setOptions = function (data,options) {
    if(data!==undefined){
        for(let i in data){
            if(data.hasOwnProperty(i)) this[i] = data[i];
        }
    }
    for(let opt in options){
        if(this[opt]===undefined){
            this[opt] = options[opt];
        }
    }
    return this;
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
exports.MirthViewEngine = MirthViewEngine;