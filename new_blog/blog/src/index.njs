module.exports = function(income, exp, done) {
    return TH.read('./tpl/index.tmpl').toString();
};
