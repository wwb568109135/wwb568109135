'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {

        require('common/service/special')(app);

		app.register.controller('SpecialPageEditCtrl', ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'Special', '$rootElement',

			function($scope, $http, $rootScope, $location, $routeParams, Special, $rootElement){
				var id = $routeParams.id;

				$scope.isPopup = false;
				$scope.newSpType = '';

				// 判断是新建还是编辑
				if(id){
					// 获取MZT属性
					$scope.sp = Special.getProperty({id: id});
				}

				// 获取MZT分类列表
				$scope.spTypeList = Special.getTypeList(function(){
					$scope.curSpType = $scope.spTypeList[0];
				});

				// 新建MZT
				$scope.create = function(){
					Special.create($scope.sp, function(data){
						if(data.result){
							$location.url('/special/edit/' + data.data.id);
						} else {
							alert('报错了！');
						}
					})
				}

				// 弹窗新增MZT类型
				$scope.popupAddSpType = function(){
					$scope.isPopup = true;
				}

				// 新增MZT类型
				$scope.addSpType = function(){
					Special.createType(function(data){
						if(data.result){
							$scope.isPopup = false;
							$scope.newSpType = '';
							$scope.spTypeList.unshift(data.data);
							$scope.curSpType = data.data;
						} else {
							alert('报错了！');
						}
					});
				}

				// 关闭弹窗
				$scope.cancel = function(){
					$scope.isPopup = false;
					$scope.newSpType = '';
				}

		}])
	}
	


})

