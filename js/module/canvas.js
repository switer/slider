Core.registerModule("canvas",function(sb){
    var anim_name = {
        "anim-move-left":"从左闪入",
        "anim-move-right":"从右闪入",
        "anim-move-top":"从上闪入",
        "anim-move-bottom":"从下闪入",
        "anim-move-top-left":"从左上闪入",
        "anim-move-top-right":"从右上闪入",
        "anim-move-bottom-left":"从左下闪入",
        "anim-move-bottom-right":"从右下闪入",
        "anim-scale":"放大",
        "anim-ySpin":"左右翻转",
        "anim-xSpin":"上下翻转",
        "anim-rightRotate":"顺时针旋转",
        "anim-leftRotate":"逆时针旋转"
        },
        SCREEN_SIZE_MAP = {
            '4:3'   : {x:800,y:600},
            '16:9'  : {x:1280,y:720},
            '2:1'   : {x:1200,y:600},
            '1:1'   : {x:800,y:800}
        };
    var editor = null,newContainerFunc=null,data_number=0,item,viewY = 80,header=20,isEditor = false,
    sliders = new sb.ObjectLink(),currentSlider = null,slider_count = 0,slider_number = 0,editorElem = null,
    createSliderFunc=null,addSliderElementFunc = null,addSliderObjectFunc = null,moveInter = -1,curKeycode = -1,
    SliderDataSet=new sb.ObjectLink(),zIndex_Number = 0,elementSet = new sb.ObjectLink(),editorContainer,
    eom=null,easm = null,eomTout=-1,target = null,elementOpertateFunc = null,cancelElementOperateMenuFunc =null,
    closeButton =null,easmCloseButton = null,setPositionFunc = null,showAnim = null,easmMove,
    copyElem = null,pasteElem=null,addImageFunc = null,addTextFunc = null,copyParams = null,eomItems = null,
    rgbSettingItems = null,defaultAtt,setSettingDefaultAttFunc,keyOperate,boxshadowsettingBut,boxshadowsetting,
    bgsettingBut,bordersettingBut,bgsetting,bordersetting,settingElements;

    var global = {},
        canvasX = 1200,
        canvasY = 600,
        rightMenuBtn; //右键选中标志
    var DATA = '{"slider1":{"anim":"anim-move-right","panelAttr":"width:100%;height:100%;position:absolute;left:0;top:0;","element":{"data1":{"type":"DIV","cAttr":"position: absolute; left: 150px; top: 200px; z-index: 1;","eAttr":"height:200px;width:500px;overflow:hidden;","zIndex":1,"value":"hello%20%2C%E4%BD%A0%E5%A5%BD%E5%90%97"}}},"slider2":{"anim":"anim-move-right","panelAttr":"width:100%;height:100%;position:absolute;left:0;top:0;","element":{"data2":{"type":"DIV","cAttr":"position: absolute; left: 150px; top: 200px; z-index: 1;","eAttr":"height:200px;width:500px;overflow:hidden;","zIndex":1,"value":"%E6%88%91%E5%BE%88%E5%97%A8"}}}}';
    return {
        init : function() {

            global = this;

            document.onselectstart =  function(){
                return false;
            }
            sb.container.oncontextmenu =  function(){
                return false;
            }
            // sb.container.style["marginTop"] = ((window.innerHeight-canvasY-viewY-header)/2+header)+"px";
            sb.data("mode", "editor");
            defaultAtt = {
                backgroundColor:"transparent",
                border:"none",
                borderColor:"rgb(0, 0, 0)",
                borderStyle:"none",
                borderWidth:"1px",
                borderBottomLeftRadius:"0%",
                borderTopLeftRadius:"0%",
                borderBottomRightRadius:"0%",
                borderTopRightRadius:"0%",
                boxShadow:"rgb(0, 0, 0) 0px 0px 10px inset",
                WebkitAnimation : "none",
                WebkitTransform : "rotate(0deg)",
                opacity:"1"
            };
            editorContainer = sb.find(".container");
            sb.css(editorContainer,{
                width: canvasX + "px",
                height: canvasY + "px"
            });
            eom = sb.find("#element-operate-menu");
            eomItems = sb.query(".elem-item", eom);
            sb.move(eom,eom);
            easm = sb.find("#element-attrSetting-menu");
            easmMove = sb.query(".move", easm)[0];
            sb.css(easmMove,{
                height:"20px",
                width:"100%",
                top:"0px",
                left:"0px"
            });
            sb.move(easmMove,easm);
            rgbSettingItems = sb.query(".rgbcolor",easm);
            bgsetting = sb.find(".bgsetting",easm); 
            bordersetting = sb.find(".bordersetting",easm);
            boxshadowsetting = sb.find(".boxshadowsetting",easm);
            bgsettingBut = sb.find(".bgsetting-but",easm); 
            bordersettingBut = sb.find(".bordersetting-but",easm);
            boxshadowsettingBut = sb.find(".boxshadowsetting-but",easm);
            sb.bind(bgsettingBut, "click", function(){
                $('.attr-setting-panel').css('display', 'none');
                $('.setting-tag').removeClass('text-focus');
                $('.bgsetting').css('display', 'block');
                $('.bgsetting-but').addClass('text-focus');
            });
            sb.bind(bordersettingBut, "click", function(){
                $('.attr-setting-panel').css('display', 'none')
                $('.setting-tag').removeClass('text-focus');
                $('.bordersetting').css('display', 'block');
                $('.bordersetting-but').addClass('text-focus');
            });
            sb.bind(boxshadowsettingBut, "click", function(){
                $('.attr-setting-panel').css('display', 'none');
                $('.setting-tag').removeClass('text-focus');
                $('.boxshadowsetting').css('display', 'block');
                $('.boxshadowsetting-but').addClass('text-focus');
            });
            $('.transformsetting-but').on("click", function(){
                $('.attr-setting-panel').css('display', 'none');
                $('.setting-tag').removeClass('text-focus');
                $('.transformsetting').css('display', 'block');
                $('.transformsetting-but').addClass('text-focus');
            });
            settingElements = sb.query(".setting-element",easm);
            for (var i = 0,item; item =  settingElements[i]; i++) {
                var inputType =  item.getAttribute("data-input");
                var inputElem = sb.find(".value-input",item);
                var tar,parent,event,value,type,tarElem,pnumber;
                switch(inputType){
                    case 'checkbox':
                        inputElem.onchange = function(e){
                            if(!target||!elementSet[target]) {
                                tarElem = sliders[currentSlider];
                            }else{
                                tarElem = elementSet[target]["container"];
                            }
                            tar = e.currentTarget;
                            parent = tar.parentNode;
                            event = parent.getAttribute("data-event");
                            type = parent.getAttribute("data-type");
                            value = tarElem.style[type];
                            if(!tar.checked||!value) value = parent.getAttribute("data-param");
                            sb.notify({
                                type:event,
                                data:{
                                    key:type,
                                    value:value
                                }
                            });
                        };
                        break;
                        item.getAttribute("data-type");
                    case 'range':
                        inputElem.onchange = function(e){
                            tar = e.currentTarget;
                            parent = tar.parentNode;
                            event = parent.getAttribute("data-event");
                            type = parent.getAttribute("data-type");
                            pnumber =  parent.dataset.number;
                            var factor = parent.getAttribute("data-factor"),
                            unit = parent.getAttribute("data-unit");
                            var multi = parent.dataset.multi || '1';

                            value = tar.value/parseInt(factor)*parseInt(multi) + unit;

                            if(pnumber) {
                                var arr = defaultAtt[type].split(" ");
                                arr[pnumber] = value;
                                value = arr.join(" ");
                            }
                            sb.notify({
                                type:event,
                                data:{
                                    key:type,
                                    value:value
                                }
                            });
                        };
                        break;
                    case 'select':
                        inputElem.onchange = function(e){
                            tar = e.currentTarget;
                            parent = tar.parentNode;
                            event = parent.getAttribute("data-event");
                            type = parent.getAttribute("data-type");
                            value = tar.value;
                            sb.notify({
                                type:event,
                                data:{
                                    key:type,
                                    value:value
                                }
                            });
                        };
                        break; 
                    default:
                        break;
                }
            }
            closeButton = sb.find(".close-menu", eom);
            easmCloseButton = sb.find(".close-menu", easm);
            newContainerFunc = this.createElementContainer;
            createSliderFunc = this.createSlider;
            addSliderElementFunc = this.addSliderElement;
            addSliderObjectFunc = this.addSliderObject;
            elementOpertateFunc = this.elementOpertate;
            addImageFunc = this.addImage;
            addTextFunc = this.addText;
            cancelElementOperateMenuFunc = this.cancelElementOperateMenu;
            setPositionFunc = this.setPosition;
            setSettingDefaultAttFunc = this.setSettingDefaultAtt;
            currentSlider = currentSlider || this.createSlider("append").id;
            editor = sliders[currentSlider];
            showAnim = document.createElement("div");
            showAnim.className = "showAnim";
            showAnim.innerHTML = anim_name[editor.getAttribute("data-anim")];
            sb.css(showAnim,{
                position:"absolute",
                display:"block",
                width:"120px",
                height:"30px",
                zIndex:"999",
                left:(editorContainer.offsetLeft+520)+"px",
                top:(editorContainer.offsetTop)+"px"
            });
            sb.move(showAnim,showAnim);
            editorContainer.appendChild(showAnim);
            sb.bind(window, "keydown",this.keyOperate);
            window.addEventListener("resize", function(){
                sb.notify({
                    type:"windowResize",
                    data:null
                });
            },false);
            eom.addEventListener("mouseout", function(){
                eomTout = window.setTimeout(function(){
                    cancelElementOperateMenuFunc();
                    eomTout = -1;
                }, 3000);
            }, false);
            eom.addEventListener("mouseover", function(){
                if(eomTout!=-1){
                    window.clearTimeout(eomTout);
                    eomTout = -1;
                }
            },false);
            closeButton.addEventListener("click", function(){
                if(eomTout!=-1){
                    window.clearTimeout(eomTout);
                    eomTout = -1;
                }
                cancelElementOperateMenuFunc();
            }, false);
            easmCloseButton.addEventListener("click", function(){
                easm.style.display = "none";
            }, false);

            sb.data("sliderDataSet",SliderDataSet);
            sb.listen({
                "onImportSlider" : this.readData,
                "enterEditorMode":this.enterEditorMode,
                "enterSaveFile":this.enterSaveFile,
                "addImage":this.addImage,
                "addText":this.addText,
                "addSlider":this.createSlider,
                "changeSlider":this.changeSlider,
                "deleteSlider":this.deleteSlider,
                "insertSlider":this.insertSlider,
                "showOperateMenu":this.elementOpertate,
                "deleteElement":this.deleteElement,
                "moveToBottom":this.moveToBottom,
                "moveToTop":this.moveToTop,
                "moveDownward":this.moveDownward,
                "moveUpward":this.moveUpward,
                "copyElement":this.copyElement,
                "pasteElement":this.pasteElement,
                "changeSliderAnim":this.changeSliderAnim,
                "elemAttrSetting":this.elemAttrSetting,
                "setStyleAttr":this.setStyleAttr,
                "changeShowAnim":this.changeShowAnim,
                "changeSliderStyle":this.changeSliderStyle,
                "windowResize":this.windowResize,
                "showFileSystem" : this.hideSliderEditor
            });
            for (i = 0; item =  eomItems[i]; i++) {
                item.onclick = function(e){
                    var notify = e.currentTarget.getAttribute("data-event");
                    sb.notify({
                        type:notify,
                        data:e
                    }); 
                }
            }
            for (i = 0; item = rgbSettingItems[i]; i++) {
                item.onselectstart = function(){
                    return false;
                };
                var redSetting = sb.find(".red-setting",item),
                greenSetting = sb.find(".green-setting",item),
                blueSetting = sb.find(".blue-setting",item);
                var settings = [redSetting,greenSetting,blueSetting],k,setting;
                for (k = 0; setting = settings[k]; k++) {
                    sb.find(".value-input",setting).onchange = function(e){
                        var tar = e.currentTarget,ancestors = tar.parentNode.parentNode; 
                        var event = ancestors.getAttribute("data-event"),attrName,
                        attrValue,rPreviewValue,gPreviewValue,bPreviewValue,
                        dataCheck = ancestors.getAttribute("data-check"),
                        valueType=ancestors.getAttribute("data-type"),
                        redSetting = sb.find(".red-setting",ancestors),
                        greenSetting = sb.find(".green-setting",ancestors),
                        blueSetting = sb.find(".blue-setting",ancestors),
                        preview = sb.find(".color-preview",ancestors),
                        rPreview = sb.find(".preview",redSetting),
                        gPreview = sb.find(".preview",greenSetting),
                        bPreview = sb.find(".preview",blueSetting),
                        rvalue = Math.round(sb.find(".value-input",redSetting).value*255/100),
                        gvalue = Math.round(sb.find(".value-input",greenSetting).value*255/100),
                        bvalue = Math.round(sb.find(".value-input",blueSetting).value*255/100);
                        attrName = valueType;
                        attrValue = "rgb("+rvalue+", "+gvalue+", "+bvalue+")";
                        rPreviewValue = "rgb("+(rvalue||0)+", "+(0)+", "+(0)+")";
                        gPreviewValue = "rgb("+(0)+", "+(gvalue||0)+", "+(0)+")";
                        bPreviewValue = "rgb("+(0)+", "+(0)+", "+(bvalue||0)+")";
                        preview.style["backgroundColor"] = attrValue;
                        rPreview.style["backgroundColor"] = rPreviewValue;
                        gPreview.style["backgroundColor"] = gPreviewValue;
                        bPreview.style["backgroundColor"] = bPreviewValue;
                        if(dataCheck=="true"){
                            var isAllowChange = sb.find(".value-input",sb.find(".for-"+valueType,easm)).checked;
                            if(!isAllowChange) return;
                        }
                        if(valueType=="boxShadow"){
                            var darr = defaultAtt[valueType].split(" ");
                            var varr = attrValue.split(" ");
                            darr[0] = varr[0];
                            darr[1] = varr[1];
                            darr[2] = varr[2];
                            attrValue = darr.join(" ");
                        }
                        else if (valueType=="WebkitTransform") {
                            attrValue = defaultAtt[valueType].replace(/^rotate\(/,'').replace(/edg\)$/,'');
                        }
                        sb.notify({
                            type:event,
                            data:{
                                key:attrName,
                                value:attrValue
                            }
                        });
                    }
                }
            }
        },
        //以一种非常恶心的hack手段去删除slider列表
        removeSliderByArray : function (rmArray) {
            _.each(rmArray , function (item) {
                var idNum = item.key.replace(/[a-z]*/g, '');
                sb.notify({
                    type:"changeSlider",
                    data:idNum
                });
                sb.notify({
                    type:"changeFrame",
                    data:'frame' + idNum
                });
                sb.notify({
                    type : 'deleteSlider',
                    data : null
                })

            });
        },
        readData:function (inp) {

            var reader = new FileReader();
            var file = inp.files.item(0);

            reader.readAsText(file, 'UTF-8');
            reader.onloadend = function (event) {
                var datajson = reader.result.match(/\<script\ type\=\"text\/html\"\ id\=\"datajson\"\>.*\<\/script\>/);
                if (datajson) {
                   var data =  datajson[0].replace(/^\<script[^\<\>]*\>/,'').replace(/\<\/script\>/,'');
                    renderSlider(data);
                } 

            }
            function renderSlider(data) {

                var importData = JSON.parse(data),
                    slidersData = JSON.parse(importData.cntData),
                    slidersConf = importData.cntConf;
                var sliderArray = readAsArray(slidersData),
                    rmArray = sliders.toArray();

                render(sliderArray);
                global.removeSliderByArray(rmArray);
                function readAsArray(data) {
                    var sliders = [], imgCount = 0;
                    for(var s in data){
                        if ( data.hasOwnProperty(s) ) {
                            var elementArray = [];
                            var elements = data[s].element;
                            for (var e in elements) {
                                if(elements.hasOwnProperty(e)){
                                    elementArray.push(elements[e]);
                                    if (elements[e].type === 'IMG') imgCount ++;
                                }
                            }
                            sliders.push({
                                data : data[s],
                                elements : elementArray,
                                imgCount : imgCount
                            });
                        }
                    }
                    return sliders;
                }

                function render(array) {
                    var slider = array.shift();
                    if (slider) {
                        renderElements(slider);
                        render(array);
                    }
                }
                
                function renderElements (slider, callback) {
                    var elements = slider.elements;

                    createSliderFunc('append', {attr:slider.data['panelAttr'], anim:slider.data['anim']});
                    sb.notify({
                        type:"importSlider",
                        data: 'append'
                    });
                    var count = 0;
                    for (var i = 0; i < elements.length; i++) {
                        var data = elements[i],elem;
                        if(data.type === "DIV"){
                            sb.notify({
                                type:"addText",
                                data: {
                                    paste : true,
                                    attr : data.cAttr,
                                    elemAttr : data.eAttr,
                                    value : decodeURIComponent(data.value)
                                }
                            });
                        }
                        else if(data.type === "IMG") {
                            sb.notify({
                                type:"addImage",
                                data: {
                                    paste : true,
                                    attr : data.cAttr,
                                    elemAttr : data.eAttr,
                                    pAttr : data.panelAtt,
                                    value : data.value
                                }
                            });
                        }
                    }
                    if (slider.imgCount === 0) {
                        callback && callback();
                    }
                }//renderElements
            }
        },
        destroy:function(){
            editor=null;
        },
        windowResize:function(){
            // sb.container.style["marginTop"] = ((window.innerHeight-canvasY-viewY-header)/2+header)+"px";
        },
        keyOperate:function(event){
            if(isEditor) return;
            if(!elementSet[target]){
                if(event.keyCode ==37||event.keyCode ==39){
                    var preSlider = sliders.getSlider(event.keyCode ==37?"pre":"next", currentSlider, -1);
                    preSlider = preSlider||currentSlider;
                    var number = preSlider.substring("slider".length,preSlider.length);
                    sb.notify({
                        type:"changeSlider",
                        data:number
                    });
                    sb.notify({
                        type:"changeFrame",
                        data:"frame"+number
                    });
                    return;
                }
            }
            // if(event.keyCode ==49){
            //     event.preventDefault();
            //     sb.notify({
            //         type:"enterSaveFile",
            //         data:null
            //     });
            // }else if(event.keyCode ==50){
            //     event.preventDefault();
            //     sb.notify({
            //         type:"addSlider",
            //         data:"append"
            //     });
            // }else if(event.keyCode ==51){
            //     event.preventDefault();
            //     sb.notify({
            //         type:"insertSlider",
            //         data:null
            //     });
            // }
            var tar,style,offset = 1;
            if(!(tar =elementSet[target])) return;
            style = tar.container.style;
            var oralT = sb.subPX(style["top"]),oralL = sb.subPX(style["left"]);
            if(event.keyCode ==37) {
                style["left"] = (oralL-offset)+"px";
            }
            else if(event.keyCode==39) {
                style["left"] = (oralL+offset)+"px";
            }
            else if(event.keyCode ==38){
                style["top"] = (oralT-offset)+"px";
            }
            else if(event.keyCode ==40){
                style["top"] = (oralT+offset)+"px";
            }else if(event.keyCode ==27){
                sb.removeClass(elementSet[target].container,"element-select");
                var parts = sb.query(".element-container-apart", elementSet[target].container);
                for (var i = 0; i < parts.length; i++) {
                    sb.removeClass(parts[i],"show-container-apart");
                }
                cancelElementOperateMenuFunc();
                easm.style.display = "none";
                target = null;
                return;
            }
        },
        enterEditorMode:function(){
            window.location.hash = ''
            sb.container.style.display = "block";
            sb.bind(window, "keyup",keyOperate);
            sb.notify({
                type:"showStyleBar",
                data:null
            });
        },

        enterSaveFile:function(){
            
            var json = new sb.ObjectLink(),
                datas;
            SliderDataSet.forEach(function(a,m){
                var data = new sb.ObjectLink();
                var slider = {};
                a.forEach(function(b,n){
                    var e = {};
                    e.type = b["data"].tagName;
                    e.cAttr = b["container"].getAttribute("style");
                    e.eAttr = b["data"].getAttribute("style");
                    e.zIndex = b["zIndex"];
                    e.value = b["data"].src|| encodeURIComponent(b["data"].innerHTML);
                    if(e.type=="IMG"){
                        e.panelAtt = sb.find(".element-panel",b["container"]).getAttribute("style");
                    }
                    data[n] = e;
                });
                slider["anim"] = sliders[m].getAttribute("data-anim");
                slider["panelAttr"] = sb.find(".panel",sliders[m]).getAttribute("style");
                slider["element"] = data;
                json[m] = slider;
            });
            alert(json.length());
            datas = {
                cntConf : {
                    'height' : editorContainer.style.height,
                    'width' : editorContainer.style.width
                },
                cntData : json.toJSONString()
            }
            // alert('length : ' + json.toJSONString().length);
            var stream = JSON.stringify(datas);
            var header = document.querySelector('#header').childNodes,
                footer = document.querySelector('#footer').childNodes,
                comment;
            for(var i = header.length-1; i >= 0; i--) {
                if(header[i].nodeType == 8){
                  headerHtml = header[i]; 
                  break;
                }
            }
            for(var i = footer.length-1; i >= 0; i--) {
                if(footer[i].nodeType == 8){
                  footerHtml = footer[i];  
                  break;
                }
            }
            var dataHtml = '<script type="text/html" id="datajson">' + stream + '</script>';

            sb.notify({
                type : "preSave",
                data : headerHtml.data + dataHtml + footerHtml.data
            });

            // //一般localstorage容量不会超过5M
            // if (stream.length < 5*1024*1024/2) window.localStorage.setItem('data',html);
            // else alert('所存储的内容大于5M，请选择文件存储'); 
            // sb.File.save('slider10.html', headerHtml.data + dataHtml + footerHtml.data,
            //     function (url) {
            //         window.location.href = url;
            //     }
            // );   
            // sb.notify({
            //     type:"previewModeStart",
            //     data:json
            // });
        //            var jsonenc = window.encodeURIComponent(json.toJSONString());
        //            sb.ajaxPost(base+"/save"+suf,function(){
        //                
        //                alert("finish");
        //                
        //            },"username=guan&userdata="+jsonenc);
        },
        hideSliderEditor : function () {
            sb.unbind(window, "keyup", keyOperate);
            sb.container.style.display = "none";
            sb.notify({
                type:"hiddenStyleBar",
                data:null
            });
        },
        insertSlider:function(){
            createSliderFunc("insert");
        },
        //新添加：sliderId
        deleteSlider:function(){
            var preSlider = sliders.getSlider("pre",currentSlider,-1) ||
            sliders.getSlider("next",currentSlider,-1);
            if(currentSlider){
                //删除slider DOM 元素
                editorContainer.removeChild(sliders[currentSlider]);
                delete sliders[currentSlider];
                delete SliderDataSet[currentSlider]
                //重置当前slider
                currentSlider = preSlider;
            }
            //显示可能被隐藏的前slider
            if(preSlider&&sliders[preSlider]) sliders[preSlider].style.display = "block";
            else {
                //如果前slider不存在，那么就创建新的
                createSliderFunc("append");
            }
        },
        createSlider:function(method, pasteObj){
            var newSlider = document.createElement("div");
            var panel = document.createElement("div");

            if (pasteObj) {
                panel.setAttribute("style", pasteObj.attr);
                newSlider.setAttribute("data-anim", pasteObj.anim);
            } else {
                panel.setAttribute("style", "width:100%;height:100%;position:absolute;left:0;top:0;");
                newSlider.setAttribute("data-anim", "anim-move-right");
            }
            
            panel.className = "panel";
            elementOpertateFunc("panel",panel);
            newSlider.appendChild(panel);
            newSlider.className = "editor";
            

            if(currentSlider) sliders[currentSlider].style.display = "none";
            slider_number++;
            slider_count++;
            var sliderID = "slider"+slider_number; 
            if(method=="insert"){
                addSliderObjectFunc({
                    key:sliderID,
                    value:newSlider
                },method,currentSlider);
                addSliderElementFunc(newSlider,method,sliders[currentSlider],editorContainer);
            }else if(method=="append"){
                addSliderObjectFunc({
                    key:sliderID,
                    value:newSlider
                },method,null);
                addSliderElementFunc(newSlider,method,null,editorContainer);
            }
            currentSlider = sliderID;
            editor = sliders[currentSlider];
            sb.notify({
                type:"changeShowAnim",
                data:editor.getAttribute("data-anim")
            });
            return {
                id:sliderID,
                slider:newSlider
            };
        },
        addSliderObject:function(slider,method,pos){
            if(method=="insert") {
                SliderDataSet.insert({
                    key:slider.key,
                    value:new sb.ObjectLink()
                },"before",pos);
                sliders.insert(slider,"before",pos);
            }
            else if(method=="append") {
                SliderDataSet[slider.key] = new sb.ObjectLink();
                sliders[slider.key] = slider.value;
            }
            else Core.log("wrong insert slider method!");
        },
        addSliderElement:function(elem,method,pos,container){
            if(method=="insert") container.insertBefore(elem, pos);
            else if(method=="append") container.appendChild(elem);
            else Core.log("wrong insert slider-Element method!");
        },
        addImage:function(obj, callback){
            var img = null,file;
            var preCont = document.createElement('div');
                editor.appendChild(preCont);

            //粘贴图片
            if(obj["paste"]) {
                img = new Image();
                img.src= obj["value"];
                file = null;
            }
            //添加图形
            else if (obj['shape']) {
                img = new Image();
                img.src= obj["value"];
                file = obj["value"];
            }
            //添加图片
            else {
                img = sb.addImage(obj);
                var img2 = sb.readAsDataURL(obj);
                file = obj.files.item(0);
            }
            if(!img) {
                return;
            }
            var imgElementId = addImageConfig(preCont, img, obj);
            img.onload = function(){
                var sizeObj = {
                    height:img.height,
                    width:img.width
                };
                var partSize = 6,con_obj=null, type = obj.shape ? 'shape' : (obj.paste ? 'paste' : null)
                    sizeObj = sb.fixedImgSize(sizeObj,canvasX,canvasY);

                newContainerFunc(sizeObj,partSize, null, {
                    'container' : preCont,
                    'type' : type,
                    'isFixedSize' : !obj.paste
                });
                img.style.height = '100%';
                img.style.width = '100%';
                callback && callback(imgElementId)
            }

            function addImageConfig (container, img, obj) {
                img.setAttribute("draggable", false);
                img.className = "imgelement";

                var panel = document.createElement("div");
                panel.className = "element-panel";
                if (obj.pAttr) {
                    $(panel).attr(obj.pAttr);
                }
                else {
                    sb.css(panel, {
                        position:"absolute",
                        top:"0px",
                        left:"0px",
                        width:"100%",
                        height:"100%"
                    }); 
                }
                var partSize = 6,dataID,maxZIndexElem,maxZIndex,cur;

                sb.move(panel, container);

                if(obj["paste"]) {
                    container.setAttribute("style", obj["attr"]);
                    img.setAttribute('style', obj["elemAttr"]);
                }
                else {
                    container.setAttribute("style", "position:absolute;z-index:1;left:0px;top:0px;");
                }

                data_number++;
                zIndex_Number++;
                cur = SliderDataSet[currentSlider];
                maxZIndexElem =cur.getLastElement();
                maxZIndex = maxZIndexElem==null?1:cur[maxZIndexElem]["zIndex"]+1;
                
                container.style.zIndex = maxZIndex;
                container.appendChild(img);
                container.appendChild(panel);

                editor.appendChild(container);
                dataID = "data"+data_number;
                elementSet[dataID] = {
                    container:container,
                    data:img,
                    zIndex:maxZIndex,
                    file:file
                }
                SliderDataSet[currentSlider][dataID] = elementSet[dataID];
                SliderDataSet[currentSlider].sortBy("zIndex");
                elementOpertateFunc(dataID,container, container);
                return dataID;
            }

            return imgElementId;
        },
        addText:function(textObj){
            var obj = {
                height:200,
                width:500
            };
            var partSize = 6,dataID,maxZIndexElemID,maxZIndex;
            var textBox = document.createElement("div");
            textBox.className = "textboxelement";
            var con_obj = newContainerFunc(obj, partSize,textBox);
            var container = con_obj.container,cur;
            data_number++;
            zIndex_Number++;
            if(textObj["paste"]){
                container.setAttribute("style", textObj["attr"]);
                textBox.setAttribute("style", textObj["elemAttr"]);
                textBox.innerHTML = textObj["value"];
            }else{
                container.setAttribute("style", "position:absolute;left:"+((canvasX-obj.width)/2)+"px;top:"+((canvasY-obj.height)/2)+"px;");
                textBox.setAttribute("style", "height:"+obj.height+"px;width:"+obj.width+"px;overflow:hidden;");
            }
            textBox.setAttribute("contenteditable", "true");
            container.appendChild(textBox);
            editor.appendChild(container);
            textBox.focus();
            isEditor = true;
            editorElem = textBox;
            document.onselectstart = function(){
                return true;
            }
            textBox.onfocus = function(e){
                document.onselectstart = function(){
                    return true;
                }
                if(!isEditor) isEditor = true;
            }
            textBox.onblur = function(e){
                document.onselectstart = function(){
                    return false;
                }
                isEditor = false;
            }
            dataID = "data"+data_number;
            cur = SliderDataSet[currentSlider];
            maxZIndexElemID = cur.getLastElement();
            maxZIndex = maxZIndexElemID==null?1:cur[maxZIndexElemID]["zIndex"]+1;
            container.style.zIndex = maxZIndex;
            elementSet[dataID] = {
                container:container,
                data:textBox,
                zIndex:maxZIndex,
                file:null
            };
            SliderDataSet[currentSlider][dataID] = elementSet[dataID];
            SliderDataSet[currentSlider].sortBy("zIndex");
            elementOpertateFunc(dataID,con_obj.container,con_obj.container);
            return dataID;
        },
        elemAttrSetting:function(e){
            var tar;
            eom.style.display = "none";
            easm.style.display = "block";
            setPositionFunc(e,easm,-100,-100,-300,-200);
            if(target&&( tar = elementSet[target])){
                tar = elementSet[target].container;
            }else{
                /*设置slider的属性*/
                tar = sb.find(".panel",editor);
            }
            for (var att in defaultAtt) {
                if(tar.style.hasOwnProperty(att)&&tar.style[att].length!=0){
                    defaultAtt[att] = tar.style[att];
                }
            }
            setSettingDefaultAttFunc();
        },
        setSettingDefaultAtt:function(){
            var i,type,pnumber;
            var redSetting = sb.find(".red-setting",item),
            greenSetting = sb.find(".green-setting",item),
            blueSetting = sb.find(".blue-setting",item),
            preview = sb.find(".color-preview",item),
            rPreview = sb.find(".preview",redSetting),
            gPreview = sb.find(".preview",greenSetting),
            bPreview = sb.find(".preview",blueSetting),
            rgbArr;
            type = item.getAttribute("data-type");
            if(type=="boxShadow") {
                var splitArr = defaultAtt[type].split(" ");
                var rgbdivArr = [splitArr[0],splitArr[1],splitArr[2]];
                rgbArr = sb.subrgb(rgbdivArr.join(" "));
            }else{
                rgbArr = sb.subrgb(defaultAtt[type]);
            }
            if(rgbArr){
                var rv = Math.round(rgbArr[0]*100/255),
                gv = Math.round(rgbArr[1]*100/255),
                bv = Math.round(rgbArr[2]*100/255);
                sb.find(".value-input",redSetting).value = rv;
                sb.find(".value-input",greenSetting).value = gv;
                sb.find(".value-input",blueSetting).value = bv;
                rPreview.style["backgroundColor"]  = "rgb("+rgbArr[0]+","+0+","+0+")";
                gPreview.style["backgroundColor"]  = "rgb("+0+","+rgbArr[1]+","+0+")";
                bPreview.style["backgroundColor"]  = "rgb("+0+","+0+","+rgbArr[2]+")";
                preview.style["backgroundColor"] = "rgb("+rgbArr[0]+","+rgbArr[1]+","+rgbArr[2]+")";
            }
            // }
            for (i = 0,item; item =  settingElements[i]; i++) {
                var inputType =  item.dataset.input;
                var inputElem = sb.find(".value-input",item),
                param,value;
                switch(inputType){
                    case 'checkbox':
                        type = item.dataset.type;
                        value = defaultAtt[type];
                        param = item.dataset.param;
                        if(value===param) inputElem.checked = false;
                        else inputElem.checked = true;
                        break;
                    case 'range':
                        type = item.dataset.type;
                        pnumber = item.dataset.number;
                        var factor = item.dataset.factor,
                        unit = item.dataset.unit,
                        dvalue = defaultAtt[type];
                        if(pnumber) dvalue = dvalue.split(" ")[pnumber];
                        var multi = item.dataset.multi || '1';
                        inputElem.value = sb.subPX(dvalue,unit.length)*factor/multi;
                        break;
                    case 'select':
                        type = item.dataset.type;
                        value = defaultAtt[type];
                        inputElem.value = value;
                        break; 
                    default:
                        break;
                }
            }
        },
        setStyleAttr:function(params){
            console.log('=========', params);
            var key = params.key,value = params.value;
            defaultAtt[key] = value;

            var target = rightMenuBtn;

            if(target&&elementSet[target]){
                var container = elementSet[target].container;
                var img,elemAtt = {
                    borderTopLeftRadius:true,
                    borderBottomLeftRadius:true,
                    borderTopRightRadius:true,
                    borderBottomRightRadius:true,
                    boxShadow:true,
                    opacity : true
                };

                if((img = sb.find("img",container))&&elemAtt[key]) {
                    sb.find(".element-panel",container).style[key] = value;
                    img.style[key] = value;
                } 
                else if (key === 'WebkitTransform') {
                    container.style[key] = 'rotate(' + value + 'deg)';
                }
                if (key !== 'opacity' && key !== 'WebkitTransform') container.style[key] = value;
            }else{
                var compatibleAtt = {
                    backgroundColor:true,
                    opacity:true,
                    boxShadow:true
                };
                /*提供设置slider属性的接口*/
                if(compatibleAtt[key]) {
                    sb.notify({
                        type:"changeSliderStyle",
                        data:{
                            key:key,
                            value:value
                        }
                    })
                }
            }
        },
        changeSliderStyle:function(data){
            sb.find(".panel",editor)["style"][data.key] = data.value;
        },
        moveUpward:function(){
            var target = rightMenuBtn;
            
            var cur = SliderDataSet[currentSlider];
            var maxElemID = cur.getLastElement(),tmp,forwardIndex = -1,forwardElemID,forwardElem,
            targetIndex;
            if(target && maxElemID !== target){
                targetIndex = cur.findIndex(target);
                forwardIndex = targetIndex+1;
                forwardElemID = cur.getSlider(null, null, forwardIndex);
                forwardElem = cur[forwardElemID];
                tmp = forwardElem["zIndex"];
                forwardElem["zIndex"] = cur[target]["zIndex"];
                cur[target]["zIndex"] = tmp;
                forwardElem["container"].style.zIndex = forwardElem["zIndex"];
                cur[target]["container"].style.zIndex = cur[target]["zIndex"];
                cur.sortBy("zIndex");
            }
        },
        moveDownward:function(){
            var target = rightMenuBtn;
            
            var cur = SliderDataSet[currentSlider];
            var minElemID = cur.getFirstElement(),tmp,backwardIndex = -1,backwardElemID,backwardElem,
            targetIndex;
            if(target && minElemID !== target){
                targetIndex = cur.findIndex(target);
                backwardIndex = targetIndex-1;
                backwardElemID = cur.getSlider(null, null, backwardIndex);
                backwardElem = cur[backwardElemID];
                tmp = backwardElem["zIndex"];
                backwardElem["zIndex"] = cur[target]["zIndex"];
                cur[target]["zIndex"] = tmp;
                backwardElem["container"].style.zIndex = backwardElem["zIndex"];
                cur[target]["container"].style.zIndex = cur[target]["zIndex"];
                cur.sortBy("zIndex");
            }
        },
        moveToTop:function(){
            var target = rightMenuBtn;

            var maxElemID = SliderDataSet[currentSlider].getLastElement(),maxZIndex = 0,maxElem;
            maxElem = SliderDataSet[currentSlider][maxElemID];
            maxZIndex = maxElem.zIndex+1;

            if(target && target!=maxElemID){
                SliderDataSet[currentSlider][target]["zIndex"] = maxZIndex;
                SliderDataSet[currentSlider][target]["container"].style.zIndex = maxZIndex;
                SliderDataSet[currentSlider].sortBy("zIndex");
            }
        },
        moveToBottom:function(){
            var target = rightMenuBtn;
            
            var minElemID = SliderDataSet[currentSlider].getFirstElement(),minZIndex = 0,minElem;
            minElem = SliderDataSet[currentSlider][minElemID];
            minZIndex = minElem.zIndex;
            if(target && target!=minElemID){
                SliderDataSet[currentSlider].forEach(function(a){
                    a["zIndex"]++;
                    a["container"].style.zIndex  = a["zIndex"];
                });
                SliderDataSet[currentSlider][target]["zIndex"] = minZIndex;
                SliderDataSet[currentSlider][target]["container"].style.zIndex = minZIndex;
                SliderDataSet[currentSlider].sortBy("zIndex");
            }
        },
        deleteElement:function(){
            var target = rightMenuBtn;
            
            if(!target) return;
            var elemNum = target;
            if(elementSet[elemNum].container) sliders[currentSlider].removeChild(elementSet[elemNum].container);
            delete elementSet[elemNum];
            delete SliderDataSet[currentSlider][elemNum];
            eom.style.display = "none";
            if(target==elemNum) target = null;
        },
        copyElement:function(){
            var target = rightMenuBtn;
            
            if(!target) return;
            copyElem = target;
            if(copyElem&&elementSet[copyElem]){
                var pasteElem = elementSet[copyElem];
                var container = pasteElem.container,data = pasteElem.data,
                value = data.src||data.innerHTML;
                copyParams = {
                    paste:true,
                    type:data.tagName,
                    value:value,
                    attr:container.getAttribute("style"),
                    elemAttr:data.getAttribute("style")
                };
            }
        },
        pasteElement:function(){

            if(copyParams){
                if(copyParams["type"]=="IMG") {
                    addImageFunc(copyParams, function (imgElementId) {
                        global.setSelect(imgElementId);
                    });
                    
                }
                else if(copyParams["type"]=="DIV") {
                    var textElementId = addTextFunc(copyParams);
                    global.setSelect(textElementId);
                }
                
            }
        },
        changeSlider:function(snum){
            var sliderID = "slider"+snum;
            if(!sliders[sliderID]) {
                Core.log("Slider is not exist!");
                return;
            }
            if(currentSlider&&sliders[currentSlider]){
                sliders[currentSlider].style.display = "none";
            //                            sb.removeClass(sliders[currentSlider], sliders[currentSlider].getAttribute("data-anim"));
            }
            sliders[sliderID].style.display = "block";
            //            setTimeout(function(){
            //                
            //                sb.addClass(sliders[sliderID], sliders[sliderID].getAttribute("data-anim"));
            //                     
            //            });
            currentSlider = sliderID;
            editor = sliders[currentSlider];
            sb.notify({
                type:"changeShowAnim",
                data:editor.getAttribute("data-anim")
            });
            cancelElementOperateMenuFunc();
            easm.style.display = "none";
            if(target){
                sb.removeClass(elementSet[target].container,"element-select");
                var parts = sb.query(".element-container-apart", elementSet[target].container);
                for (var i = 0; i < parts.length; i++) {
                    sb.removeClass(parts[i],"show-container-apart");
                }
                target = null;
            }
        },
        cancelElementOperateMenu:function(){
            eom.style.display = "none";
        },
        changeSliderAnim:function(newAnim){
            sliders[currentSlider].setAttribute("data-anim", newAnim);
            sb.notify({
                type:"changeShowAnim",
                data:newAnim
            });
        },
        changeShowAnim:function(anim){
            showAnim.innerHTML = anim_name[anim];
        },
        setSelect : function (elemID) {
            if (elemID === "panel") return;
            //取消现有目标的效果
            if(target&&elementSet[target]) {
                sb.removeClass(elementSet[target].container,"element-select");
                var parts = sb.query(".element-container-apart", elementSet[target].container);
                for (i = 0; i < parts.length; i++) {
                    sb.removeClass(parts[i],"show-container-apart");
                }
            }
            if (target === elemID) {
                target = null;
                return;
            }
            target = elemID;

            var container = elementSet[target].container;
            sb.addClass(container, "element-select");
            var elements = sb.query(".element-container-apart", elementSet[target].container);
            for (i = 0; i < elements.length; i++) {
                sb.addClass(elements[i],"show-container-apart");
            }

        },
        elementOpertate:function(elemID,etar,container){
            var i;
            sb.click(etar, {isDown : false}, function (e) {
                    cancelRightMenu();
                    if (elemID === "panel") return;
                    //取消现有目标的效果
                    if(target&&elementSet[target]) {
                        sb.removeClass(elementSet[target].container,"element-select");
                        var parts = sb.query(".element-container-apart", elementSet[target].container);
                        for (i = 0; i < parts.length; i++) {
                            sb.removeClass(parts[i],"show-container-apart");
                        }
                    }
                    if (target === elemID) {
                        target = null;
                        return;
                    }
                    target = elemID;
                    sb.addClass(container, "element-select");
                    var elements = sb.query(".element-container-apart", elementSet[target].container);
                    for (i = 0; i < elements.length; i++) {
                        sb.addClass(elements[i],"show-container-apart");
                    }
                    
            })

            function cancelRightMenu () {
                cancelElementOperateMenuFunc();
                easm.style.display = "none";
            }
            sb.bind(etar,"mousedown",function(e){
                //监听鼠标右键
                if(e.button==2){
                    //取消默认右键菜单
                    etar.oncontextmenu = function(){
                        return false;
                    }
                    //清除上次setimeout
                    if(eomTout!=-1){
                        window.clearTimeout(eomTout);
                        eomTout = -1;
                    }
                    // //取消现有目标的效果
                    // if(target&&elementSet[target]) {
                    //     sb.removeClass(elementSet[target].container,"element-select");
                    //     var parts = sb.query(".element-container-apart", elementSet[target].container);
                    //     for (i = 0; i < parts.length; i++) {
                    //         sb.removeClass(parts[i],"show-container-apart");
                    //     }
                    // }
                    //elemID==canvas时为面板触发右键

                    rightMenuBtn = elemID;
                    if(elemID=='panel'){
                        //如果上次为面板触发右键，隐藏菜单
                        if(eom.style.display == "block"){
                            cancelElementOperateMenuFunc();
                            easm.style.display = "none";
                            return;
                        }
                        //面板触发右键，则没有选择目标
                        target=null;
                        eom.style.display = "block";
                        setPositionFunc(e,eom,-50,-50,-100,-200);
                        eomTout = window.setTimeout(function(){
                            eom.style.display = "none";
                            eomTout =  -1;
                        }, 3000); 
                        return;
                    }
                    //再点击就取消选中
                    // if(target==elemID){
                    //     cancelElementOperateMenuFunc();
                    //     easm.style.display = "none";
                    //     target = null;
                    //     return;
                    // }
                    // target = elemID;
                    // sb.addClass(container, "element-select");
                    // var elements = sb.query(".element-container-apart", elementSet[target].container);
                    // for (i = 0; i < elements.length; i++) {
                    //     sb.addClass(elements[i],"show-container-apart");
                    // }
                    eom.style.display = "block";
                    setPositionFunc(e,eom,-50,-50,-100,-200);
                    eomTout = window.setTimeout(function(){
                        eom.style.display = "none";
                        eomTout =  -1;
                    }, 3000); 
                }
            });
        },
        setPosition:function(event,elem,x1,y1,x2,y2,show){
            var offsetX = event.screenX>(window.innerWidth+x2)?x2:x1,
            offsetY = (event.screenY>window.innerHeight+y2)?y2:y1;
            elem.style.left = (event.screenX+offsetX)+"px";
            elem.style.top = (event.screenY+offsetY)+"px";
        },
        createElementContainer:function(sizeObj,partSize,elem, options){
            /*
             * names:con_e container:east
             *      con_w container:west
             *      con_s container:south
             *      con_n container:north
             */
            options = options || {};

            var container = options.container || document.createElement("div");
            var move_e = document.createElement("div");
            var move_w = document.createElement("div");
            var move_s = document.createElement("div");
            var move_n = document.createElement("div");
            var parts = {
                "con_e":{
                    className:"con-part-e",
                    resizeHandle:sb.proxy(sb.resizeRX, sb),
                    style:"right:"+(-partSize/2-2)+"px;top:50%;"
                },
                "con_w":{
                    className:"con-part-w",
                    resizeHandle:sb.proxy(sb.resizeLX, sb),
                    style:"left:"+(-partSize/2-2)+"px;top:50%;"
                },
                "con_s":{
                    className:"con-part-s",
                    resizeHandle:sb.proxy(sb.resizeBY, sb),
                    style: "bottom:"+(-partSize/2-2)+"px;left:50%;"
                },
                "con_n":{
                    className:"con-part-n",
                    resizeHandle:sb.proxy(sb.resizeTY, sb),
                    style:"top:"+(-partSize/2-2)+"px;left:50%;"
                },
                "con_se":{
                    className:"con-part-se",
                    resizeHandle:sb.proxy(sb.resizeRB, sb),
                    style:"bottom:"+(-partSize/2-2)+"px;right:"+(-partSize/2-2)+"px;"
                },
                "con_ne":{
                    className:"con-part-ne",
                    resizeHandle:sb.proxy(sb.resizeRT, sb),
                    style:"top:"+(-partSize/2-2)+"px;right:"+(-partSize/2-2)+"px;"
                },
                "con_sw":{
                    className:"con-part-sw",
                    resizeHandle:sb.proxy(sb.resizeLB, sb),
                    style:"bottom:"+(-partSize/2-2)+"px;left:"+(-partSize/2-2)+"px;"
                },
                "con_nw":{
                    className:"con-part-nw",
                    resizeHandle:sb.proxy(sb.resizeLT, sb),
                    style:"top:"+(-partSize/2-2)+"px;left:"+(-partSize/2-2)+"px;"
                }
            };
            var frag = document.createDocumentFragment();
            for (var item in parts) {
                var element = sb.create("div");
                element.className = "element-container-apart "+parts[item].className;
                element.setAttribute("style", parts[item].style+"height:"+partSize+"px;width:"+partSize+"px;");
                parts[item].element = element;
                parts[item].resizeHandle([element,container,elem]);
                frag.appendChild(element);
            }
            
            if (!options.container) {
                container.setAttribute("style", "position:absolute;z-index:1;left:0px;top:0px;");
                //图形库的图形大小为图片本身大小
            }
            if (options['isFixedSize']) {
                container.style.height = sizeObj.height + 'px';
                container.style.width = sizeObj.width + 'px';
            }

            container.className = "element-container";
            move_e.className = "element-container-apart-move con-move-e";
            move_w.className = "element-container-apart-move con-move-w";
            move_s.className = "element-container-apart-move con-move-s";
            move_n.className = "element-container-apart-move con-move-n";
            move_w.setAttribute("style", "left:0px;top:0;height:100%;width:10px;");
            move_e.setAttribute("style", "right:0px;top:0;height:100%;width:10px;");
            move_s.setAttribute("style", "bottom:0px;left:0;height:10px;width:100%;");
            move_n.setAttribute("style", "top:0px;left:0;height:10px;width:100%;");
            container.setAttribute("draggable", false);
            container.appendChild(move_w);
            container.appendChild(move_e);
            container.appendChild(move_s);
            container.appendChild(move_n);
            container.appendChild(frag);
            sb.move(move_w,container);
            sb.move(move_e,container);
            sb.move(move_s,container);
            sb.move(move_n,container);
            return {
                container:container
            }
        }
    };
});