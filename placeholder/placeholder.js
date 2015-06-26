jQuery.fn.placeholder = function(){
	var i = document.createElement('input'),
		placeholdersupport = 'placeholder' in i;
	if(!placeholdersupport){
		var inputs = jQuery(this);
		inputs.each(function(){
			var input = jQuery(this),
				text = input.attr('placeholder'),
				placeholder = jQuery('<span class="phTips '+this.id+'">'+text+'</span>');
			
			placeholder.click(function(){
				input.focus();
			});
			placeholder.insertAfter(input);
			function check() {
				if(input.val() !== ""){
					placeholder.css({visibility:'hidden'});
				}else{
					placeholder.css({visibility:''});//使用visibility:visible会导致父级visibility:hidden失效
				}
			}
			input.keyup(function(){
				check($(this));
			});
			input.on('change',function(){
				check($(this));
			});
			check($(this));
		});
	}
	return this;
};
