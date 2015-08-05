```css
.finally-solve {
letter-spacing: -4px;/*根据不同字体字号或许需要做一定的调整*/
word-spacing: -4px;
font-size: 0;
}
.finally-solve li {
font-size: 16px;
letter-spacing: normal;
word-spacing: normal;
display:inline-block;
*display: inline;
zoom:1;
}


```


```javascript
//去除空格
$('.removeTextNodes').contents().filter(function() {
  return this.nodeType === 3;
}).remove();

```