const fs = require('fs');

function renderTmp(rule,content){
	var match = content.text.match(rule.template);
	while(match){
		rule.action(match,content);
		match = content.text.match(rule.template);
	}
}

module.exports = {
	render:function(request,response,filepath,dt){
		function envirement(){
			var req = request
				,res = response
				,data = dt
				,ct = {};
			function ev(str){
				return eval(str);
			}
			return ev;
		}
		let content = {text:fs.readFileSync(filepath).toString()};
		content.eval = envirement();
		for(let i=0;i<this.rules.length;i++){
			renderTmp(this.rules[i],content);
		}
		return content.text;
	},
	rules:[
		{   /* 继承 */
			template:/<< extend ['"](.*)['"] >>/i,
			action:function(match,content){
				content.blocks = {};
				content.isEnd = false;
				for(let i=0;i<this.rules.length;i++){
					renderTmp(this.rules[i],content);
				}
				content.text = fs.readFileSync(match[1]).toString();
				content.isEnd = true;
				for(let i=0;i<this.rules.length;i++){
					renderTmp(this.rules[i],content);
				}
			},
			rules:[
				{	/* 块式继承 */
					template:/<< block (\w+) >>((?:(?!<< endblock >>).)*)<< endblock >>/is,
					action:function(match,content){
						if(!content.isEnd){
							content.blocks[match[1]] = match[2];
							content.text = content.text.replace(this.template,'');
						} else {
							if(!content.blocks[match[1]]){
								content.blocks[match[1]] = match[2];
							}
							content.text = content.text.replace(this.template,content.blocks[match[1]]);
						}
					}
				},
			]
		},
		{
			/* for 循环 */
			template:/<< for (.*) in (.*) >>((?:(?!<< endfor >>)[\w\W])*)<< endfor >>/i,
			action:function(match,content){
				var str = ''
					,dt = content.eval(match[2])
					,m = 1
					,c;
				for(let i in dt){
					if(dt.hasOwnProperty(i)){
						c = ''+dt[i];
						while(/(?<!\\)'/.test(c)){
							c = c.replace(/(?<!\\)'/,"\\'");
						}
						while(/(?<!\\)"/.test(c)){
							c = c.replace(/(?<!\\)"/,'\\"');
						}
						content.eval('ct.'+match[1]+m+"='"+c+"';");
						str += match[3].replace(new RegExp(match[1]),'ct.'+match[1]+m);
						m++;
					}
				}
				content.text = content.text.replace(this.template,str);
			}
		},
		{
			/* if else 条件句 */
			template:/<<\? (.*) >>((?:(?!<<\!>>)[\w\W])*)<<\!>>((?:(?!<<\?>>)[\w\W])*)<<\?>>/i,
			action:function(match,content){
				if(content.eval(match[1])){
					content.text = content.text.replace(this.template,match[2]);
				} else {
					content.text = content.text.replace(this.template,match[3]);
				}
			}
		},
		{
			/* if 条件句 */
			template:/<<\? (.*) >>((?:(?!<<\?>>)[\w\W])*)<<\?>>/i,
			action:function(match,content){
				if(content.eval(match[1])){
					content.text = content.text.replace(this.template,match[2]);
				} else {
					content.text = content.text.replace(this.template,'');
				}
			}
		},
		{
			/* 直接执行js代码 */
			template:/<<:((?:(?!>>).)*)>>/is,
			action:function(match,content){
				content.text = content.text.replace(this.template,'');
				content.eval(match[1]);
			}
		},
		{
			/* 输出数据 */
			template:/<<= (.*) >>/i,
			action:function(match,content){
				content.text = content.text.replace(this.template,content.eval(match[1]));
			}
		},
	]
}