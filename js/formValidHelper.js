(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.form = factory();
    }
}(this, function() {
	function capitalizeFirstLetter(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	}
    var reg = {
			email: /^[a-zA-Z0-9_]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/,
			chinese: /^[\u0391-\uFFE5]+$/,
			zipcode: /^[1-9]\d{5}$/,
			mobile: /^1[3-9][0-9]{9}$/,
			phone: /^([\+][0-9]{1,3}([ \.\-])?)?([\(][0-9]{1,6}[\)])?([0-9 \.\-]{1,32})(([A-Za-z \:]{1,11})?[0-9]{1,4}?)$/,
			phoneCn: /^(0[1-9][0-9]{1,2}-?[2-9][0-9]{4,})|([4|8]00[0-9]{7})$/,
			numbers: /^[0-9]*$/,
			numbers_dot: /^[0-9\.]*$/,
			abc: /^[A-Za-z]+$/,
			numbers_abc_underline: /^\w+$/,
			url: /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
			username: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
			price: /^\d+(\.\d+)?$/
		},
		msg = {
			noChinese: '* Chinese character is not allowed.',
			required: '* This fields is required.',
			email: '* Invalid Email address.'
		},
		types = ['email', 'url'];

	var inArray = function(array, v) { 
	    for(var i=0; i < array.length; i++) { 
	        if(array[i] === v) {return true;} 
	    }
	    return false; 
	};

	var test = function($el, func){
		var result = {
			isPassed: true,
			type: ''
		};

		if(!!!$el.data('valid')) {
			return result;
		}
		
		var options = $el.data('valid').split(' ');

		$.each(options, function(k,v){
			var r;
			if(v.indexOf('_') > -1) {
				var args = v.split('_'),
					functionName = 'is' + capitalizeFirstLetter(args[0]),
					type = capitalizeFirstLetter(args[0]);

				args[0] = $el;

				r = form[functionName].apply(undefined, args);
				if(r.isPassed) {
					return true;
				} else {
					result = r;
					return false;
				}
				
			}
			if(form['is' + capitalizeFirstLetter(v)] !== undefined) {
				r = form['is' + capitalizeFirstLetter(v)]($el);
				if(r.isPassed == false) {
					result = r;
					return false;
				}
			} else {
				r = isRegex($el,v);
				if(r.isPassed == false) {
					result = r;
					return false;
				}
			}
		});

		// if(result.isDeferred && typeof result.func == 'function' ) {
		// 	result.deferred.always(function(abc){
		// 		result.func(abc);
		// 	});
		// }

		return result;
	};

	var tests = function($els){
		var result = {
			isPassed: true,
			list: []
		};

		$.each($els, function(k,v){
			var r = test($(v));

			if(!r.isPassed) {
				result.isPassed = false;
				result.list.push({
					type: r.type,
					$el: $(v)
				});	
			}
			
		});

		return result;
	};

	var isRequired = function($el){
		var flag = true;
		if( $el.is('[type=radio]') ) {
			if($el.closest('form').find('[name='+$el.attr('name')+']:checked').length) {
				return {
					isPassed: flag,
					type: 'required'
				};
			} else {
				flag = false;
			}
		}
		if(flag && $el.is('[type=checkbox]') && !$el.is(':checked')) {
			flag = false;
		}
		if(flag && $el.val() === null || !$el.val().length || ($el.prop('tagName') == 'SELECT' && $el.val() == -1) ) {
			flag = false;
		}
		if(flag && $el.data('default') && $el.val() === $el.data('default') ) {
			flag = false;
		}

		return {
			isPassed: flag,
			type: 'required',
			msg: msg['required']
		}
	};

	var isNoChinese = function($el){
		return {
			isPassed: /^[^\u4e00-\u9fa5]{0,}$/.test($el.val()),
			type: 'noChinese',
			msg: msg['noChinese']
		};
	};

	var isRegex = function($el, regex){
		if($el.val().length == 0) {
			return {
				isPassed: true,
				type: ''
			};
		}
		var regexText = regex,
			regex = reg.hasOwnProperty(regexText) ? reg[regexText] : regex;
		if( regex.test($el.val()) ) {
			return {
				isPassed: true,
				type: regexText,
				msg: msg[regexText]
			};
		}
		return {
			isPassed: false,
			type: regexText,
			msg: msg[regexText]
		};
	};

	var isEqual = function($el){
		return {
			isPassed: $el.val() === $('[name='+arguments[1]+']').val(),
			type: 'equal',
			msg: '* fields do not match'
		};
	};

	var isMinLength = function($el, length){
		return {
			isPassed: $el.val().length >= parseInt(length),
			type: 'minLength',
			msg: msg['minLength']
		}
	};

	var isMaxLength = function($el, length){
		return {
			isPassed: $el.val().length <= parseInt(length),
			type: 'maxLength',
			msg: msg['maxLength']
		}
	};

	var isLessThan = function(){

	};

	var isMoreThan = function(){
		
	};

	var isAjax = function($el){

	};

	var form = {
			test: test,
			tests: tests,
			isEqual: isEqual,
			isRegex: isRegex,
			isRequired: isRequired,
			isMinLength: isMinLength,
			isNoChinese: isNoChinese,
			msg: msg
		};

	return form;
}));





if($.fn.tooltipster !== undefined) {
	var formValid = (function(){
		window.tooltips = (function(){
			var show = function($el, o){
				if($el.data('tooltipster-ns') !== undefined) {
					$el.tooltipster('destroy');
				}
				$el.tooltipster(o).tooltipster('show');
			};

			var error = function($el, msg){
				show($el, {
				    position: 'top-right',
				    theme: 'tooltipster-error',
				    maxWidth: 300,
				    contentAsHTML: true,
				    content: msg,
				    hideOnClick: true,
				    trigger: 'custom',
				    autoClose: true,
				    timer: 3000,
				    interactive: true,
				    debug: false
				});
			};

			var hide = function($el){
				if($el.data('tooltipster-ns') === undefined) {
					return;
				}
				$el.tooltipster('hide');
			};

			return {
				show: show,
				hide: hide,
				error: error
			}
		})();

		var test = function($el){
			var r = form.test($el);
			if(r.isPassed == false && r.isDeferred !== true) {
				tooltips.error($el, r.msg);
			}
			return r;
		};

		var tests = function($els){
			var result = {
				isPassed: true,
				list: []
			};
			$.each($els, function(k,v){
				var r = test($(v));

				if(!r.isPassed) {
					result.isPassed = false;
					result.list.push({
						type: r.type,
						$el: $(v),
						isPending: r.isPending,
						msg: r.msg
					});	
				}
			});
			return result;
		};

		var blurValid = function($form){
			$form.on('focus', '[data-valid]', function(){
				tooltips.hide($(this));
			}).on('blur', '[data-valid]', function(){
				test($(this));
			});
		};


		


		return {
			test: test,
			tests: tests,
			blurValid: blurValid
		}
	})();
}