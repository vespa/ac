var getData = (function(){
    "use strict";
    function GetData(obj){
        obj = obj || {};
        this.constructor    = getData;
        this.path           = obj.path                  || "data/data.json";
        this.method         = obj.method                || "get";
        this.success        = obj.success               || function(xhr){ return xhr.responseText ; };
        this.error          = obj.error                 || function(xhr){ return xhr.statuText; };
        return this.request();
    }
    // private
    // associates with the constructor to allow unit test get here
    GetData.createRequest = function(method, url){
      var xhr;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else if(window.ActiveXObject) {
        try {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
          try {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (e) {
            xhr = false;
          }
        }
      }
      xhr.open(method, url, true);
      return xhr;
    };

    // public
    GetData.prototype = {
        request : function(){
            var self = this, 
                getData = this.constructor,
                request = GetData.createRequest(this.method, this.path),
                msg,
                useReadyState = false;
            if(request){
                request.send();
                request.onerror = function(){
                    self.error(req);
                }
                // old IE versions
                if(typeof request.onload === "undefined"){
                    useReadyState = true;
                }

                request.onload = function(){
                    msg = JSON.parse(request.responseText);
                    self.success(msg);
                }

                if(request.readyState && useReadyState ) {
                    request.onreadystatechange = function() {
                        if (request.readyState === 4 || request.readyState === "loaded" || request.readyState === "complete") {
                            request.onload();
                        }
                    };
                }
            };
        }
    }
    return function(obj){
        return new GetData(obj);
    }
})();