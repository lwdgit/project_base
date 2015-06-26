function Sleep(timeout) {
    this.timeout = timeout || 0;
    return this;
}

Sleep.prototype.do = function(callback, context) {
    setTimeout(function() {
        if (typeof callback == 'string')
            callback = eval(callback);
        else 
            callback.call(context);
    }, this.timeout);
    return this;
}

Sleep.prototype.sleep = function(timeout) {
    this.timeout = this.timeout + timeout;
    return this;
}
