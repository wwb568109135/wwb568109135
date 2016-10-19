'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {

		app.register.controller('ModuleCreateCtrl', ['$scope', '$http', '$rootScope', 'Module',
			function($scope, $http, $rootScope){
				$scope.name = 'module create';



		}])
	}
	


})

