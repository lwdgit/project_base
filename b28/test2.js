(function(window, $) {
    var msg = {
            '0': '日',
            '1': '一',
            '2': '二',
            '3': '三',
            '4': '四',
            '5': '五',
            '6': '六',
            '': ''
        },
        G_data = {
            IPGroupData: null,
            timeGroupData: null,
            IPGroupName: [],
            IPGroupRane: [],
            timeGroupName: [],
            lanIP: '',
            lanMask: ''
        };

    function ipGrouphandler(data) {
        var ret = [];
        G_data.IPGroupData = data;
        G_data.IPGroupName = [];
        G_data.IPGroupRane = [];
        
        for (var i = 0, l = data.length; i < l; i++) {
            G_data.IPGroupName.push(data[i].IPGroupName);
            G_data.IPGroupRane.push(data[i].IPGroupStartIP + '~' + data[i].IPGroupEndIP);

            ret.push({
                checkbox: '<input type="checkbox" tindex="' + i + '" ' + (data[i].IPGroupRefer > 0 ? 'disabled' : '')+ '>',
                IPGroupName: data[i].IPGroupName,
                IPGroupRane: data[i].IPGroupStartIP + '~' + data[i].IPGroupEndIP,
                operate: '<div class="operate" referTimes="' + data[i].IPGroupRefer + '"><span class="edit"></span><span class="delete"></span></div>'
            });
        }
        return {
            ipGroupTable: ret
        };
    }

    function timeGroupHandler(data) {
        var ret = [];
        G_data.timeGroupData = data;
        G_data.timeGroupName = [];

        for (var i = 0, l = data.length; i < l; i++) {
            G_data.timeGroupName.push(data[i].timeGroupName);
            ret.push({
                checkbox: '<input type="checkbox" tindex="' + i + '" ' + (data[i].timeGroupRefer > 0 ? 'disabled' : '')+ '>',
                timeGroupName: data[i].timeGroupName,
                timeGroupWeek: (function(week) {
                    var res = [];
                    for (var j = 0; j < 7; j++) {
                        if (week[j] === '1') {
                            res.push(msg[j]);
                        }
                    }
                    return res.join(',');
                }(data[i].timeGroupWeekday.split(''))),
                timeGroupTime: (data[i].timeGroupStartHour + ':' + data[i].timeGroupStartMinute + '~' + data[i].timeGroupEndHour + ':' + data[i].timeGroupEndMinute).replace(/(^|[\:~])(\d)\b/g, '$10$2'),
                operate: '<div class="operate" referTimes="' + data[i].timeGroupRefer + '"><span class="edit"></span><span class="delete"></span></div>'

            });
        }

        return {
            timeGroupTable: ret
        };
    }


    var Valid = {
        validateIP: function(data) {
            if (R.Valid.IPToInt(data.IPGroupStartIP) > R.Valid.IPToInt(data.IPGroupEndIP)) {
                showMsg(_('起始IP地址不能大于结束IP地址！'));
                return false;
            }

            if (!R.Valid.isSameNet(G_data.lanIP, data.IPGroupStartIP, G_data.lanMask)) {
                showMsg(_('起始IP与LAN口IP不在同一网段'));
                return false;
            }

            if (!R.Valid.isSameNet(G_data.lanIP, data.IPGroupEndIP, G_data.lanMask)) {
                showMsg(_('结束IP与LAN口IP不在同一网段'));
                return false;
            }

            var msg = '',
            IPGroupRaneArr = G_data.IPGroupRane.slice(0);
            IPGroupRaneArr.splice(data.IPGroupIndex, 1);
            if (msg = R.Valid.ipIntersection(IPGroupRaneArr, data.IPGroupStartIP + '~' + data.IPGroupEndIP, '~')) {
                showMsg(msg);
                return false;
            }

            return true;
        },
        validateTime: function(data) {
            if (+data.timeGroupStartHour > +data.timeGroupEndHour || (data.timeGroupStartHour === data.timeGroupEndHour && +data.timeGroupStartMinute > +data.timeGroupEndMinute)) {
                showMsg(_('起始时间不能大于终止时间'));
                return false;
            }
        },
        validateName: function(name, arr, msg) {
            if ($.inArray(name, arr) > -1 ) {
                showMsg(msg);
                return false;
            } else {
                return true;
            }
        }
    }

    var IPFormView = new R.FormView('#IPGroup-modal form');
    var IPTableSelectEvent = new TableSelectEvent($('#IPGroupContainer')).init();

    IPFormView.beforeSubmit = function(data) {
        var _names = G_data.IPGroupName.slice(0),
            submitData;


        _names.splice(data.IPGroupIndex, 1);
        submitData = Valid.validateIP(data) && Valid.validateName(data.IPGroupName, _names, 'IP组名称不能重复');
        if (submitData)
        showSaveMsg(_("请稍候..."));
    
        return submitData;
    }

    IPFormView.afterSubmit = function(res) {
        showSaveMsg('保存成功！', 1000);
        IPGroupView.update(false);
        $('#IPGroup-modal').modal('hide');
    };


    var IPGroupView = new R.View('#IPGroupContainer', {
        fetchUrl: '/goform/getIPGroups',
        updateCallback: ipGrouphandler,
        events: {
            '#addIP, click': function() {
                if (G_data.IPGroupData.length >= R.CONST.CONFIG_GROUP_IP_NUMBER) {
                    showMsg(_('IP组规则最多只能添加%s条', [R.CONST.CONFIG_GROUP_IP_NUMBER]));
                    return;
                }
                $('#IPGroup-modal').modal().find('.modal-header>span').text('新增IP组');
                IPFormView.reset({IPGroupIndex: G_data.IPGroupData.length});
            },
            '#IPGroupContainer, click, .edit': function() {
                $('#IPGroup-modal').modal().find('.modal-header>span').text('编辑IP组');
                var index = $(this).parents('tr').find('[tindex]').attr('tindex');
                var data = G_data.IPGroupData[index];
                data.IPGroupIndex = index;
    
                IPFormView.update(G_data.IPGroupData[index]);
            },
            '#IPGroupContainer, click, .delete': function() {
                if ($(this).parent().attr('referTimes') > 0) {
                    showMsg('该条目已经被引用，不允许删除！');
                    return;
                }
                showConfirm.call(this, "确认删除吗？", function() {
                    showSaveMsg(_("请稍候..."));
                    $.GetSetData.setData('/goform/delIPGroups', {
                        IPGroupIndex: $(this).parents('tr').find('[tindex]').attr('tindex')
                    }, function(res) {
                        IPGroupView.update(false);
                        showSaveMsg(_("删除成功！"), 1000);
                    });
                });
                
            },
            '#delIP, click': function() {
                var selected = IPTableSelectEvent.getSelectedItems();
                if (selected.length < 1) {
                    showMsg('请选择要删除的条目！');
                    return;
                }
                showConfirm.call(this, "确认删除吗？", function() {
                    showSaveMsg(_("请稍候..."));
                    $.GetSetData.setData('/goform/delIPGroups', {IPGroupIndex: selected.join('\t')}, function(res) {
                        showSaveMsg(_("删除成功！"), 1000);
                        IPGroupView.update(false);
                    });
                });
            }
        }
    });


    var timeTableSelectEvent = new TableSelectEvent($('#timeGroupContainer')).init();
    var timeFormView = new R.FormView('#timeGroup-modal form');
        timeFormView.beforeSubmit = function(data) {
            var _names = G_data.timeGroupName.slice(0),
                submitData;

            _names.splice(data.timeGroupIndex, 1);
           submitData =  Valid.validateName(data.timeGroupName, _names, '时间组名称不能重复') && Valid.validateTime(data);
           if (submitData) {
                showSaveMsg(_("请稍候..."));
           }
           return submitData;
        }
        timeFormView.afterSubmit = function(res) {
            if (res === '1') {
                showSaveMsg('保存成功！', 1000);
                timeGroupView.update(false);
                $('#timeGroup-modal').modal('hide');
            }
        };


    var timeGroupView = new R.View('#timeGroupContainer', {
        fetchUrl: '/goform/getTimeGroups',
        updateCallback: timeGroupHandler,
        events: {
            '#addTime, click': function() {
                if (G_data.timeGroupData.length >= R.CONST.CONFIG_GROUP_TIMER_NUMBER) {
                    showMsg(_('时间组规则最多只能添加%s条', [R.CONST.CONFIG_GROUP_TIMER_NUMBER]));
                    return;
                }
                $('#timeGroup-modal').modal().find('.modal-header>span').text('新增时间组');
                timeFormView.reset({timeGroupIndex: G_data.timeGroupData.length});
            },
            '#timeGroupContainer, click, .edit': function() {
                $('#timeGroup-modal').modal().find('.modal-header>span').text('编辑时间组');
                var index = $(this).parents('tr').find('[tindex]').attr('tindex');
                var data = G_data.timeGroupData[index];
                data.timeGroupIndex = index;
                data.setWeek = 'manual';
                timeFormView.update(data);
            },
            '#timeGroupContainer, click, .delete': function() {
                if ($(this).parent().attr('referTimes') > 0) {
                    showMsg('该条目已经被引用，不允许删除！');
                    return;
                }
                
                showConfirm.call(this, "确认删除吗？", function() {
                    showSaveMsg(_("请稍候..."));
                    $.GetSetData.setData('/goform/delTimeGroups', {
                        timeGroupIndex: $(this).parents('tr').find('[tindex]').attr('tindex')
                    }, function(res) {
                        timeGroupView.update(false);
                        showSaveMsg(_('删除成功！'), 1000);
                    });
                });
                
            },
            '#delTime, click': function() {
                var selected = timeTableSelectEvent.getSelectedItems();
                if (selected.length < 1) {
                    showMsg('请选择要删除的条目！');
                    return;
                }

                showConfirm.call(this, "确认删除吗？", function() {
                    showSaveMsg(_("请稍候..."));
                    $.GetSetData.setData('/goform/delTimeGroups', {timeGroupIndex: selected.join('\t')}, function(res) {
                        showSaveMsg(_('删除成功！'), 1000);
                        timeGroupView.update(false);
                    });
                });
            },
            '#timeGroup-modal input[name="setWeek"], click': function() {
                if (this.value === 'all') {
                    $('#timeGroup-modal input[name="timeGroupWeekday"]').prop('checked', this.checked);
                }
            },
            '#timeGroupInput>input, change': function() {
                if (this.value.length < 2) {
                    this.value = '0' + this.value;
                }
            }
        }
    });
    $.valid.tNum = function (str, min, max) {
        if(!(/^[0-9]{1,}$/).test(str)) {
            return _($.reasyui.MSG["Must be number"]);      
        }
        if (typeof min != "undefined" && typeof max != "undefined") {
            if(parseInt(str, 10) < min || parseInt(str, 10) > max) {
            
                return _($.reasyui.MSG["Input range is: %s - %s"], [min, max]);
            }
        }
    };

    window.timeGroupView = timeGroupView;
    window.IPGroupView = IPGroupView;
    $.GetSetData.getJson('/goform/getLanIpMask', function(data) {
        G_data.lanIP = data.lanIP;
        G_data.lanMask = data.lanMask;
    });
}(window, $));
