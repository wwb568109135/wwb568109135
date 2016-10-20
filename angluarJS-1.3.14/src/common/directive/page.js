"use strict";

define(function(require, exports, module) {

	module.exports = function(app) {

		app.register.directive('specialPage', function (Module) {
			return {
				restrict: 'EA',
				scope: {
					page: '=specialPage',
					curModule: '=curModule'
				},

				controller: function($scope, $element, $attrs){

					
				},

				link: function(scope, iElement, iAttrs, controller){
					scope.setCurModule = function($index, module){
						scope.curModule = module;
					};

				},

				templateUrl: '/common/directive/page.html'
			}
		});

	}
	
})

