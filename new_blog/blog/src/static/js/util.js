var Ajax = {
    _createObj: function() {
        var xmlHttp;
        if (window.ActiveXObject) {
            xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
        } else {
            xmlHttp = new XMLHttpRequest();
        }
        return xmlHttp;
    },
    _handleData: function(data, type) {
        if (data && typeof data === 'object') {
            if (type === 'json') {
                return JSON.stringify(data);
            } else {
                var res = '';
                for (var p in data) {
                    res += (p + '=' + data[p]);
                }
                return encodeURI(res);
            }
        } else {
            return data;
        }
    },
    _response: function(req, callback) {
        req.onreadystatechange = function() {
            if (req.readyState === 4) {

                if (req.status === 200) {
                    callback(req.responseText);
                } else {
                    callback(null, req);
                }
            }
        };
    },
    param: function(obj) {
        if (Object.prototype.toString.call(obj) === '[object Object]') {
            var ret = [];
            for(var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    ret.push(encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]));
                }
            }
            ret = ret.join('&');
            ret = ret.replace(/%20/g, '+');
            return ret;
        } else {
            return '';
        }
    },
    get: function(url, callback) {
        var req = this._createObj();
        req.open('GET', url);
        req.send(null);
        this._response(req, callback);
    },
    post: function(url, data, callback, type) {
        var req = this._createObj();
        req.open('POST', url, true);
        var header = type === 'json' ? 'text/json' : 'application/x-www-form-urlencoded';
        req.setRequestHeader('Content-Type', header);
        if (typeof data === 'function') {
            type = callback;
            callback = data;
            req.send(null);
        } else {
            req.send(this._handleData(data));
        }

        this._response(req, callback);
    },
    jsonp: function(url, data, callback) {
        var id = ~~(Math.random() * 10000);
        var sc = document.createElement('script');
        var cb = '_callback_' + id;
        window[cb] = function(response) {
            sc.jsonp = 1;
            if (typeof callback === 'function') {
                if (response)
                    callback(JSON.stringify(response));
                else
                    callback(response);
            }
            //console.log(response);
            document.getElementsByTagName('head')[0].removeChild(sc);
            delete window[cb];
        };
        if (url.indexOf('?') === -1) {
            url += '?';
        }
        url += '&callback=' + cb;
        sc.src = url;
        sc.onload = sc.onreadystatechange = function() {
            if (-[1, ] || /loaded|complete/i.test(this.readyState)) {
                if (sc.jsonp !== 1) {
                    window[cb](null);
                } 
            }
            sc.onload = sc.onreadystatechange = null;
            sc = null;
        };
        sc.onerror = function() {
            window[cb](null);
            sc.onerror = null;
        };
        document.getElementsByTagName('head')[0].appendChild(sc);
    },
    localLoad: function(url, data, callback, conf) {
        conf = conf || {};
        var localData;
        if (conf.forceUpdate !== true || !onLine()) {
            localData = localStorage.getItem(url);
        }
        if (localData) {
            callback(localData);
        } else {
            var _callback = function(data, req) {
                if (data) {
                    localStorage.setItem(url, data);
                } else {
                    data = localStorage.getItem(url); //如果未取得数据，则从本地读取
                }
                return callback(data, req);
            };
            this.jsonp(url, data, _callback, 'json');
        }
    },
    loadStyle: function(path, callback) {
        if (!path) return;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = path;
        document.getElementsByTagName('head')[0].appendChild(link);
        if (typeof callback === 'function') {
            link.onload = callback;
        }
    }
};

function showLoadding(show) {
    var style = document.getElementById('loadding').style;
    if (show) {
        style.cssText = 'display: block';
    } else {
        style.cssText = 'opacity: 0';
        setTimeout(function() {
            style.display = 'none';
        }, 1000);
    }
}

function onLine() {
    return navigator.onLine || location.host === '127.0.0.1' || location.host === 'localhost';
}

exports.onLine = onLine;

exports.showLoadding = showLoadding;

exports.Ajax = Ajax;
