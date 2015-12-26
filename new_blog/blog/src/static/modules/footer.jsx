var React = require('react');
var Footer = React.createClass({
    render: function() {
        return (
            <div className="footer" style={{textAlign: 'center'}}>Copyright 2015</div>
        );
    }
});
React.render(
<Footer />,
document.getElementById('footer')
);