/**
	此脚本用于构建主页引用文件数据包sourceMap
**/
var fs 		= require('fs'),
	cmMinify = require('./min-build.js'),
	file 	= 'index.html',
	cmpJS 	= '../sourceMap.js',
	source  =  {
		'footer' 		: 'footer.html',
		'header' 		: 'header.html',
		'blogHeader' 	: 'blog/blogHeader.html',
		'blogFooter' 	: 'blog/blogFooter.html',
		'cmThemeJS' 	: 'codemirror/cm.theme.js',
		'cmThemeCSS' 	: 'codemirror/codeMirrorThemes.css',
		'cmJS' 			: 'codemirror/codeMirrorJS.js',
		'cmCSS' 		: 'codemirror/codeMirrorCSS.css',
		'animationCSS'	: 'animation.css',
		'drawJS'		: 'drawJS/drawJS.js',
		'zepto'			: 'zepto.min.js',
		'impressCSS' 	: 'impress/impress-demo.css',
		'impressJS' 	: 'impress/impress.js',
		'impressHeader' : 'impress/impressHeader.html',
		'impressFooter' : 'impress/impressFooter.html',
	}
console.log('minify codemirror themes');
cmMinify.min();
var ctn,
	sourceMap = {};
console.log('create sourceMap object');
for (var name in source) {
	ctn = fs.readFileSync(source[name], 'UTF-8');
	sourceMap[name] = ctn;
}
console.log('write sourceMap file');
fs.writeFileSync(cmpJS, 'window._sourceMap = ' + JSON.stringify(sourceMap), 'UTF-8');