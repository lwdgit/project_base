
fis.hook('module', {
    mode: 'amd',
    forwardDeclaration: true
})
.match('modules/**.js', {
    isMod: true, // 组件建议都是匿名方式 define
    lint: fis.plugin('jshint', {
        ignored: [/jquery\.js$/i],

        //using Chinese reporter
        i18n: 'zh-CN',
        es3: true,
        //jshint options
        camelcase: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        node: true
    })
})
.match('::package', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'amd',
        useInlineMap: true // 资源映射表内嵌
    })
});
