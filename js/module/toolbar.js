Core.registerModule("toolbar",function(sb){
    
    var addImageApp=null,addTextApp=null,addSliderApp=null,deleteSlider = null,toolAppItems =null,header=20,toolbarY = 600,viewY = 80,
    
    insertSlider = null,enterPreviewMode = null,operation = null,appOptTout = -1,tarApp = null,previewApp = null,
    
    appDetailItems = null,toolAppMenu = null,operationSubMenuItems = null, item;
    
    
    return {
        
        init:function(){
            
            sb.container.style["marginTop"] = ((window.innerHeight-toolbarY-viewY-header)/2+header)+"px";
            
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
                    
                    type:"enterPreviewMode",
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
        },
        destroy:function(){
            
            addImageApp=null;
            
            addTextApp=null;
            
        },
        windowResize:function(){
            
            sb.container.style["marginTop"] = ((window.innerHeight-toolbarY-viewY-header)/2+header)+"px";
            
        },
        enterEditorMode:function(){
            
            sb.container.style.display = "block";
            
        },
        enterPreviewMode:function(){
            
            sb.container.style.display = "none";
            
        }
        
    };
});