'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {

        require('common/service/special')(app);
        require('common/directive/crumb')(app);

		app.register.controller('SpecialEditCtrl', ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'Special',

			function($scope, $http, $rootScope, $location, $routeParams, Special){

				var id = $routeParams.id;

				$scope.isPopup = false;
				$scope.newSpType = '';
				$scope.id = id;

				$rootScope.setSepcialFlowInfo($routeParams.special_id,$routeParams.page_type_id,$routeParams.parent_id,$scope);

				// 判断是新建还是编辑
				if(id){
					// 获取MZT属性
					$scope.sp = Special.getProperty({id: id},function () {
						$scope.curSpType = {
							id : $scope.sp.cate_id,
							name : $scope.sp.cate_name,
						}

						$scope.curClient = {
							id : $scope.sp.client_id,
							name : $scope.sp.client_name,
						}
						//获取虚拟MZT信息
						if ($scope.sp.virtual_id && $scope.sp.virtual_id != 0) {
							Special.getVirtual({
								ids: $scope.sp.virtual_id,
								check_created: 1
							}, function(data) {
								if (data && data.list) {
									$scope.curVirtual = data.list[0];
								} else {
									$scope.curVirtual = {
										id: $scope.sp.virtual_id || '',
										name : $scope.sp.virtual_name || '',
									}
								}

							});
						} else{
							Special.getVirtual({check_created: 1}, function(data) {
								$scope.virtualList = data.list;
							});
						}

						$rootScope.setSepcialFlowInfo(id,0,$scope.sp.parent_id,$scope);
					});
				} else {
					$scope.sp = {
						name: '',
						title: ''
					}
					//创建虚拟MZT
					//从待办MZT列表点击创建
					if ($routeParams.virtual_id) {
						Special.getVirtual({
							ids: $routeParams.virtual_id,
							check_created: 1
						}, function(data) {
							if (data && data.list) {
								$scope.curVirtual = data.list[0];
								$scope.is_from_dap = true;
								$scope.sp.virtual_name = $scope.curVirtual.name;
								$scope.sp.virtual_id = $scope.curVirtual.id;
								$scope.sp.name = $scope.curVirtual.name;
								$scope.sp.title = $scope.curVirtual.name;
							} else {
								$scope.curVirtual = {
									id: $scope.sp.virtual_id || '',
									name: $scope.sp.virtual_name || '',
								}
							}

						});
					//点击新建MZT按钮
					} else {
						Special.getVirtual({check_created: 1}, function(data) {
							$scope.virtualList = data.list;
						});
					}
				}

				// 获取MZT分类列表
				$scope.spTypeList = Special.getTypeList(function(){
					if(!id){
						$scope.curSpType = $scope.spTypeList[0];
					}

				});

				// 获取客户分类列表
				$scope.clientList = Special.getClientList(function(){
					if(!id){
						$scope.curClient = $scope.clientList[0];
					}
				});

				//获取虚拟MZT列表
				// $scope.virtualList = Special.getVirtual({}, function(data) {
				// 	$scope.virtualList = data.list;

				// });

				//设置虚拟id
				$scope.$watch('sp.virtual_name', function(newValue, oldValue) {
					console.log(newValue, oldValue)
				});

				$scope.setVirtualName = function(item) {
					if (item.is_created === 1) {
						alert('选择的虚拟id已绑定，请重新选择！');
					} else {
						$scope.curVirtual = item;
						$scope.sp.virtual_name = $scope.curVirtual.name;
						$scope.sp.virtual_id = $scope.curVirtual.id;
						$scope.is_show_search_list = false;
					}
				}

				$scope.startSearch = function() {
					$scope.is_show_search_list = true
				}



				// 新建MZT
				$scope.create = function(){
					if(!valid()) return;

					if($scope.sp.virtual_name && !$scope.sp.virtual_id){
						alert('请选择虚拟档期');
						return;
					}

					Special.create(angular.extend(id ? $scope.sp.toJSON() : $scope.sp, {client_id: $scope.curClient.id, cate_id: $scope.curSpType.id}), function(data){
						if(data.result){
							var params = $.param({
								page_type_id: 0,
								parent_id : data.data.parent_id,
								special_id: data.data.special_id,
							});

							$location.url('/page/edit/' + data.data.parent_id + '?' + params);
						} else {
							alert(data.msg);
						}
					})
				}

				// 保存MZT
				$scope.update = function(){
					if(!valid()) return;

					Special.update(angular.extend(id ? $scope.sp.toJSON() : $scope.sp, {client_id: $scope.curClient.id, cate_id: $scope.curSpType.id}), function(data){
						if(data.result){
							var params = $.param({
								page_type_id: 0,
								parent_id : $scope.sp.parent_id,
								special_id: id,
							})

							$location.url('/page/edit/' + $scope.sp.parent_id + '?' + params);
						} else {
							alert(data.msg);
						}
					})
				}

				// 弹窗新增MZT类型
				$scope.popupAddSpType = function(){
					$scope.isPopup = true;
				}

				// 新增MZT类型
				$scope.addSpType = function(){
					console.log($scope.newSpType)
					Special.createType({name: $scope.newSpType}, function(data){
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

				$scope.$on('clickBody', function(){
					$rootScope.toggleDrop(window.event,$scope,'popAdminSelect');
				});

				$scope.setSpType = function(item){
					$scope.curSpType = item;
				}

				$scope.setClientType = function(item){
					$scope.curClient = item;
				}

				function valid(){
					return true;
				}

		}])
	}



})

