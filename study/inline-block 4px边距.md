```css
.finally-solve {
letter-spacing: -4px;/*���ݲ�ͬ�����ֺŻ�����Ҫ��һ���ĵ���*/
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
//ȥ���ո�
$('.removeTextNodes').contents().filter(function() {
  return this.nodeType === 3;
}).remove();

```