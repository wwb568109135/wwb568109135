'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {
		require('common/service/style')(app);
		require('common/service/common')(app);
		require('common/directive/checkbox')(app);
		require('common/directive/pager')(app);
		require('common/directive/popupImg')(app);
		require('common/directive/popup')(app);
		require('common/directive/crumb')(app);

		app.register.controller('StyleListCtrl', ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'Style', 'Common', 'getApi',

			function($scope, $http, $rootScope, $location, $routeParams, Style, Common, getApi){

				$scope.pageChanged = function (newPageNumber) {
					$scope.newPageNumber = newPageNumber;
				    $scope.style = Style.getStyleList({
				        "page" : newPageNumber,
				        "style_cate_id" : $scope.curType ? $scope.curType.id : '',
				        "is_default" : $scope.curDefault ? $scope.curDefault.id : '',
				        "filter_name" : $scope.filtText
				        } , function () {
				    });
				}

				$scope.pageChanged(1);

				$scope.delete = function () {
				    var ids = Common.getChecksValue('check');

				    Style.delete({ ids : ids},function  (data) {
		        		if(data.result){
		            		alert(data.msg);

		            		//删除view数据
		            		$scope.pageChanged($scope.newPageNumber);
		            	}else{
		            		alert(data.msg);
		            	}

				        $scope.popDelOpen = false;
				    })
				}

				$scope.preDelete = function () {
				    var ids = Common.getChecksValue('check');

				    if(ids == ''){
				        alert('请选择要删除的样式组！');
				        return;
				    }

				    $scope.popDelOpen = true;
				}

				$scope.cates = Style.getStyleCate(function () {
					var cate = {
						id : '',
						name : "下拉选择样式组分类"
					};

					$scope.cates.unshift(cate);
					$scope.curType = $scope.cates[0];
				});

				$scope.defaults = [{
					"id" : '',
					"name" : "下拉选择是否默认"
				},{
					"id" : 1,
					"name" : "是"
				},{
					"id" : 0,
					"name" : "否"
				}]

				$scope.curDefault = $scope.defaults[0];

				$scope.setSelectValue = function (key,value) {
				    $scope[key] = value;
				}

				$scope.$on('clickBody', function(){
                    $rootScope.toggleDrop(window.event,$scope,'tableXl');
                });
				// var $scope.publishs = .data;
		}]);
	}



})

