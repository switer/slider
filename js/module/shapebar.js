Core.registerModule("shapebar", function(sb){

	return {
		init : function () {
			$('.shape-icon').on('click', function (e) {
				var $target = $(e.target),
					type = $target.data('type'),
					color = 'blue';
				var shapeData = sb.drawShape(type, color);
				sb.notify({
					type : 'addImage',
					data : {
						'shape' : true,
						'value' : shapeData
					}
				})
			})
		},
		destroy : function () {

		}
	}
});