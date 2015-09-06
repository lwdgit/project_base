exports.b28lib = function() {
    var coreVersion = "3.0",
        MSG = {},
        trim = function(text) {
            return text.trim();
        },
        parseJSON = function(data) {
            // JSON RegExp
            var rvalidchars = /^[\],:{}\s]*$/,
                rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
                rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
                rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;

            if (data === null) {
                return data;
            }

            if (typeof data === "string") {
                // Make sure leading/trailing whitespace is removed (IE can't handle it)
                data = trim(data);

                if (data) {
                    // Make sure the incoming data is actual JSON
                    // Logic borrowed from http://json.org/json2.js
                    if (rvalidchars.test(data.replace(rvalidescape, "@")
                            .replace(rvalidtokens, "]")
                            .replace(rvalidbraces, ""))) {

                        return (new Function("return " + data))();
                    }
                }
            }
        },
        gettext = function(text) {
            return MSG[text] || text;
        },
        loadData = function(data) {
            var json = parseJSON(data);
            if (json !== '') {
                for (var key in json) {
                    if (key !== 'undefined') {
                        MSG[json[key]] = key;
                    }
                }
            }
        },
        loadJSON = function(json) {
            if (typeof json == 'string') json = eval('(' + json + ')');
            if (json !== '') {
                for (var key in json) {
                    if (key !== 'undefined') {
                        MSG[json[key]] = key;
                    }
                }
            }
        },
        transTitle = function(doc) {
            var titleElem = doc.getElementsByTagName("title")[0],
                transTitleText;

            if (titleElem && titleElem.getAttribute("id") &&
                /\S/.test(titleElem.getAttribute("id"))) {
                transTitleText = titleElem.getAttribute("id");
            } else {
                transTitleText = doc.title;
            }
            doc.title = gettext(trim(transTitleText));
        },
        replaceTextNodeValue = function(element) {
            if (!element) {
                return;
            }
            var firstChild = element.firstChild,
                nextSibling = element.nextSibling,
                nodeType = element.nodeType,
                btnStr = "submit,reset,button",
                curValue, isInputButton;

            //handle element node
            if (nodeType === 1) {

                // Hander elements common attribute need to replace
                curValue = element.getAttribute("alt");
                if (curValue && /\S/.test(curValue)) {
                    curValue = trim(curValue);
                    element.setAttribute("alt", gettext(curValue));
                }
                curValue = element.getAttribute("placeholder");
                if (curValue && /\S/.test(curValue)) {
                    curValue = trim(curValue);
                    element.setAttribute("placeholder", gettext(curValue));
                }
                curValue = element.getAttribute("title");
                if (curValue && /\S/.test(curValue)) {
                    curValue = trim(curValue);
                    element.setAttribute("title", gettext(curValue));
                }

                isInputButton = element.nodeName.toLowerCase() == "input" &&
                    (btnStr.indexOf(element.getAttribute("type")) !== -1);
                if (isInputButton) {

                    //data-lang属性具有较高优先级
                    curValue = element.getAttribute("data-lang") || element.value;
                } else {
                    curValue = element.getAttribute("data-lang");
                }

                if (curValue && /\S/.test(curValue)) {
                    curValue = trim(curValue);
                    if (curValue) {
                        if (isInputButton) {
                            element.setAttribute("value", gettext(curValue));
                        } else {
                            element.innerText = gettext(curValue);
                        }
                    }
                }

                //handle textNode
            } else if (nodeType === 3 && /\S/.test(element.nodeValue)) {
                curValue = trim(element.nodeValue);
                element.nodeValue = gettext(curValue);
            }
            //translate firstChild
            //stop handle elem.child if elem has attr data-lang
            if (firstChild && (!element.getAttribute || !element.getAttribute("data-lang"))) {
                replaceTextNodeValue(firstChild);
            }

            //translate siblings
            if (nextSibling) {
                replaceTextNodeValue(nextSibling);
            }
        };

    function unique(inputs) { //用哈希表去重
        var res = [];
        var json = {};
        if (!inputs) {
            return [];
        }
        for (var i = 0; i < inputs.length; i++) {
            if (!json[inputs[i]]) {
                res.push(inputs[i]);
                json[inputs[i]] = 1;
            }
        }
        return res;
    }

    function translateRes(content) {
        content = content.replace(/((["'])(?:\\.|[^\\\n])*?\2)/g, function(key) {
            var quote = key.charAt(0);
            key = key.slice(1, key.length - 1);
            key = key.trim();
            if (key !== '' && MSG[key]) {
                return quote + MSG[key] + quote;
            }
        });
        return content;
    }

    function GetPageData() {
        var nodeValueArray = [],
            onlyZH = false;

        function _getValue(curValue) {
            if (curValue && /\S/.test(curValue)) {
                curValue = trim(curValue);
                if (onlyZH && /[\u4e00-\u9fa5]/.test(curValue) || !onlyZH) { //是否存在中文
                    nodeValueArray.push(curValue);
                }
            }
        }

        function listNode(element) {
            if (!element) {
                return;
            }
            var firstChild = element.firstChild,
                nextSibling = element.nextSibling,
                nodeType = element.nodeType,
                nodeName = element.nodeName.toLowerCase(),
                btnStr = "submit,reset,button",
                curValue, isInputButton;

            //handle element node
            if (nodeType === 1) {
                if (nodeName == 'script' || nodeName == 'style') {
                    if (nodeName == 'script') {
                        if (firstChild && firstChild.nodeValue && trim(firstChild.nodeValue)) {
                            nodeValueArray = nodeValueArray.concat(GetResData(firstChild.nodeValue, onlyZH).reverse());
                        }
                    }
                    firstChild = null; //不再检索script,style的内容
                }


                // Hander elements common attribute need to replace
                curValue = element.getAttribute("alt");
                _getValue(curValue);

                curValue = element.getAttribute("placeholder");
                _getValue(curValue);

                curValue = element.getAttribute("title");
                _getValue(curValue);

                isInputButton = element.nodeName.toLowerCase() == "input" &&
                    (btnStr.indexOf(element.getAttribute("type")) !== -1);

                if (isInputButton) {
                    //data-lang属性具有较高优先级
                    curValue = element.getAttribute("data-lang") || element.value;
                } else {
                    curValue = element.getAttribute("data-lang");
                }

                _getValue(curValue);


                //handle textNode
            } else if (nodeType === 3 && /\S/.test(element.nodeValue)) {
                curValue = trim(element.nodeValue);
                _getValue(curValue);
            }

            //translate firstChild
            //stop handle elem.child if elem has attr data-lang
            if (firstChild) {
                listNode(firstChild);
            }

            //translate siblings
            if (nextSibling) {
                listNode(nextSibling);
            }
        }

        this.getNodeValue = function(element, _onlyZH) {
            if (!element) {
                return "";
            }
            onlyZH = _onlyZH;
            /*if (element.title) {
                if (trim(element.title) !== "") {
                    nodeValueArray.push(trim(element.title));
                }
            }*/
            listNode(element);
            return unique(nodeValueArray);
        };
    }

    function PosToRow(str) {
        var oldpos = 0;
        var coderow = 0;
        var regExp = str.indexOf('\r\n') > -1 ? new RegExp('\\r\\n', 'g') : str.indexOf('\n') > -1 ? new RegExp('\\n', 'g') : new RegExp('\\r', 'g');

        //console.log(regExp);
        return function(pos) {
            var pre = str.substring(oldpos, pos);
            oldpos = pos;
            var submatch = pre.match(regExp);
            coderow += submatch ? submatch.length : 0;
            return coderow + 1;
        };
    }

    function addInfo(str, data, pos) {
        var posToRow = PosToRow(data);
        return (str + '\t:\t \t:\t 行号:' + posToRow(pos) + '\t:\t' + 
                data.substring(data.lastIndexOf('\n', pos - 10), data.indexOf('\n', pos + 10))).replace(/[\n\r]/g, '   ');
                //增加代码摘要，+-10为缓冲范围
        //console.log(data.lastIndexOf('\n', pos - 10), data.indexOf('\n', pos + 10)
    }

    function filter(keys, key, index) {

        return keys.some(function(v) {
            //console.log(index, key, key.lastIndexOf(v));
            if (v === key || key.lastIndexOf(v) === (index - v.length)) return true;
        });
    }

    function GetResData(data, onlyZH) { //获取js等资源文件内语言
        var regqutoe1 = new RegExp(/\$(\().*?\)/gi),
            regqutoe2 = new RegExp(/((["'])(?:\\.|[^\\\n])*?\2)/g);
        var ignoreKeyWord = ['$(', 'getElementById(', 'find(', 'indexOf(', 'getElementsByTagName(', 'getElementsByClassName(', 'on('];
        var matchKeyWord = ['_(', 'showMsg(', 'MSG['];

        var arr = [];
        
        data /*.replace(regqutoe1, '')*/ .replace(regqutoe2, function(matches) {
            matches = matches.slice(1, matches.length - 1);
            if (matches.trim().length > 0) {
                if (/[\u4e00-\u9fa5]/.test(matches)) { //是否含有中文
                    arr.push(addInfo(matches, data, arguments[3]));
                } else if (!onlyZH) {
                    if (matches.trim().length > 1 && /[a-z]/i.test(matches)) {
                        var backLength = arguments[3] >= 25 ? 25 : arguments[3]; //计算回溯长度,一般js里的关键字长度不会超过25

                        var backStr = data.substr(arguments[3] - backLength, backLength);

                        if (filter(matchKeyWord, backStr, backLength) || (matches.indexOf(' ') > -1 && !/^[#\.]|/.test(trim(matches)))) { //回溯查找
                            arr.push(addInfo(matches, data, arguments[3]));
                        } else if (!filter(ignoreKeyWord, backStr, backLength)) {
                            arr.push(addInfo(matches, data, arguments[3]));
                        }
                    }
                    /*else if (!onlyZH && (trim(matches).indexOf(' ') > -1 && !/^[#\.]/.test(trim(matches)) || /^[A-Z]/.test(matches) && matches.length > 1)) {
                    //arr.push(matches);
                }*/
                    /* else {
                                        arr.push(matches + '  ' + posToRow(arguments[3]));
                                    }*/
                }
            }
        });
        return unique(arr);
    }

    return {
        loadJSON: loadJSON,
        loadData: loadData,
        translatePage: replaceTextNodeValue,
        translateRes: translateRes,
        transTitle: transTitle,
        getPageData: new GetPageData().getNodeValue, //获取html内语言
        getResData: GetResData, //获取js等文件语言
        coreVersion: coreVersion
    };
}();
