### FIS3与FIS差异

1. `release`不支持`-r`参数
2. fis通过设置`fis.set('roadmap', {})`来设置匹配规则，fis3通过`fis.match`设置
3. fis `roadmap`后面规则无法覆盖前面的规则，而fis3默认可以覆盖
4. fis插件只支持全局安装，fis3插件已经支持本地使用，并且优先使用本地插件
5. fis不支持相对路径，fis3可以通过[`fis3-hook-relative`](https://github.com/fex-team/fis3-hook-relative)插件支持相对路径
6. fis不支持同一配置(`fis-conf.js`)来配置多个编译方式，fis3可以通过`fis.media`设置`开发模式`和`prod模式`分别使用的配置，你还可以自己指定media
7. fis3支持`fis-conf.js`修改后自动重启,并立即生效
8. fis release -o -p -D -m在fis3中以配置存在，并可以精准控制
9. fis3 DEMO很多，大部分的前端开发框架都有[DEMO](https://github.com/fex-team/fis3-demo)

> 更多请参考[fis与fis3的差异](https://github.com/fex-team/fis3/blob/70f2571ec84780656a6b162e3a9a0c3c4d8dc08b/doc/docs/fis2-to-fis3.md)


### FIS3 命令及API

#### FIS命令

1. 发布
```
    fis3 release -d <path> -w -L
    //wL表示对文件改动后自动刷新
```
2. 预览(默认为node服务器，端口为8080)
```
    fis3 server start
```
3. 查看文件分配到的属性
```
    fis3 inspect
    fis3 inspect <media>
```
#### FIS API

> fis3的配置文件默认还是`fis-conf.js`

* `fis.match(selector, prop)`表示对匹配到的文件进行的操作，如压缩，打包
* `fis.media(state)`提供多种状态，比如有些属性配置是开发阶段的，有些是上线时需要起作用的。如：

```javascript
    fis.media('prod').match('*.js', {
      optimizer: fis.plugin('uglify-js')
    });  
```

        $fis3 release prod


> 例子：
```javascript
//fis-config.js
// 加 md5
fis.match('*.{js,css,png}', {
  useHash: true
});

// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
  spriter: fis.plugin('csssprites')
})

// 对 CSS 进行图片合并
fis.match('*.css', {
  // 给匹配到的文件分配属性 `useSprite`
  useSprite: true
});

fis.match('*.js', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});


//开发的时候不需要压缩、合并图片、也不需要 hash。那么给上面配置追加如下配置；
fis.media('debug').match('*.{js,css,png}', {
  useHash: false,
  useSprite: false,
  optimizer: null
})

fis.match('*', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://cq.01.p.p.baidu.com:8888/receiver.php',
    to: '/home/work/htdocs' // 注意这个是指的是测试机器的路径，而非本地机器
  })
})

```


### FIS内置语法

> 注：此语法为fis内定，非标准web前端语法，所以写法只被fis支持


#### 在html或css中嵌入资源

给资源添加**?__line**参数来标记资源需要嵌入

#### 在js中嵌入资源

使用编译函数**__inline()**来对资源进行嵌入

#### 在js中对资源进行定位

使用定位函数**__uri()**

#### 在css中对资源进行定位

fis编译工具会识别css文件或**html的style标签内容**中 `url(path)` 以及 `src=path`字段，并将其替换成对应资源的编译后url路径

#### 在html中声明依赖
在项目的index.html里使用注释声明依赖关系：

    <!--
        @require demo.js
        @require "demo.css"
    -->

#### 在js中声明依赖

fis支持识别js文件中的 注释中的@require字段 标记的依赖关系，这些分析处理对 html的script标签内容 同样有效。

    //demo.js
    /**
     * @require demo.css
     * @require list.js
     */

#### 在css中声明依赖

fis支持识别css文件 注释中的@require字段 标记的依赖关系，这些分析处理对 html的style标签内容 同样有效。

    /**
     * demo.css
     * @require reset.css
     */

> fis3会自动生成一张依赖列表，并将其输出到`mainfest.json`或`__RESOURCE_MAP__`区域



### Glob匹配

 *  `*` 匹配多个除了 / 以外的字符
 *  `?` 匹配单个除了 / 以外的字符
 *  `**` 匹配多个字符包括 /
 *  `{}` 可以让多个规则用 , 逗号分隔，起到或者的作用
 *  `!` 出现在规则的开头，表示取反。即匹配不命中后面规则的文件
 *  `[...]`匹配一个范围内的字符，类似RegExp
 *  `!`或`^`表示不匹配
 *  `!(pattern1|pattern2)`表示不匹配`pattern1`或`pattern2`
 *  `?(pattern1|pattern2)`表示匹配`pattern1`或`pattern2` 0次或1次
 *  `+(pattern1|pattern2)`表示匹配`pattern1`或`pattern2` 至少1次
 *  `*(pattern1|pattern2)`表示匹配`pattern1`或`pattern2` 至少0次
 *  `@(pattern1|pat*|pat?erN)`表示精确匹配


 > 注：匹配以`.`开头的文件或目录需要加`.`,如`.*`。更多详见[node-glob英文文档](https://github.com/isaacs/node-glob)

 > FIS支持类`css伪类`来匹配一组文件，如`::text`表示匹配所有文本文件，`::image`表示匹配所有图片文件, `::package`表示匹配打包过程，更多详见[FIS-Glob文档](http://fex-team.github.io/fis3/docs/api/config-glob.html)