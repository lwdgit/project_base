/*********数据验证*******/
var Err = 0;

if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.toString().replace(/^[ \t\n\r]+|[ \t\n\r]+$/g, "");
    }
}

function checkBox(time) {
    time = time || 200;
    setTimeout(function() { //防止组件还未加载完成
        $(".validatebox").off("focus").off("blur")
            .on("focus", DataCheck.hide)
            .on("blur", DataCheck.check)
            .on("change", DataCheck.check);
        $(".validatebox-tip-content").die().live("touch", function() {
            DataCheck.hide.call($(".validatebox").filter("#" + $(this).parent()[0].className.replace("validatebox-tip", "").trim()));
        });
        $(".validatebox-tip-content").live("click", function() {
            DataCheck.hide.call($(".validatebox").filter("#" + $(this).parent()[0].className.replace("validatebox-tip", "").trim()));
        });
        Debug.log("init check plugin!");
    }, time);
}

function setToolTip(ctrl, tip, str) {
    var tip_content = tip.find(".validatebox-tip-content");
    var tip_pointer = tip.find(".validatebox-tip-pointer");
    if (str !== undefined) {
        tip_content.html(str);
    }

    if ($(".sidebar").width() < 250) { //通过sidebar检测是否为大屏
        tip.css({
            "top": ctrl.offset().top - (tip_content.outerHeight() - ctrl.outerHeight()) / 2,
            "left": ctrl.offset().left + ctrl.outerWidth()
        });
        tip_pointer.css("top", (tip_content.outerHeight() - tip_pointer.outerHeight()) / 2);
    } else {
        tip.css({
            "top": ctrl.offset().top - tip_content.outerHeight() - 10,
            "left": ctrl.offset().left + ctrl.outerWidth() - tip_content.outerWidth() - 8
        });
        tip_pointer.css("top", tip_content.outerHeight());
    }
    if (str != '') {
        tip.css('visibility', 'visible');
    } else {
        tip.css('visibility', 'hidden');
    }
}

var DataCheck = {
    getOptions: function(s) {
        var options = s.attr("data-options");
        return $.parseJSON(options);
    },
    check: function() {
        var s = $(this);
        var data = DataCheck.getOptions(s);
        var id = s.attr("id");
        var str = "";
        if (Err < 0) {
            Err = 0;
        }

        if (this.readOnly) {
            if (s.hasClass("validatebox-invalid")) {
                s.removeClass("validatebox-invalid");
                $(".validatebox-tip." + id).remove();
                Err--;
            }
            return;
        }

        if (0 === dataValidCheck.isOwnEmptyObj(data)) {
            //为空对象
            return;
        }
        if ("true" == data.required) {
            str = "此字段不能为空";
        }
        if (s.val() !== "") {
            str = DataCheck.valid[data.validType](s.val(), data);
        }

        if (str) {
            var tip = null;
            if (s.hasClass("validatebox-invalid")) {
                tip = $(".validatebox-tip." + id);
            } else {
                Err++;
                tip = $('<div class="validatebox-tip ' + id + '">' + '<span class="validatebox-tip-content"></span>' + '<span class="validatebox-tip-pointer pointer1"></span><span class="validatebox-tip-pointer pointer2"></span>' + '</div>').appendTo("body");
                s.addClass("validatebox-invalid");
            }
            setToolTip(s, tip, str);
        } else {
            if (s.hasClass("validatebox-invalid")) {
                s.removeClass("validatebox-invalid");
                $(".validatebox-tip." + id).remove();
                Err--;
            }
        }
        reBuild = false
        Debug.log($(this).attr("id") + " was been checked, now Err is " + Err);
    },
    remove: function() {
        var id = $(this).attr("id");
        $(".validatebox-tip." + id).css("visibility", "hidden");
        $(".validatebox-tip." + id).remove();
        Err--;
        $(this).removeClass("validatebox-invalid");
    },
    show: function() {
        var id = $(this).attr("id");
        if ($(this).hasClass("validatebox-invalid")) {
            $(".validatebox-tip." + id).css("visibility", "visible");
        }
    },
    hide: function() {
        var id = $(this).attr("id");
        $(".validatebox-tip." + id).css("visibility", "hidden");
    },
    hideAll: function() {
        $(".validatebox-tip").css("visibility", "hidden");
    },
    valid: {
        port: function(str, obj) {
            if (/[^\d]|^[0]+/g.test(str) || parseInt(str, 10) < 1 || parseInt(str, 10) > 65535) {
                return obj.msg || "端口号只能为1-65535之间的整数";
            }
        },
        mac: function(str, obj) {
            var s = str.split(":");
            if (!(/^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/).test(str)) {
                return obj.msg || "MAC地址错误";
            }
            if (str == "00:00:00:00:00:00" ||
                str.toUpperCase() == "FF:FF:FF:FF:FF:FF") {
                return obj.msg || "MAC地址不能为保留地址";
            }
            if (parseInt(s[0], 16) & 1 == 1) {
                return obj.msg || "MAC地址不能为组播地址";
            }
        },
        ip: function(str, obj) {
            var exception = obj.ex,
                len = 0;
            if (typeof obj.ex != "undefined") {
                len = exception.length;
                for (var i = 0; i < len; i++) {
                    if (str == exception[i]) {
                        return;
                    }
                }
            }
            if (!(/^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){2}([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-4])$/).test(str)) {
                return obj.msg || "IP地址错误";
            }
            //add 127&223 test at 5.20
            var ipArr = str.split(".");
            if (ipArr[0] === "127") {
                return obj.msg || "IP地址首位不能为127";
            }
            if (ipArr[0] > 223) {
                return obj.msg || "IP地址首位不能大于223";
            }
        },
        net_segment: function(str, obj) {
            if (!(/^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){2}([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/).test(str)) {
                return obj.msg;
            } else if (/^(?:22[4-9]|23[0-9])\.(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/.test(str)) {
                return obj.msg;
            }
        },
        mask: function(str, obj) {
            function fomartMask(mask) {
                var m = parseInt(mask, 10);
                return (m + 256).toString(2).substring(1);
            }
            obj.msg = obj.msg || "子网掩码无效";

            if (!(/^(254|252|248|240|224|192)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(254|252|248|240|224|192|128|0))$/.test(str))) {
                return obj.msg;
            }
            var maskArr = str.split("."),
                maskBinary = fomartMask(maskArr[0]) + fomartMask(maskArr[1]) + fomartMask(maskArr[2]) + fomartMask(maskArr[3]);

            if (-1 != maskBinary.indexOf("01") || "0.0.0.0" == str) {
                return obj.msg;
            }
        },
        url: function(str, obj) {
            /*扩大匹配集至中文*/
            if (/^[-_~\|\#\?&\\\/\.%0-9a-z\u4e00-\u9fa5]+$/ig.test(str)) {
                if (/.+\..+/ig.test(str) || str == "localhost") {

                } else {
                    return obj.msg || "无效的网址格式";
                }
            } else {
                return obj.msg || "无效的网址格式";
            }
        },
        cloud_url: function(str, obj) {
            if (/^[-_~\|\#\?&\\\/\.%0-9a-z]+$/ig.test(str)) {
                if (/.+\..+/ig.test(str) || str == "localhost") {

                } else {
                    return obj.msg || "无效的网址格式";
                }
            } else {
                return obj.msg || "无效的网址格式";
            }
        },
        wan_rate: function(str, obj) {
            if (/^\d+(\.\d)?$/g.test(str) && str >= 0.1 && str <= 100) {

            } else {
                return obj.msg.replace(/s%/g, 100);
            }
        },
        pppoe_notictime: function(str, obj) {
            if (+str >= 0 && +str <= 7) {

            } else {
                return obj.msg;
            }
        },
        pwd: function(str, obj) {
            if (obj.length < str.length) {
                return obj.msg || "密码长度不能超过%s".replace(/%s/g, obj.length);
            }
            if (!(/^[a-z0-9@_.]{1,}$/ig.test(str))) {
                return obj.msg || "密码只能由字母数字和@_.组成";
            }
        },
        security_pwd: function(str, obj) {
            if (str.length > 0 && str.length < 64) {
                if (!(/^[\x20-\x7f]{8,63}$/i.test(str))) {
                    return '请输入8-64位十六进制码或8-63位ASCII码';
                }
            } else if (64 == str.length) {
                if (!/^[0-9a-fA-F]{64}$/i.test(str)) {
                    return '请输入8-64位十六进制码或8-63位ASCII码';
                }
            } else {
                return '请输入8-64位十六进制码或8-63位ASCII码';
            }
        },
        ascii: function(str, obj) {
            obj.length = obj.length || 127;
            if (!/^[\x20-\x7f]{1,127}$/i.test(str)) {
                return obj.msg;
            }
            if (str.indexOf("\"") !== -1 || str.indexOf("\'") !== -1 || str.indexOf("&") !== -1) {
                return obj.msg || '帐号只能由ASCII字符组成(引号,&号除外)，且不能超过127个字符';
            }
            if (obj.length && obj.length < str.length) {
                return '不能超过' + obj.length + '个字符';
            }
        },
        cloud_username: function(str, obj) {
            obj.length = obj.length || 32;
            if (!/^[\x20-\x7f]{1,}$/i.test(str)) {
                return obj.msg;
            }
            if (/\s/i.test(str)) {
                return obj.msg || '帐号只能由ASCII字符组成(空格除外)，且不能超过32个字符';
            }
            if (obj.length && obj.length < str.length) {
                return '不能超过' + obj.length + '个字符';
            }
        },
        ascii_pwd: function(str, obj) {
            var regExp = /^([\x20-\x7f]{5}|[\x20-\x7f]{13})$/;
            if (!regExp.test(str)) {
                return "只能输入5或13个ASCII字符";
            }
        },
        ascii_key: function(str, obj) {
            if (!/^[\x20-\x7f]{8,63}$/i.test(str)) {
                return obj.msg;
            }
        },
        hex_pwd: function(str, obj) {
            var regExp = /^([0-9a-fA-F]{10}|[0-9a-fA-F]{26})$/;
            if (!regExp.test(str)) {
                return "只能输入10或26个HEX字符";
            }
        },
        web_title: function(str, obj) {
            if (/[;'"&%\\]/g.test(str) || (null == str.match(/[^ -~]/g) ? str.length : str.length + str.match(/[^ -~]/g).length * 2) > 30) {
                return obj.msg.replace(/s%/, '30');
            }
        },
        web_info: function(str, obj) {
            if (/[;'"&%\\]/g.test(str) || (null == str.match(/[^ -~]/g) ? str.length : str.length + str.match(/[^ -~]/g).length * 2) > 512) {
                return obj.msg.replace(/s%/, '254');
            }
        },
        ssid: function(str, obj) {
            if (/[;'"&%\\]/g.test(str)) {
                return '不能输入 ; \' " & % \\';
            }
            //中文3字节，[^ -~]只匹配3字节
            if ((null == str.match(/[^ -~]/g) ? str.length : str.length + str.match(/[^ -~]/g).length * 2) > 32) {
                return obj.msg.replace(/s%/, '32');
            }
            var len;
            if (null == str.match(/[\u4e00-\u9fa5]/g)) {
                len = str.length;
            } else if (null == str.match(/[^\u4e00-\u9fa5]/g)) {
                len = str.length * 3;
            } else {
                len = str.match(/[^\u4e00-\u9fa5]/g).length + str.match(/[\u4e00-\u9fa5]/g).length * 3;
            }
            if (32 < len) {
                return obj.msg.replace(/s%/, '32');
            }
            if (chkHalf(str)) {
                return obj.msg = "不能包含全角字符！";
            }
        },
        pppoe_endip: function(str, obj) {
            if (/^[0-9]+$/g.test(str) && +str >= 1 && +str <= 254) {

            } else {
                return obj.msg;
            }
        },
        mtu: function(str, obj) {
            //str = parseInt(str,10);
            if (/^[0-9]+$/g.test(str) && str >= parseInt(obj.start, 10) && str <= parseInt(obj.end, 10)) {

            } else {
                return obj.msg;
            }
        },
        net: function(str, obj) {
            if ("0.0.0.0/0" == str) {

            } else {
                if (!(/^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){2}([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\/([1-9]|[1-2]\d|3[0-2])$/).test(str)) {
                    return obj.msg;
                }
            }
        },
        port1: function(str, obj) {
            var exception = obj.ex,
                len = exception.length;
            for (var i = 0; i < len; i++) {
                if (str == exception[i]) {
                    return;
                }
            }
            if (/^[0-9]+$/g.test(str) && parseInt(str, 10) >= 1025 && parseInt(str, 10) <= 65535) {

            } else {
                return obj.msg;
            }
        },
        range: function(str, obj) {
            if (/^[0-9]+$/g.test(str) && parseInt(str, 10) >= obj.range[0] && parseInt(str, 10) <= obj.range[1]) {

            } else {
                return obj.msg;
            }
        },
        range_len: function(str, obj) {
            if (/^[0-9]+$/g.test(str) && str.length >= obj.range[0] && str.length <= obj.range[1]) {

            } else {
                return obj.msg;
            }
        },
        pin: function(str, obj) {
            if (!(/^[0-9]+$/g.test(str))) {
                return obj.msg;
            }
            if (8 == str.length) {
                var tmp = (+str.charAt(0) + +str.charAt(2) + +str.charAt(4) + +str.charAt(6)) * 3,
                    tmp2 = +str.charAt(1) + +str.charAt(3) + +str.charAt(5) + +str.charAt(7),
                    tmp3 = (tmp + tmp2) % 10;
                if (0 !== tmp3) {
                    return obj.msg;
                }
            } else {
                return obj.msg;
            }
        },
        num: function(str, obj) {
            var min = obj.min || false,
                max = obj.max || false,
                exp = obj.exp;
            if (obj.range) {
                min = obj.range[0];
                max = obj.range[1];
            }
            if (!(/^-?[0-9]{1,}$/).test(str)) {
                return "必须是整数";
            }
            if (min && max) {
                if (parseInt(str, 10) < min || parseInt(str, 10) > max) {
                    if (!exp || exp && parseInt(str, 10) != exp) {
                        return ("输入范围: " + min + " - " + max);
                    }
                }
            }
        },
        domain: function(str, obj) {
            if (!/[^(\d|\.)]/g.test(str)) {
                if (this.ip(str, obj)) {
                    return obj.msg;
                }
            } else {
                if (this.url(str, obj)) {
                    return obj.msg;
                }
            }
        },
        time: function(str, obj) {
            if (!/^(([01]?[0-9])|(2[0-3]))\:([0-5]?[0-9])$/.test(str)) {
                return obj.msg;
            }
        }
    }
};

/*数据关系验证*/

var dataValidCheck = {
    ipMaskMergeOk: function(ip, mask) {
        function checkIp(ip, mask) {
            var ips = ip.split("."),
                masks = mask.split("."),
                i = 0;
            for (; i < 4; i++) {
                if ((ips[i] | masks[i]) != 255) {
                    return true;
                }
            }
            return false;
        }

        var ipArr = ip.split('.'),
            maskArr = mask.split('.'),
            mergeRslt,
            i;

        for (i = 0; i < 4; i++) {
            ipArr[i] = parseInt(ipArr[i], 10);
            maskArr[i] = parseInt(maskArr[i], 10);
        }
        mergeRslt = (ipArr[0] | maskArr[0]) + '.' + (ipArr[1] | maskArr[1]) + '.' + (ipArr[2] | maskArr[2]) + '.' + (ipArr[3] | maskArr[3]);
        if (mergeRslt == mask || mergeRslt == '255.255.255.255' || !checkIp(ip, mask)) {
            return -1;
        }
        return 0;
    },
    //验证两个IP是否在同一网段
    isSameNet: function(ip_lan, ip_wan, mask_lan, mask_wan) {
        if (!mask_wan) {
            mask_wan = mask_lan;
        }
        var ip1Arr = ip_lan.split("."),
            ip2Arr = ip_wan.split("."),
            maskArr1 = mask_lan.split("."),
            maskArr2 = mask_wan.split("."),
            i;
        var mask1all = maskArr1[0] * 256 * 256 * 256 + maskArr1[1] * 256 * 256 * +maskArr1[2] * 256 + maskArr1[3];
        var mask2all = maskArr2[0] * 256 * 256 * 256 + maskArr2[1] * 256 * 256 * +maskArr2[2] * 256 + maskArr2[3];
        var largeMask = (mask1all - mask2all > 0) ? 1 : 0;
        var compareMask = [];

        if (largeMask) {
            compareMask = maskArr1.splice(0, 4);
        } else {
            compareMask = maskArr2.splice(0, 4);
        }
        for (i = 0; i < 4; i++) {
            if ((ip1Arr[i] & compareMask[i]) != (ip2Arr[i] & compareMask[i])) {
                return false;
            }
        }
        return true;
    },
    IPInLan: function(ip, lanip, lanmask) {
        var tempip = ip.split("."),
            templanip = lanip.split("."),
            tempmask = lanmask.split(".");
        for (var i = 0; i < 4; i++) {
            if ((tempip[i] & tempmask[i]) != (templanip[i] & tempmask[i])) {
                return -1;
            }
        }
        return 0;
    },
    IpInLan2: function(eip, emask, ip, mask) {
        var index = 0,
            eipp = eip.split("."),
            emaskk = emask.split("."),
            ipp = ip.split("."),
            maskk = mask.split("."),
            msk = maskk;

        for (var i = 0; i < 4; i++) {
            if (emaskk[i] == maskk[i]) {
                continue;
            } else if (emaskk[i] > maskk[i]) {
                msk = maskk;
                break;
            } else {
                msk = emaskk;
                break;
            }
        }
        for (var i = 0; i < 4; i++) {
            if ((eipp[i] & msk[i]) != (ipp[i] & msk[i])) {
                return -1;
            }
        }
        return 0;
    },
    isNetSegment: function(ip, mask) {
        var iparr = ip.split("."),
            maskarr = mask.split("."),
            i = 0;
        for (; i < 4; i++) {
            if ((parseInt(iparr[i], 10) & parseInt(maskarr[i], 10)) != parseInt(iparr[i], 10)) {
                return -1;
            }
        }
        return 0;
    },

    /*
     *  IP段是否有交集
     *ip_arr: 数组，每个元素为一个ip段
     *ip_segment:需要添加进去的ip段, 前提是此IP段是正确的，即起始IP<结束IP
     * return: 0-无交集， -1: 有交集
     */

    ipIntersection: function(ip_arr, ip_segment, req) {
        var len = ip_arr.length,
            start_ip = ipToInt(ip_segment.split("-")[0]),
            end_ip = ipToInt(ip_segment.split('-')[1]),
            start_temp = 0,
            end_temp = 0;
        for (var i = 0; i < len; i++) {
            start_temp = ipToInt(ip_arr[i].split('-')[0]);
            end_temp = ipToInt(ip_arr[i].split('-')[1]);

            if (-1 == req) { //add
                if (start_ip > end_temp || end_ip < start_temp) {

                } else {
                    showMsg("此IP段与已经存在的IP段：" + ip_arr[i] + "有重复部分");
                    return -1;
                }
            } else { //edit
                if (i == req || start_ip > end_temp || end_ip < start_temp) {

                } else {
                    showMsg("此IP段与已经存在的IP段：" + ip_arr[i] + "有重复部分");
                    return -1;
                }
            }

            /*if(start_ip > end_temp || end_ip < start_temp) {

            } else {
                showMsg("此IP段与已经存在的IP段："+ip_arr[i]+"有重复部分");
                return -1;
            }*/
        }

        return 0;
    },
    checkEmptyVal: function(obj) {
        for (var prop in obj) {
            if ("" == $.trim($("#" + prop).val())) {
                showMsg(obj[prop] + "不能为空");
                return -1;
            }
        }
        return 0;
    },
    /*
        检测对象是否具有自己的属性，如果有，返回-1， 否则返回0
    */
    isOwnEmptyObj: function(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return -1;
            }
        }
        return 0;
    },
    verifyRepeatName: function(name, arr, prop, operation, msg) {
        var len = arr.length,
            i = 0,
            id = "";
        msg = typeof msg == "undefined" ? "名称" : msg;
        if (0 == len) {
            return 0;
        }
        if (-1 == operation) {
            //添加
            for (; i < len; i++) {
                if (arr[i][prop] == name) {
                    showMsg(msg + "重复, 请重新填写一个新的" + msg);
                    return -1;
                }
            }
        } else {
            id = operation;
            for (; i < len; i++) {
                if (id != i && arr[i][prop] == name) {
                    showMsg(msg + "重复, 请重新填写一个新的" + msg);
                    return -1;
                }
            }
        }
        return 0;
    }
};

//关于选择改变以后，输入框也改变的错误处理
function validateErrChange(ids, flag) {
    var len = ids.length;
    if (flag == 1) {
        for (var i = 0; i < len; i++) {
            if ($("#" + ids[i]).hasClass("validatebox-invalid")) {
                $("#" + ids[i]).removeClass("validatebox-invalid").val('');
                $(".validatebox-tip." + ids[i]).remove();
                Err--;
            }
        }
    }
}

/**
 * [validateErrChange2 关于选择改变以后，输入框也改变的错误处理]
 * @param  {[type]} elems [jquery元素集]
 * @return {[type]}       [无]
 */
function validateErrChange2(elems) {
    var len = elems.length;
    for (var i = 0; i < len; i++) {
        if (elems.eq(i).hasClass("validatebox-invalid")) {
            elems.eq(i).removeClass("validatebox-invalid").val('');
            $(".validatebox-tip." + elems.eq(i).attr("id")).remove();
            Err--;
        }
    }
}

/**
 * [validateCheck 匹量验证数值正确性]
 * @param  {[type]} elems [jquery元素集]
 * @return {[type]}       [无]
 */
function validateCheck(elems) {
    var err = Err;
    elems.each(function() {
        DataCheck.check.call(this);
    });
    return Err - err;
}


/*
检查是否有全角字符,有:true,没有:false
*/
function chkHalf(str) {
    for (var i = 0; i < str.length; i++) {
        strCode = str.charCodeAt(i);
        if ((strCode > 65248) || (strCode == 12288)) {
            return true;
            break;
        }
    }
    return false;
}


