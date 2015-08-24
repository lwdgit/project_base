// @require static/require.js

define('comp/1-0/1-0', ['require', 'exports', 'module', 'comp/cal/cal'],function (require, exports, module) {
    var cal = require('comp/cal/cal');
    console.log('work');
    // 1 - 0
    console.log(cal.min(1, 0));
});