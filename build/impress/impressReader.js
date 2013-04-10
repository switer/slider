var paintingBoards = {},
    targetSlider = null;
(function(){
    var impressContainer = document.getElementById("impress"),
        sliders = {},
        index = 0;
    
    var datajson = document.getElementById('datajson').innerHTML,
        datas = JSON.parse(datajson),
        DATA = JSON.parse(datas.cntData),
        conf = datas.cntConf;

    function getSqrt(map) {
        var len = 0;
        for(var key in map){
            if(map.hasOwnProperty(key)) len ++;
        }
        var sqrtNum = Math.sqrt(len);
        if (sqrtNum % 1 > 0) sqrtNum = parseInt(sqrtNum) + 1; 
        console.log(len, sqrtNum);
        return sqrtNum;
    }

    var module = {
        init:function(){
            var sqrtNum = getSqrt(DATA);
            for(var s in DATA){
                if(DATA.hasOwnProperty(s)){
                    var slider = document.createElement("DIV"),
                        panel = document.createElement("DIV"),
                        elements = DATA[s].element;
                    slider.appendChild(panel);
                    panel.setAttribute('style', DATA[s].panelAttr);
                    sliders[s] = slider;

                    $(slider)
                            .css({
                                'height' : conf.height,
                                'width'  : conf.width
                            })
                            .data('x', (index % sqrtNum) * ( parseInt(conf.width)  + 100))
                            .data('y', parseInt(index / sqrtNum) * ( parseInt(conf.height)  + 100))
                            .addClass('slide step')
                            // .data('x', index * ( parseInt(conf.width)  + 100) )
                            // .data('y', 0)
                    index ++;
                    for (var e in elements) {
                        if(elements.hasOwnProperty(e)){
                            var data = elements[e],elem;
                            if(data.type === "DIV"){
                                elem = document.createElement("DIV");
                                elem.innerHTML = decodeURIComponent(data.value);
                                elem.setAttribute("style", data.cAttr + data.eAttr);
                                elem.style.zIndex = data.zIndex;
                            }
                            else if(data.type=="IMG"){
                                elem = new Image();
                                elem.src = data.value;
                                elem.setAttribute("style", data.cAttr);
                                elem.style.zIndex = data.zIndex;
                            }
                            else if (data.type==="VIDEO") {
                                elem = document.createElement("video");
                                var src = document.createElement("source");
                                src.src = data.value;
                                elem.appendChild(src);
                                elem.setAttribute("style", data.cAttr);
                                elem.setAttribute('controls', true);
                                elem.style.zIndex = data.zIndex;
                            }
                            else if (data.type==='CODE') {
                                var text = document.createElement("div");

                                elem = document.createElement("div");

                                elem.setAttribute("style", data.cAttr);
                                elem.style.zIndex = data.zIndex;
                                text.setAttribute("style", data.eAttr);
                                elem.appendChild(text);
                                (function (eData) {
                                        var codeMirror = CodeMirror(text, {
                                          value: eData.value,
                                          mode:  eData.codeType,
                                          theme:  eData.theme,
                                          lineNumbers  : true,
                                          lineWrapping  : true,
                                          readOnly : false
                                        });
                                        setTimeout(function () {
                                            module.triggerWindowResize();
                                        }, 0);
                                })(data)

                            }
                            if(elem) slider.appendChild(elem);
                        }
                    }
                    impressContainer.appendChild(slider);
                }
            }
            impress().init();
        },
        //cm需要resize来refresh
        triggerWindowResize : function () {
            var evt = document.createEvent("UIEvents");
            evt.initUIEvent('resize', true, true, window)
            window.dispatchEvent(evt);
        }
    };
    window.module = module;
    module.init();
}());