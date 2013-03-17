var fs 		= require('fs'),
	file 	= 'index.html',
	cmpJS 	= '../sourceMap.js';
	source  =  {
		'footer' 		: 'footer.html',
		'header' 		: 'header.html',
		'cmThemeJS' 	: 'cm.theme.js',
		'cmThemeCSS' 	: 'codeMirrorThemes.css',
		'cmJS' 			: 'codeMirrorJS.js',
		'cmCSS' 		: 'codeMirrorCSS.css',
		'animationCSS'	: 'animation.css'
	}

var ctn,
	sourceMap = {};
for (var name in source) {
	ctn = fs.readFileSync(source[name], 'UTF-8');
	sourceMap[name] = ctn;
}
fs.writeFileSync(cmpJS, 'window._sourceMap = ' + JSON.stringify(sourceMap), 'UTF-8');