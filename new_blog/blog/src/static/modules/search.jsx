var React = require('react');
var Search = React.createClass({
    getInitialState: function() {
        return {type: '全文', style: {display: 'none'}};
    },
    onSubmit: function() {
        var value = this.refs.name.getDOMNode().value;
        if (!value)return;
        this.props.onSubmit({type: this.state.type, keyword:value});
    },
    onSelectTags: function(e) {
        this.refs.name.getDOMNode().value = e.target.innerHTML;
        this.setState({type: '标签'});
    },
    onShowSelect: function(e) {
        var type = this.state.type;
        if (e.target.tagName === 'LI') {
            type = e.target.innerHTML;
        }
        this.setState({type: type, style: {display: this.state.style.display === 'none' ? '' : 'none'}});
    },
    render: function() {
        var tags = [];
        if (this.props.tags) {
            for(var prop in this.props.tags) {
                var tag = this.props.tags[prop];
                if (tag) {
                    tags.push(<li>{tag}</li>);
                }
            }
        }
        
        return (
            <div className="search-container">
                <div className="search">
                    <input type="hidden" name="type" />
                    <button className="select" onClick={this.onShowSelect}><i className="icon-font icon-arrow"></i></button>
                    <ul className="type-select" style={this.state.style} onClick={this.onShowSelect}>
                        <li>全文</li>
                        <li>标题</li>
                        <li>标签</li>
                    </ul>
                    <span className="type">{this.state.type}</span>
                    <input type="text" placeholder="请输入搜索关键字" name="keyword" defaultValue={this.state.value} ref="name" />
                    <button className="submit" onClick={this.onSubmit}><i className="icon-font icon-search"></i></button>
                </div>
                <div className="tag-list">
                    <label className="label">手动选择标签</label>
                    <ul onClick={this.onSelectTags}>
                        {tags}
                    </ul>
                </div>
            </div>
        );
    }
});
module.exports = Search;