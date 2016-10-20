'use strict';

define(function(require, exports, module) {

	module.exports = function (app) {

		app.register.directive('checkAll', ['$resource', function($resource){
			// Runs during compile
			return {
				// name: '',
				// priority: 1,
				// terminal: true,
				// scope: {}, // {} = isolate, true = child, false/undefined = no change
				// controller: function($scope, $element, $attrs, $transclude) {},
				// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
				restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
				// template: '',
				// templateUrl: '',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function(scope, element, attrs, controller) {
					element.bind('click',function () {
						var name = attrs.name,
							checks = $('input:checkbox[name='+ name +'][value]');
					    if(this.checked){
					        checks.prop('checked',true);
					    }else{
					        checks.prop('checked',false);
					    }
					});

					scope.check = function (e) {
						//console.log('check');
						var target = e.target,
						    name = target.name;

						scope.initCheckAll(name);
					}

					scope.initCheck = function (ids, arry) {
						// console.log(ids,arry);
						angular.forEach(arry, function(value, key){
							if(value.id != null && ids.indexOf(value.id.toString()) > -1){
								value.check = true;
							}else{
								value.check = false;
							}
						});
					}

					scope.initCheckAll = function (name) {
						setTimeout(function () {
							var checks = $('input:checkbox[name='+ name +'][value]'),
							    checkeds = $('input:checkbox:checked[name='+ name +'][value]'),
							    checkAll = $('input:checkbox[name='+ name +'][check-all]');

							if(checks.length > 0 && checks.length == checkeds.length){
							    checkAll.prop('checked',true);
							}else{
							    checkAll.prop('checked',false);
							}
						}, 0);
					}
				}
			};
		}]);
	}
});
