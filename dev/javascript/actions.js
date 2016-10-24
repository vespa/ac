
(function(){
    "use strict";
    var messages;
    var inbox;

    getData({
        path : "data/data.json",
        success : function(data){
            messages    = manager(data.messages);
            inbox = createInbox({
                target   : ".email-list-items",
                messages : messages 
            }) 
            .print()
            .setCommands();
            
            reply();
        }
    }); 
})();
