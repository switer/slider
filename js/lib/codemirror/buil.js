var fs = require('fs'),
	uglidfy = require('uglify-js'),
	file = "codemirror.js",
	minFile = 'codemirror.min.js',
	content = uglidfy.minify(file).code;

	fs.writeFileSync(minFile, content, 'utf-8')