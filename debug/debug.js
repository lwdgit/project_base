
/**
 * 全局错误收集模块
 */

function sendError(data) {
    var msg = [
        [data.url, data.line, data.col].join(':'), data.msg
    ].join(' ==> ');
    msg = new Date().toString().match(/[\d:-]*/g).join(" ").replace(/ +/g, " ") + ": >>>>>" + msg + "   browser:" + navigator.appVersion;
    $.post("goform/getWebError?data=" + msg);
}

function sendOwnMsg(data) {
    $.post("goform/getWebError?data=" + data);
}

//调试信息开关
var enableDebug = false,
    Debugload = false;


if (window.location.href.toLocaleLowerCase().indexOf("enabledebug") > 0 || window.document.cookie.indexOf('enabledebug') > -1) {
    enableDebug = true;
    Debugload = true;
}

window.onerror = function(msg, url, line, col, error) {
    if (msg !== "Script error." && !url) {
        if (enableDebug) {
            return false;
        } else {
            return true;
        }
    }
    setTimeout(function() {
        var data = {};
        col = col || (window.event && window.event.errorCharacter) || 0;
        data.url = url;
        data.line = line;
        data.col = col;
        if (!!error && !!error.stack) {
            data.msg = error.stack.toString();
        } else if (!!arguments.callee) {
            var ext = [];
            var f = arguments.callee.caller,
                c = 3;
            while (f && (--c > 0)) {
                ext.push(f.toString());
                if (f === f.caller) {
                    break;
                }
                ext = ext.join(',');
                data.msg = error.stack.toString();
            }
        }
        sendError(data);
    }, 0);
    if (enableDebug) {
        return false;
    } else {
        return true;
    }
};


/**
 * 调试组件，可灵活关闭
 * @return {[type]} [description]
 */
var Debug = (function(window) {
    var enable = false;
    if (window.console && window.console.log) {
        if (typeof enableDebug != "undefined" && enableDebug === true) {
            enable = true;
        }
    }

    function getError() {
        return new Error();
    }

    function getInfo() {
        var err = getError();
        if (typeof err.lineNumber == "undefined") {
            if (err.stack) { //chrome
                var line = err.stack.match(/Debug\.log.*\n *(.*)/);
                if (line !== null) {
                    line = line[1];
                }
                return line || err.stack.match(/at ((http|file).*)/)[1];
            } else {
                return "";
            }
        } else {
            return err.stack.match(/Debug<\/<\.log.*\n(.*)/)[1];
        }
    }

    return {
        log: function(msg) {
            if (enable) {
                if (console.log.apply) {
                    enable && console.log.apply(console, Array.prototype.slice.call(arguments).concat("                                     ==>").concat(getInfo()));
                } else {
                    enable && console.log(msg);
                }
            }
        },
        logem: function(msg) {
            if (enable) {
                if (console.log.apply) {
                    var args = "%c";
                    for (var data in arguments) {
                        if (typeof arguments[data] == "object") {
                            args += " %o";
                        } else {
                            args += " %s";
                        }
                    }
                    args += "%s";
                    args = [args].concat("font-weight:bolder;color:#111;background-color:#ff0");
                    console.log.apply(console, args.concat(Array.prototype.slice.call(arguments)).concat("                                     ==>").concat(getInfo()));
                } else {
                    console.log(msg);
                }
            }
        },
        warn: function(msg) {
            if (enable) {
                if (console.log.apply) {
                    console.warn.apply(console, arguments);
                } else {
                    console.warn(msg);
                }
            }
        },
        error: function(msg) {
            if (enable) {
                if (console.log.apply) {
                    console.error.apply(console, arguments);
                } else {
                    console.error(msg);
                }
            }
        },
        count: function(msg) {
            if (enable) {
                if (console.count) {
                    console.count.apply(console, arguments);
                }
            }
        }
    };
}(window));

enableDebug && Debug.log('%c调试模式启动!', "filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr='#FF0000',endColorStr='#F9F900',gradientType='1'); background: -moz-linear-gradient(left, #FF0000, #F9F900); background: -o-linear-gradient(left,#FF0000, #F9F900); background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#FF0000), to(#F9F900));");

