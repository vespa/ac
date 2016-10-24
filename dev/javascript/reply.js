var reply = (function(){
    "use strict";
    function Reply(obj){
        obj = obj || {};
        this.target         = obj.target        || ".email-body-actions ";
        this.replyBox       = obj.replyBox      || ".email-reply";
        this.textarea       = obj.textarea      || ".email-reply-body-textarea ";
        this.subject        = obj.subject       || ".email-reply-body-title-input";
        this.textOrigin     = obj.textOrigin    || ".email-body-text";
        this.subjectOrigin  = obj.subjectOrigin || ".email-body-title-text";
        return this.configure();
    }
    Reply.prototype ={
        configure: function(){
            var target          = document.querySelector(this.target),
                box             = document.querySelector(this.replyBox),
                textarea        = document.querySelector(this.textarea),
                subject         = document.querySelector(this.subject),
                textOriging     = document.querySelector(this.textOrigin),
                subjectOrigin   = document.querySelector(this.subjectOrigin),
                self            = this;

            target.addEventListener("click", function (e) {
                e.preventDefault();
                box.style.display = "block";
                subject.value = "re: " + subjectOrigin.innerHTML;
                textarea.innerHTML = "\n\r\n\r\n\r\n\r------\n\r" + textOriging.innerHTML;
            })
            return this;
        }
    }
    return function (obj){
        new Reply(obj);
    }
})();