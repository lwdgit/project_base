var React = require('react');
var util = require('js/util');
var Article = require('article');
var ArticleList = require('article_list');
var Search = require('search');
var Write = require('write');
var About = require('about');
var Setting = require('setting');
var Msg = require('msgbox');

var Page = React.createClass({
    moreTimes: 1,
    page_size: 10,
    page_end: false,
    curComponent: 'list',
    getInitialState: function() {
        return {list: [], article: {}, tags: [], more: this.moreTimes};
    },
    defaults: {
        title: {
            'list': '文章列表',
            'article': '%s',
            'write': '随便写写',
            'about': '关于我',
            'setting': '设置',
            'search': '搜索 标签',
            'search_list': '搜索 [%s]',
            '': '异常，请手动刷新页面！',
            'undefined': '异常，请手动刷新页面！',
            'null': '异常，请手动刷新页面！'  
        }
    },
    setHeader: function(titleId, msg) {
        var title = this.defaults.title[titleId];
        if (msg) {
            title = title.replace(/%s/g, msg);
        }
        this.curComponent = titleId;
        document.title = title + '  -- 夜的第七章 ★ 个人博客移动版';
        window.App.Instance.header.setState({titleId: titleId, title: title});
    },
    loadList: function(forceUpdate, cb, page) {
        if (!page)page = this.moreTimes; 
        if (!(this.state.list.length === 0 || forceUpdate)) {
            this.showList(this.state.list);
            return;
        }
        util.Ajax.localLoad('/data/index.php?page=' + page, 
            {page: page, page_size: this.page_size},
            function(res) {
            if (res) {
                res = JSON.parse(res);
                if(typeof cb === 'function')cb(res);
            } else {
                res = [];
            }
            //console.log(res);
            var list;
            if (page === 1) {
                this.moreTimes = 1;
                list = res;
            } else {
                list = this.state.list.concat(res);
            }
            this.showList(list);
        }.bind(this), {forceUpdate: forceUpdate});
    },
    showList: function(list) {
        this.setHeader('list');
        this.setState({list: list});
    },
    loadTags: function() {
        util.Ajax.localLoad('/data/getTags.php', {}, function(res) {
            if (res) {
                res = JSON.parse(res);
            } else {
                res = {};
            }
            this.setHeader('search');
            this.setState({tags: res});
        }.bind(this));
    },
    loadArticle: function(id, args) {
        util.Ajax.localLoad('/data/article.php?id=' + id + args, {id: id}, function(res) {
            if (res) {
                res = JSON.parse(res);
            } else {
                res = {};
            }
            //console.log(res);
            
            this.setHeader('article', res['title']);
            this.setState({article: res});
        }.bind(this));
    },
    about: function() {
        this.setHeader('about');
        this.setState({});
    },
    setting: function() {
        this.setHeader('setting');
        this.setState({});
    },
    onSearch: function(args) {
        //console.log(args);
 
        util.Ajax.localLoad('/data/search.php?keyword=' + args.keyword + '&page=' + 1, 
            {},
            function(res) {
            if (res) {
                res = JSON.parse(res);
                if(typeof cb === 'function')cb(res);
            } else {
                res = [];
            }
            //console.log(res);
            
            this.showList(res);
            this.setHeader('search_list', args.keyword);
        }.bind(this), {forceUpdate: true});
    },
    writeArticle: function() {
        this.setHeader('write');
        this.setState({title: 'write'});
    },
    onSubmitArticle: function(args, cb) {
        if (!/user/.test(document.cookie)) {
            alert('请先登录！');
        } else {
            util.Ajax.post('/data/postArticle.php', util.Ajax.param(args), function(res) {
                //console.log(res);
                if (res > 1) {
                    if (typeof cb === 'function') {
                        cb(res);
                    }
                } else {
                    alert('文章保存失败!');
                    console.log(res);
                }
            });
        }
        return;
    },
    onViewMore: function(e) {
        this.loadList(true, function(res) {
            if (res.length > 0) {
                this.moreTimes++;
                setTimeout(function() {
                    window.scrollTo(0,window.document.body.clientHeight);
                }, 100);
                
            } 
            if (res.length < res.page_size) {
                this.page_end = true;
            }
        }.bind(this), this.moreTimes + 1);
    },
    toggleSection: function() {
        var styles = {};
        if (this.curComponent) {
            var flag = false;
            for(var prop in this.defaults.title) {
                if (prop === this.curComponent) {
                    styles[prop] = {display: ''};
                    flags = true;
                } else {
                    styles[prop] = {display: 'none'};
                }
            }
            if (flags) {
                return styles;
            } else {
                //TODO:显示异常处理
                return null;
            }
        } 
        return null;
    },
    render: function() {
        var style = this.toggleSection();
        if (!style) return <div className="page-error">页面异常，请刷新重试！</div>;
        return (
            <div className="section-container">
                <section style={style.list}>
                    <ArticleList data={this.state.list} urls={this.state.urls} onViewMore={this.onViewMore}/>
                </section>
                <section style={style.article}>
                    <Article title={this.state.article.title} {...this.state.article}>
                        {this.state.article.content}
                    </Article>
                </section>
                <section style={style.write}>
                    <Write title={this.state.write_title} tags={this.state.write_tags} onSubmit={this.onSubmitArticle}>
                        {this.state.write_content}
                    </Write>
                </section>
                <section style={style.search}>
                    <Search tags={this.state.tags} onSubmit={this.onSearch}/>
                </section>
                <section style={style.about}>
                    <About />
                </section>
                <section style={style.setting}>
                    <Setting />
                </section>
            </div>
        );
    }
});

exports.init = function() {
    return React.render(
        <Page />,
        document.getElementById('basicContainer')
    );
};