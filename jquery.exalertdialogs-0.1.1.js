(function($){

	//jQuery Alert Dialogsの設定を上書き
	$.alerts.overlayColor = '#555';
	$.alerts.overlayOpacity = .5;
	$.alerts.okButton = '&nbsp;はい&nbsp;';
	$.alerts.cancelButton = '&nbsp;いいえ&nbsp;';

	//独自ボタン
	$.exAlerts = {
		autofocus : true,
		exButtonStyle : 'ex-button'
	}

	$(['jAlert','jConfirm','jPrompt']).each(function(){
		var f = window[this];
		window[this] = function(){
			f.apply(f,arguments);
			var input = $('#popup_container input:text');
			var button = $('#popup_container input:button');
			$("#popup_ok, #popup_cancel").unbind('keypress');
			if ($.exAlerts.exButtonStyle) {
				button.wrap('<span class="' + $.exAlerts.exButtonStyle + '"/>')
			}
			if ($.exAlerts.autofocus) {
				setTimeout(function(){
					if (input.size()) input.eq(0).focus();
					else button.eq(0).focus();
				},100);
			}
		}
	});

	//SUBMITボタンに Alert Dialogs の jConfirm を割り込ませる Plugin
	$.fn.exJConfirm = function(message, title, preCallback, postCallback){
		var targets = $(this);
		var confirmOk = false;
		targets.each(function(idx){
			$(targets.eq(idx).attr('form')).find('input[type!="submit"][type!="button"]').keydown(function(evt){
				if ((evt.which && evt.which == 13) || (evt.keyCode && evt.keyCode == 13)) return false;
			});
		});
		targets.click(function(){
			var ret;
			if (preCallback) {
				ret = preCallback();
				if (!(ret == undefined || ret)) {
					return false;
				}
			}
			var button = $(this);
			if (confirmOk || jConfirm(message, title,function(isOk){
				if (isOk) {
					var ret;
					if (postCallback) ret = postCallback();
					if (ret == undefined || ret) {
						confirmOk = true
						button[0].click();
					}
				}
			}));
			return confirmOk ? !(confirmOk = false) : confirmOk;
		});
	}
})(jQuery);

