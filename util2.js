/* global -Debug */

var Debug = {
    enable: false,
    sendError: false,
    _sendError: function(data) {
        if (!Debug.sendError) return;
        var msg = [
            [data.url, data.line, data.col].join(':'), data.msg
        ].join(' \n==> ');
        msg = new Date().toString().match(/[\d:-]*/g).join(" ").replace(/ +/g, " ") + ": >>>>>" + msg + "   browser:" + navigator.appVersion;
        $.ajax({
            url: 'http://192.168.98.21/goform/collectErr.php?data=' + msg,
            type: 'get',
            dataType: 'jsonp'
        });
        // $.post("goform/getWebError?data=" + msg);
    },
    init: function() {
        Debug.getState();
        Debug._fire();
    },
    getState: function() {
        if (!window.console || !window.console.log) {
            Debug.enable = false;
            return;
        }
        if (window.location.href.toLocaleLowerCase().indexOf("enabledebug") > 0 || window.document.cookie.indexOf('enabledebug') > -1) {
            Debug.enable = true;
        }
    },
    _fire: function() {
        /*window.onerror = function(msg, url, line, col, error) {
            if (msg !== "Script error." && !url) {
                if (Debug.enable) {
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
                Debug._sendError(data);
            }, 0);
            if (Debug.enable) {
                return false;
            } else {
                return true;
            }
        };*/
    },
    _getError: function() {
        return new Error();
    },
    _getInfo: function() {
        var err = Debug._getError();
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
    },
    log: function(msg) {
        if (Debug.enable) {
            if (console.log.apply) {
                Debug.enable && console.log.apply(console, Array.prototype.slice.call(arguments).concat("\n").concat(Debug._getInfo()));
            } else {
                Debug.enable && console.log(msg);
            }
        }
    },
    logem: function(msg) {
        if (Debug.enable) {
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
                console.log.apply(console, args.concat(Array.prototype.slice.call(arguments)).concat("                                     ==>").concat(Debug._getInfo()));
            } else {
                console.log(msg);
            }
        }
    },
    warn: function(msg) {
        if (Debug.enable) {
            if (console.log.apply) {
                console.warn.apply(console, arguments);
            } else {
                console.warn(msg);
            }
        }
    },
    error: function(msg) {
        if (Debug.enable) {
            if (console.log.apply) {
                console.error.apply(console, arguments);
            } else {
                console.error(msg);
            }
        }
    },
    count: function() {
        if (Debug.enable) {
            if (console.count) {
                console.count.apply(console, arguments);
            }
        }
    }
};
Debug.init();
if (window == top) Debug.log('%c调试模式启动!', "font-size: 20px;");

/**
 * [objClone description]
 * @param  {[type]} myObj [description]
 * @return {[type]}       [description]
 */
function objClone(myObj) {
        if (typeof(myObj) != 'object') return myObj;
        if (myObj === null) return myObj;
        var myNewObj = {};
        for (var i in myObj)
            myNewObj[i] = objClone(myObj[i]);
        return myNewObj;
    }
    /**
     * 拓展数组对象深度克隆
     * @return {[type]} [description]
     */
Array.prototype.clone = function() { //为数组添加克隆自身方法，使用递归可用于多级数组
    var newArr = [];
    for (var i = 0; i <= this.length - 1; i++) {
        var itemi = this[i];
        if (itemi.length && itemi.push) itemi = itemi.clone(); //数组对象，进行递归
        else if (typeof(itemi) == "object") itemi = objClone(itemi); //非数组对象，用上面的objClone方法克隆
        newArr.push(itemi);
    }
    return newArr;
}



/**
 * [GetSetData description]
 * @type {Object}
 */
$.GetSetData = {
    getData: function(url, handler) {
        if (url.indexOf("?") < 0) {
            url += "?" + Math.random();
        }
        $.ajax({
            url: url,
            cache: false,
            type: "get",
            dataType: "text",
            async: true,
            success: function(data, status) {
                if (data.indexOf("login.js") > 0) {
                    window.location.href = "login.asp";
                    return;
                }

                if (typeof handler == "function") {
                    handler.apply(this, arguments);
                }
            },
            error: function(msg, status) {
                Debug.log("get Data failed,msg is ", msg);
                if (typeof handler == "function") {
                    handler.apply(this, arguments);
                }
            },
            complete: function(xhr) {
                xhr = null;
            }
        });

    },
    getDataSync: function(url, handler) {
        if (url.indexOf("?") < 0) {
            url += "?" + Math.random();
        }
        $.ajax({
            url: url,
            cache: false,
            type: "get",
            dataType: "text",
            async: false,
            success: function(data, status) {
                if (data.indexOf("login.js") > 0) {
                    window.location.href = "login.asp";
                    return;
                }

                if (typeof handler == "function") {
                    handler.apply(this, arguments);
                }
            },
            error: function(msg, status) {
                Debug.log("get Data failed,msg is ", msg);
                if (typeof handler == "function") {
                    handler.apply(this, arguments);
                }
            },
            complete: function(xhr) {
                xhr = null;
            }
        });
    },
    getJson: function(url, handler) {
        this.getData(url, function(data) {
            handler($.parseJSON(data));
        });
    },
    getHtml: function(elems, url, handler) {
        this.getData(url, function(data, status) {
            if (status == "success") {
                elems.html(data);
            }
            handler(status);
            data = null;
            elems = null;
        });
    },
    setData: function(url, data, handler) {
        $.ajax({
            url: url,
            cache: false,
            type: "post",
            dataType: "text",
            async: true,
            data: data,
            success: function(data) {
                if (data.indexOf("login.js") > 0) {
                    window.location.href = "login.asp";
                    return;
                }
                if ((typeof handler).toString() == "function") {
                    handler(data);
                }
            }
        });
    }
};




/**
 * table opt
 */

var TablePage = function($el, data) {
    this.$el = $el;

    this.currentIndex = 0;
    this.perNum = 10; //list length per page
    this.pageNum = 1; //total page
    this.showStyle = 1; //0: 部分数据 1:全部数据

    this.data = data;
    this.pageData = data;
    this.dataCols = 0;
    this.tHead = [];
    this.hasInit = false;
    this.updateCallback = null;

    this.btn = {
        currentIndex: 1, //start from 1
        visible: true,
        maxIndex: 7,
        insertArea: $('#page'),
        btnWrap: '<a class="btn btn-default prev">&lt;</a>%btns%<a class="btn btn-default next">&gt;</a><label for="gotoPageVal">跳转：</label><div class="pageGo"><div class="input-group controls-sm"><input class="form-control" type="text" id="gotoPageVal"><span class="input-group-btn"><button type="button" class="btn btn-default" id="goToBtn">Go</button></span></div></div>',
        hiddenInfo: '<span class="info-hidden-flag">...</span>'
    };

    this.html = {
        tHead: '',
        tBody: '',
        table: ''
    };

    this.MSG = {
        noData: "没有表格数据"
    };
};

TablePage.prototype = {
    constructor: TablePage,
    init: function() {
        if (this.$el === null || !this.$el.length) {
            throw new Error('please specify the element for table');
        }
        this.tableOpt.initTableContainer.call(this);

        if (!this.hasInit) {
            
            if (!this.btn.insertArea.length && !this.$el.siblings('.table-page-navbtn').length) {
                var id = 'tablePageBtn_'+ ~~(Math.random() * 1000);
                this.$el.after('<div class="table-page-navbtn" id="' + id + '"></div>');
                this.btn.insertArea = $('#' + id);
            }
            this.btnOpt.bindEvent.call(this);
        }

        this.update();
        this.hasInit = true;
        return this;
    },
    dataOpt: {
        getData: function() {
            if (this.showStyle === 0) {
                if (this.data && this.data instanceof Array) {
                    this.pageData = this.data.slice(0, this.perNum);
                } else {
                    this.data = this.pageData = [];
                }
            } else {
                if (this.data && this.data instanceof Array) {
					if (this.currentIndex >= this.data.length) {
						this.currentIndex -= this.perNum;
						this.btn.currentIndex -= 1;
					}
                    this.pageData = this.data.slice(this.currentIndex, this.currentIndex + this.perNum);
                } else {
                    this.data = this.pageData = [];
                }
            }
            return this.pageData;
        },
        updateData: function(data) {
            this.data = data;
        }
    },
    update: function(callback) {
        this.dataOpt.getData.call(this);
        if (this.showStyle == 1) {
            this.pageNum = Math.ceil(this.data.length / this.perNum);
        }
        this.goPage(this.btn.currentIndex ? this.btn.currentIndex : 1);
        //this.tableOpt.createTable.call(this);

        if (callback && typeof callback == 'function') {
            callback.call(this);
        }
    },
    tableOpt: {
        initTableContainer: function() {
            this.html.table = this.html.table || (this.$el[0].tagName.toLowerCase() == 'table' ? this.$el[0].outerHTML.substr(0, this.$el[0].outerHTML.indexOf('>') + 1) : '<table>');
        },
        fillTable: function() {
            this.dataOpt.getData.call(this);
            this.html.tBody = '<tbody>';
            if (!!this.pageData.length) {
                for (var i = 0, l = this.pageData.length; i < l; i++) {
                    this.html.tBody += '<tr>';
                    if (this.pageData[i] instanceof Array || typeof this.pageData[i] == 'object') {
                        for (var j in this.pageData[i]) {
                            if (this.pageData[i][j] === undefined) continue;
                            this.html.tBody += '<td>' + this.pageData[i][j] + '</td>';
                        }
                    }

                    this.html.tBody += '</tr>';
                }
            } else {
                this.html.tBody += '<tr><td colspan="' + this.dataCols + '" class="text-center">' + this.MSG.noData + '</td></tr>';
            }
            this.html.tBody += '</tbody>';
        },
        createHead: function(force) {
            if (!force) {
                if (this.html.tHead) {
                    return;
                } else if (this.tHead.length) {
                    this.html.tHead = '<thead><tr>';
                    for (var i = 0, l = this.tHead.length; i < l; i++) {
                        this.html.tHead += '<th>' + this.tHead[i] + '</th>';
                    }
                    this.html.tHead += '</tr></thead>';
                    this.dataCols = this.tHead.length;
                } else if (!!this.$el.find('thead').length) {
                    this.html.tHead = this.$el.find('thead')[0].outerHTML;
                    this.dataCols = this.$el.find('thead tr>*').length;

                } else {
                    throw new Error('no table head data and not find thead elements');
                }
            } else {
                if (!this.tHead.length) {
                    throw new Error('no table head data');
                }
                this.html.tHead = '<thead><tr>';
                for (var i = 0, l = this.tHead.length; i < l; i++) {
                    this.html.tHead += '<th>' + this.tHead[i] + '</th>';
                }
                this.html.tHead += '</tr></thead>';
            }

        },
        createTable: function() {
            this.tableOpt.createHead.call(this);
            this.tableOpt.fillTable.call(this);
            this.render();
        },
        updateTable: function() {
            this.tableOpt.fillTable.call(this);
            this.render();
        },
        emptyTable: function() {
            this.html.tbody = '';
            this.render();
        }
    },
    btnOpt: {
        bindEvent: function() {
            var that = this;
            this.btn.insertArea.on('click', 'a', function() {
                if (this.className.indexOf('prev') > -1) {
                    that.btn.currentIndex = that.btn.currentIndex < 2 ? 1 : that.btn.currentIndex - 1;
                } else if (this.className.indexOf('next') > -1) {
                    that.btn.currentIndex = that.btn.currentIndex > that.pageNum - 1 ? that.pageNum : +that.btn.currentIndex + 1;
                } else {
                    that.btn.currentIndex = this.innerHTML;
                }
                that.goPage(that.btn.currentIndex);
            });
            this.btn.insertArea.on('keypress', 'input', function(e) {
                if (e.keyCode == '13') {
                    e.preventDefault();
                    this.value = ~~this.value;
                    if (this.value > that.pageNum) this.value = that.pageNum;
                    else if (this.value < 1) this.value = 1;
                    that.goPage(this.value);
                }
            });
            this.btn.insertArea.on('click', 'button', function() {
                var ele = $(this).parent().prev()[0];
                ele.value = ~~ele.value;
                if (ele.value > that.pageNum) ele.value = that.pageNum;
                else if (ele.value < 1) ele.value = 1;
                that.goPage(ele.value);
            });
        },
        /**
         * 显示或隐藏按钮
         * @param  {[bool]} visible [true为显示，false为隐藏]
         * @return {[type]}         [description]
         */
        showBtn: function(visible) {
            if (visible === true && typeof visible == 'boolean') {
                if (this.pageNum < 2 || !this.pageData.length) {
                    this.btn.insertArea.hide();
                } else {
                    this.btn.insertArea.show();
                }
            } else {
                this.btn.insertArea.hide();
            }
        },
        /**
         * 更新按钮，重绘按钮及设置active状态
         * @return {[type]} [description]
         */
        updateBtn: function() {
            var btnEle = '',
                btnWrap = this.btn.btnWrap,
                min = 0,
                max = 0,
                btnFirst = '',
                btnLast = '';

            if (this.pageNum < this.btn.maxIndex) {
                min = 2;
                max = this.pageNum > min ? this.pageNum - 1 : min;
            } else {
                var area = Math.ceil(this.btn.maxIndex - 3) / 2;
                max = +this.btn.currentIndex + area >= this.pageNum - 1 ? this.pageNum - 1 : +this.btn.currentIndex + area;
                min = +this.btn.currentIndex - area <= 2 ? 2 : +this.btn.currentIndex - area;

                if (this.btn.currentIndex - min < area) { //如果最小值按钮个数不够，则从最大值那边添数
                    max = (max + area - (this.btn.currentIndex - min)) >= this.pageNum - 1 ? this.pageNum - 1 : +max + area - (this.btn.currentIndex - min);
                } else if (max - this.btn.currentIndex < area) {
                    min = (min - area + (max - this.btn.currentIndex)) <= 2 ? 2 : min - area + (max - this.btn.currentIndex);
                }
            }

            if (min <= max && min < this.pageNum) {
                for (var i = min; i <= max; i++) {
                    if (i != this.btn.currentIndex) {
                        btnEle += '<a class="btn pageNum btn-default">' + i + '</a>';
                    } else {
                        btnEle += '<a class="btn pageNum btn-default active">' + i + '</a>';
                    }
                }
            }


            if (this.btn.currentIndex == 1) {
                btnFirst = '<a class="btn pageNum btn-default active">1</a>';
                btnLast = '<a class="btn pageNum btn-default">' + this.pageNum + '</a>';
            } else if (this.btn.currentIndex == this.pageNum) {
                btnFirst = '<a class="btn pageNum btn-default">1</a>';
                btnLast = '<a class="btn pageNum btn-default active">' + this.pageNum + '</a>';
            } else {
                btnFirst = '<a class="btn pageNum btn-default">1</a>';
                btnLast = '<a class="btn pageNum btn-default">' + this.pageNum + '</a>';
            }

            if (min > 2) {
                btnFirst += this.btn.hiddenInfo;
            }
            if (max < this.pageNum - 1) {
                btnLast = this.btn.hiddenInfo + btnLast;
            }

            btnWrap = btnWrap.replace('%btns%', btnFirst + btnEle + btnLast);
            this.btn.insertArea.html(btnWrap);

            this.btn.insertArea.find('input').val(this.btn.currentIndex);
            this.btnOpt.showBtn.call(this, true);
        }
    },
    render: function() {
        this.$el.html(this.html.tHead + this.html.tBody);//再次查找table防止元素失效
        try {
            top.ResetHeight.resetHeight();
        } catch(e){}
    },
    goPage: function(pageIndex) {
        if (this.showStyle == 1) {
            this.currentIndex = (pageIndex - 1) * this.perNum;
            this.btn.currentIndex = pageIndex;
        } else {
            this.currentIndex = 0;
            this.btn.currentIndex = pageIndex;
        }
        if (this.updateCallback && typeof this.updateCallback == 'function') {
            this.updateCallback.apply(this, arguments);
        } else {
            this.tableOpt.createTable.call(this);
        }
        this.btnOpt.updateBtn.call(this);
    }
};



/**
 * extend class
 */
var initializing = false,
    fnTest = /xyz/.test(function() {
        xyz;
    }) ? /\b_super\b/ : /.*/;
var Class = function() {};
Class.extend = function(prop) {
    var _super = this.prototype;
    initializing = true;
    var prototype = new this();
    initializing = false;
    for (var name in prop) {
        prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function(name, fn) {
                return function() {
                    var tmp = this._super;
                    this._super = _super[name];
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;
                    return ret;
                };
            })(name, prop[name]) :
            prop[name];
    }

    function Class() {
        if (!initializing && this.init)
            this.init.apply(this, arguments);
    }
    Class.prototype = prototype;
    Class.prototype.constructor = Class;
    Class.extend = arguments.callee;
    return Class;
};

/* global -R */

R = typeof R === 'undefined' ? {} : R;

R.Core = Class.extend({
    init: function() {},
    update: function() {}
});


/**
 * jquery 数据操作拓展
 */

$.isEqual = function(a, b) {
    for (var prop in a) {
        if ((!b.hasOwnProperty(prop) && a[prop] !== "") || a[prop] !== b[prop]) {
            return false;
        }
    }
    return true;
};

$.fn.extend({
    getVal: function() {
        if ($(this).length == 1) {
            if (this.tagName == "input" || $(this).attr("data-val")) {
                return $(this).val();
            } else {
                return $(this).text();
            }
        } else {
            return $(this).filter(function() {
                return this.checked && this.value;
            }).map(function() {
                return this.value;
            }).get();
        }
    },
    setVal: function(value) {
        if ($(this).length < 0 || value === undefined) {
            return;
        }
        var tagName = $(this)[0].tagName.toLowerCase(),
            type = $(this).attr("type");
        if (tagName == "input") {
            switch (type) {
                case "checkbox":
                    if ($(this).attr('group-index')) {
                        if ($(this).attr('group-index') !== '0') break;

                        var groups = $('[name=' + this[0].name + ']'),
                            valueArr;
                        if (!value || !value.toString().length) {
                            valueArr = [];
                            valueArr.length = groups.length;
                        } else {
                            valueArr = value.toString().split('');
                            if (valueArr.length < groups.length) break;
                        }

                        for (var i = 0, l = groups.length; i < l; i++) {
                            if (valueArr[i] === '1') {
                                groups[i].checked = true;
                            } else {
                                groups[i].checked = false;
                            }
                        }
                    } else if (value == $(this).val() || value == "enabled" || value == "启用" || value == "1" || value == "true") {
                        $(this).attr("checked", true);
                    } else {
                        $(this).attr("checked", false);
                    }
                    break;
                case "radio":
                    $(this).val([value]);
                    break;
                case "text":
                case "password": 
                default:
                    $(this).val(value);
            }
        } else if (tagName == "select") {
            if ($(this).find("option[value='" + value + "']").length < 1) {
                //支持手动填写的元素赋值,需要包含writeable属性
                var writeAbleOption;
                if ((writeAbleOption = $(this).find("option[writeable]")).length > 0) {
                    writeAbleOption.val(value);
                    $(this).val(value);
                } else {
                    $(this).val([value]);
                }
                
            } else {
                $(this).val([value]);
            }
        } else if ($(this).attr("data-val")) {
            $(this).val(value);
        } else if (tagName == "textarea") {
            $(this).text($(this).val(value));
        } else {
            $(this).text(value);
        }
        $(this).removeValidateTip();
    },
    collect: function() {
        return this.map(function() {
                // Can add propHook for "elements" to filter or add form elements
                var elements = $.prop(this, "elements");
                return elements ? $.makeArray(elements) : this;
            })
            .filter(function() {
                var type = this.type;
                // Use .is(":disabled") so that fieldset[disabled] works
                return ($(this).attr("data-val") || this.name || $(this).attr('data-bind') && this.tagName.toLowerCase() !== 'table') && !$(this).is(":disabled") &&
                    ($(this).attr("type") != "radio" || $(this).attr("type") == "radio" && this.checked);
            })
            .map(function(i, elem) {
                var val = $(this).val() || $(this).text();
                if ($(this).attr("type") == "checkbox") {
                    if (!$(this).attr('group-index')) {
                        val = this.checked.toString();
                    } else {
                        if ($(this).attr('group-index') === '0') {
                            val = $('input[name=' + this.name + ']').map(function() {
                                return this.checked ? 1 : 0
                            }).get().join('');
                        } else {
                            val = null;
                        }
                    }
                }
                return val === null ?
                    null :
                    $.isArray(val) ?
                    $.map(val, function(val) {
                        return {
                            name: elem.name || $(elem).attr('data-bind'),
                            value: val
                        };
                    }) : {
                        name: elem.name || $(elem).attr('data-bind') || $(elem).attr('name'),
                        value: val
                    };
            }).get();
    },
    serializeJson: function() {
        var serializeObj = {},
        array = this.collect();

        $(array).each(function() {
            if (serializeObj[this.name]) {
                if ($.isArray(serializeObj[this.name])) {
                    serializeObj[this.name].push(this.value);
                } else {
                    serializeObj[this.name] = [serializeObj[this.name], this.value];
                }
            } else {
                serializeObj[this.name] = this.value;
            }
        });
        return serializeObj;
    },
    getFormData: function() {
        return $.param(this.collect());
    }
});



/**
 * 
 * 批量赋值
 * @param  {[type]} ele [container id，或者jquery dom对象集]
 * @param  {object} [data] [数据]
 * @param {bool} [updateAll] [description]
 * @return {null}      [description]
 */
/* global -AutoFill */
var AutoFill = function(ele, data, updateAll) {
    if (!!ele) {
        this.updateAll = updateAll;
        if (typeof ele == 'string') {
            this.$formControls = $(ele).find('[name]');
            this.$commonControls = $(ele).find('[data-bind]');
        } else if (typeof ele == 'object' && !!ele.length) {
            var that = this,
                formControls = [],
                commonControls = [];
            ele.each(function() {
                if ($(this).attr('data-bind')) {
                    commonControls.push(this);
                } else if (updateAll !== false) {
                    formControls.push(this);
                }
            });
            this.$commonControls = $(commonControls);
            this.$formControls = $(formControls);
        }
        this.updateData(data);
    } else {
        Debug.log('please specify the ele!');
    }
};

AutoFill.prototype = {
    constructor: AutoFill,
    data: null,
    updateAll: true,
    originData: null,
    $formControls: [],
    $commonControls: [],

    listObj: function(obj) {
        var _obj = {};
        if ($.isPlainObject(obj)) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    if (!$.isPlainObject(obj[i])) {
                        _obj[i] = obj[i];
                    } else {
                        $.extend(_obj, this.listObj(obj[i]));
                    }
                }
            }
        } else {
            _obj = obj;
        }
        return _obj;
    },

    fill: function() {
        var data;
        
        for (var i = 0, l = this.$commonControls.length; i < l; i++) {
            data = this.data[this.$commonControls.eq(i).attr('data-bind')];
            if (this.$commonControls[i].tagName.toLowerCase() == 'table') {
                var table;
                if (!$(this.$commonControls.eq(i)).data("tablepage")) {
                    table = new TablePage(this.$commonControls.eq(i));
                    table.data = data;
                    table.init();     
                    $(this.$commonControls.eq(i)).data("tablepage", table);           
                } else {
                    table = $(this.$commonControls.eq(i)).data("tablepage");
                    table.data = data;
                    table.update();
                }
            } else {
                this.$commonControls.eq(i).setVal(data);
            }
        }

        if (this.updateAll !== false) {
            for (var i = 0, l = this.$formControls.length; i < l; i++) {
                data = this.data[this.$formControls.eq(i).attr('name')];
                this.$formControls.eq(i).setVal(data);
            }
        }
        

        return this;
    },
    updateData: function(data, updateAll) {
        this.updateAll = updateAll === undefined ? this.updateAll : updateAll;
        if (data) {
            this.originData = data;
            this.data = this.listObj(data);
            this.fill();
        }
        return this;
    }
};

/* global -AutoCollect */
var AutoCollect = function(ele) {
    if (!!ele) {
        if (typeof ele == 'string') {
            this.$formControls = $(ele).find('[name]').filter(':visible:enabled, [type="hidden"], :visible.input-append');
            this.$commonControls = $(ele).find('[data-bind]:visible');
        } else if (typeof ele == 'object' && !!ele.length) {
            var that = this,
                formControls = [],
                commonControls = [];
            ele.each(function() {
                if ($(this).attr('data-bind')) {
                    commonControls.push(this);
                } else {
                    formControls.push(this);
                }
            });
            this.$commonControls = $(commonControls);
            this.$formControls = $(formControls);
        }
    } else {
        Debug.log('please specify the ele!');
    }
};

AutoCollect.prototype = {
    constructor: AutoCollect,
    $formControls: null,
    $commonControls: null,
    getData: function(ifAll) {
        return $.param(this.$formControls.serializeJson(ifAll));
    },
    getJson: function(ifAll) {
        if (ifAll) {
            return $.extend(this.$formControls.serializeJson(), this.$commonControls.serializeJson())
        } else {
            return this.$formControls.serializeJson();
        }
    }
};


R.View = R.Core.extend({
    name: 'View',
    hasInit: false,
    submitData: null,
    validateObj: null,
    $el: null,
    defaults: {
        fetchUrl: null,
        submitUrl: null,
        events: null,
        originData: null,
        container: '',
        updateCallback: null,
        afterUpdate: null,
        beforeSubmit: null,
        afterSubmit: null
    },
    init: function(el, config) {
        if (!el) throw new Error('please specify the bind container el or data el!');
        if (typeof el == 'string') {
            this.$el = $(el);
            if (!this.$el.length) throw new Error('no found the container element!');
        } else if (typeof el == 'object' && !!el.length) { //为jquery对象
            this.$el = el;
        } else {
            throw new Error('unknown object!');
        }

        this.defaults = {
            fetchUrl: config.fetchUrl || '',
            submitUrl: config.submitUrl || '',
            events: config.events || {},
            originData: config.data || '',
            container: (typeof el === 'string' ? el : '#' + this.$el.attr('id')),
            updateCallback: config.updateCallback,
            afterUpdate: config.afterUpdate,
            afterSubmit: config.afterSubmit,
            beforeSubmit: config.beforeSubmit
        };

        
        if (this.hasInit) {
            this.update(false);//只更新非表单元素
            return;
        } else {
            this.update();//更新全部
            this.initEvents();
        }
        this.hasInit = true;

        return this;
    },
    update: function(updateAll, callback, afterCallback) {
        this.defaults.updateCallback = callback || this.defaults.updateCallback;
        
            if (!this.defaults.fetchUrl) {
                Debug.log('fetchUrl not specified!');
                return;
            }
            var that = this;
            $.GetSetData.getData(this.defaults.fetchUrl, function(res) {
                if (res !== '') {
                    res = $.parseJSON(res);
                    that.defaults.originData = res;
                    if (that.defaults.updateCallback && typeof that.defaults.updateCallback == 'function') {
                        if ((res = that.defaults.updateCallback.call(this, res, updateAll)) === false) return;
                    }

                    that.initElements(res, updateAll);
                    if (afterCallback && typeof afterCallback == 'function') {
                        afterCallback.apply(this, arguments);
                    }
                }
                Debug.log(res);
            });
        
    },
    initElements: function(data, updateAll) {
        data = data || this.defaults.originData;
        if (!this.handler) {
            if (this.$el.length < 2) {
                this.handler = new AutoFill(this.defaults.container, data, updateAll);
                this.validateObj = $.validate({wrapElem: this.defaults.container});
            } else {
                this.handler = new AutoFill(this.$el, data, updateAll);
                this.validateObj = $.validate({wrapElem: this.$el});
            }
        } else {
            this.handler.updateData(data, updateAll);
        }
        this.originData = data;
        this.defaults.originData = data;
        if (typeof this.defaults.afterUpdate === "function") {
            this.defaults.afterUpdate();
        }
    },
    validate: (function() {
        var validateAlert = false;

        return function(data) {
            var $validateWrap = $(this.$el.length < 2?this.defaults.container: this.$el),
                validatePass = this.validateObj.check($validateWrap.find(".validatebox"));

            this.submitData = data || this.submitData;

            if (!validatePass && !validateAlert) {
                validateAlert = true;
                showMsg(_("输入有误，请检查红色的输入框"));
                setTimeout(function() {
                    validateAlert = false;
                }, 2000);
            }
            return validatePass;
        }
    })(),
    collect: function($ele) {
        if (!$ele || this.$el.length > 1) {
            this.submitData = new AutoCollect(this.defaults.container).getJson() || this.submitData;
        } else {
            if (!$ele) {
                $ele = this.$el;
            }
            this.submitData = new AutoCollect($ele).getJson() || this.submitData;
        }
        return this.submitData;
    },
    submit: function(url, data, afterSubmit, beforeSubmit) {
        var that = this;

        if (typeof url === 'function') {
            afterSubmit = url;
            url = undefined;
        }

        data = data || this.collect();
        url = url || this.defaults.submitUrl;


        if (this.validate()) {
            this.defaults.beforeSubmit = beforeSubmit || this.defaults.beforeSubmit;
            if (this.defaults.beforeSubmit && typeof this.defaults.beforeSubmit === 'function') {
                var _data;
                if ((_data = this.defaults.beforeSubmit.call(this, data)) === false) {
                    return;
                } else if (_data && _data !== true) {
                    data = _data;
                }
            }

            if ($.isPlainObject(data)) {
                data = $.param(data);
            }

            Debug.log(data);

            $.GetSetData.setData(url, data, function(res) {
                that.defaults.afterSubmit = afterSubmit || that.defaults.afterSubmit;
                if (that.defaults.afterSubmit && typeof that.defaults.afterSubmit ==='function') {
                    that.defaults.afterSubmit.call(this, res);
                }
            });
        }
        return this;
    },

    getSubmitData: function() {
        if (!this.validate()) {
            return false;
        }

        data = this.collect();
        if (this.defaults.beforeSubmit && typeof this.defaults.beforeSubmit === 'function') {
            var _data;
            if ((_data = this.defaults.beforeSubmit.call(this, data)) === false) {
                return false;
            } else if (_data && _data !== true) {
                data = _data;
            }
        }
        return data;
    },
    /**
     * 批量绑定事件
     * @param  {[type]} events [eg: '{#container #type-select,click,input': netView.changeRadio}]
     * @return {[type]}        [无返回]
     */
    initEvents: function(events) {
        this.defaults.events = events || this.defaults.events;
        for (var key in this.defaults.events) {

            var event = this.defaults.events[key];
            if (event) {
                var args = key.split(',').concat(event),
                    ele = args.shift(0);
                $(ele).on.apply($(ele), args);
            }
        }
        return this;
    }
});


R.FormView = R.View.extend({
    name: 'FormView',
    afterSubmit: null,
    beforeSubmit: null,
    init: function(el, config) {
        el = el || 'form:visible';
        config = config || {};
        config.data = config.data || {};
        config.submitUrl = config.submitUrl || $(el).attr('action');
        
        this._super(el, config);
        if (!config.data || $.isEmptyObject(config.data)) {
            this.reset();
        }
    },
    update: function(data, callback) {
        var res;

        this.defaults.updateCallback = callback || this.defaults.updateCallback;        

        if (this.defaults.updateCallback && typeof this.defaults.updateCallback == 'function') {
            res = this.defaults.updateCallback.call(this, data);
        }

        data = (res || data);
        if (data) {
            this.defaults.originData = data;
            this.initElements(data);
        } else {
            this.defaults.originData = null;
            this.reset();
        }
    },
    reset: function(data) {
        $(this.defaults.container)[0].reset();
        this.initElements(data);
    },
    initEvents: function() {
        var that = this;
        this._super(this.defaults.events);
        if (!this.hasInit) {
            $(this.defaults.container).find('[type="submit"]').off('click.R.FormView').on('click.R.FormView', function(e) {
                e.preventDefault();
                that.submit(null, null, that.afterSubmit, that.beforeSubmit);
            });
        }
    }
});


var TableData = function(data, cols) { //不完善，暂时只能添加checkbox和operate两个
    this.originData = data || null;
    this.cols = cols || [];
    if (!this.originData) {
        throw new Error('data is null!');
    } else if (!(this.originData instanceof Array)) {
        throw new Error('data must be array');
    }
    if (!this.cols.length) {
        if (typeof this.cols == 'string') {
            this.cols = new Array(this.cols);
        } else if (this.cols instanceof Array) {
            this.cols = cols;
        }
    }
    this.init();
};

TableData.prototype = {
    constructor: TableData,
    originData: null,
    returnData: null,
    cols: [],
    init: function() {
        return this.update();
    },
    get: function() {
        return this.returnData;
    },
    update: function() {
        //TODO:待进一步完善
        var checkbox = false,
            cols = this.cols,
            colsLen = cols.length,
            data = [];

        var col = cols.shift();
        if (col !== 'checkbox') {
            cols.unshift(col);
        } else {
            checkbox = true;
        }

        for (var i = 0, l = this.originData.length; i < l; i++) {
            data[i] = {};
            if (checkbox) {
                data[i]['checkbox'] = '<input type="checkbox" tIndex="' + i + '">';
            }
            for (var prop in this.originData[i]) {
                data[i][prop] = this.originData[i][prop];
            }
            if (!!cols.length) {
                data[i]['operate'] = cols;
            }
        }
        this.returnData = data;
        return this;
    }
}

/* global -TableSelectEvent */
var TableSelectEvent = function($container) {
    var hasInit = false;

    function setTableListChecked(state) {
        $container.find('tbody input:enabled').prop('checked', state);
    }

    return {
        getSelectedItems: function($ele) {
            return $container.find('table tbody input').map(function() {
                return this.checked ? ~~$(this).attr('tindex') : null;
            }).get();
        },
        init: function() {
            if (!hasInit) {
                $container.on('click', 'input', function() {
                    if (this.parentNode.tagName.toLocaleLowerCase() === 'th') {
                        setTableListChecked(this.checked);
                    } else {
                        if (!this.checked) {
                            $container.find('thead input').prop('checked', false);
                        }
                    }
                });
            }
            hasInit = true;
            return this;
        }
    };
}

/**
 * 提示框
 * @param  {[type]} msg       [提示信息]
 * @param  {[type]} autoClose [是否自动关闭，默认为true]
 * @param  {[type]} timeout   [自动关闭延时，默认2500ms]
 * @return {[type]}           [无]
 */
function showMsg(msg, autoClose, timeout) {
    timeout = timeout || 2500;
    if (window != top) {
        top.showMsg.apply(null, arguments);
        return;
    }
    var msgBox = $('#msgBox');
    if (!msgBox.length) {
        msgBox = $("<div id='msgBox' class='msgbox'></div>");
        msgBox.appendTo("body");
    }
    if (msg) {
        msgBox.html(msg).animateShow();
    } else {
        msgBox.animateHide();
    }

    if (autoClose !== false) {
        setTimeout(function() {
            msgBox.animateHide();
        }, timeout);
    }
}

/**
 * 保存提示带蒙板
 * @param  msg       [提示信息]
 * @param  timeout 提示信息显示时间，不提供则一直显示
 */
var showSaveMsg = (function() {
    var ajaxMsgObj = null,
        status = "hide";

    return function (msg, timeout) {
        if (window != top) {
            top.showSaveMsg.apply(null, arguments);
            return;
        }
        status = "show";
        $('#msgBox').animateHide();
        if (!ajaxMsgObj) {
            ajaxMsgObj = $.ajaxMessage(msg);
        } else {
            ajaxMsgObj.text(msg);
            ajaxMsgObj.show();
        }
        if (timeout) {
            status = "hide";
            setTimeout(function() { 
                if (status == "hide") {
                    ajaxMsgObj.hide();
                }
            }, timeout);
        }
    }    
})();

/**
 * 保存提示带蒙板
 * @param  msg       [提示信息]
 * @param  timeout 提示信息显示时间，不提供则一直显示
 */
var showConfirm = (function() {
    var $modal = null,
        status = "hide",
        applyFun = null,
        cancelFun = null,
        context = window;

    $modal = $('<div class="modal"></div>');
    $modal[0].innerHTML = '<div class="modal-dialog modal-md">' 
                        +     '<div class="modal-content">'
                        +         '<div class="modal-header">'
                        +             '<button type="button" class="close" data-dismiss="modal">'
                        +                 '<span>×</span>'
                        +                 '<span class="sr-only">Close</span>'
                        +             '</button>'
                        +             '<span>请确认</span>'
                        +         '</div>'
                        +         '<div class="modal-body">'
                        +             '<div class="text-center form-group" id="confirmMsg" style="margin-bottom: 0px;"></div>'
                        +         '</div>'
                        +         '<div class="text-center modal-footer" style="text-align:center;">'
                        +             '<input type="button" id="confirmApplyBtn" class="btn btn-static-sm btn-primary" data-dismiss="modal" value="确定">'
                        +             '&nbsp;&nbsp;&nbsp;<input type="button" class="btn btn-static-sm btn-default" data-dismiss="modal" value="取消">'
                        +         '</div>'
                        +     '</div>'
                        + '</div>';

    $modal.appendTo("body");

    $modal.on("click", "#confirmApplyBtn", function() {
        (typeof applyFun === "function") && applyFun.call(context);
    });
    $modal.on("hidden.bs.modal", function() {
        (typeof cancelFun === "function") && cancelFun.call(context);
        applyFun = null;
        cancelFun = null;
    });    

    return function (msg, applyCallback, cancelCallback) {
        context = this;

        applyFun = applyCallback;
        cancelFun = cancelCallback;
        $modal.modal().find("#confirmMsg").html(msg);
    }    
})();



/* 翻译函数占位 */
var _ = (typeof _ === 'undefined' ? function(nkey, replacements) {
    var index,
        count = 0;

    if (replacements instanceof Array && replacements.length !== 0) {
        while ((index = nkey.indexOf('%s')) !== -1) {
            nkey = nkey.slice(0, index) + replacements[count] +
                nkey.slice(index + 2);
            count = ((count + 1) === replacements.length) ? count : (count + 1);
        }
    } else if (typeof replacements === "string") {
        index = nkey.indexOf('%s');
        nkey = nkey.slice(0, index) + replacements + nkey.slice(index + 2);
    }
    return nkey;
} : _);


$(function() {
    if (window == top) return; //这里不要用全等，否则ie8下会有问题
    top.ResetHeight && top.ResetHeight.initHeight();
});





/************** modal框内验证重置，modal位置调整 *******************************/
$('.modal').on('hidden.bs.modal', function() {
    $(this).find('.validatebox-tip-wrap').hide().data("aniStatus", "none");
    $(this).find('.validatebox-invalid').removeClass('validatebox-invalid');
    top.$("body").removeClass("modal-open");
    top.ResetHeight.resetHeight();
}).on('show.bs.modal', function() {
    top.$("body").addClass("modal-open");
    var $dialog = $(this).find(".modal-dialog");
    setTimeout(function() {
        top.ResetHeight.resetHeight();
        setModalSize($dialog);
    },0);
});


//调整modal框位置
function setModalSize($dialog) {
    var $modal = ($dialog || $(".modal-dialog").filter(":visible").eq(0)),
        topScrollTop = top.document.body.scrollTop || top.document.documentElement.scrollTop || 0,
        scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;

    $modal.css("top", scrollTop + topScrollTop);
}

$(document).on("click", function() {
    if (top != window) {
        top.$("body").removeClass("nav-show");
    }
});


