var form = (function(){
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
			url: /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
		},
		type = ['email', 'url'];

	var inArray = function(array, push) { 
	    for(var i=0; i < array.length; i++) { 
	        if(array[i] == push) return true; 
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
		if( inArray(options, type) && !isType($el) ) {
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
		return result;
	};

	var isRequired = function($el){
		if( !$el.val().length || $el.val() == -1 ) {
			return false;
		}
		return true;
	};

	var isRegex = function($el){
		var regex = $el.data('regex'),
			regex = reg.hasOwnProperty(regex) ? reg[regex] : regex;
		if( $el.val().match(regex) != null ) {
			return true;
		}
		return false;
	};

	var isType = function($el){
		var type = $el.attr('type'),
			regex = reg[type];
		if( $el.val().match(regex) != null ) {
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

	return {
		test: test,
		isEqual: isEqual,
		isType: isType,
		isRegex: isRegex,
		isRequired: isRequired,
		isMinLength: isMinLength
	};
})();