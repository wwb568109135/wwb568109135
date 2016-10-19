'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {

    	require('common/service/module')(app);


		app.register.controller('ModuleEditCtrl', ['$scope', '$http', '$rootScope', 'Module', '$q', '$animate', 'util',

			function($scope, $http, $rootScope, Module, $q, $animate, util){

				$http.
					get('api/module_list.json').
					success(function(data){
						$scope.list1 = data.data;
						$scope.list2 = [];
					})

				$scope.drag = function(){
					console.log('drag');
				};
				$scope.start = function(){
					console.log('start');
				};
				$scope.stop = function(){
					console.log('stop');
				};
				$scope.drop = function(){
					console.log('drop');
				};
				$scope.over = function(){
					console.log('over');
				};
				$scope.out = function(){
					console.log('out');
				};
				
			}])
	}
	


})

