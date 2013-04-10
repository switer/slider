var fs = require('fs'),
	UglifyJS = require("uglify-js");

exports.min = function () {
	var result = UglifyJS.minify("codemirror/codeMirrorThemes.js");
	fs.writeFileSync('codemirror/cm.theme.js', result.code, 'utf-8');
}