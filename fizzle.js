/**
 * 节点选择器
 * 匹配节点并返回一个包装过的对象
 * @version 0.0.1
 * @link https://github.com/latel/cook.js/blob/master/core/fizzle.js
 */
 
 
$ = fizzle = function (selector, context) {
    //申明fizzle对象中的属性
    //1. 以[0]开始的数组，存储匹配到的元素（隐藏）
    //2. 匹配到的元素的长度
    var length = 0, i, j, crumbs, nodes = [], node, selectorEl, offset = 0, rets = [];
    //我们先定义一些常用的正则检测
    //1.是否是个形如"#id"的简单字符串
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
        //String、window和function也有length属性
        if (len == null || typeof iterable === "string" || isFunction(iterable) || isWindow(iterable))
            ret[0] = iterable;
        else
            while (len)
                ret[--len] = iterable[len];
        return ret;
    }
 
    //其次定义一个重要的函数
    //函数负责对单个选择器的解析并按其提取节点
    //@param {String} crumb  xuanze器文本，如:
    //    "div#nerd.is ul.happy li p"
    //@param {DOM Object} context 上下文限定，过滤器以此开始向下搜索
    //@return {Array} 匹配到的DOM节点组成的数组
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
                    //如果小于1则视为百分比的几率选取
                    //如果大于等于1则视为随机保留的个数
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
            //去除重复的元素
            return rets;
        }
    }
 
    //保证集合中至少有一个元素
    selector = selector || document;
    //保证有初始上下文，默认亦为document
    context  = context && context.nodeType === 1 ? context : document;
 
    //根据给定的selector类型，可能有以下几种类型
    //1. 本身是Windoow等其他对象
    //2. 本身就是个DOM元素
    //3. 字符串类型
    //现在我们依次对每个情况做出处理
 
    //1..
    //如果是对象就直接返回
    if (typeof selector === document || isWindow(selector))
        return selector;
 
    //2..
    //DOM元素的nodeType值均为1
    if (selector.nodeType === 1) {   
        return selector;
    }
 
    //3..
    //解析字符串
    if (typeof selector == "string") {
        //首先去除首尾的空白
        selector = selector.replace(/^\s+|\s+$/g, "");
        //如果选择器为类似#id的简单形式，则调用原生的方法以提升效率
        if (exprId.test(selector)) {
            return document.getElementById(selector.replace("#", ""));
        } else {
            //运行到这里意味着选择器是个比较复杂的形式
            //@var {String} selectorEl 选择器的单个元素，如：
            //    $("div#nerd.is ul.happy li p, input.me");
            //    将会被视为
            //        div#nerd.is ul.happy li p,
            //        input.me
            //    2个xuanzeqi suo pipei daode yuansu de组合
            //@var {Array} nodes 临时存储匹配到的节点
            selectorEl  = selector.split(",");
            for (i = 0, len = selectorEl.length; i < len; i++) {
                j     = 0;
                //空白的节点不应该被检测，写错了？
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