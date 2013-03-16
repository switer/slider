var fs = require('fs'),
	UglifyJS = require("uglify-js");

var result = UglifyJS.minify("codeMirrorThemes.js");
fs.writeFileSync('cm.theme.js', result.code, 'utf-8');