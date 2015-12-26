var React = require('react');

var Item = React.createClass({
    render: function() {
        return (
            <li><a href={this.props.url}>{this.props.children}</a></li>
        );
    }
});

var ViewMore = React.createClass({
    viewMore: function(e) {
        this.props.onViewMore();
    },
    render: function() {
        return (
            <button className="btn btn-read-more" title="查看更多" onClick={this.viewMore}><i className="icon-font icon-more"></i></button>
        );
    }
})

var ArticleList = React.createClass({
    render: function() {
        var ret = this.props.data.map(function(item, index) {
            return <Item key={index} url={'/article.php?id=' + item.id + '&st=' + item.timestamp}>{item.title}</Item>;
        });
        return (
            <div  className="article-list">
            <ul>{ret}</ul>
            <ViewMore onViewMore={this.props.onViewMore} />
            </div>
        );
    }
});

module.exports = ArticleList;