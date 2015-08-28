var page = require('../components/page');
exports.init = function() {
    page({
        //hashbang: true,//是否采用hash形式
        decodeURLComponents: false,
    });

    page('*', function(context) {
        console.log(context.path);
    });
}
