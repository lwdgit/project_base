var page = require('../js/libs/page');
exports.init = function(cb) {
    page({
        //hashbang: true,//是否采用hash形式
        decodeURLComponents: false,
        dispatch: true
    });

    page('*', function(context) {
        cb(context.path, 'init' in context);
    });
}
