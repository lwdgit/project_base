var doReplaceType = -[1, ] ?
    function($ele) {//not IE
        $ele[0].type = 'password';
        $ele.on('focus', function() {
            $(this)[0].type = 'text';
        }).on('blur',function(){
            $(this)[0].type = 'password';
        });
    } :
    function($ele) {//IE
        var regex = new RegExp('type=[^\\s]+', 'i'),
            value = $ele[0].value,
            id = $ele[0].id;
        var $password = $($ele[0].outerHTML.replace(regex, 'type=password'));
        $password.attr({
            'id': 'clone-' + id,
            'name': ''
        });
        $password.css({
            'z-index': '10000'
        });
        $password.val(value);
        $password.insertAfter($ele);

        $ele.hide();
        $password.show();

        $password.on('focus', function() {
            $ele.show();
            $ele.focus();
            $ele.val($password[0].value);
            $password.hide();
        });
        $ele.on('blur',function(){
            $password.val($ele[0].value);
            $password.show();
            $ele.hide();
        });
    };

jQuery.fn.password = function() {
    var inputs = $(this);
    inputs.each(function() {
        doReplaceType($(this));
    });
};