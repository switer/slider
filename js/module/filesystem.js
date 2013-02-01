Core.registerModule("filesystem", function(sb){

	var webui, webfs;

	return {
		init : function () {
			var _this = this;
			_.bindAll(this);
			sb.listen({
				'showFileSystem' : this.showFileSystem
			});
			require(['webfs'],
			function (wfs) {
				webui = wfs.webui;
				webfs = wfs.webfs;

				_this._container = '#fileView';

				webui.renderRoot(window.TEMPORARY, _this._container, function () {
					//文件的打开事件API
					webui.initFileOperation('click', _this._container, errHandler);
					//删除按钮的API
					webui.initIconDel('click', _this._container, errHandler);
					//APP Event
					initWebuiEvenet();
				});
				function msg (msg) {
					var $nBox = $('#notifyBox');
					$nBox.find('#notifyMsg').html(msg);
					$nBox.showPopbox();
				}
				function errHandler (err) {
					var errStr =  err.code && ( webfs.errorCodeMap[err.code]  || webfs.phonegapErrorCodeMap[err.code])
					msg(errStr || err);
				}
				function initWebuiEvenet() {
					//显示弹框
					$(document.body).on('click', "#addFolder", function (e) {
						var $target = $(e.target)
						$('#folderInpBox').showPopbox();
					}, errHandler);

					$(document.body).on('click', "#addFile", function (e) {
						var $target = $(e.target)
						$('#fileInpBox').showPopbox();
					}, errHandler);
					//确定输入文件内容
					$(document.body).on('click', '#folderInpBtn', function () {

						var folderName = $('#folderInp').val();
						
						webui.mkdir(folderName, _this._container, function () {
							$('#folderInpBox').suiHide();
						}, errHandler); 
					})
					//确定输入目录名
					$(document.body).on('click', '#fileInpBtn', function () {

						var fileName = $('#fileNameInp').val(),
							suffix = $('#fileSufInp').val(),
							content = _this.fileContent || $('#fileContentInp').val();
						
						webui.writeFile(fileName + '.' + suffix, content, _this._container, function () {
							$('#fileInpBox').suiHide();
						}, errHandler); 
					})
					//显示删除按钮
					$(document.body).on('click', '#showDeleteIcon', function () {
						webui.showDelStatus(_this._container);
					});

				}
			})
		},
		showFileSystem : function (data) {
			console.log(data);
			this.fileContent = data;
			$("#filesystem").suiShow();
		}
	}
});