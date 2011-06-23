/*
 * 	Ex Alert Dialogs 0.1.2 - jQuery plugin
 *	written by Cyokodog	
 *
 *	Copyright (c) 2011 Cyokodog (http://d.hatena.ne.jp/cyokodog/)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
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

	var API = function(api){
		var api = $(api),api0 = api[0];
		for(var name in api0)
			(function(name){
				if($.isFunction( api0[name] ))
					api[ name ] = (/^get[^a-z]/.test(name)) ?
						function(){
							return api0[name].apply(api0,arguments);
						} : 
						function(){
							var arg = arguments;
							api.each(function(idx){
								var apix = api[idx];
								apix[name].apply(apix,arg);
							})
							return api;
						}
			})(name);
		return api;
	}

	$.ex = $.ex || {};

	$.ex.jconfirm = function(idx , targets , option){
		var o = this,
		c = o.config = $.extend({} , $.ex.jconfirm.defaults , option);
		c.targets = targets;
		c.target = c.targets.eq(idx);
		c.index = idx;

		var trigger;
		if (c.target.is('form')) {
			c._targetIsForm = true;
			c.form = c.target;
			trigger = 'submit';
		}
		else {
			c._targetIsForm = false;
			c.form = $(c.target.attr('form'));
			trigger = 'click';
		}

		c.form.find('input[type!="submit"][type!="button"]').keydown(function(evt){
			if ((evt.which && evt.which == 13) || (evt.keyCode && evt.keyCode == 13)) return false;
		});

		var confirmOk = false;

		c.target.bind(trigger,function(){
			if (c.disabled) return true;
			var ret;
			if (c.preCallback) {
				ret = c.preCallback.call(o,o);
				if (!(ret == undefined || ret)) {
					return false;
				}
			}
			if (confirmOk || jConfirm(c.message||'', c.title||'',function(isOk){
				if (isOk) {
					var ret;
					if (c.callback) ret = c.callback.call(o,o);
					if (ret == undefined || ret) {
						confirmOk = true
						if (c.target[0][trigger]) {
							c.target[0][trigger]();
						}
						else {
							c.target.trigger(trigger)();
						}
					}
				}
			}));
			return confirmOk ? !(confirmOk = false) : confirmOk;
		});
	}

	$.extend($.ex.jconfirm.prototype,{
		getTarget : function(){
			return this.config.target;
		},
		disabled : function(attr){
			this.config.disabled = attr;
			return this;
		},
		setMessage : function(attr){
			this.config.message = attr;
			return this;
		},
		setTitle : function(attr){
			this.config.title = attr;
			return this;
		}
	});

	$.ex.jconfirm.defaults = {
		api : false,
		disabled : false,
		preCallback : '',
		callback : ''
	}

	$.fn.exJConfirm = function(message,title,option){
		var targets = this,api = [];
		option = option || {};
		option.message = message;
		option.title = title;
		targets.each(function(idx) {
			var target = targets.eq(idx);
			var obj = target.data('ex-jconfirm') || new $.ex.jconfirm( idx , targets , option);
			api.push(obj);
			target.data('ex-jconfirm',obj);
		});
		return option && option.api ? API(api) : targets;
	}

})(jQuery);

