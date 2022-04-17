const body = require("body/any");

module.exports = {
    type:'middleware',
    content(req,res,next){
        if(req.method==='post'){
            function parse(err,body){
                if(err) throw err;
                req.body = body;
                next();
            }
            body(req,res,parse);
        } else {
            req.body = {};
        }
    }
}