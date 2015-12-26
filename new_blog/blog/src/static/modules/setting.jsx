var React = require('react');

var ShiftButton = React.createClass({
    render: function() {
        var id = ~~(Math.random() * 1000);
        return (
            <label htmlFor={id} className="shift-button">
                <input type="checkbox" id={id} defaultChecked={this.props.checked} onChange={this.props.onChange}/>
                <div className="button">
                    <div className="circle"></div>
                </div>
            </label>
        );
    }
});


var SingleSelect = React.createClass({
    getInitialState: function() {
        return {defaultItem: this.props.defaultItem ? ~~this.props.defaultItem : 0};
    },
    onClick: function(e) {
        var index = ~~e.currentTarget.getAttribute('data');
        if (index !== this.state.defaultItem) {
           this.props.onChange(index);
           this.setState({defaultItem: index}); 
        }
    },
    render: function() {
        var defaultItem = this.state.defaultItem;
        var self = this;
        var list = this.props.data.map(function(item, index) {
            return (
            <div className="control-group" data={index} key={index} onClick={self.onClick}>
                <label className="control-label">{item}</label>
                <div className="controls">{index === defaultItem ? '✓' : '　'}</div>
            </div>
            );
        });
        return <fieldset >{list}</fieldset>;
    }
});


var Setting = React.createClass({
    getInitialState: function() { 
        return {safeEye: false, loginState: window.document.cookie.indexOf('user') > -1 ? '已登录' : '未登录'};
    },
    logIn: function() {
        if (this.state.loginState === '未登录') {
            window.location.href = '/Auth/';
        }
    },
    logOut: function() {
        if (confirm('你确定要退出登录？')) {
            window.location.href = '/Auth/logOut.php'; 
        }
    },
    initLink: function() {
        this.initLink.link = document.createElement('link');
        this.initLink.link.href = '/static/css/eye.css';
        this.initLink.link.rel = 'stylesheet';
        this.initLink.link.disabled = !this.state.safeEye;
        document.getElementsByTagName('head')[0].appendChild(this.initLink.link);
    },
    onSafeEye: function(e) {
        this.initLink.link.disabled = !e.target.checked;
    },
    changeFont: function(index) {
        var map = {
            '0': '0.8',
            '1': '1',
            '2': '1.2'
        };
        document.getElementsByTagName('body')[0].style.cssText = 'font-size:' + map[index] + 'em !important'
    },
    changeList: function(index) {
        var map = {
            '0': 10,
            '1': 15,
            '2': 30
        };
        window.App.Instance.page.page_size = map[index];
    },
    componentDidMount: function() {
        this.initLink();
    },
    render: function() {
        return (
            <div className="setting">
                <fieldset>
                    <div className="control-group">
                        <label className="control-label" htmlFor="status">登录信息</label>
                        <div className="controls">
                            <div id="status" onClick={this.logIn}>{this.state.loginState}</div>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <div className="control-group">
                        <label className="control-label">护眼模式</label>
                        <div className="controls"><ShiftButton onChange={this.onSafeEye} checked={this.state.safeEye}/></div>
                    </div>
                </fieldset>

                <label className="label">字体大小</label>
                <SingleSelect data={['小', '中', '大']} defaultItem="1" onChange={this.changeFont}/>
                

                <label className="label">单次加载数据</label>
                <SingleSelect data={['10条', '15条', '30条']} defaultItem="1" onChange={this.changeList}/>


                <fieldset className="plain">
                    <div className="btn-group">
                        {this.state.loginState === '已登录' ? <button className="btn primary" onClick={this.logOut}>退出登录</button> : 
                        <button className="btn primary" onClick={this.logIn}>点击登录</button>
                        }
                    </div>
                </fieldset>
                
            </div>
        );
    }
});

module.exports = Setting;