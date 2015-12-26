var React = require('react');
var Nav = React.createClass({
    getInitialState: function() {
        return {style:{display: 'none'}};
    },
    toggleDisplay: function() {
        this.setState({style: {display: this.state.style.display === 'none' ? 'block' : 'none'}});
    },
    clearCache: function() {
        if (!confirm('清除缓存后，离线文章将会失效，是否继续？')) {
            return;
        }
        try {
            localStorage.clear();
            applicationCache.update();
            window.location.reload();
        } catch (e) {}
    },
    handleClick: function() {
        this.toggleDisplay();
    },
    render: function() {
        return (
            <div className="nav-bg" style={this.state.style} onClick={this.handleClick}>
                <div className="nav-container">
                    <div className="avatar-container">
                        <div className="avatar" title="这就是我"></div>
                    </div>
                    <ul>
                        <li><a href="/"><i className="icon-font icon-home"></i>首　　页</a></li>
                        <li><a href="/?write"><i className="icon-font icon-write"></i>写点什么</a></li>
                        <li><a href="/?about"><i className="icon-font icon-about"></i>关　　于</a></li>
                        <li onClick={this.clearCache}><i className="icon-font icon-clear"></i>清除缓存</li>
                        <li><a href="/?setting"><i className="icon-font icon-setting"></i>设　　置</a></li>
                    </ul>
                    <div className="copyright">
                       &copy;2015 wenblog
                       <br/>开发版
                    </div>
                </div>
            </div>
        );
    }
});
module.exports = React.render(
<Nav />,
document.getElementById('nav')
);