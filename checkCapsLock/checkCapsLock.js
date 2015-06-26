function checkCapsLock($eles, callback) {
    var IsCapPress = function() {
        this.capIsPress = false;
        this.lastValue = $eles.val();
        this.$eles = $eles;

        function _check(value, isShiftPress) {
            if (value) {
                if (IsCapPress.lastValue != value)
                    IsCapPress.lastValue = value;
                else return IsCapPress.capIsPress;
                var lastKey = value.charAt(value.length - 1);
                if (lastKey >= 'a' && lastKey <= 'z' || lastKey >= 'A' && lastKey <= 'Z')
                    return isShiftPress ? lastKey >= 'a' && lastKey <= 'z' : lastKey >= 'A' && lastKey <= 'Z';
                else
                    return IsCapPress.capIsPress;
            }
            return IsCapPress.capIsPress;
        }

        this.bindCtrl = function($eles, callback) {
            this.$eles = $eles || this.$eles;
            this.$eles.on('keyup', function(e) {
                if (e.keyCode == 16 || e.keyCode == 8) return IsCapPress.capIsPress;
                IsCapPress.capIsPress = _check($(this).val(), e.shiftKey);
                if (callback && typeof callback == 'function')
                    callback.call(this, IsCapPress.capIsPress);
                else return IsCapPress.capIsPress;
            });
        };
        this.unbindCtrl = function($eles, callback) {
            this.$eles = $(eles) || this.$eles;
            this.$eles.off('keypress');
        }
        if ($eles && callback) this.bindCtrl($eles, callback);
    }
    return new IsCapPress();
}