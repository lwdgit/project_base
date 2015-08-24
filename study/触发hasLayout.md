　　什么是hasLayout？hasLayout是IE特有的一个属性。很多的ie下的css bug都与其息息相关。在ie中，一个元素要么自己对自身的内容进行计算大小和组织，要么依赖于父元素来计算尺寸和组织内容。当一个元素的hasLayout属性值为true时，它负责对自己和可能的子孙元素进行尺寸计算和定位。虽然这意味着这个元素需要花更多的代价来维护自身和里面的内容，而不是依赖于祖先元素来完成这些工作。 
下列元素默认 hasLayout=true 
<table> <td> <body> <img> <hr> <input> <select> <textarea> <button> <iframe> <embed> <object> <applet> <marquee> 
很多情况下，我们把 hasLayout的状态改成true 就可以解决很大部分ie下显示的bug。 
hasLayout属性不能直接设定，你只能通过设定一些特定的css属性来触发并改变 hasLayout 状态。下面列出可以触发hasLayout的一些CSS属性值。 
------------------------------------- 
display 
启动haslayout的值:inline-block 
取消hasLayout的值:其他值 
-------------------------------------- 
width/height 
启动hasLayout的值：除了auto以外的值 
取消hasLayout的值：auto 
--------------------------------------- 
position 
启动hasLayout的值：absolute 
取消hasLayout的值：static 
---------------------------------------- 
float 
启动hasLayout的值：left或right 
取消hasLayout的值：none 
--------------------------------------- 
zoom 
启动hasLayout的值：有值 
取消hasLayout的值：narmal或者空值 
（zoom是微软IE专有属性，可以触发hasLayout但不会影响页面的显示效果。zoom: 1常用来除错，不过 ie 5 对这个属性不支持。） 
---------------------------------------- 
writing-mode: tb-rl 
这也是微软专有的属性。 
ie7还有一些额外的属性可以触发该属性（不完全列表）： 
min-height: (任何值) 
max-height: (任何值除了none) 
min-width: (任何值) 
max-width: (任何值除了none) 
overflow: (任何值除了visible) 
overflow-x: (任何值除了visible) 
overflow-y: (任何值除了visible)5 
position: fixed 
因元素hasLayout而导致的问题其实一般都很容易发现：往往是内容出现错位甚至完全不可见。举一个典型例子，当一个元素内含浮动或绝对定位的内容时，它通常会表现出奇怪和错误的行为，看下面的代码： 

<div id="nofloatbox"> 
<div id="floatbox"></div> 
</div>

CSS代码如下： 

#nofloatbox { 
border: 1px solid #FF0000; 
background: #CCC; 
}   
#floatbox { 
float: left; 
width: 100px; 
height: 100px; 
border: 1px solid #0000FF; 
background: #00FF00; 
}

ie显示结果如下图： 
认识hasLayout——IE浏览器css bug的一大罪恶根源 - neverned - neverned 



可见无浮动的div并没有被里面的浮动元素的高度撑开，其高度并不会自动计算。我们下面再给这个无浮动的div加上个zoom:1;来触发其hasLayout属性试试，css代码如下： 

#nofloatbox { 
border: 1px solid #FF0000; 
background: #CCC; 
zoom:1; 
}   
#floatbox { 
float: left; 
width: 100px; 
height: 100px; 
border: 1px solid #0000FF; 
background: #00FF00; 
}

保存刷新ie浏览器窗口，如下图： 
 认识hasLayout——IE浏览器css bug的一大罪恶根源 - neverned - neverned 

可见这次外围容器的高度被撑起来了。 
同样，设定上文所述的其他会触发hasLayout的css属性都会得到这个结果。 
通常firefox等标准的遵守浏览器可以加上overflow: hidden;来解决，而IE则不行，需要触发其hasLayout属性才可以。 
hasLayout对于内联元素也可以有效果，当内联元素的hasLayout为true的时候，可以给这个内联元素设定高度和宽度并得到期望的效果。如下例： 
代码： 

<p>今天的<span style="width: 100px; height: 50px; background: #DDD;">天气</span>真好</p> 

效果如下图所示：

认识hasLayout——IE浏览器css bug的一大罪恶根源 - neverned - neverned 

下面给span加上zoom: 1;来触发hasLayout： 

<p>今天的<span style="width: 100px; height: 50px; background: #DDD; zoom: 1;">天气</span>真好</p> 

这回的效果如下图所示：

认识hasLayout——IE浏览器css bug的一大罪恶根源 - neverned - neverned 

要注意的是，hasLayout是微软专有的东西，对firefox等比较遵守标准的浏览器就无效了，因此不可太过依赖。貌似现在的IE8就已经不用特意去触发hasLayout就可以得到和firefox一致的效果，不知ie8是否已经弃用这个属性了？ 
其实依据合理的语义化，恰当的文档流，正确的标准化所生产出来的页面，在各个公司出品的标准渲染的浏览器下，一般并不会存在太多兼容性的问题的。 
一般如果是因为layout而引起的显示不符期望效果的话，在ff下会表现正常，而在ie下会出现错误。这个时候可以尝试触发父容器及其中的子容器的haslayout属性，通常可以通过加上zoom: 1;来调试。直到找到了产生问题的元素，再进行针对性的修正。最好的办法是对这个元素设置尺寸属性。但是，有时不便指定尺寸属性的情况下，就只能寻找替代方案了。对于ie7 ，最好的办法是设置最小高度属性为0；这个技术是无害的，因为0本来就是这个属性的初始值。而且没有必要对其他浏览器隐藏这个属性。而对于ie6和更早版本中触发一个元素hasLayout的方法是在overflow属性是visible的情况下设置这个元素的高度属性为1%，然后对其他浏览器隐藏这个设置。这种技术就是著名的Holly hack。