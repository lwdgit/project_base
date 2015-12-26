var React = require('react');

var MsgBox = React.createClass({
    getInitialState: function() {
        return {title: '提示', msg: '请设置提示信息', style: {display: 'none'}};
    },
    render: function() {
        return (
            <div className="msgbox" style={this.state.style}>
                <label htmlFor="close-msg" className="header">
                    <span>{this.state.title}</span>
                    <span id="close-msg"></span>
                </label>
                <div className="content">
                    {this.state.msg}
                </div>
            </div>
        );
    }
});

var Msg = React.render(
    <MsgBox />,
    createId('msgbox')
);

function createId(id) {
    var ele = document.getElementById(id);
    if (ele) return ele;
    else {
        ele = document.createElement('div');
        ele.id = id;
        document.getElementsByTagName('body')[0].appendChild(ele);
        return ele;
    }
}

function hideMsg() {
    Msg.setState({style: {display: 'none'}});
}

function showMsg(msg, title, autoClose) {
    if (!msg) {
        hideMsg();
    } else {
        clearTimeout(showMsg.tick);
        Msg.setState({
            title: title || '提示',
            msg: msg,
            style: {display: 'block'}
        });
        if (autoClose) {
            autoClose = ~~autoClose > 1500 ? ~~autoClose : 1500;
            showMsg.tick = setTimeout(hideMsg, autoClose); 
        }
    }
}


exports.show = showMsg;

exports.hide = hideMsg;