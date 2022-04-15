var r = /<< block (\w+) >>((?:(?!<< endblock >>).)*)<< endblock >>/is;

var s = `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
</head>
<body>
	<< block content >>
	111
	<< endblock >>
</body>
</html>`

console.log(s.match(r));
