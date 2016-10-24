var manager  = (function(w){
    "use strict";
    function Manager(obj){
        return this.processNewMessages(obj);
    }
    Manager.prototype = {
        messages: {},
        totalReady: 0,
        totalUnready: 0,
        setMessage : function(message){
            this.messages[message.uid] =  message;
        },
        dateConveter: function(date){
            var d = new Date(date * 1000).toUTCString();
            d = d.replace(/:\d{2}\s{1,}\w{3}$/gi, "");
            return d;
        },
        processNewMessages : function(data){
            // for the  example I will assume all message are new
            var self = this;
            data.map(function(item){
                item.unread = true;
                item.time_sent_string = self.dateConveter(item.time_sent);
                self.setMessage(item);
            });

            self.totalUnready = data.length;
            return this;
        }
    }
    return function(obj){
        return new Manager(obj);
    }
})(window);