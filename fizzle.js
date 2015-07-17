/**
 * �ڵ�ѡ����
 * ƥ��ڵ㲢����һ����װ���Ķ���
 * @version 0.0.1
 * @link https://github.com/latel/cook.js/blob/master/core/fizzle.js
 */
 
 
$ = fizzle = function (selector, context) {
    //����fizzle�����е�����
    //1. ��[0]��ʼ�����飬�洢ƥ�䵽��Ԫ�أ����أ�
    //2. ƥ�䵽��Ԫ�صĳ���
    var length = 0, i, j, crumbs, nodes = [], node, selectorEl, offset = 0, rets = [];
    //�����ȶ���һЩ���õ�������
    //1.�Ƿ��Ǹ�����"#id"�ļ��ַ���
    var exprId = /^#(\w)+$/;
 
    function isWindow (obj) {
        return obj != null && obj.window == window;
    }
    function isArray (obj) {
        return Object.prototype.toString.call(obj) == "[object Array]";
    }
    function isFunction (obj) {
        return Object.prototype.toString.call(obj) == "[object Function]";
    }
    function makeArray (iterable) {
        var ret = [],
            len = iterable.length;
        //String��window��functionҲ��length����
        if (len == null || typeof iterable === "string" || isFunction(iterable) || isWindow(iterable))
            ret[0] = iterable;
        else
            while (len)
                ret[--len] = iterable[len];
        return ret;
    }
 
    //��ζ���һ����Ҫ�ĺ���
    //��������Ե���ѡ�����Ľ�����������ȡ�ڵ�
    //@param {String} crumb  xuanze���ı�����:
    //    "div#nerd.is ul.happy li p"
    //@param {DOM Object} context �������޶����������Դ˿�ʼ��������
    //@return {Array} ƥ�䵽��DOM�ڵ���ɵ�����
    //function matchEl (filter, context) {
    function matchEl (crumb, context) {
        var i, j, len, len2, rets = [], ret, tagName, id, clazz, child, pattern, type, attr, val, dice, queue;
 
 
        //handle context to make sure that it is an array
        context = isArray(context)? context : [context];
 
        //tagname limited, prevent from large selections
        tagName = crumb.match(/^\w+/) !== null && crumb.match(/^\w+/)[0] || "*";
        for (i = 0, len = context.length; i < len; i++) {
            rets = rets.concat(
                    makeArray(
                        context[i].getElementsByTagName(tagName.toUpperCase())));
        }
        if (tagName !== "*") {
            crumb = crumb.replace(new RegExp("^" + tagName, ""), "");
        }
 
        //loop the left crumbs char to specialfy the ones
        //id
        if (/^#/.test(crumb)) {
            id = crumb.match(/^#\w+/)[0].replace("#", "");
            crumb = crumb.replace(new RegExp("^#" + id, ""), "");
            for (j = 0, len = rets.length; j < len; j++) {
                //shortcut
                ret = rets[j];
                if (ret.id != id) {
                    rets.splice(j, 1);
                    len--;
                    --j;
                }
            }
        }
        //class
        if (/^\./.test(crumb)) {
            clazz = crumb.match(/^\.\w+/)[0].replace(".", "");
            crumb = crumb.replace(new RegExp("^\." + clazz, ""), "");
            for (j = 0, len = rets.length; j < len; j++) {
                //shortcut
                ret = rets[j];
                className = " " + ret.className + " ";
                pattern = new RegExp(clazz, "");
                if (!pattern.test(className)) {
                    rets.splice(j, 1);
                    len--;
                    --j;
                }
            }
        }
        //child([attr=?])
        if (/^\[[^\]]*\]/.test(crumb)) {
            seed = crumb.match(/^\[[^\]]*\]/)[0].replace("[", "").replace("]", "");
            crumb = crumb.replace("[" + seed + "]", "");
            attr  = seed.match(/^\w+/)[0]; seed = seed.replace(new RegExp("^" + attr, ""), "");
            expr  = seed.match(/^(!=|=)/)[0]; seed = seed.replace(new RegExp("^" + expr, ""), "");
            val   = seed;
            if (expr === "!=") {
                for (j = 0, len = rets.length; j < len; j++) {
                    //shortcut
                    ret = rets[j];
                    if (css.attr(ret, attr) == val) {
                        rets.splice(j, 1);
                        len--;
                        --j;
                    }
                }
            } else {
                for (j = 0, len = rets.length; j < len; j++) {
                    //shortcut
                    ret = rets[j];
                    if (css.attr(ret, attr) != val) {
                        rets.splice(j, 1);
                        len--;
                        --j;
                    }
                }
            }
        }
        //child(:odd,:even,:random)
        if (/^:/.test(crumb)) {
            seed  = crumb.match(/^:\w+/)[0].replace(":", "");
            crumb = crumb.replace(new RegExp("^:" + seed, ""), "");
            type  = seed.match(/^\w+/)[0];
            seed  = seed.replace(type, "");
            switch (type) {
                case "odd":
                    for (len = rets.length, j = rets.length - 1; j >= 0; j--) {
                        //shortcut
                        ret = rets[j];
                        if (j%2 == 1) {
                            rets.splice(j, 1);
                            len--;
                            --j;
                        }
                    }
                    break;
 
                case "even":
                    for (len = rets.length, j = rets.length - 1; j >= 0; j--) {
                        //shortcut
                        ret = rets[j];
                        if (j%2 == 0) {
                            rets.splice(j, 1);
                            len--;
                            --j;
                        }
                    }
                    break;
 
                case "random":
                    //���С��1����Ϊ�ٷֱȵļ���ѡȡ
                    //������ڵ���1����Ϊ��������ĸ���
                    seed = seed || 1;
                    if (seed < 1) {
                        for (j = 0, len = rets.length; j < len; j++) {
                            //shortcut
                            dice = Math.random();
                            ret = rets[j];
                            if (dice > seed) {
                                rets.splice(j, 1);
                                len--;
                                --j;
                            }
                        }
                    } else {
                        queue = [];
                        seed = rets.length - parseInt(seed);
                        while (queue.length < seed) {
                            dice = Math.round(Math.random() * (rets.length - 1));
                            queue[queue.length] = rets[dice];
                            rets.splice(dice, 1);
                        }
                    }
                    break;
            }
        }
 
        //peal blank at head
        crumb = crumb.replace(/^\s+/, "");
         
        //is it nessesary to continue
        if (crumb)
            return matchEl(crumb, rets);
        else {
            //ȥ���ظ���Ԫ��
            return rets;
        }
    }
 
    //��֤������������һ��Ԫ��
    selector = selector || document;
    //��֤�г�ʼ�����ģ�Ĭ����Ϊdocument
    context  = context && context.nodeType === 1 ? context : document;
 
    //���ݸ�����selector���ͣ����������¼�������
    //1. ������Windoow����������
    //2. ������Ǹ�DOMԪ��
    //3. �ַ�������
    //�����������ζ�ÿ�������������
 
    //1..
    //����Ƕ����ֱ�ӷ���
    if (typeof selector === document || isWindow(selector))
        return selector;
 
    //2..
    //DOMԪ�ص�nodeTypeֵ��Ϊ1
    if (selector.nodeType === 1) {   
        return selector;
    }
 
    //3..
    //�����ַ���
    if (typeof selector == "string") {
        //����ȥ����β�Ŀհ�
        selector = selector.replace(/^\s+|\s+$/g, "");
        //���ѡ����Ϊ����#id�ļ���ʽ�������ԭ���ķ���������Ч��
        if (exprId.test(selector)) {
            return document.getElementById(selector.replace("#", ""));
        } else {
            //���е�������ζ��ѡ�����Ǹ��Ƚϸ��ӵ���ʽ
            //@var {String} selectorEl ѡ�����ĵ���Ԫ�أ��磺
            //    $("div#nerd.is ul.happy li p, input.me");
            //    ���ᱻ��Ϊ
            //        div#nerd.is ul.happy li p,
            //        input.me
            //    2��xuanzeqi suo pipei daode yuansu de���
            //@var {Array} nodes ��ʱ�洢ƥ�䵽�Ľڵ�
            selectorEl  = selector.split(",");
            for (i = 0, len = selectorEl.length; i < len; i++) {
                j     = 0;
                //�հ׵Ľڵ㲻Ӧ�ñ���⣬д���ˣ�
                if (selectorEl[i] && !/^\s+$/.test(selectorEl[i])) {
                    nodes = matchEl(selectorEl[i], context);
                    rets  = rets.concat(nodes);
                }
            }
        }
    }
    return rets;
    /*
    return isArray(rets)?
        rets[0] : 
        rets;*/
};