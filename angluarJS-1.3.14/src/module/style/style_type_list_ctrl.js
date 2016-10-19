'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {
		require('common/service/style')(app);
		require('common/directive/checkbox')(app);
		require('common/directive/pager')(app);

		app.register.controller('styleListCtrl', ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'Style',

			function($scope, $http, $rootScope, $location, $routeParams, Style){

				$scope.style = Style.getStyleList(function () {
					$scope.pageChanged = function (newPageNumber) {
					    $scope.styles = Style.getStyleList({
					        "page" : newPageNumber,
					        "filter_name" : $scope.filtText
					        } , function () {
					    });
					}

					$scope.pageChanged(1);

					angular.forEach($scope.lists,function(element, index){
						element.check = false;
					});

					function getChecks() {
						var ids = '';

						$('input:checked[value]').each(function (i) {
							ids += this.value + '_';
						})

						return ids.substring(0,ids.length - 1);
					}

					$scope.deleteStyle = function () {
						var ids = getChecks();

						if(ids == ''){
							alert('请选择要删除的子页面');
							return;
						}

						var transFn = function(data) {
							// console.log($.param(data));
						    return $.param(data);
						},
						postCfg = {
						    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
						    ,transformRequest: transFn
						};

						/**
						 * 删除子页面
						 * ids 要删除的id数组
						 *
						 * @type {[type]}
						 */
						ids = ids.split('_');

						$http.post('/api/deleteStyle.json', {
							ids : ids
						}, postCfg)
					    .success(function(data){
					    	if(data.result){
					    		alert(data.msg);

					    		//删除view数据
					    		angular.forEach(ids,function(id, i){
					    			angular.forEach($scope.lists,function(list, index){
					    				if(id == list.id){
					    					$scope.lists.splice(index,1);
					    				}
					    			});
					    		});
					    	}else{
					    		alert(data.msg);
					    	}
					    });
					}

				});

				$scope.types = Style.getStyleTypes(function () {

				});

				$scope.defaults = [{"name" : "是"},{"name" : "否"}]

				$scope.setSelectValue = function (key,value) {
				    $scope[key] = value;
				}

				$scope.$on('clickBody', function(){
                    $scope.isDropType = false;
                    $scope.isDropDefault = false;
                });

                $scope.doSearch = function () {
                    $scope.lists = Style.getStyleFiltList({"text" : $scope.filtText}, function () {

                    });
                }

				// var $scope.publishs = .data;
		}]);
	}



})

