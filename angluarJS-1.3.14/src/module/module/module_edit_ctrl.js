'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {

    	require('common/service/module')(app);


		app.register.controller('ModuleEditCtrl', ['$scope', '$http', '$rootScope', 'Module', '$q', '$animate', 'util',
			function($scope, $http, $rootScope, Module, $q, $animate, util){
				var $module = $('.module'),
					$preview = $('.preview'),
					$setting = $('.setting');

				$scope.fff = 'ffffff';
				$scope.previewOn = false;

				$http.
					get('api/module_list.json').
					success(function(data){
						$scope.moduleList = data.data;
					})

				$scope.drag = function(item){
					console.log('drag');
					if(util.isIntersected($preview, $('.module-item:eq(0)'))){
						$scope.previewOn = true;
					} else {
						$scope.previewOn = false;
					}

					$scope.$apply();
				}

				$scope.stop = function(){
					console.log('stop');
					$scope.previewOn = false;
					$scope.$apply();

					// 如果放手是，在preview里，则获取模块信息
					if(util.isIntersected($preview, $('.module-item:eq(0)'))){
						addModule(this);
					}
				}

				$scope.start = function(){
					console.log('start')
				}

				$scope.drop = function(){
					console.log('drop');
				}

				$scope.over = function(){
					console.log('over');
				}

				$scope.out = function(){
					console.log('out');
				}


				// 添加模块
				function addModule(scope){
					$http.get('api/module.json?id=' + scope.item.id).
						success(function(data){
							$scope.curModule = data.data;
						})

				}

		}])
	}
	


})

