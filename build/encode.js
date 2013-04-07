/**
	此脚本用于构建主页引用文件数据包sourceMap
**/
var fs 		= require('fs'),
	file 	= 'index.html',
	cmpJS 	= '../sourceMap.js';
	source  =  {
		'footer' 		: 'footer.html',
		'header' 		: 'header.html',
		'blogHeader' 	: 'blogHeader.html',
		'blogFooter' 	: 'blogFooter.html',
		'cmThemeJS' 	: 'cm.theme.js',
		'cmThemeCSS' 	: 'codeMirrorThemes.css',
		'cmJS' 			: 'codeMirrorJS.js',
		'cmCSS' 		: 'codeMirrorCSS.css',
		'animationCSS'	: 'animation.css',
		'drawJS'		: 'drawJS.js',
		'zepto'			: 'zepto.min.js'
	}

var ctn,
	sourceMap = {};
for (var name in source) {
	ctn = fs.readFileSync(source[name], 'UTF-8');
	sourceMap[name] = ctn;
}
fs.writeFileSync(cmpJS, 'window._sourceMap = ' + JSON.stringify(sourceMap), 'UTF-8');