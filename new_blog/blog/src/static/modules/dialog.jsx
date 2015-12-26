var React = require('react');
var Dialog = React.createClass({
    onClick: function(e) {
        console.log(arguments);
        if (this.props.onClick) {

            this.props.onClick.apply(this, arguments);
        }
    },
    render: function() {
        var dialogFooter;
        if (this.props.footer) {
            if (this.props.footer instanceof Array) {
                dialogFooter = this.props.footer.map(function(item) {
                     return <span onClick={this.onClick} className={item.className ? item.className : 'dialog-btn'}>
                    {item.text ? item.text : item.toString()}
                    </span>
                });
            } else {
                dialogFooter = <div className="dialog-footer">{this.props.footer}</div>;
            }
        }
        return (
            <div className="dialog">
                <div className="dialog-container">
                    <div className="dialog-header">{this.props.title ? this.props.title : '提示'}</div>
                    <div className="dialog-content">{this.props.children}</div>
                    {dialogFooter}
                </div>
            </div>
        );
    }
});

module.exports = Dialog;