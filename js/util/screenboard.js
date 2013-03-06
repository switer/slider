!function (global) {

	var screenBoard = {};
	global.screenBoard = screenBoard;

	screenBoard.create = function () {
		var scales = ["4:3", '16:9', '2:1', '1:1'],
			scaleElem, 
			$scaleElem,
			closeMenu = document.createElement('div'),
			board = document.createElement('div');

		closeMenu.className = 'close-menu';
		board.className = 'panel1 screen-box';
		$(closeMenu).attr('style', 'top:-10px;right:-10px').on('click', function (e) {$(board).hide();})
		$(board).attr('style', 'left: 90px;top:20px');
		for (var i = 0; i < scales.length;i ++) {
			scaleElem = document.createElement('div');
			$scaleElem = $(scaleElem);
			scaleElem.className = 'screen-scale';
			$scaleElem.data('value', scales[i]).html(scales[i]);
			$(board).append(scaleElem);
		}
		$(board).append(closeMenu);
		return board;
	}
	
	screenBoard.listen = function (elem, callback) {
		$(elem).on('click .screen-scale', function (e) {
			var $tar = $(e.target)
			if ( !$tar.hasClass('screen-scale') ) return;
			var value = $tar.data('value');
			callback && callback.call(global, value);
		});
	}
}(window)