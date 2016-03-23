var React = require('react');

/*var Guide = React.createClass({
    render: function() {
        return (

        );
    }
});*/

var ScrollTitle = React.createClass({
    left: 55,
    left1: 0,
    clientWidth: window.document.body.clientWidth,
    getInitialState: function() {
        this.left1 = this.left + this.clientWidth;
        return {left: this.left + 'px', left1:  this.left1 + 'px'};
    },
    computePos: function(pos) {
        //console.log(this.clientWidth, this.refs.title.getDOMNode().clientWidth)
        if (pos <= -this.clientWidth) {
            pos = this.clientWidth;
        } else {
            pos -= 20;
        }
        return pos;
    },
    tick: function() {
        this.left = this.computePos(this.left);
        this.left1 = this.computePos(this.left1);
        this.setState({left: this.left + 'px', left1: this.left1 + 'px'});
    },
    componentDidMount: function() {
        var dom = this.refs.title.getDOMNode();
        dom.style.width = 'auto';
        if (dom.clientWidth <= this.clientWidth - 55) {
            return;
        }
        this.clientWidth = dom.clientWidth + 55;
        dom.style.width = '100%';
        this.left1 = this.left + this.clientWidth;
        this._tick = setInterval(this.tick, 1000);
    },
    componentWillUnmount: function() {
        clearInterval(this._tick);
    },
    render: function() {
        //console.log(this.clientWidth, wi)
        return (
            <div className="scroll-title">
                <div className="title" ref="title" style={{left: this.state.left}}>{this.props.children}</div>
                <div className="title" style={{left: this.state.left1}}>{this.props.children}</div>
            </div>
        );
    }
})


var Header = React.createClass({
    getInitialState: function() {
        return {titleId: 'list', title: document.title.slice(0, -18)};
    },
    back: function() {
        if (history.state) {
            history.back();
        } else {
            location.replace('//' + location.host);
        }
    },
    showNav: function() {
        window.App.Instance.nav.toggleDisplay();
    },
    render: function() {
        var back;
        if (this.state.titleId === 'article') {
            return (
                <div className="header">
                    <button className="back icon-font icon-back" onClick={this.back}></button>
                    <ScrollTitle className="title">{this.state.title}</ScrollTitle>
                </div>
            );
            
        } else if (this.state.titleId.indexOf('list') > -1) {
            return (
                <div className="header">
                    <button className="nav-btn btn" onClick={this.showNav}><i className="icon-font icon-list"></i></button>
                    <div className="list"><a href="/" className="plain">{this.state.title} <i className="icon-font icon-fresh"></i></a></div>
                    <button className="search-btn btn"><a href="/?search"><i className="icon-font icon-search"></i></a></button>
                </div>
            );
        } else {
            return ( 
                <div className="header">
                    <button className="back icon-font icon-back" onClick={this.back}></button>
                    <div>{this.state.title}</div>
                </div>
            );
        }  
    }
});
module.exports = React.render(
<Header />,
document.getElementById('header')
);