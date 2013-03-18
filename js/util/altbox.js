!function () {
    window.altbox = {};
    window.altbox.start = function () {
        var abH = 100,abW = 300;
        var alertBox = document.querySelector("#alert-box");
        // alertBox.style["marginTop"] = (window.innerHeight-abH)/2+"px";
        // alertBox.style["marginLeft"] = (window.innerWidth-abW)/2+"px";
        $(alertBox).css({
            zIndex : 9999,
            marginTop : (window.innerHeight-abH)/2+"px",
            marginLeft : (window.innerWidth-abW)/2+"px"
        })
        var titles = (document.querySelectorAll("[data-title]")),elem;
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
    }
}()