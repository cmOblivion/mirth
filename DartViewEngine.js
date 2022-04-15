const fs = require('fs');

function renderTmp(rule,content){
	var match = content.text.match(rule.template);
	while(match){
		rule.action(match,content);
		match = content.text.match(rule.template);
	}
}

module.exports = {
	name:'DartViewEngine',
	render:function(filepath,dt,options){
		function envirement(){
			var data = dt;
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
		{   /* 继承模板 */
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
				{	/* 块式继承模板 */
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
			template:/<<:(.*):>>/is,
			action:function(match,content){
				content.text = content.text.replace(this.template,'');
				content.eval(match[1]);
			}
		},
		{
			template:/<<= (.*) >>/i,
			action:function(match,content){
				content.text = content.text.replace(this.template,content.eval(match[1]));
			}
		},
	]
}