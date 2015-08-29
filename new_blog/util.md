# util.js API用法说明


## 基础功能API

### Debug

> 此对象主要用于拓展`console.log`日志输出，通过设置`Debug.enable`可以控制是否输出日志。这样开发完成后无需删除日志打印代码即可控制日志输出。

#### API

	Debug
		 .enable          : 控制日志总开关，true为显示日志信息，false为关闭日志信息
		 .sendError       : 是否发送错误信息至服务器端，true为发送, false为不发送
		 .log 			  : 同console.log
		 .logem 		  : 粗体日志
		 .warn,error,count: 同`console`相关功能
		 .init()          : 对象初始化


### GetSetData


### TablePage,DataHandler,TableSelectEvent

> **表格对象及相关操作集合**，用于自动生成表格，主要功能有：
	
	* 数据批量填充，支持全部数据和部分数据两种
	* 支持分类查找和排序
	* 自动添加序号和复选框
	* 支持批量操作，自动获取选中主键(primaryKey)列表



#### TablePage使用示例

> 注：注释部分的代码只是表示示例部分不需要这样设置，写出来供参考

```html
	<div id="searchArea"><!-- 搜索框容器，默认在table前，
	如无需个性化设置，无需写该容器，表格对象会自动添加到
	合适的位置
	--></div>
	<table>
		<thead>
			<th><input type="checkbox" name="th-checkbox"></th>
			<th>序号</th>
			<th col-name="name" key="name">姓名</th>
			<th col-name="sex">性别</th>
			<th col-name="birth" search-name="birth" sort-name="birth">生日</th>
			<th col-name="other" sort-name="other">备注</th>
		</thead>
		<tbody></tbody>
	</table>
	<div id="pageGoBtn"><!-- 
	跳转框容器，默认在table后，
	如无需个性化设置，无需写该容器，表格对象会自动添加到
	合适的位置
	 --></div>

```

> 注：注释部分的代码只是表示示例部分不需要这样设置，写出来供参考

```javascript
 	var table = new TablePage($('table'));//传入jquery对象
 	//设置表格容器，可以不是table；如果不是table，本对象会在容器内自动添加一个table

 	//table.tHead = ['<input type="checkbox" name="th-checkbox">',
 					 '序号','姓名','性别','生日','备注'];
 	//如果已经有表头，就无需设置此项

 	//table.tHeadOrder = ['name', 'sex', 'birth', 'other']; 
 	//表头排序索引，也可以通过读取html的col-name字段获取

	table.perNum = 10;//设置每页显示条数,默认10条

	talbe.showStyle = 1;//设置显示方式，0: 部分数据 1: 全部数据,默认为1，即全部数据

	//table.pageNum = 1;
	//设置表格总共有多少页,仅当showStyle=0时需设置，默认1页

	//table.primaryKey = "name";
	//也可以通过在html表头上写key="name"设置，注意，主键只应有一个

	table.showSearch = true;//是否支持搜索，默认为true

	table.allowSort = true;
	//是否支持排序,需要在html中添加sort-name指定可以排序的列,默认为true

 	table.sortDir = "desc";//初始排序方向，可取值有'asc','desc'。默认'asc',即升序

 	table.hasOrder = true;//是否自动添加序号，默认为true

 	talbe.hasCheckbox = true;
 	//是否需要添加复选框，用于批量操作，默认为true, 开启此功能可与TableSelectEvent联用




	//用于showStyle=0;即部分数据更新时的异步调用接口，全部数据无需此方法
	//通过该方法可以实现换页，搜索，排序时自动向后台发送数据，
	//全部数据的搜索排序无需向后台发送数据，故无需此方法
	/*
	table.updateCallback(data, done) {
		/**data为object**/
		var sendData = {
			page: data.pageIndex,//设置需获取数据的页码，最小为1
			perNum: data.perNum,//需要后台返回多少条数据
			sortName: data.sortName,//返回的数据排序主键
			sortDir: data.sortDir,//数据返回以何种方式排序，有'asc'升序和'desc'降序
			searchName: data.searchName,//返回的数据搜索时对应列名
			searchKeyWord: this.searchKeyWord//返回的数据需包含的关键字
		}

	    $.get(url, sendData, function(res) {
	    	//done，异步数据获取完成后，通后done方法将表格数据传给表格
	        done(res);
	    });
	};*/

	//注：以上参数设置也可以用
	/*new TablePage($('table'), {//...config...});
	* 设置
	*/

	/******
	特殊设置

	table.btn.maxIndex = 7;//默认显示按钮个数为7

	table.btn.insertArea = $('#pageGoBtn');
	//跳转按钮会出现在id为pageGoBtn的容器内，默认为$('#page'),
	一般会自动生成一个随机id的容器，位置在table后面

	table.btn.btnWrap =  
	'<a class="btn btn-default prev">&lt;</a>%btns%<a class="btn btn-default next">&gt;</a><label for="gotoPageVal">&nbsp;&nbsp;跳转至:</label><div class="pageGo" style="display:inline-block;"><div class="input-group controls-sm"><input class="form-control" type="text" id="gotoPageVal" style="width:20px;"><span class="input-group-btn"><button type="button" class="btn btn-default" id="goToBtn">跳转</button></span></div></div>',
        hiddenInfo: '<span class="info-hidden-flag">...</span>';
    //跳转按钮模板，可以按照上面进行自定义，记得添加 %btns%占位符

    table.search.insertArea = $('#searchArea');
    //与table.btn.insertArea相似，用于搜索框定位，默认为$('#search')

	table.search.searchWrap = 
	'<div><select name="search-key" style="width:105px"></select><input class="input-xmedium search-box" type="text" maxlength="32"><button type="button" class="btn btn-default searchIcon"></button></div>';
	//搜索框模板，可以按照上面进行自定义


	//table.update(callback);//手动更新表格

	******/

	

 	table.data = data;//表格数据，为Array数组类型
 	table.init();//表格初始化，记得以上设置全部完成后再执行该方法
```

> 注：注释部分的代码只是表示示例部分不需要这样设置，写出来供参考


#### TableSelectEvent使用示例

```javascript
/*注: 该对象为TablePage批量操作的拓展对象，以下示例与TablePage示例相关
* 当然你也可以将其用于其他非TablePage初始化的table操作
*
* 当 table.hasCheckbox = true时, 可用此对象简化操作
*/
var tableCheckboxEvent = new TableSelectEvent($('table'));
//传入jquery对象，与TablePage一致

tableCheckboxEvent.init();//初始化
tableCheckboxEvent.getSelectedItems();//获取目标表格选中的checkbox个数
```

#### DataHandler API
	
> 该方法集主要用于TablePage对数据进行搜索，排序，部分功能参考`underscore.js`

	DataHandler
			  * .isEmptyObject(Object) //是否为空对象
			  * .where(objArr, attrs, returnAttrArr)
			   //搜索数组对象里特定属性里是否包含搜索的关键字
				   如: 
				     DataHandler.where([
					   	{name: 'lili', sex: 'female', 'age': '20'},
					   	{name: 'windy', sex: 'female', 'age': '21'},
					   	{name: 'lp', sex: 'male', 'age': '22'}
					   	], {name: 'windy'}, [name, age]);

				   	=> 返回: {'name': 'windy', age: '21'}
				   	
			  * .sortObj(objArr, attr, dir)//对数组对象进行排序,'asc'升序，'desc'降序

			   		如：
			   		  DataHandler.sortObj(
			   		  	[
			   		  	{name: 'lili', sex: 'female', 'age': '20'},
			   		  	{name: 'windy', sex: 'female', 'age': '21'},
			   		  	{name: 'lp', sex: 'male', 'age': '22'}
			   		  	], 'age', 'asc');

						=> 返回: [
				   		  	{name: 'lili', sex: 'female', 'age': '20'},
				   		  	{name: 'windy', sex: 'female', 'age': '21'},
				   		  	{name: 'lp', sex: 'male', 'age': '22'}
				   		]
			   		 
