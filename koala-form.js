// https://github.com/tongjieme/koala-form
// versino 0.8
(function($){
	// helper - merge two objects together, without using $.extend
	var merge = function (obj1, obj2) {
		var obj3 = {};
		for (var attrOne in obj1) { obj3[attrOne] = obj1[attrOne]; }
		for (var attrTwo in obj2) { obj3[attrTwo] = obj2[attrTwo]; }
		return obj3;
	};

	var inArray = function(array, push) { 
	    for(var i=0; i < array.length; i++) { 
	        if(array[i] == push) return true; 
	    }
	    return false; 
	};

	var removeA = function(arr) {
	    var what, a = arguments, L = a.length, ax;
	    while (L > 1 && arr.length) {
	        what = a[--L];
	        while ((ax= arr.indexOf(what)) !== -1) {
	            arr.splice(ax, 1);
	        }
	    }
	    return arr;
	}
	// var ary = ['three', 'seven', 'eleven'];
	// removeA(ary, 'seven');

	window.KoalaForm = function(o){
		this.o = $.extend({},{
			$form: $('.koala-form'),
			controlSelector: '',
			errorClass: 'hasError',
			focus2error: false,
			reg: {
				email: /^[a-zA-Z0-9_]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/,
				chinese: /^[\u0391-\uFFE5]+$/,
				zipcode: /^[1-9]\d{5}$/,
				mobile: /^1[3-9][0-9]{9}$/,
				phone: /^(0[1-9][0-9]{1,2}-?[2-9][0-9]{4,})|([4|8]00[0-9]{7})$/,
				numbers: /^[0-9]*$/,
				numbers_dot: /^[0-9\.]*$/,
				abc: /^[A-Za-z]+$/,
				numbers_abc_underline: /^\w+$/,
				url: /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
			},
			type: ['email', 'url'],
			mode: 'simple', // or complex
			on_single_error_func: function(type){}, // type: invalid type
			on_single_focus_func: function(){}, // this is the current input
			on_single_blur_func: function(){}, // this is the current input
			on_single_pass_func: function(){}, // this is the current input
			on_pass_func: function(e){} // e is the event
		}, o);
		this.init = function(){
			this.o.mode == 'simple' ? this.simple() : this.complex();
		},
		this.simple = function(){
			// begin simple mode
			var THIS = this,
				o = this.o;

			o.$form.find('[data-valid-options]').on('blur', function(){
					if( THIS.test($(this)).notPass ) {
						THIS.simpleShowHelp($(this), 'show', THIS.test($(this)).type );
					}
				}).on('focus', function(){
					THIS.simpleShowHelp($(this), 'hide', THIS.test($(this)).type );
				});
			o.$form.on('submit', function(e){
				var inputs = $(this).find('[data-valid-options]');
				$.each(inputs, function(k,v){
					if( THIS.test($(v)).notPass ) {
						THIS.simpleShowHelp($(v), 'show', THIS.test($(this)).type );
						o.focus2error || $(v)[0].focus();
						e.preventDefault();
						return false; // break out the each loop
					}
				});
				
			});
		},
		this.complex = function(){
			var THIS = this,
				o = this.o;
			o.$form.find('[data-valid-options]').on('blur', function(){
					var notPass = THIS.test($(this)).notPass,
						type = THIS.test($(this)).type;
					if( notPass ) {
						o.on_single_error_func.call(this, type);
					}
					o.on_single_blur_func.call(this);
				}).on('focus', function(){
					o.on_single_focus_func.call(this);
				});
			o.$form.on('submit', function(e){
				var inputs = $(this).find('[data-valid-options]'),
					hasError = false;
				$.each(inputs, function(k,v){
					var notPass = THIS.test($(v)).notPass,
						type = THIS.test($(v)).type;
					if( notPass ) {
						if( o.on_single_error_func.call(v, type, o) != false ) {
							hasError = true;
							
							e.preventDefault();
							return false; // break out the each loop
						}
					}
					o.on_single_pass_func.call(v);
				});
				if(!hasError) {
					o.on_pass_func(e);
				}
			});
		},
		this.test = function($el){
			var options = $el.data('validOptions').split(' '),
				type = $el.attr('type');

			var result = {
				notPass: false,
				type: ''
			};
			if( ( inArray(options, 'required') || $el.prop('required') ) && !this.required($el) ) {
				result.notPass = true;
				result.type = 'required';
			}
			if( inArray(options, 'regex') && !this.regex($el) ) {
				result.notPass = true;
				result.type = 'regex';
			}
			if( inArray(options, type) && !this.type($el) ) {
				result.notPass = true;
				result.type = 'regex';
			}
			if( inArray(options, 'equal') && !this.equal($el) ) {
				result.notPass = true;
				result.type = 'equal';
			}
			if( inArray(options, 'minLength') && !this.minLength($el) ) {
				result.notPass = true;
				result.type = 'minLength';
			}
			return result;
		},
		this.required = function($el){
			if( !$el.val().length || $el.val == -1 ) {
				return false;
			}
			return true;
		},
		this.regex = function($el){
			var regex = $el.data('regex'),
				regex = this.o.reg.hasOwnProperty(regex) ? this.o.reg[regex] : regex;
			if( $el.val().match(regex) != null ) {
				return true;
			}
			return false;
		},
		this.type = function($el){
			var type = $el.attr('type'),
				regex = this.o.reg[type];
			if( $el.val().match(regex) != null ) {
				return true;
			}
			return false;
		},
		this.equal = function($el){
			if( $el.val() == $($el.data('equal-to')).eq(0).val() ) {
				return true;
			}
			
			return false;
		},
		this.minLength = function($el){
			if( $el.val().length >= parseInt($el.data('min-length')) ) {
				return true;
			}
			
			return false;
		},
		this.hasHelpType = function($el){
			var o = this.o,
				helps;
			if(o.controlSelector) {
				helps = $el.closest(o.controlSelector).find('[class^=help]')
			} else {
				helps = $el.siblings('[class^=help]');
			}

			return helps.length > 1;
		}
		this.simpleShowHelp = function($el, action, type){
			var o = this.o,
				helpClass = '.help';


			if (this.hasHelpType($el)) {
				helpClass = '.help-' + type;
			};
			if(action == 'show') {
				if(o.controlSelector) {
					$el.addClass(o.errorClass)
					   .closest(o.controlSelector).find(helpClass).show();
				} else {
					$el.addClass(o.errorClass)
					   .siblings(helpClass).show();
				}
			} else {
				if(o.controlSelector) {
					$el.removeClass(o.errorClass)
					   .closest(o.controlSelector).find(helpClass).hide();
				} else {
					$el.removeClass(o.errorClass)
					   .siblings(helpClass).hide();
				}
			}
		};
		this.init();
	};
})(jQuery, window, undefined);
