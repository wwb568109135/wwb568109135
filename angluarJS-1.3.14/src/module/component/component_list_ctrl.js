'use strict';

define(function(require, exports, module) {
	module.exports = function(app) {
		require('common/directive/checkbox')(app);
        require('common/directive/crumb')(app);
        require('common/directive/popup')(app);
		require('common/service/component')(app);
        require('common/service/common')(app);

		app.register.controller('ComponentListCtrl', ['$scope', '$http', '$rootScope', 'Component', 'Common', 'getApi', function($scope, $http, $rootScope, Component, Common, getApi){
                $scope.pageChanged = function (newPageNumber) {
                    $scope.curPage = newPageNumber;
                    $scope.components = Component.getComponentList({
                        "page" : newPageNumber,
                        "filter_name" : $scope.filtText
                        } , function () {
                    });
                }

                $scope.pageChanged(1);

                $scope.delete = function () {
                	var ids = Common.getChecksValue('check');

                    Component.delete( { ids : ids} ,function (data) {
                        if(data.result){
                            alert(data.msg);
                            $scope.pageChanged($scope.curPage);
                        }else{
                            alert(data.msg);
                        }
                    });

                    $scope.popDelOpen = false;
                }

                $scope.preDelete = function () {
                    var ids = Common.getChecksValue('check');

                    if(ids == ''){
                        alert('请选择要删除的组件！');
                        return;
                    }

                    $scope.popDelOpen = true;
                }

                $scope.showPopup = function (id) {
                    if(id){
                        $scope.component = Component.getComponentInfo({"id" : id},function () {
                            $scope.component.curStyleCate = {
                                id : $scope.component.style_cate_id ,
                                name : $scope.component.style_cate_name
                            };

                            $scope.component.common = $scope.component.is_common;

                            initData();
                        })
                    }else{
                        $scope.component = {
                            name : ''
                        };

                        $scope.curStyleCate = {
                            id : '',
                            name : ''
                        }

                        initData();
                    }

                    $scope.popupOpen = true;
                }

                function initData() {
                    $scope.component.cates = Component.getStyleCate(function () {});

                    $scope.component.postData = function () {
                        var data = {
                                name : $scope.component.name,
                                style_cate_id : $scope.component.curStyleCate.id,
                                is_common : $scope.component.is_common
                            }

                        if($scope.component.id){
                            data.id = $scope.component.id;

                            Component.edit( data ,function (data) {
                                dealData(data);
                            })
                        }else{
                            Component.add( data ,function (data) {
                                dealData(data);
                            })
                        }
                    }
                }

                function dealData (data) {
                    if(data.result){
                        alert(data.msg);

                        if($scope.component.id){
                            $scope.pageChanged($scope.curPage);
                        }else{
                            $scope.pageChanged(1);
                        }

                        $scope.popupOpen = false;
                    }else{
                        alert(data.msg);
                    }
                }

                $scope.$on('clickBody', function(){
                    $rootScope.toggleDrop(window.event,$scope.component,'popAdminSelect');
                });


		}])
	}

})

