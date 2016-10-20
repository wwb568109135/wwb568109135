'use strict';

define(function(require, exports, module) {

	module.exports = function (app) {
		/**
		 * 注册日历选择指令，包含日期和时分的选择
		 * 依赖jquery-ui，datepicker,timerpicker
		 */
		require('datepicker-i18n');

		app.register.directive('uiTime', ['$resource', function($resource){
			// Runs during compile
			return {
				// name: '',
				// priority: 1,
				// terminal: true,
				// scope: {}, // {} = isolate, true = child, false/undefined = no change
				// controller: function($scope, $element, $attrs, $transclude) {},
				require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
				// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
				// template: '',
				// templateUrl: '',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function(scope, element, attrs, controller) {
					// console.log(attrs.uiTimeTime)
					var getOptions = function() {

					    return angular.extend({
					    	minuteGrid: 10,
					    	timeFormat: 'HH:mm:ss'
					    }, scope.$eval(attrs.uiTime),scope.$eval(attrs.uiTimeTime));
					};
					var initDateWidget = function() {
					    var showing = false;
					    var opts = getOptions();

					    if (attrs.uiMaxRange) {
					    	opts.onClose = function( selectedDate ) {
					            $('[ui-time=' + attrs.uiMaxRange + ']').datepicker( "option", "maxDate", selectedDate );
					        }
					    };

					    if (attrs.uiMinRange) {
					    	opts.onClose = function( selectedDate ) {
					            $('[ui-time=' + attrs.uiMinRange + ']').datepicker( "option", "minDate", selectedDate );
					        }
					    };

					    // Check if the element already has a datepicker.
					    if (element.data('datetimepicker')) {
					        // Updates the datepicker options
					        element.datetimepicker('option', opts);
					        element.datetimepicker('refresh');
					    } else {
					        // Creates the new datetimepicker widget
					        element.datetimepicker(opts);

					        //Cleanup on destroy, prevent memory leaking
					        element.on('$destroy', function() {
					            element.datetimepicker('destroy');
					        });
					    }
					};
					// Watch for changes to the directives options
					scope.$watch(getOptions, initDateWidget, true);
				}
			};
		}]);
	}
});
