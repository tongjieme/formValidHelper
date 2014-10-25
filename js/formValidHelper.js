(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.form = factory();
    }
}(this, function() {
    var reg = {
			email: /^[a-zA-Z0-9_]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/,
			chinese: /^[\u0391-\uFFE5]+$/,
			zipcode: /^[1-9]\d{5}$/,
			mobile: /^1[3-9][0-9]{9}$/,
			phone: /^(0[1-9][0-9]{1,2}-?[2-9][0-9]{4,})|([4|8]00[0-9]{7})$/,
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
		
		var options = $el.data('valid').split(' '),
			type = $el.attr('type');

		if( ( inArray(options, 'required') || $el.prop('required') ) && !isRequired($el) ) {
			result.isPassed = false;
			result.type = 'required';
			return result;
		}
		if( inArray(options, 'regex') && !isRegex($el) ) {
			result.isPassed = false;
			result.type = 'regex';
			return result;
		}
		if( inArray(types, type) && !isType($el) ) {
			result.isPassed = false;
			result.type = 'regex';
			return result;
		}
		if( inArray(options, 'equal') && !isEqual($el) ) {
			result.isPassed = false;
			result.type = 'equal';
			return result;
		}
		if( inArray(options, 'minLength') && !isMinLength($el) ) {
			result.isPassed = false;
			result.type = 'minLength';
			return result;
		}
		if( inArray(options, 'maxLength') && !isMaxLength($el) ) {
			result.isPassed = false;
			result.type = 'maxLength';
			return result;
		}
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
		if( $el.is('[type=radio]') ) {
			if($el.closest('form').find('[name='+$el.attr('name')+']:checked').length) {
				return true;
			} else {
				return false;
			}
		}
		if( $el.val() === null || !$el.val().length || ($el.prop('tagName') == 'SELECT' && $el.val() == -1) ) {
			return false;
		}
		if( $el.data('default') && $el.val() === $el.data('default') ) {
			return false;
		}
		return true;
	};

	var isRegex = function($el){
		if($el.val().length == 0) {
			return true;
		}
		var regex = $el.data('regex'),
			regex = reg.hasOwnProperty(regex) ? reg[regex] : regex;
		if( regex.test($el.val()) ) {
			return true;
		}
		return false;
	};

	var isType = function($el){
		var type = $el.attr('type'),
			regex = reg[type];
		if( $el.val().match(regex) !== null ) {
			return true;
		}
		return false;
	};

	var isEqual = function($el){
		// if the equal-to value is '' then passed
		// if(!$($el.data('equal-to')).eq(0).val()) {
		// 	return true;
		// }

		var valueArray = [];
		$.each( $el.add($($el.data('equal-to')) ), function(k,v){
			valueArray.push($(v).val());
		});
		
		if(valueArray.length > 0) {
	        for(var i = 1; i < valueArray.length; i++)
	        {
	            if(valueArray[i] !== valueArray[0]) {
	                return false;
	            }
	        }
	    }
	    return true;
	};

	var isMinLength = function($el){
		if( $el.val().length >= parseInt($el.data('min-length')) ) {
			return true;
		}
		
		return false;
	};

	var isMaxLength = function($el){
		if( $el.val().length <= parseInt($el.data('max-length')) ) {
			return true;
		}
		
		return false;
	};

	var isLessThan = function(){

	};

	var isMoreThan = function(){
		
	};

	var right = $('<span class="formTips Yw_right"></span>'),
    	wrong = $('<span class="formTips Yw_wrong"></span>');

	var tipsRight = function($el, text){
		if($el.next().hasClass('formTips')) {
	      $el.next().remove();
	    }
	    right.clone().html(text).insertAfter($el);
	};
	var tipsError = function($el, text){
		if($el.next().hasClass('formTips')) {
	      $el.next().remove();
	    }
		wrong.clone().html(text).insertAfter($el);
	};
	var tipsRemove = function($el){
		if($el.next().hasClass('formTips')) {
	      $el.next().remove();
	    }
	};
	var isTipsError = function($el){
		return $el.next().hasClass('Yw_wrong');
	};

	var form = {
			test: test,
			tests: tests,
			isEqual: isEqual,
			isType: isType,
			isRegex: isRegex,
			isRequired: isRequired,
			isMinLength: isMinLength,
			tipsRight: tipsRight,
			tipsError: tipsError,
			tipsRemove: tipsRemove,
			isTipsError: isTipsError
		};

	return form;
}));