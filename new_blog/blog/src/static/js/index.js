var util = require('js/util');

function initPath(path, isBack) {
    if (path === '/') {
        //window.location.href = '/';
        window.App.Instance.page.loadList(!isBack, null, 1);
    } else if (/id\=(\d+)(.*)/.test(path)) {
        window.App.Instance.page.loadArticle(RegExp.$1, RegExp.$2);
    } else if (path === '/?search') {
        window.App.Instance.page.loadTags();
    } else if (path === '/?write') {
        console.log('todo:write');
        window.App.Instance.page.writeArticle();
    } else if (path === '/?about') {
        console.log('todo:about');
        window.App.Instance.page.about();
        //alert('系统正在开发中!!!');
    } else if (path === '/?setting') {
        console.log('todo:setting');
        window.App.Instance.page.setting();
    } else {
        window.App.Instance.page.loadList();
    }
}

function init() {
    require(['../js/router', 'page', 'nav', 'widget', 'header', 'footer'], function(router, page, nav, widget, header, footer) {
        util.showLoadding(false);
        document.getElementById('main').style.visibility='visible';
        window.App = window.App || {
            Instance: {}
        };
        window.App.Instance.page = page.init();
        window.App.Instance.header = header;
        window.App.Instance.nav = nav;
        initPath(window.location.pathname + window.location.search);
        router.init(initPath);
    });
}

if (window.applicationCache) {
    applicationCache.addEventListener('updateready', function() {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
            window.applicationCache.swapCache();
            console.log("appcache updated");
            window.location.reload();
        }
    });
}

exports.init = init;
