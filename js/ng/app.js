function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

var app = angular.module('app', []);


app.config(function($compileProvider) {
  // $compileProvider.debugInfoEnabled(false);

});


app.controller("twitter", function($scope, $timeout, $compile){
	var This = this;
	This.message = 'hello';

	This.updateMessage = function(message){
	    This.message = message;
	};

	$scope.color = 'red'

    $scope.newCode = function(e){
        var $el = $compile( '<div code="html"><textarea><script src="js/jquery.min.js"></script><script src="ng/angular.js"></script><link href="css/common.css" rel="stylesheet"></textarea></div>' )( $scope );
        $($el).insertAfter($(e.target))
    };

	// $scope.myClass = ''
	// $scope.color = ""

	$scope.number = 1;

    $timeout(function(){
        $scope.list = [{
                    href: 'abc'
                },{
                    href: 'abc'
                },{
                    href: 'abc'
                },{
                    href: 'abc'
                },{
                    href: 'abc'
                },{
                    href: 'abc'
                },{
                    href: 'abc'
                },{
                    href: 'abc'
                },{
                    href: 'abc'
                },{
                    href: 'abc'
                },{
                    href: 'abc'
                },{
                    href: 'abc'
                },{
                    href: 'abc'
                },{
                    href: 'abc'
                },{
                    href: 'abc'
                },{
                    href: 'abc'
                }];
        $scope.page = 1;
    }, 2000);
    
})
.directive('integer', function(){
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ctrl){
        	ele.on('keyup', function(){
        		$(ele).val($(ele).val().replace(/[^\d.-]/g, ''));
        		$(ele).trigger('change');
        	});

            ctrl.$parsers.unshift(function(viewValue){
                return parseInt(viewValue, 10) || 0;
            });
        }
    };
})
.directive('word', function(){
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ctrl){
            var o = {
                space: false
            };

            if(attr.option) {
                o = $.extend({}, o, $.parseJSON(attr.option));
            }

            var regex = o.space ? /[^\w\s]|\d/g : /[\W\d]|\s/g;

        	ele.on('keyup change', function(e){
        		if(e.keyCode == 17 || e.keyCode == 91 || e.keyCode == 37 || e.keyCode == 39) {
        			return;
        		}
        		$(ele).val($(ele).val().replace(regex, ''));
        	});

        	if(ctrl !== undefined) {
	        	ctrl.$parsers.unshift(function(viewValue){
	                return viewValue.replace(regex, '');
	            });	
        	}
        }
    };
})
.directive('wordnum', function(){
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ctrl){
            var o = {
                space: false
            };

            if(attr.option) {
                o = $.extend({}, o, $.parseJSON(attr.option));
            }

            var regex = o.space ? /[^\w\s]/g : /[\W\s]/g;

            ele.on('keyup change', function(e){
                if(e.keyCode == 17 || e.keyCode == 91 ) {
                    return;
                }
                $(ele).val($(ele).val().replace(regex, ''));
            });

            if(ctrl !== undefined) {
                ctrl.$parsers.unshift(function(viewValue){
                    return viewValue.replace(regex, '');
                }); 
            }
        }
    };
})
.directive('codex', function($timeout){
    return {
        restrict: 'A',
        scope: {
            content: '='
        },
        transclude: true,
        replace: true,
        template: '<div></div>',
        compile: function(tElement, tAttrs, transclude){
            return function(scope, element, attrs, ctrl, transclude){
                var content;
                var hl = function(content){
                    $(element).html($('<pre class="'+(attrs.codex || '')+'"><code></code></pre>'));
                    $(element).find('pre code').text(content);
                    hljs.highlightBlock($(element).find('pre')[0], {
                        languages: ['javascript']
                    });
                }
                transclude(scope.$new(), function(el){
                    content = el[0].innerText;
                    scope.content = content;
                });
                scope.$watch('content',
                    function(newValue, oldValue) {
                        hl(newValue);
                    }
                );
            }
        }
    };
})
.directive('cmPage', function(){
    return {
        template: '<div class="cm-pagination" ng-if="list">' +
                    '<a href="#" class="prev" ng-click="prev($event)" ng-if="current != 1">Prev</a>' +
                    '<ul>' +
                        '<li ng-class="{active: current == $index + 1}" ng-show="In($index+1)" ng-repeat="l in list track by $index"><a href="{{l.href}}" ng-click="go($index+1, $event)">{{$index+1}}</a></li>' +
                    '</ul>' +
                    '<a href="#" class="next" ng-click="next($event)" ng-if="current != list.length">Next</a>' +
                '</div>',
        scope: {
            current: '=',
            list: '='
        },
        restrict: 'A',
        controller: function($scope){
            $scope.go = function(page, e){
                e.preventDefault();
                $scope.current = page;
            }
            $scope.prev = function(e){
                e.preventDefault();
                $scope.current = parseInt($scope.current) - 1;
            }
            $scope.next = function(e){
                e.preventDefault();
                $scope.current = parseInt($scope.current) + 1;
            }
            $scope.newArray = function(a, b){
                var aa = [];
                for(var i = a; i <= b; i++) {
                    aa.push(i)
                }
                return aa;
            }
            $scope.In = function(i){
                return $.inArray(i, $scope.showed) > -1;
            }
        },
        link: function(scope, ele, attr, ctrl){
            scope.onlyshow = parseInt(attr['onlyshow']) || 6;

            scope.$watchGroup(['list', 'current'],
                function(newValue, oldValue) {
                    if(scope.list == undefined) {
                        return;
                    }
                    scope.showed = (function(){
                        var middle = Math.round(scope.onlyshow / 2),
                            length = scope.list.length;
                            
                        // 最前 x 个
                        if(newValue[1] <= middle) {
                            return scope.newArray(1, scope.onlyshow);
                        }
                        // 最后 x 个
                        if((newValue[1] + middle) > length) {
                            return scope.newArray(length - scope.onlyshow, length)
                        }
                        // 中间
                        return scope.newArray(newValue[1] - middle, newValue[1] + middle - 1);
                    })();
                }
            );

            scope.current = scope.current == undefined ?  1 : scope.current;

            
            // scope.list = undefined;
        }
    };
});