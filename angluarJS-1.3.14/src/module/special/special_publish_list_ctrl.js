'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {

		require('common/service/special')(app);
		require('common/service/index')(app);
		require('common/directive/checkbox')(app);
		require('common/directive/crumb')(app);
		require('common/directive/popup')(app);
		require('common/directive/popupImg')(app);
		require('common/service/common')(app);

		app.register.controller('SpecialPublishListCtrl', ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'Special', 'Common', 'getApi', 'Index',

			function($scope, $http, $rootScope, $location, $routeParams, Special, Common, getApi, Index){
				var href = $location.url();
				$scope.urlParams = href.split('?')[1];

				$scope.special_id = $routeParams.id;
				$scope.rule_names = [];//用户群体选项
				$scope.warehouses = [];//分仓选项
				$scope.sale_types = [];//销售类型选项
				$scope.selections = {//选中项
					rule_name:[],
					warehouse:[],
					sale_type:[]
				};


				$scope.vre_names_cdi = [];

				$scope.special = Special.getPublishList({
					id: $scope.special_id
				}, function() {
					angular.forEach($scope.special.children, function(v, k) {
						if ($scope.rule_names.indexOf(v.rule_name) < 0) {
							$scope.rule_names.push(v.rule_name);
						}
						if ($scope.warehouses.indexOf(v.warehouse) < 0) {
							$scope.warehouses.push(v.warehouse);
						}
						if ($scope.sale_types.indexOf(v.sale_type) < 0) {
							$scope.sale_types.push(v.sale_type);
						}
					});
				});

				// 获取vre人群可见列表
				$scope.vreTypeStatusList = Special.getVreTypeStatusList({
					special_id: $scope.special_id
				}, function(data) {
					angular.forEach(data, function(v, k) {
						$scope.vre_names_cdi.push(v.cdi_type);
					});
					// console.log(data);
					// console.log($scope.vre_names_cdi);
				});


				$scope.goBatchEdit = function () {
					var ids = Common.getChecksValue('check');

					if(ids == ''){
						alert('请选择要修改的项');
					}else{
						location.href = '#/special/' + $scope.special.id + '/publish/edit/' + ids.join('_') + '?' + $.param($routeParams) + '&clientId=' + $scope.special.client_id;
					}
				}

				$scope.goPreview = function () {
					location.href = '#/preview/' + $scope.special.id + '?' + $.param($routeParams) + '&page_id=' + $routeParams.parent_id;
				}

				$scope.delete = function () {
				    var ids = Common.getChecksValue('check');

				    Special.delete({ ids : ids},function  (data) {
				        if(data.result){
					        alert(data.msg);
					        //删除view数据
                            angular.forEach(ids,function(id, i){
                                angular.forEach($scope.special.children,function(list, index){
                                    if(id == list.id){
                                        $scope.special.children.splice(index,1);
                                    }
                                });
                            });
					    }else{
					        alert(data.msg);
					    }
				    });

				    $scope.popDelOpen = false;
				}

				$scope.preDelete = function () {
				    var ids = Common.getChecksValue('check');

				    if(ids == ''){
				        alert('请选择要删除的子页面');
				        return;
				    }

				    $scope.popDelOpen = true;
				}

				$scope.publish = function () {
					var ids = Common.getChecksValue('check');

					if(ids == ''){
				        alert('请选择要发布的子页面');
				        return;
				    }

					Special.publish({ childPageIds : ids.join(',')},function  (data) {
				        if(data.result){
					        alert(data.msg);
					    }else{
					        if(data.code == 109){
					            var data = data.data;
					            var msg = [];
					            for(var key in data){
					                if(key){
					                	if(typeof data[key] == 'object'){
											var m = '';
					                		for(var k in data[key]){
												//alert(data[key][k]);
												//return
												m += data[key][k]+'，';
											}
											msg.push(key+'：'+ m + '\n\n');
					                	}else{
					                		alert(data[key]);
											return
					                	}
					                }

					            }
					            alert(msg.join(''));
					        }else{
					            alert(data.msg);
					        }
					    }
				    });
				}

				$scope.goEditLayout = function (pid) {
					var param = {
							page_type_id : 1
						},
						routParams = $routeParams;

					$.extend(routParams,param)

					location.href = '#/page/edit/'+ pid +'?' + $.param(routParams);
				}

				// 导出url
				$scope.outUrl = function(e){
				    e.preventDefault();

				    var ids = Common.getChecksValue('check');

				    if(ids == ''){
				        alert('请选择要导出url的MZT！');
				        return
				    }

				    window.open(getApi('exportsUrl') + '?ids=' + ids.join('_'));
				}


				$scope.pullAutoSyncSwitch = function (specialId,$event) {
				    var target = $event.target,
				        $target = $(target),
				        act = $target.attr('data-action'),
				        opposite = act == 'open' ? 'close' : 'open';

				    $scope.pullToSwitch(specialId, act, function () {
				        $target.attr('data-action', opposite);

				        if(opposite == 'open'){
				            $target.removeClass('swithBtnOpen');
				            $target.addClass('swithBtnClose');
				        }else {
				            $target.removeClass('swithBtnClose');
				            $target.addClass('swithBtnOpen');
				        }
				    } )
				}

				$scope.pullToSwitch = function (specialId,act,fn) {
				    Special.pullAutoSyncSwitch({
				        act : act,
				        specialId : specialId
				        },function (data) {
				        if(data.result){
				            if(fn){
				                fn();
				            }
				        }else{
				            alert('接口错误');
				        }
				    })
				}

				$scope.toggleShowPage = function (publish) {
					var display = publish.display == 0 ? 1 : 0;

					// Special.updateDisplay({
					//         "child_page_id" : publish.id,
					//         "display" : display
					//     },function (res) {
					//         if(res.result){
					//             publish.display = res.data;
					//         }else{
					//             alert(res.msg);
					//         }
					// })
					//

					Index.updateStatus({
					        "child_page_id" : publish.id,
					        "display" : display
					    },function (data) {
					        if(data.result){
					            publish.display = data.data;
					        }else{
					            for(var key in data.data){
					                if(key){
					                    alert(data.data[key]);
					                    break;
					                }
					            }
					        }
					})
				}

				$scope.toggleBatchShowPage = function (type) {
					var ids = Common.getChecksValue('check'),
						display = type == 'left' ? 0 : 1;

					if(ids.length == 0){
					    alert('请选择要修改的子页面！');
					    return
					}

					// 检查是否可以上报
					Index.checkRelease({
					    childPageIds : ids.join(',')
					    },function (data) {
					    if(data.result){
					    	$scope.toggleRadioBtn = type;

					    	// 上报
					        Index.indexBatchEdit({
					        	childPageIds : ids.join(','),
					        	display : display
					        },function (data) {
					            if(data.result){
					                alert(data.msg);

					                angular.forEach($scope.special.children, function(value, key){
					                	if(ids.indexOf(value.id) > -1){
					                		value.display = display;
					                	}
					                });

					            }else{
					                alert(data.msg);
					            }

					            $scope.toggleRadioBtn = '';
					        });
					    }else{
					        if(data.code == 109){
					            var data = data.data;
					            for(var key in data){
					                if(key){
					                    for(var k in data[key]){
					                        alert(data[key][k]);
					                        return
					                    }
					                }
					            }
					        }else{
					            alert(data.msg);
					        }
					    }
					})
				}

				//MZT组设置 确认修改 按钮
				$scope.mstSet_vreRule = function() {
					$scope.vre_names_entrance_checks = [];

					$('input:checkbox[name="mstSet_vreRule"][value]').each(function(i) {
						if (this.checked) {
							$scope.vre_names_entrance_checks.push(1);
						}else{
							$scope.vre_names_entrance_checks.push(0);
						}
					});


					var cdi_type_status_list = {};

					for (var i = 0; i < $scope.vre_names_entrance_checks.length; i++) {
						cdi_type_status_list[$scope.vre_names_cdi[i]] = $scope.vre_names_entrance_checks[i];
					};

					Special.setVreStatus({
						"special_id": $scope.special_id,
						"cdi_type_status_list": cdi_type_status_list
					},function(data){

						if (data.code == 1) {
							alert("修改成功");
						}
					});
				}

				//确定筛选
				$scope.select_confirm = function(name) {
					var sName = name;
					$scope.sName = name;
					$scope.selections[sName] = [];

					$('input:checkbox[name = ' + sName + '][value]').each(function(i) {
						if (this.checked) {
							$scope.selections[sName].push(this.value);
						}
					});
					//console.log($scope.selections[sName]);
					angular.forEach($scope.special.children, function(value, key) {
						if ($scope.selections[sName].indexOf(value[sName]) >= 0) {
							//console.log(value.rule_name);
							$scope.special.children[key].check = true;
						} else {
							$scope.special.children[key].check = false;
						}
					});
				}

				$scope.selectAll = function(chkall){
					if(chkall == true){
						angular.forEach($scope.special.children, function(value, key) {
							$scope.special.children[key].check = true;
						});
					} else {
						angular.forEach($scope.special.children, function(value, key) {
							$scope.special.children[key].check = false;
						});
					}
				}


				//按用户群筛选子页面
				$scope.filter_rule = function(publish) {
					if ($scope.selections.rule_name.length) {
						if ($scope.selections.rule_name.indexOf(publish.rule_name) >= 0) {
							return publish;
						}
					} else {
						return publish;
					}
				}
				//按分仓筛选子页面
				$scope.filter_warehouse = function(publish) {
					if ($scope.selections.warehouse.length) {
						if ($scope.selections.warehouse.indexOf(publish.warehouse) >= 0) {
							return publish;
						}
					} else {
						return publish;
					}
				}
				//按分销售类型选子页面
				$scope.filter_sale = function(publish) {
					if ($scope.selections.sale_type.length) {
						if ($scope.selections.sale_type.indexOf(publish.sale_type) >= 0) {
							return publish;
						}
					} else {
						return publish;
					}
				}

		}]);
	}
})



