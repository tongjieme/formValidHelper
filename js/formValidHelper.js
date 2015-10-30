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
		types = ['email', 'url'];

	var inArray = function(array, v) { 
	    for(var i=0; i < array.length; i++) { 
	        if(array[i] === v) {return true;} 
	    }
	    return false; 
	};

	var test = function($el){
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
				r = isRegex($el,reg[v]);
				if(r.isPassed == false) {
					result = r;
					return false;
				}
			}
		});

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
		if( $el.val() === null || !$el.val().length || ($el.prop('tagName') == 'SELECT' && $el.val() == -1) ) {
			flag = false;
		}
		if( $el.data('default') && $el.val() === $el.data('default') ) {
			flag = false;
		}

		return {
			isPassed: flag,
			type: 'required'
		}
	};

	var isNoChinese = function($el){
		return {
			isPassed: /^[^\u4e00-\u9fa5]{0,}$/.test($el.val()),
			type: 'noChinese'
		};
	};

	var isRegex = function($el, regex){
		if($el.val().length == 0) {
			return {
				isPassed: true,
				type: ''
			};
		}
		var regex = regex || $el.data('regex'),
			regex = reg.hasOwnProperty(regex) ? reg[regex] : regex;
		if( regex.test($el.val()) ) {
			return {
				isPassed: true,
				type: regex
			};
		}
		return {
			isPassed: false,
			type: regex
		};
	};

	var isEqual = function($el){
		return {
			isPassed: $el.val() === $('[name='+arguments[1]+']').val(),
			type: 'equal'
		};
	};

	var isMinLength = function($el, length){
		return {
			isPassed: $el.val().length >= parseInt(length),
			type: 'minLength'
		}
	};

	var isMaxLength = function($el, length){
		return {
			isPassed: $el.val().length <= parseInt(length),
			type: 'maxLength'
		}
	};

	var isLessThan = function(){

	};

	var isMoreThan = function(){
		
	};

	var form = {
			test: test,
			tests: tests,
			isEqual: isEqual,
			isRegex: isRegex,
			isRequired: isRequired,
			isMinLength: isMinLength,
			isNoChinese: isNoChinese
		};

	return form;
}));