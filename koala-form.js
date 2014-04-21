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
			controlSelector: '.controls',
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
			on_single_error_func: function(){},
			on_single_focus_func: function(){},
			on_single_blur_func: function(){},
			on_single_pass_func: function(){},
			on_pass_func: function(){}
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
						THIS.simpleShowHelp($(this), 'show');
					}
				}).on('focus', function(){
					THIS.simpleShowHelp($(this), 'hide');
				});
			o.$form.on('submit', function(e){
				var inputs = $(this).find('[data-valid-options]');
				$.each(inputs, function(k,v){
					if( THIS.test($(v)).notPass ) {
						THIS.simpleShowHelp($(v), 'show');
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
						hasError = true;
						o.on_single_error_func.call(v, type, o);
						e.preventDefault();
						return false; // break out the each loop
					}
					o.on_single_pass_func.call(v);
				});
				if(!hasError) {
					o.on_pass_func();	
				}
			});
		},
		this.test = function($el){
			var options = $el.data('validOptions').split(' '),
				type = $el.attr('type');
			if( inArray(options, 'required') && !this.required($el) ) {
				return {
					notPass: true,
					type: 'required'
				};
			}
			if( inArray(options, 'regex') && !this.regex($el) ) {
				return {
					notPass: true,
					type: 'regex'
				};
			}
			if( inArray(this.o.type, type) && !this.type($el) ) {
				return {
					notPass: true,
					type: 'regex'
				};
			}
			return {
					notPass: false,
					type: ''
				};
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
		this.simpleShowHelp = function($el, string){
			if(string == 'show') {
				$el.closest(o.controlSelector).find('.help').show();
			} else {
				$el.closest(o.controlSelector).find('.help').hide();
			}
		};
		this.init();
	};
})(jQuery, window, undefined);
