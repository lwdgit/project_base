var ProcessBar = function(args) {
    this.ele = null;
    this.args = args || {};
    if (typeof this.args != 'object') throw new Error('the arguments can only be json type!');
    this.timeout = this.args.timeout || 500;
    this.text = this.args.text || 'rebooting...';
    this.url = this.args.url || location.href;
    this.maxPercent = this.args.maxPercent || 100;
    this._curPercent = 0;
    this._percentEle = null;
    this._progressBarEle = null;
    this.callback = this.args.callback;
    this.init();
};
ProcessBar.prototype = {
    constructor: ProcessBar,
    init: function() {
        this.create();
        return this;
    },
    _createHtmlElement: function() {
        this.ele = document.createElement('div');
        this.ele.id = 'loading_wrap'
        this.ele.style.display = 'none';
        this.ele.innerHTML = '<div id="loading_div" >' + '<span class="loadding"><span id="load_pc"></span></span><br /><span id="load_text">' + this.text + '</span><i id="percent"></i>' + '</div><div class="loading-bg"></div>';
        document.body.appendChild(this.ele);
        this._percentEle = document.getElementById('percent');
        this._progressBarEle = document.getElementById('load_pc');
    },
    create: function() {
        if (!this.ele) this._createHtmlElement();
    },
    _timer: function() {
        this._curPercent++;
        if (this._curPercent > this.maxPercent) {
            this.stop();
        } else {
            this._percentEle.innerHTML = this._curPercent + '%';
            this._progressBarEle.style.width = ~~(this._curPercent / this.maxPercent*100) + '%';
            var that = this;
            setTimeout(function() {
                that._timer();
            }, this.timeout);
        }

    },
    stop: function() {
        if (this._callback()) {
            this.gotoHref();
        }
        this.hide();
    },
    start: function() {
        this.show();
        this._timer();
    },
    show: function() {
        this.ele.style.display = 'block';
    },
    hide: function() {
        this.ele.style.display = 'none';
    },
    gotoHref: function() {
        window.location.href = this.url;
    },
    _callback: function(callback) {
        this.callback = callback || this.callback;
        if (typeof this.callback == 'function') {
            return this.callback.apply(this, arguments);
        }
        return true;
    }
}


