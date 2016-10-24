var createInbox = (function(w){
    function Inbox(obj){
        var tmpl                = obj.template                  || "#line-inbox";
        tmpl                    = Inbox.getTemplate(tmpl);
        this.lines              = [];
        this.readList           = [];
        this.lineShow           = obj.lineShow                  || ".email-list-show";
        this.lineDelete         = obj.lineShow                  || ".email-list-delete";
        this.targetCounter      = obj.targetCounter             || ".email-list-title-unread-count";
        this.targetSubject      = obj.targetSubject             || ".email-body-title-text";
        this.targetBody         = obj.targetBody                || ".email-body-text";
        this.markAsUnreadClass  = obj.markAsUnreadClass         || ".email-tools-itens-unread";
        this.deleteClass        = obj.deleteClass               || ".email-tools-itens-delete";
        this.messages           = obj.messages.messages;
        this.template           = tmpl;
        this.unread             = obj.messages.totalUnready
        this.target             = obj.target                    || ".email-list-items";
        this.readClass          = obj.readClass                 || "read-item";
        this.targetActions      = obj.targetActions             || ".email-body-actions";
        this.hideAll            = ".hide-action";
        return this.process(obj);
    }

    Inbox.getTemplate = function(tmpl){
        var cont = document.createElement("div");
        cont.innerHTML = document.querySelector(tmpl).innerHTML;
        return cont.querySelector('li');
    };

    Inbox.createArray = function (obj) {
        var data = [];
        for(var x in obj){
            if(obj.hasOwnProperty(x)) {
                data.push(obj[x]);
            }
        }
        data = data.sort(function(a, b){
         return b.time_sent - a.time_sent;
        });
        return data;
    }

    Inbox.prototype = {
        current: 0,
        updateCounter: function (uid) {
            var counter =  document.querySelector(this.targetCounter),
                readList = this.readList;
            if(!readList[uid]){
                this.unread = this.unread-1;
                this.unread = (this.unread <=0)? 0 : this.unread;
                counter.innerHTML = this.unread;
                this.readList[uid] = uid;
            }
            return this;
        },

        hideAction: function(){
            var hideAll = hideAll = document.querySelectorAll(this.hideAll);
            hideAll = [].slice.call(hideAll);
            hideAll.map(function(item){
                item.style.display = "none";
            });
            return this;
        },
        markAsUnread: function () {
            if(this.current === 0){
                return false;
            }
            var target = document.querySelector(this.target).querySelector('.'+this.current),
                counter =  document.querySelector(this.targetCounter),
                reg;
            if(target.className.indexOf(this.readClass)!==-1){
                reg = new RegExp(this.readClass, 'gi');
                target.className = target.className.replace(reg, "");
                this.unread = this.unread+1;
                counter.innerHTML = this.unread;
                delete this.readList[this.current];
            }

        },

        showMessage: function(uid){
            this.current = uid;
            var mail = this.messages[uid],
                title   = document.querySelector(this.targetSubject),
                body    = document.querySelector(this.targetBody),
                actions = document.querySelectorAll(this.targetActions);

            this.hideAction();

            title.innerHTML = mail['subject'];
            body.innerHTML = mail['message'];
            body.setAttribute("data-current-message", uid);
            actions = [].slice.call(actions);
            actions.map(function(item){
                item.style.display = "block";
            });
            
        },
        removeMessage: function (uid) {
            uid = uid || this.current;
            if(uid === 0){
                return false;
            }
            var mail    = this.messages[uid],
                line    = document.querySelector('.'+uid),
                title   = document.querySelector(this.targetSubject),
                body    = document.querySelector(this.targetBody),
                current = body.getAttribute("data-current-message"),
                actions = document.querySelector(this.targetActions);

            if(current && current === uid){
                body.innerHTML = "";
                title.innerHTML = "";
                actions.style.display = "none"; 
                this.current = 0;
            }
            delete this.messages[uid];
            this.hideAction();
            this.lines = [];
            this.process().print();
            return this;
                    
        },
        setBehavior: function(line, obj){
            var self    = this,
                link    = line.querySelector(this.lineShow),
                linkDel = line.querySelector(this.lineDelete),
                uid     =  obj.uid;
            line.className += " "+uid;
            link.addEventListener("click", function(e){
                e.preventDefault();
                line.className += " "+self.readClass;
                self.updateCounter(uid);
                self.showMessage(uid);
            });

            linkDel.addEventListener("click", function(e){
                e.preventDefault();
                self.updateCounter(uid);
                self.removeMessage(uid);
            });

            return line;
        },
        setMarkAsUnread: function () {
            var target = document.querySelector(this.markAsUnreadClass),
                self = this;
            target.addEventListener("click", function (e) {
                e.preventDefault();
                self.markAsUnread();
            });
        },
        setDeleteOnCorner: function (argument) {
            var target = document.querySelector(this.deleteClass),
                self = this;

            target.addEventListener("click", function (e) {
                e.preventDefault();
                self.removeMessage();
            });
        },
        generateLine: function(obj){
            var tmpl = this.template.cloneNode("true"),
                content = tmpl.innerHTML,
                reg;
            for(var x in obj){
                if(obj.hasOwnProperty(x)) {
                    reg = new RegExp("\{\{"+x+"\}\}", "gi")
                    content = content.replace(reg, obj[x]);
                    
                }
            }
            if(!obj.unread){
                tmpl.className += " read-item";
                tmpl.setAttribute("data-unread", false);
            }
            tmpl.innerHTML = content;
            return tmpl;
        },
        setCommands: function (argument) {
           this.setMarkAsUnread();
           this.setDeleteOnCorner();
           return this;
        },

        process : function(){
            var tmpl   = this.template,
                line,
                lines = [],
                msg    = Inbox.createArray(this.messages),
                count = msg.length;
            for(var x=0;x<count; x++){
                line = this.generateLine(msg[x]);
                line = this.setBehavior(line, msg[x]);
                lines.push(line);
            }
            this.lines = lines;
            return this;

        },
        print: function(){
            var target  = document.querySelector(this.target),
                counter =  document.querySelector(this.targetCounter),
                lines   = this.lines;
            counter.innerHTML = this.unread;
            target.innerHTML = "";
            lines.map(function(item){
                target.appendChild(item);
            });
            return this;
        }
    }
    return function(obj){
        return new Inbox(obj);
    }
})(window);