'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {

        require('common/service/page')(app);
        require('common/directive/checkbox')(app);

		app.register.controller('PageSubCreateCtrl', ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'Page', '$rootElement',

			function($scope, $http, $rootScope, $location, $routeParams, Page, $rootElement){
				$scope.factory = 'all';
				$scope.is_show_virtual_info = false;
				$scope.virtual_info = {};

				$scope.memberTypes = Page.getConsumerType(function () {});

				$scope.saleTypes = Page.getSaleType(function () {});

				$scope.warehouses = Page.getWarehouse(function () {});

				$scope.rules = Page.getCdiRules({
									is_all: 0
								},function () {});

				//获取虚拟MZT信息
				$scope.getSpecialVirtualInfo = Page.getSpecialVirtualInfo({
					"special_id": $routeParams.special_id,
				}, function(re) {
					//判断是否绑定虚拟id

					if (re.code === 1 && re.data) {
						$scope.is_show_virtual_info = true;
						$scope.virtual_info = re.data;

						var warehouses = $scope.virtual_info.warehouse.split(',');
						var sale_type = $scope.virtual_info.sale_type.split(',');
						var consumer_type = $scope.virtual_info.consumer_type.split(',');
						var vre_ids = [];
						$.each($scope.virtual_info.crowd, function(){
							vre_ids.push(this.code);
						});
						vre_ids = vre_ids.join(',');

						//与虚拟MZT匹配，自动勾选
						if ($scope.virtual_info.warehouse == 0 || $scope.virtual_info.warehouse === '') {
							$scope.factory = 'all';
							$scope.isWareHouseShow = false;
						} else {
							$scope.factory = '2';
							$scope.isWareHouseShow = true;
							$.each(warehouses, function() {
								var no = parseInt(this);
								$scope.warehouses[no - 1] = $.extend({}, {
									check: true,
									disable: true
								}, $scope.warehouses[no - 1]);
							});
						}
						$.each(sale_type, function() {
							var no = parseInt(this);
							if(this !== '' && this != 0){
								$scope.saleTypes[no] = $.extend({}, {
									check: true,
									disable: true
								}, $scope.saleTypes[no]);
							}
						});
						$.each(consumer_type, function() {
							var no = parseInt(this);
							if(this !== '' && this != 0){
								$scope.memberTypes[no - 1] = $.extend({}, {
									check: true,
									disable: true
								}, $scope.memberTypes[no - 1]);
							}
						});

						//vre人群转换cdi人群再进行对比
						if (vre_ids !== '' && vre_ids != 0) {
							Page.getCdiTypeByVreId({
								vre_ids: vre_ids
							}, function(data) {
								$scope.ruleIds = data;
								$.each($scope.ruleIds, function(i) {
									$.each($scope.rules, function(j) {
										if ($scope.ruleIds[i] == this.rule_id) {
											$scope.rules[j] = $.extend({}, {
												check: true
											}, this);
										}
									});
								});
							});
						}

					}
				});

				$scope.isPopup = false;      //是否开弹窗

				$scope.ifSave = function () {
					var length = $routeParams.list_length;
					if(length != 0){
						$scope.isPopup = true; //打开弹窗
					}else{
						$scope.doSave();
					}
				}

				$scope.doSave = function () {
					var checkBox = {},
						data,
						defaultValue = ['all'];

					$('input:checkbox[value]').each(function (i) {
						var name = this.name,
							check = this.checked,
							value = this.value;

						if(checkBox.tempName != name){
							checkBox[name] = [];
						}

						if(check == 1){
							checkBox[name].push(value);
						}

						checkBox.tempName = name;
					});

					if($scope.factory == '2' && checkBox.warehouse.length == 0){
						alert('请选择分仓！');
						return
					}

					checkBox.warehouse = $scope.factory == 'all' ? defaultValue : checkBox.warehouse;
					checkBox.memberType = checkBox.memberType.length == 0 ? defaultValue : checkBox.memberType;
					checkBox.saleType = checkBox.saleType.length == 0 ? defaultValue : checkBox.saleType;

					data = {
		                "special_id" : $routeParams.special_id,
		                "template_id" : $routeParams.template_id,
		                "parent_id" : $routeParams.parent_id,
		                "consumer_type" : checkBox.memberType,
		                "sale_type" : checkBox.saleType,
		                "warehouse" : checkBox.warehouse,
		                "rule_ids" : checkBox.rule
		            };

		            // console.log(data);

			        Page.create(data, function(data){
			        	alert(data.msg);

			        	// 修改子页面跳转逻辑 - 直接回到编辑页面
				    	if(data.result){
				    		location.href = '#/page/edit/'+ $routeParams.parent_id +'?' + $.param($routeParams);
				    	}
			        });
				}
		}])
	}



})

