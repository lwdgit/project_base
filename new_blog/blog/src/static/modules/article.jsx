var React = require('react');
var Markdown = require('js/libs/showdown.min');

var Article = React.createClass({
    render: function() {
        //console.log(this.props);
        var content;
        if (this.props.contentType === 'markdown') {
            content = new Markdown.converter().makeHtml(this.props.content);
        } else {
            content = this.props.content;
        }
        
        return ( 
            <article>       
                <div className="content"><span className="article-content" dangerouslySetInnerHTML={{__html: content}} /></div>
            </article>
        );
    }
});

module.exports = Article;