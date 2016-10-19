'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {
		require('common/service/style')(app);
		require('common/service/common')(app);
		require('common/directive/checkbox')(app);
		require('common/directive/pager')(app);
		require('common/directive/crumb')(app);
		require('common/directive/popup')(app);

		app.register.controller('StyleCateListCtrl', ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'Style', 'Common', 'getApi',

			function($scope, $http, $rootScope, $location, $routeParams, Style, Common,getApi){

				$scope.pageChanged = function (newPageNumber) {
					$scope.newPageNumber = newPageNumber;
				    $scope.style = Style.getStyleCateList({
				        "page" : newPageNumber,
				        "filter_name" : $scope.filtText
				        } , function () {
				    });
				}

				$scope.pageChanged(1);

				$scope.delete = function () {
				    var ids = Common.getChecksValue('check');

				    Style.deleteCate({ ids : ids},function  (data) {
				        if(data.result){
				    		alert(data.msg);

				    		//删除view数据
				    		$scope.pageChanged($scope.newPageNumber);
				    	}else{
				    		alert(data.msg);
				    	}
				    });

				    $scope.popDelOpen = false;
				}

				$scope.preDelete = function () {
				    var ids = Common.getChecksValue('check');

				    if(ids == ''){
				        alert('请选择要删除的样式组分类！');
				        return;
				    }

				    $scope.popDelOpen = true;
				}

				$scope.showPopup = function (id) {
				    if(id){
				        $scope.cate = Style.getStyleCateInfo({"id" : id},function () {
				        	initData();
				        })
				    }else{
				        $scope.cate = {
				            style_cate_code : '',
				            name : ''
				        }

				        initData();
				    }

				    $scope.popupOpen = true;
				}

				function initData() {
				    $scope.cate.postData = function () {
				        var data = angular.fromJson(angular.toJson($scope.cate));

				        if(data.id){
				            Style.editCate( data ,function (data) {
				                dealData(data);
				            })
				        }else{
				            Style.addCate( data ,function (data) {
				                dealData(data);
				            })
				        }

				        function dealData (data) {
				            if(data.result){
				                alert(data.msg);

				                if($scope.cate.id){
				                    $scope.pageChanged($scope.curPage);
				                }else{
				                    $scope.pageChanged(1);
				                }

				                $scope.popupOpen = false;
				            }else{
				                alert(data.msg);
				            }
				        }
				    }
				}
		}]);
	}



})

