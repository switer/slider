(function(){
    
    /**************颜色选取面板***************/
    
    var colorSelectors = document.querySelectorAll(".colorSelector"),k,clen;
    
    for (k= 0,clen = colorSelectors.length; k < clen; k++) {
        
        var colorSelector = colorSelectors[k],
        
        general_list = document.createElement("div"),
        
        standard_list = document.createElement("div"),
        
        color_list = document.createElement("div"),
        
        execCType = document.createElement("input");
        
        execCType.type = "hidden";
        
        execCType.value="foreColor";
    
        colorSelector.style.display="none";
        
        general_list.className = "general_list";
        
        standard_list.className = "standard_list";
        
        color_list.className = "color_list";
        
        execCType.className = "execC_type";
    
        var generalColor = ['#ffffff','#000000','#EEECE1','#1F497D','#4F81BD','#C0504D',
        '#9BBB59','#8064a2','#4BACC6','#F79646'];

        var standardColor = ['#C00000','#ff0000','#FFC000','#ffff00','#92D050','#00B050',
        '#00B0F0','#0070C0','#002060','#7030A0'];

        var color = [0xF2F2F2,0x7F7F7F,0xDDD9C3,0xC6D9F0,0xDBE5F1,0xF2DCDB,0xEBF1DD,
        0xE5E0EC,0xDBEEF3,0xFDEADA];

        var color2 = [0x7F7F7F,0x0C0C0C,0x1D1B10,0x0F243E,0x244061,0x632423,0x4F6128,
        0x3F3151,0x205867,0x974806];
    
        var len = generalColor.length,color_len = 5,i,j,strong;
    
        for ( i= 0; i < len; i++) {
        
            strong = document.createElement("a");
            
            strong.href = "javascript:;";
            
            strong.style.backgroundColor = generalColor[i];
            
            general_list.appendChild(strong);
        
            strong.addEventListener("click", function(e){
            
                document.execCommand(execCType.value,false,e.currentTarget.style["backgroundColor"]);
            
            }, false);
        
            strong = document.createElement("a");
            
            strong.href = "javascript:;";
            
            strong.style.backgroundColor = standardColor[i];
            
            standard_list.appendChild(strong);
        
            strong.addEventListener("click", function(e){
            
                document.execCommand(execCType.value,false,e.currentTarget.style["backgroundColor"]);
            
            }, false);
        
        }
    
        for (i = 0; i < color_len; i++) {
        
            for (j = 0; j < len; j++) {
            
                strong = document.createElement("a");
                
                strong.href = "javascript:;";
                
                /*分割第一组16进制颜色数据*/
                var colordiv =  [parseInt(color[j]/0x10000),parseInt(color[j]/0x100)%0x100,parseInt(color[j])%0x100];
                /*分割第二组16进制颜色数据*/
                var colordiv2 =  [parseInt(color2[j]/0x10000),parseInt(color2[j]/0x100)%0x100,parseInt(color2[j])%0x100];
                /*比较两组分割的差值*/
                var diffs = [((colordiv[0]-colordiv2[0])/4),((colordiv[1]-colordiv2[1])/4),((colordiv[2]-colordiv2[2])/4)];
                /*计算背景色*/
                var bgcolor =  parseInt(parseInt(colordiv[0]-diffs[0]*i)*0x10000+parseInt(colordiv[1]-diffs[1]*i)*0x100+parseInt(colordiv[2]-diffs[2]*i));
                /*hack为颜色数据长度必须为6位*/
                var colorstr = bgcolor.toString(16);
                
                if(colorstr.length<6) colorstr = "0"+colorstr;
                
                strong.style.backgroundColor = "#"+colorstr;
                
                color_list.appendChild(strong);
                
                strong.addEventListener("click", function(e){
            
                    document.execCommand(execCType.value,false,e.currentTarget.style["backgroundColor"]);
            
                }, false);
            }
        }
    
        var frag = document.createDocumentFragment();
    
        frag.appendChild(execCType);
        
        frag.appendChild(general_list);
        
        frag.appendChild(color_list);
        
        frag.appendChild(standard_list);
    
        colorSelector.appendChild(frag);
    }
    /*********************************************/
    
    Core.startAll(); 
    
    var abH = 100,abW = 300;
    var alertBox = document.querySelector("#alert-box");
    
    alertBox.style["marginTop"] = (window.innerHeight-abH)/2+"px";
    alertBox.style["marginLeft"] = (window.innerWidth-abW)/2+"px";
    
    var titles = (document.querySelectorAll(".title")),elem;
    var messageBox = document.querySelector("#message-box");
    var messageContent =messageBox.querySelector(".message-content");
    
    for (i = 0; elem = titles[i]; i++) {
        
        elem.addEventListener("mouseover", function(event){
            
            var tar = event.currentTarget;
            
            messageContent.innerHTML = tar.getAttribute("data-title");
            
            messageBox.style.display = "block";
            
            window.setTimeout(function(){
                
                messageBox.style.left = (event.clientX+25)+"px";
            
                messageBox.style.top = (event.clientY+25)+"px";
                
            });
       
        }, false);
        
        elem.addEventListener("mouseout", function(event){
    
            document.querySelector("#message-box").style.display = "none";
       
        }, false);
    }

}());