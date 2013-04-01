Core.registerModule("shapebar", function(sb){
    var global;
	return {
		init : function () {
			global = this;
			sb.listen({
                "enterEditorMode":this.enterEditorMode,
                "enterPreviewMode":this.enterPreviewMode,
                "windowResize":this.windowResize 
            });
			$('.shape-icon').on('click', function (e) {
				var $target = $(e.target),
					type = $target.data('type');
					// color = 'blue';
				global._chooseColor(e, function (color) {
					var shapeData = sb.drawShape(type, color);
					sb.notify({
						type : 'addImage',
						data : {
							'shape' : true,
							'value' : shapeData
						}
					})
				});
			})
			var $bar = $('#shapebar');
            $bar.on('click', function (evt) {
                if ($(evt.target)[0].id !== 'shapebar') return; 
                if ( $bar.hasClass("l-sb") ) $bar.removeClass('l-sb')
                else $bar.addClass('l-sb');
            })

			var cb = window.colorboard.create(function (value) {
                global._chooseColorCallback && global._chooseColorCallback(value);
                global._chooseColorCallback = null;
                $(global._colorboard).css('display', 'none');
            })
            document.body.appendChild(cb);
            global._colorboard = cb;
            window.colorboard.title(cb, '请选择图形颜色');

		},
		//显示取色板
		_chooseColor : function (event, callback) {
			global._chooseColorCallback = callback;
			$(global._colorboard).css('display', 'block').css('top', event.clientY + 'px').css('right', '100px')
		},
		destroy : function () {

		},
		enterEditorMode:function(){
            sb.container.style.display = "block";
        },
        enterPreviewMode:function(){
            sb.container.style.display = "none";
        }
	}
});