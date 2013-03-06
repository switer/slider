Core.registerModule("view",function(sb){
    var createFrameFunc = null,frame_count = 0,VIEWSCALE=5, 
    frame_number = 0,MAX_FRAME_NUMBER=10,frames = new sb.ObjectLink(),
    dispFrames = new sb.ObjectLink(),hidFrames = new sb.ObjectLink(),currentFrame = null,
    addSliderFunc = null,showFrameFunc = null,frameContainer = null,addFrameElementFunc = null,
    addFrameObjectFunc = null,changeCurrFrameFunc = null,preFramesButn=null,nextFramesButn = null,
    changeDisplayFrameListFunc = null,getElementDataFunc=null,showFrameElementByDataFunc=null;
    return {
        init:function(){
            frameContainer = sb.find("#frame-list");
            preFramesButn = sb.find("#pre-frame-list");
            nextFramesButn = sb.find("#next-frame-list");
            createFrameFunc = this.createFrame;
            addSliderFunc = this.addSlider;
            showFrameFunc = this.showFrame;
            addFrameElementFunc = this.addFrameElement;
            addFrameObjectFunc = this.addFrameObject;
            changeCurrFrameFunc = this.changeCurrFrame;
            changeDisplayFrameListFunc = this.changeDisplayFrameList;
            getElementDataFunc = this.getElementData;
            showFrameElementByDataFunc = this.showFrameElementByData;
            if(!currentFrame) this.addSlider("append");
            sb.listen({
                "deleteSlider":this.deleteFrame,
                "addSlider":this.addSlider,
                "importSlider":this.addSlider,
                "showSlider":this.showFrame,
                "changeSliderStyle":this.changeSliderStyle,
                "changeFrame":this.showFrame,
                "insertSlider":this.insertFrame,
                "enterEditorMode":this.enterEditorMode,
                "enterPreviewMode":this.enterPreviewMode
            });
            preFramesButn.onclick = function(){
                if(dispFrames.getFirstElement()==frames.getFirstElement()) return;
                frameContainer.className = "";
                changeDisplayFrameListFunc(dispFrames.getFirstElement(),"showPre");
                window.setTimeout(function(){
                    frameContainer.className = "anim-move-left";
                });
            };
            nextFramesButn.onclick = function(){
                if(dispFrames.getLastElement()==frames.getLastElement()) return;
                if(dispFrames.findIndex(dispFrames.getLastElement())<MAX_FRAME_NUMBER) return;
                frameContainer.className = "";
                changeDisplayFrameListFunc(dispFrames.getLastElement(),"showNext");
                window.setTimeout(function(){
                    frameContainer.className = "anim-move-right";
                });
            }
        },
        destroy:function(){
        },
        insertFrame:function(){
            addSliderFunc("insert");
        },
        addFrameObject:function(frame,method,pos){
            if(method=="insert") {
                frames.insert(frame,"before",pos);
                if(!dispFrames[pos]){
                    Core.log("frame display error");
                }else dispFrames.insert(frame,"before",pos);
            }
            else if(method=="append") {
                frames[frame.key] = frame.value;
                dispFrames[frame.key] = frame.value;
            }
            else Core.log("wrong insert slider method!");
        },
        addFrameElement:function(elem,method,pos,container){
            if(method=="insert") container.insertBefore(elem, pos);
            else if(method=="append") container.appendChild(elem);
            else Core.log("wrong insert slider-Element method!");
        },
        addSlider:function(method){
            var frame = createFrameFunc(method);
            if(method=="append") addFrameElementFunc(frame.frame,method,null,frameContainer);
            else if(method=="insert") addFrameElementFunc(frame.frame,method,frames[currentFrame],frameContainer);
            changeDisplayFrameListFunc(frame.id,method);
        },
        deleteFrame:function(){
            //nearFrame:当前frame的邻近frame,
            //method {'before','after'}:the sequence insert into dispFrames
            var nearFrame,method;
            //select from display frames
            nearFrame = frames.getSlider("pre",currentFrame,-1)||
            frames.getSlider("next",currentFrame,-1);
            if(nearFrame == null){
                //select from all frames
                nearFrame = frames.getSlider(method="pre",currentFrame,-1)||
                frames.getSlider(method="next",currentFrame,-1);
            }
            //显示新的预览列表
            var oldCurr = showFrameFunc(nearFrame,method=="pre"?"before":"after");
            //删除预览frame
            if(oldCurr){
                frameContainer.removeChild(frames[oldCurr]);
                frame_count--;
                delete frames[oldCurr];
                if(dispFrames[oldCurr]) delete dispFrames[oldCurr];
                if(hidFrames[oldCurr]) delete hidFrames[oldCurr];  
            }
            changeDisplayFrameListFunc(currentFrame,"delete");
        },
        /*
         *get a appropriate hidden frame and display it
         *pos {'head','end'}
         */
        displayFrame:function(){
            var disIndexA,disIndexB,dispFrame = null,disAID,disBID;
            disAID = dispFrames.getFirstElement();
            disBID = dispFrames.getLastElement();
            disIndexA = frames.findIndex(disAID);
            disIndexB = frames.findIndex(disBID);
            if(disIndexA>1){
                dispFrame = frames.getSlider(null, null, disIndexA-1);
                dispFrames.insert({
                    key:dispFrame,
                    value:frames[dispFrame]
                }, "before", disAID);
            }
            else {
                if(disIndexB<frames.length){
                    dispFrame = frames.getSlider(null, null, disIndexB+1);
                    dispFrames.insert({
                        key:dispFrame,
                        value:frames[dispFrame]
                    }, "after", disBID);
                }
            }
            if(dispFrame){
                delete hidFrames[dispFrame];
                frames[dispFrame].style.display = "block";
            }
        },
        /*
         *show the slider of the frame
         *if frame is not exist,create a new frame
         *返回前一个frame，没有就返回null
         */
        showFrame:function(frameID){
            var curr;
            if(frameID&&frames[frameID]){
                //currentFrame = frameID;
                //若为第一个帧，显示该帧所在的组
                if(frameID==dispFrames.getFirstElement()){
                    curr = currentFrame;
                    changeDisplayFrameListFunc(frameID,"showPre");
                    window.setTimeout(function(){
                        frameContainer.className = "anim-move-left";
                    });
                    return curr;
                }
                //若为最后一个帧，显示该帧所在的组
                else if(frameID == dispFrames.getLastElement()&&dispFrames.length()>=MAX_FRAME_NUMBER){
                    curr = currentFrame;
                    changeDisplayFrameListFunc(frameID,"showNext");
                    window.setTimeout(function(){
                        frameContainer.className = "anim-move-right";
                    });
                    return curr;
                }
                return changeCurrFrameFunc(frameID);
            }else{
                curr = currentFrame;
                addSliderFunc("append");
                return curr;
            }
        },
        /*
         * function:1.change currentFrame to new currentFrame
         *          2.delete currentFrame in hidFrames
         *          3.insert newCurr into dispFrames
         *          4.display newCurr  
         *          5.return oldCurr
         * 
         */
        changeCurrFrame:function(newCurr,method){
            var oldCurr = null;
            if(!dispFrames[newCurr]){
                delete hidFrames[newCurr];
                dispFrames.insert({
                    key:newCurr,
                    value:frames[newCurr]
                }, method, currentFrame);   
            }
            oldCurr = currentFrame;
            if(frames[currentFrame]) sb.removeClass(frames[currentFrame],"focus");
            currentFrame = newCurr;
            frames[currentFrame].style.display = "block";
            sb.addClass(frames[currentFrame],"focus");
            sb.notify({
                type:"changeSlider",
                data:parseInt(currentFrame.substr("frame".length,currentFrame.length))
            });
            if(oldCurr){
                var dataSet = sb.data("sliderDataSet");
                var frameNumber = oldCurr.substr("frame".length, oldCurr.length);
                var frameData = dataSet["slider"+frameNumber];
                var elements = getElementDataFunc(frameData);
                showFrameElementByDataFunc(elements,oldCurr);
            }
            return oldCurr;
        },
        getElementData:function(dataSet){
            var data,datas = {},container,type,value,elem,zIndex,height,width,left,top;
            for(var o in  dataSet){
                if(dataSet.hasOwnProperty(o)){
                    container = dataSet[o].container;
                    elem = dataSet[o].data;
                    type = elem.tagName;
                    value = elem.src||elem.innerHTML;
                    zIndex = dataSet[o].zIndex;
                    height = container.style.height||elem.style.height;
                    width = container.style.width||elem.style.width;
                    data = {
                        type:type,
                        value:value,
                        attr:container.getAttribute("style"),
                        panelAttr:type=="IMG"?sb.find(".element-panel",container).getAttribute("style"):"",
                        left:container.style.left,
                        top:container.style.top,
                        height:height,
                        width:width,
                        zIndex:zIndex
                    };
                    datas[o] = data;
                }
            }
            return datas;
        },
        showFrameElementByData:function(data,frame){
            var elem = null,borderWidth;
            var frameEelem = frames[frame];
            var framePanel = sb.find(".frame-panel",frameEelem);
            frameEelem.innerHTML = "";
            if(framePanel){
                frameEelem.appendChild(framePanel);
            }
            for(var a in data){
                if(data.hasOwnProperty(a)){
                    elem = document.createElement("div");
                    elem.setAttribute("style", data[a].attr);
                    borderWidth = elem.style.borderWidth;
                    elem.style.position = "absolute";
                    elem.style.left = (parseInt(data[a].left.substr(0,data[a].left.length-2))/VIEWSCALE)+"px";
                    elem.style.top = (parseInt(data[a].top.substr(0,data[a].top.length-2))/VIEWSCALE)+"px";
                    elem.style.height = (parseInt(data[a].height.substr(0,data[a].height.length-2))/VIEWSCALE)+"px";
                    elem.style.width = (parseInt(data[a].width.substr(0,data[a].width.length-2))/VIEWSCALE)+"px";
                    if(borderWidth) {
                        elem.style.borderWidth = parseInt(parseInt(borderWidth.substr(0,borderWidth.length-2))/VIEWSCALE+0.5)+"px";
                    }
                    elem.style.zIndex = data[a].zIndex;
                    if(data[a].type=="IMG"){
                        var img = new Image();
                        var panel = sb.create("div");
                        panel.setAttribute("style",  data[a].panelAttr);
                        img.src = data[a].value;
                        img.style["height"] = "100%";
                        img.style["width"]= "100%";
                        img.style["borderTopLeftRadius"]= elem.style["borderTopLeftRadius"];
                        img.style["borderTopRightRadius"]= elem.style["borderTopRightRadius"];
                        img.style["borderBottomLeftRadius"]= elem.style["borderBottomLeftRadius"];
                        img.style["borderBottomRightRadius"]= elem.style["borderBottomRightRadius"];
                        elem.appendChild(img);
                        elem.appendChild(panel);
                    }
                    else if(data[a].type=="DIV"){
                        var text = document.createElement("div");
                        text.innerHTML = data[a].value;
                        text.className = "text";
                        var theight = (parseInt(data[a].height.substr(0,data[a].height.length-2)));
                        var twidth = (parseInt(data[a].width.substr(0,data[a].width.length-2)));
                        text.style.top = ((-theight*(VIEWSCALE-1)/(VIEWSCALE))/2)+"px";
                        text.style.left = ((-twidth*(VIEWSCALE-1)/(VIEWSCALE))/2)+"px";
                        text.style.height = data[a].height;
                        text.style.width = data[a].width;
                        text.style.position = "relative";
                        elem.className = "textCon";
                        elem.appendChild(text);
                        elem.style.overflow = "hidden";
                    }else{
                        Core.log("unsupport type :"+data[a].type);
                    }
                    frames[frame].appendChild(elem);
                }
            }
        },
        /*
         *change current display frame-list
         *function:1.如果为向后追加，则begin元素显示在尾部；
         *          2.如果为插入方式，则begin元素显示在头部；
         *
         */
        changeDisplayFrameList:function(begin,method){
            var beginIndex = -1,endIndex = -1,newDispFrames = null,length,frame = null;
            beginIndex = frames.findIndex(begin);
            if(method=="append"){
                var indexA = beginIndex;
                if((indexA=(indexA-MAX_FRAME_NUMBER+1))<1){
                    indexA = 1;
                }
                endIndex = beginIndex;
                beginIndex = indexA;
            }
            else if(method=="insert"){
                var headDispIndex = frames.findIndex(dispFrames.getSlider(null, null, 1));
                beginIndex = headDispIndex;
                endIndex = beginIndex+MAX_FRAME_NUMBER-1;
            }
            else if(method=="delete"){
                beginIndex = frames.findIndex(dispFrames.getSlider(null, null, 1));
                endIndex  = beginIndex+MAX_FRAME_NUMBER-1;
            }
            else if(method=="showPre"){
                var indexB = beginIndex;
                if((indexB=(indexB-MAX_FRAME_NUMBER+1))<1){
                    indexB = 1;
                }
                endIndex = indexB+MAX_FRAME_NUMBER-1;
                beginIndex = indexB;
            }
            else if(method=="showNext"){
                endIndex = beginIndex+MAX_FRAME_NUMBER-1;
            }
            else {
                Core.log("changeDisplayFrameListError!");
                return;
            }
            newDispFrames = frames.subSet(beginIndex,endIndex);
            for(var o in frames){
                if(frames.hasOwnProperty(o)){
                    frames[o].style.display = "none";
                    hidFrames[o] = frames[o];
                    delete dispFrames[o];
                }
            }
            length  = newDispFrames.length;
            for (var i = 0; i < length; i++) {
                frame = newDispFrames[i];
                dispFrames[frame] = frames[frame];
                dispFrames[frame].style.display = "block";
                delete hidFrames[frame];
            }
            changeCurrFrameFunc(begin,"append");
        },
        /*
         *function：1.create a new frame-element{DIV}
         *          2.add frame-number and frame-count
         *          3.offer the method insert or append to the frames
         *          4.add the frame event handle
         *          5.return Object:{id,frame}
         */
        createFrame:function(method){
            var frame = document.createElement("div");
            var framePanel = sb.create("div");
            frame.appendChild(framePanel);
            frame.className = "frame scale";
            framePanel.className = "frame-panel";
            frame.setAttribute("style", "display:block;");
            framePanel.setAttribute("style", "position:absolute;width:100%;height:100%;");
            frame_number++;
            frame_count++;
            var frameID = "frame"+frame_number;
            //            frames[frameID] = frame;
            if(method=="append") addFrameObjectFunc({
                key:frameID,
                value:frame
            },method,null);
            else if(method=="insert") addFrameObjectFunc({
                key:frameID,
                value:frame
            },method,currentFrame);
            var SframeNum = frame_number;
            frame.addEventListener("click", function(){
                sb.notify({
                    type:"changeSlider",
                    data:SframeNum
                });
                sb.notify({
                    type:"changeFrame",
                    data:frameID
                });
            },false);
            return {
                id:"frame"+frame_number,
                frame:frame
            }
        },
        changeSliderStyle:function(att){
            sb.find(".frame-panel",frames[currentFrame]).style[att.key] = att.value;
        },
        enterEditorMode:function(){
            sb.container.style.display = "block";
        },
        enterPreviewMode:function(){
            sb.container.style.display = "none";
        }
    };
});
