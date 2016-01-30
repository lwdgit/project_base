var React = require('react');

var Write = React.createClass({
    getInitialState: function() {
        var article = this.loadValue();
        if (article) {
            return {
                id: article.id,
                title: article.title,
                children: article.content,
                tags: article.tags
            };
        }
        
        return {};
    },
    componentDidMount: function(e) {
        var autoSave = function() {
            var article = this.collectValue();
            if (!article.title && !article.content && article.id) {
                delete article.id;
            }
            localStorage.setItem('__tempArticle', JSON.stringify(article));
        }.bind(this);
        window.onbeforeunload = window.onunload = autoSave;
        setInterval(autoSave, 6000);
    },
    componentWillUnmount: function(e) {
        window.onbeforeunload = window.onunload = null;
    },
    loadValue: function() {
        var article = localStorage.getItem('__tempArticle');
        if (article) {
            article = JSON.parse(article);
            return {
                id: article.id,
                title: article.title,
                content: article.content,
                tags: article.tags
            };
        } else {
            return null;
        }
    },
    collectValue: function() {
        var title, content, tags, id;
        title = this.refs.title.getDOMNode().value;
        content = this.refs.content.getDOMNode().value;
        tags = this.refs.tags.getDOMNode().value;
        id = this.refs.id.getDOMNode().value || '';
        return {
            id: id,
            title: title,
            content: content,
            tags: tags
        };
    },
    onSubmit: function(e) {
        e.preventDefault();
        var article = this.collectValue();
        if (!article.title || !article.content || !article.tags) {
            alert('输入不完整！');
            return;
        }
        this.props.onSubmit(article, function(res) {
            this.setState({id: res});
        }.bind(this));
    },
    render: function() {
        return (
            <div className="write-container">
                <form onSubmit={this.onSubmit}>
                    <input type="text" ref="title" name="title" defaultValue={this.state.title} placeholder="在此输入标题"/>
                    <input type="hidden" ref="id" name="id" value={this.state.id} />
                    <textarea name="content" ref="content" defaultValue={this.state.children} placeholder="在此输入内容, 支持markdown语法"/>
                    <input type="text" ref="tags" name="tags" defaultValue={this.state.tags} placeholder="在此输入标签,多个以“ | ”间隔"/>
                    <div className="operate">
                        <input type="submit" value="保存"/>
                        <input type="reset" value="恢复"/>
                    </div>
                </form>
            </div>
        );
    }
});

module.exports = Write;
