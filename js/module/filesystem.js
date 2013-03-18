Core.registerModule("filesystem", function(sb){

	var webui, webfs,
		global  = {};//全局变量

	return {
		init : function () {
			var _this = this;
				global = this;
			_.bindAll(this);
			sb.listen({
				'preSave' : this.checkAutoSave,
				'showFileSystem' : this.showFileSystem,
				'saveFile' : this.saveFileHandler,
				'openFileSystem' : this.openFileSystem
			});
			$('#returnHomeBtn').on('click', function () {
				$('#filesystem').hide();
				$('body').css('overflow', 'hidden');
				sb.notify({
					type: 'enterEditorMode',
					data : null
				});
			})
			function msg (msg) {
				var $nBox = $('#notifyBox');
				$nBox.find('#notifyMsg').html(msg);
				$nBox.showPopbox();
			}
			function errHandler (err) {
				var errStr =  err.code && ( webfs.errorCodeMap[err.code]  || webfs.phonegapErrorCodeMap[err.code])
				msg(errStr || err);
			}

			global._errHandler = errHandler;
			require(['webfs'],
			function (wfs) {
				webui = wfs.webui;
				webfs = wfs.webfs;
				global.wfs = wfs;

				_this._container = '#fileView';

				webui.renderRoot(window.TEMPORARY, _this._container, function () {
					//文件的打开事件API
					webui.initFileOperation('click', _this._container, errHandler);
					//删除按钮的API
					webui.initIconDel('click', _this._container, errHandler);
					//APP Event
					initWebuiEvenet();

					$('#addFile').html('保存为');
					$(".fs-icon-back.fs-icon-root").css('top', '45px');
					$(".fs-view").css('marginTop','105px')
				});
				
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
					//确定输入目录名
					$(document.body).on('click', '#folderInpBtn', function () {

						var folderName = $('#folderInp').val();
						
						webui.mkdir(folderName, _this._container, function () {
							$('#folderInpBox').suiHide();
						}, errHandler); 
					})
					//确定输入文件内容
					$(document.body).on('click', '#fileInpBtn', function () {

						var fileName = $('#fileNameInp').val(),
							suffix = $('#fileSufInp').val(),
							content = _this.fileContent || $('#fileContentInp').val();
						
						webui.writeFile(fileName + '.' + suffix, content, _this._container, function (file) {
							var path = file.toURL(),
								pathFrags = path.split('/'),
								filename = pathFrags.pop(),
								directory =pathFrags.join('/');

							global._last_save_file = {
								'filename' : filename,
								'directory' : directory
							}
							$('#fileInpBox').suiHide();
						}, errHandler); 
					})
					//显示删除按钮
					$(document.body).on('click', '#showDeleteIcon', function () {
						webui.showDelStatus(_this._container);
					});
					//添加导航头的hack
					$(window).on('scroll', function (e) {
						if (window.scrollY >= 45) $(".fs-icon-back.fs-icon-root").css('top', '0px');
						else $(".fs-icon-back.fs-icon-root").css('top', '45px');
					})
					$(_this._container).on('click', '.fs-icon-opt-upload', function (e) {
						var cwd = webui.getCwd(_this._container);
						webfs.openfile($(e.target).data('file'), cwd, function (file) {
							webfs.readfile(file, 'UTF-8', function (evt) {
								var content = evt.target.result;
								$.ajax({
								  type: 'POST',
								  url: '/s/upload',
								  data: JSON.stringify({
								  	fileName : $(e.target).data('file'),
								  	content : content,
								  	type : 'text/html'
								  }),
								  contentType: 'application/json'
								})
							}, function () {
								alert('error');
							});
						}, errHandler);
					})

				}
			})
		},
		_saveFile : function (data) {

		},
		saveFileHandler : function (data) {
			if (!global._save_file) global.showFileSystem(data);
			else global._saveFile(data);
		},
		//检查是否自动保存
		checkAutoSave : function (data) {
			if (global._last_save_file) {
				global.wfs.webfs.writeFileInPath(global._last_save_file.directory, 
					global._last_save_file.filename, data, function () {
						alert('保存成功');
				}, function (err) {
					alert('error' + err.code);
				}, { override : true });
			} else {
				sb.notify({
					type : "showFileSystem",
					data : data
				});
				sb.notify({
					type : 'enterPreviewMode',
					data : null
				})
			}
		},
		showFileSystem : function (data) {
			window.location.hash = '!filesystem'
			this.fileContent = data;
			$("#filesystem").suiShow();
			$('body').css('overflow', 'auto')
			$('#filesystem').show();
			$('#addFile').css('visibility', 'visible');
		},
		openFileSystem : function () {
			window.location.hash = '!filesystem'
			this.fileContent = null;
			sb.notify({
				type : 'showFileSystem',
				data : null
			})
			sb.notify({
					type : 'enterPreviewMode',
					data : null
			})
			$('#addFile').css('visibility', 'hidden');
		}
	}
});