$.fn.select = function (args) {
	var selects = $(this);
	selects.each(function (index) {
		if (typeof args === "string" && args == "remove") {
			remove($(this));
			$(this).css("visibility", "visible");
		} else {
			var select = $(this),
				spanWrap = $('<span class="jSelect" id="jSelect' + index + '"></span>'),
				input = $('<input type="text" class="form-control input-sm validatebox" readonly id="jSelect-input' + index + '">'),
				ext = $('<button type="button" class="btn"><span class="caret"></span></button>'),
				option = $('<ul></ul>'),
				openflag = false,
				writeable = false;

			function dataInit(inp, ele) { //
				var lastEle = ele.find("option:last");
				if (lastEle.attr("writeable") !== undefined && ele.val() == lastEle.val()) {
					writeable = true;
					inp.attr('readonly', false);
					inp.addClass('validatebox');
					inp.attr('data-options', lastEle.attr('data-options'));
					inp.val(ele.val());
				} else {
					inp.val(ele.find('option[value="' + ele.val() + '"]').html());
				}
				inp.attr('data', ele.val());
			}

			dataInit(input, select);
			spanWrap.append(input);
			spanWrap.append(ext);
			spanWrap.append(option);
			remove(select);
			spanWrap.insertAfter(select);

			function onChange() {
				select.trigger('change');
				input.trigger('change');
			}

			function handleClick() {
				if (openflag) {
					option.empty();
					option.hide();
					openflag = false;
				} else {
					var li = select.html();
					option.html(li.replace(/(<\/?)option/gi, '$1li'));
					option.show();
					if (!writeable) {
						optSelect(input.attr('data'), option).addClass('active');
					} else {
						option.find('[writeable]').addClass('active');
					}
					window.setTimeout(function () {
						openflag = true;
					}, 50);
				}
			}

			input.on('change', function (e, message) {
				if (writeable) {
					select.find('option[writeable]').val($(this).val());
					select.val($(this).val());
					if (!message) {
						select.trigger('onchange'); //自定义事件用于处理select change
					}
				}
			});
			spanWrap.delegate('input', 'click', function () {
				if (!writeable) {
					handleClick();
				}
			});

			spanWrap.delegate('button', 'click', function () {
				handleClick();
			});

			select.on('change', function () {
				if (!writeable) {
					input.val($(this).find('option[value="' + $(this).val() + '"]').html());
				} else {
					input.val($(this).find('option[writeable]').val());
					input.focus();
				}
				input.attr('data', $(this).val());
				option.find('li.active').removeClass('active');
				if (openflag) {
					optSelect($(this).val(), option).addClass('active');
				}
			});

			option.delegate('li', 'mousemove', function () {
				option.find('li.active').removeClass('active');
				$(this).addClass('active');
			});

			option.delegate('li', 'click', function () {
				select.val($(this)[0].getAttribute('value'));
				if ($(this).attr('writeable') !== undefined) {
					writeable = true;
					input.attr('readonly', false);
					input.addClass('validatebox');
					input.attr('data-options', $(this).attr('data-options'));
				} else {
					writeable = false;
					input.attr('readonly', true);
				}

				option.hide();
				openflag = false;
				onChange();
			});

			$(document).on('click', function () {
				if (openflag) {
					option.hide();
					openflag = false;
				}
			});
		}
	});

	function remove(select) {
		if (select.next().hasClass("jSelect")) {
			select.next().remove();
		}
	}

	function optSelect(index, obj) {
		var t = null;
		obj.find('li').each(function () {
			if ($(this)[0].getAttribute('value') == index.toString()) {
				t = $(this);
			}
		});
		return t;
	}
};