/**
     * 延时执行函数，用于解决onresize之类的连续操作引起的系统卡顿
     * @param  {[type]} method  [description]
     * @param  {[type]} context [description]
     * @return {[type]}         [description]
     */
    function throttle(method, context) {
        clearTimeout(method.tId);
        method.tId = setTimeout(function() {
            method.call(context);
        }, 100);
    }