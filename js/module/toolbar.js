Core.registerModule("toolbar",function(sb){
    var addImageApp=null,addTextApp=null,addSliderApp=null,deleteSlider = null,toolAppItems =null,header=20,toolbarY = 600,viewY = 80,
    insertSlider = null,enterPreviewMode = null,operation = null,appOptTout = -1,tarApp = null,previewApp = null,
    appDetailItems = null,toolAppMenu = null,operationSubMenuItems = null, item;
    var ecb,
        global;
    return {
        init:function(){
            global = this;

            this._textMatches = {
                'foreColor' : '请选择文字颜色',
                'hiliteColor' : '请选择文字背景颜色'
            }

            ecd = sb.find("#execCommand-detail",document);
            ecb = sb.find("#execCommand-bar",document);
            showEcdBut = sb.find(".show_execCommandDetail",document);
            ecdresize = sb.find(".resize",ecd);
            ecdmove = sb.find(".move",ecd);
            closeEcd = sb.find(".close-menu",ecd);
            colorSelector = sb.find("#colorSelector",document);
            execCType = sb.find(".execC_type",colorSelector);
            link = sb.find("#setlink",document);
            link_but  = sb.find(".font-link",ecd);
            comfirmLink = sb.find(".comfirm-link",link);
            fontColor_but = sb.find(".font-color",ecd);
            fontBackground_but = sb.find(".font-background",ecd);
            linkValue = sb.find(".link-value",link);
            sb.css(ecd,{
                display:'none',
                width:'680px',
                height:'30px',
                top:'580px',
                left:(window.innerWidth-700)+'px'
            });
            sb.css(link,{
                display:"none",
                width:'240px',
                heiht:'25px',
                top:(sb.subPX(ecd.style.top)-50)+"px",
                left:(sb.subPX(ecd.style.left)-260)+"px"
            });
            sb.resizeRB(ecdresize, ecd);
            sb.move(ecdmove,ecd);
            sb.listen({
                "showLink":this.showLink,
                "showColor":this.showColor,
                "showEcd":this.showEcd,
                "hiddenStyleBar":this.hiddenStyleBar,
                "showStyleBar":this.showStyleBar
            });
            comfirmLink.addEventListener("click", function(){
                document.execCommand("createLink", false, linkValue.value);
            }, false);
            link_but.addEventListener("click", function(e){
                sb.notify({
                    type:'showLink',
                    data:e
                });
            }, false);
            fontColor_but.addEventListener("click", function(e){
                sb.notify({
                    type:'showColor',
                    data:{
                        event:e,
                        type:"foreColor"
                    }
                });
            }, false);
            fontBackground_but.addEventListener("click", function(e){
                sb.notify({
                    type:'showColor',
                    data:{
                        event:e,
                        type:"hiliteColor"
                    }
                });
            }, false);
            showEcdBut.addEventListener("click", function(e){
                sb.notify({
                    type:'showEcd',
                    data:e
                });
            }, false);
            closeEcd.addEventListener("click", function(e){
                sb.notify({
                    type:'showEcd',
                    data:e
                });
            }, false);


            /**/
            // sb.container.style["marginTop"] = ((window.innerHeight-toolbarY-viewY-header)/2+header)+"px";
            toolAppItems = sb.query(".tool-app");
            enterPreviewMode = sb.find("#tool-enterPreviewMode");
            addImageApp = sb.find("#tool-addimage");
            addTextApp = sb.find("#tool-addtext");
            addSliderApp = sb.find("#tool-addslider");
            deleteSlider = sb.find("#tool-deleteSlider");
            insertSlider = sb.find("#tool-insertSlider");
            previewApp = sb.find("#tool-preview");
            operation = sb.find("#tool-operation");
            operationSubMenuItems = sb.query(".operation-item",operation);
            toolAppMenu = sb.find("#tool-buttons");
            appDetailItems = sb.query(".ondetail",toolAppMenu);
            sb.listen({
                "enterEditorMode":this.enterEditorMode,
                "enterPreviewMode":this.enterPreviewMode,
                "windowResize":this.windowResize 
            });
            //取消按钮点击时出现的全选情况
            for (var i = 0; item =  toolAppItems[i]; i++){
                item.onselectstart = function(){
                    return false;
                }
            }
            //设定操作菜单在鼠标离开时自动隐藏
            operation.addEventListener("mouseout", function(e){
                appOptTout = window.setTimeout(function(){
                    if(tarApp){
                        var optItem =operation.querySelector("#"+tarApp.id+"-operation");
                        optItem.style.display = "none";
                    }
                    operation.style.display = "none";
                    appOptTout = -1;
                }, 3000);
            }, false);
            //取消操作菜单在鼠标over时自动隐藏
            operation.addEventListener("mouseover", function(e){
                operation.style.display = "block";
                if(tarApp){
                    var optItem =operation.querySelector("#"+tarApp.id+"-operation");
                    optItem.style.display = "block";
                }
                window.clearTimeout(appOptTout);
                appOptTout = -1;
            }, false);
            //初始化工具条工具的子操作菜单
            for (i = 0; item = appDetailItems[i]; i++) {
                item.addEventListener("click", function(event){
                    var tar,optItem,offsetY
                    if(tarApp) operation.querySelector("#"+tarApp.id+"-operation").style.display = "none";
                    tar = event.currentTarget;
                    tarApp = tar;
                    optItem =operation.querySelector("#"+tar.id+"-operation");
                    operation.style.display = "block";
                    optItem.style.display = "block";
                    operation.style.top = (event.currentTarget.offsetTop-22)+"px";
                    if(appOptTout!=-1){
                        window.clearTimeout(appOptTout);
                    }
                    appOptTout = window.setTimeout(function(){
                        operation.style.display = "none";
                        optItem.style.display = "none";
                        appOptTout = -1;
                    }, 3000);
                },false);
            }
            //初始化工具子菜单的点击事件
            for (i = 0; item =  operationSubMenuItems[i]; i++) {
                item.onclick = function(e){
                    var notify = e.currentTarget.getAttribute("data-event");
                    var param = e.currentTarget.getAttribute("data-param");
                    sb.notify({
                        type:notify,
                        data:param
                    });
                }
            }
            enterPreviewMode.onclick = function(){
                sb.notify({
                    type:"enterSaveFile",
                    data:{}
                });
            }
            addImageApp.onchange = function(){
                sb.notify({
                    type:"addImage",
                    data:sb.find("#addImageInp")
                });
                addImageApp.innerHTML = "<input type='file' id='addImageInp'/>";
            };
            $('#tool-import').on('change', function () {
                sb.notify ({
                    type: "onImportSlider",
                    data: sb.find("#importInp")
                });
                $('#tool-import').html("<input type='file' id='importInp'/>");
            })
            $('#tool-openFileSystem').on('click', function () {
                sb.notify ({
                    type: "openFileSystem",
                    data: sb.find("#importInp")
                });
            })

            addTextApp.onclick = function(){
                sb.notify({
                    type:"addText",
                    data:{}
                });
            };
            addSliderApp.onclick = function(){
                sb.notify({
                    type:"addSlider",
                    data:"append"
                });
            };
            deleteSlider.onclick = function(){
                sb.notify({
                    type:"deleteSlider",
                    data:{}
                });  
            };
            insertSlider.onclick = function(){
                sb.notify({
                    type:"insertSlider",
                    data:{}
                });  
            };

            var cb = window.colorboard.create(function (value) {
                document.execCommand(global._execType,false, value);
            })
            document.body.appendChild(cb);
            global._colorboard = cb;

            var scrnb = window.screenBoard.create();
            window.screenBoard.listen(scrnb, function (value) {
                alert(value);
            });
            document.body.appendChild(scrnb);
            sb.move(scrnb, scrnb);
        },
        destroy:function(){
            addImageApp=null;
            addTextApp=null;
        },
        windowResize:function(){
            // sb.container.style["marginTop"] = ((window.innerHeight-toolbarY-viewY-header)/2+header)+"px";
        },
        enterEditorMode:function(){
            sb.container.style.display = "block";
        },
        enterPreviewMode:function(){
            sb.container.style.display = "none";
        },
        showLink:function(e){
            link.style.display = link.style.display=="none"?"block":"none";
            if((sb.subPX(ecd.style.top)-50)>=0) link.style.top = (sb.subPX(ecd.style.top)-50)+"px";
            else link.style.top = (sb.subPX(ecd.style.top)+50)+"px";
            link.style.left = (e.clientX-130)+"px";
        },
        showColor:function(data){

            var colorSelector = global._colorboard;
            window.colorboard.title(colorSelector, global._textMatches[data.type]);

            console.log(colorSelector);
            if( colorSelector.style.display =="block" && global._execType != data.type ){

            } else {
                colorSelector.style.display = colorSelector.style.display=="none"?"block":"none";
            }
            global._execType = data.type;

            if(sb.subPX(ecd.style.top)-170>=0) colorSelector.style.top = (sb.subPX(ecd.style.top)-170)+"px";
            else colorSelector.style.top = (sb.subPX(ecd.style.top)+50)+"px";
            colorSelector.style.left = (data.event.clientX-100)+"px";
        },
        showEcd:function(){
            if(ecd.style.display=="block"){
                colorSelector.style.display = "none";
                ecd.style.display = "none"
                link.style.display = "none";
            }else{
                ecd.style.display = "block";
            }
        },
        hiddenStyleBar:function(){
            sb.container.style.display = "none";
            ecd.style.display = "none";
            colorSelector.style.display = "none";
            link.style.display = "none";
        },
        showStyleBar:function(){
            sb.container.style.display = "block";
        }
    };
});