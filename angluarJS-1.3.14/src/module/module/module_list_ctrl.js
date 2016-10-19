'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {

		app.register.controller('ModuleListCtrl', ['$scope', '$http', '$rootScope', 
			function($scope, $http, $rootScope){
				$http.get('api/module_list.json').
					success(function(data){
						$scope.list = data.data;
					})

				$scope.getData = function(){
					$http.get('api/module_list.json').
						success(function(data){
							$scope.list = data.data;
						})
				}

		}])
	}
	


})

