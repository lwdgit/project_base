X3 API使用说明
==============


[TOC]

###基础功能

#### showMsg

> 信息提示弹出框
''
用法：直接调用showMsg,类似alert,可设置是否自动关闭与关闭延时

示例:

```javascript
showMsg('hello world');//2.5秒后自动关闭
showMsg('hello world', false);//一直显示，直至下一个showMsg覆盖
showMsg('hello world', true, 5000);//5秒后自动关闭
```

#### _ 

> 未引入b28之前的占位方法，用于防止该方法报错，如已经引入b28翻译，可去除该方法

用法：与b28一致

示例：

```javascript

_('hello world');

_('hello %s', ['world']);

```


###Jquery拓展

#### $(ele).getVal()

> 获取元素值

#### $(ele).setVal(val)

> 为元素赋值

#### $(ele).collect()

> 批量获取元素容器内的表单元素的值，支持input[group-index],返回数组

#### $(ele).serializeJson()

> 批量获取元素容器内的表单元素的值，支持input[group-index],返回json

#### $(ele).getFormData()

> 批量获取元素容器内的表单元素的值，支持input[group-index],返回form-encode-url


###AutoFill

> 该对象主要用于批量填充页面上的表单及非表单元素，即有name或data-bind的元素（对table也适用）。

用法：使用时传入页面容器id(也可以是jquery选择器选择的元素合集)，及后台传过来的json数据。

返回：无

示例：
```javascript

new AutoFill('#containerID', {"username": "admin", "password": "admin"});

```
可选函数：
```javascript
AutoFill.
        updateData(data)
        fill()
        listObj()//将多层次的obj转化为单层次obj(Array类型不受影响)

```




###AutoCollect

> 该函数主要用于从指定页面区域获取所有可见及可用元素的值（暂不支持table）

用法：使用时传入页面容器id或jquery选择器选择的元素合集

返回：json或formData

示例：
```javascript
new AutoCollect('#containerID').getJson(true);
//添加true可以收集非表单元素(但需包含data-bind属性)
```

可选函数：
```javascript
AutoCollect.
            getData(boolean)
            getJson(boolean)
```


###TablePage

> 该对象主要用于创建一个可分页表单

用法：使用时传入jquery DOM对象及表格数据(Array类型)，其他参数可选，支持**全部加载数据**或**部分加载数据**

返回：TablePage对象

示例：
```javascript
var table = new TablePage($('#tableID'));
table.data = data;
table.init();
table.updateCallback = somefun;
table.updateData(data);//对表格数据进行更新
//用于在部分数据在换页时对数据的预处理

```

###TableData [beta]

> 该方法与TablePage配合使用，主要用于自动在数据前后添加checkbox和编辑栏。

返回：Array

示例：
```javascript
var tableData = new TableData([{ip: '192.168.0.1'}, {ip: '192.168.0.2'}],
 ['checkbox', '<div class="operate"><span class="edit"></span><span class="delete"></span></div>']).get();
//返回的数据包含了checkbox和edit,delete

```


###R.View 

> 通用视图对象，封装了通用数据的增删查改，及事件批量绑定与数据的验证(待完善)、提交等功能，以减少不必要的初始化代码重写。

>> 该类具有继承与被继承属性，继承时可反向调用父类方法或重写父类方法。如果该类不满足需求，可以通过继承的方式对父类的方法进行重写或拓展。

返回：视功能而定

示例：
```javascript
var pageView = new R.View('#network', {//以下参数全为可选项，可在单独调用时再进行传值
        fetchUrl: '/goform/getNetwork',//获取数据的url，如果无需自动获取数据，可以不设置fetchUrl
        data: jsonData,//初始化数据，该项会在对象初始化时覆盖fetchUrl的作用，但可以通过update(true)解决
        submitUrl: '/goform/setNetwork',//提交数据的url
        updateCallback: handler,//对获取到数据进行处理的中间层
        beforeSubmit: beforeSubmitHandler,//对提交的数据进行预处理的中间层
        afterSubmit: submitHandler,//提交完成后执行的事件
        events: {//批量绑定事件
            '#container #type-select,click,input': netView.changeRadio, //类似jquery的事件委托
            '#submit,click': function() {pageView.submit()}//对默认提交事件进行绑定
        }
    });
    setTimeout(function() {
        pageView.update(true);//5秒钟内更新一次数据
    }, 5000)

    pageView.submit('/goform/setData', {ip: '192.168.1.1'}, func);

    pageView.submit(function(res) {
        console.log('提交完成');
    });

```

可用函数方法(除init其它方法参数均为可选)：

    R.View.
            init(containerID, configJson) //该函数在对象初始化时会自动进行调用，如需对参数进行批量修改可以重新调用改方法，注：新增的事件绑定将不会生效，可以使用initEvents(events)方法
            initEvents(eventsJson) //对事件进行批量绑定
            update(boolean, callback, afterCallback)//更新视图,[false: 有数据时不通过ajax获取数据， true: 强制从ajax获取数据,默认为true
                          callback: 数据填充前对数据进行预处理，afterCallback: update完成后的调用]
            submit(url, data, callback) //进行数据提交
            collect($ele) //数据收集，返回json
            validate(data) //对数据进行手动验证



###R.FormView 

> 继承自R.View，对**form**表单进一步进行封装，可以实现无参数完成表格初始化(相当于reset)与数据提交

用法：可以使用跟R.View完全一样的参数，该方法对```[type="submit"]```进行了默认绑定

示例：

```javascript
var dailogView = new R.FormView();//初始化表单为空

var dialogView = new R.FormView('#formId', {
    submitUrl: '/goform/setData',//该参数为空时会自动从form的action字段提取url做为submitUrl
    afterSubmit: func, //用于在数据提交完成后进行的后续处理
    events: {},//无需再绑定[type=submit]的提交按钮，用法同R.View
    //其他方法同R.View
});

dialogView.reset({index: 0});//清空表单数据，{index: 0}表示除该元素值为0外其他全为默认
dialogView.update(data);//data为空时自动执行dialogView.reset()

```





###Demo示例

> 请参考 上网设置(network/wanSet)、流量控制(qos/QosManage)、系统状态(sysStatus/sysInfo);