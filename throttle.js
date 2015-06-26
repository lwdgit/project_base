/**
     * ��ʱִ�к��������ڽ��onresize֮����������������ϵͳ����
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