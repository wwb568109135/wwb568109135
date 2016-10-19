'use strict';

define(function(require, exports, module) {
	module.exports = function(app) {
        require('common/directive/checkbox')(app);
        require('common/directive/crumb')(app);
        require('common/directive/popup')(app);
        require('common/service/consumer')(app);
        require('common/service/common')(app);

		app.register.controller('ConsumerListCtrl', function($scope, $http, $rootScope, Consumer , Common, getApi,$templateCache){

                $scope.pageChanged = function(newPageNumber, refresh) {
                    if ($scope.curPage != newPageNumber || refresh) {
                        $scope.curPage = newPageNumber;
                        $scope.consumers = Consumer.getList({
                            "pageNo": newPageNumber,
                            "filter_name": $scope.filtText
                        }, function() {});
                    }
                }

                $scope.pageChanged(1,true);

                $scope.delete = function () {
                    var ids = Common.getChecksValue('check');

                    Consumer.delete({ ids : ids},function  (data) {
                        if(data.result){
                            alert(data.msg);
                            $scope.pageChanged($scope.curPage, true);
                        }else{
                            if (data.code == 103) {
                                alert("您没有权限执行此项操作！");
                            }else{
                                alert(data.msg);
                            }
                        }

                        $scope.popDelOpen = false;
                    })
                }

                $scope.preDelete = function () {
                    var ids = Common.getChecksValue('check');

                    if(ids == ''){
                        alert('请选择要删除的客户类型！');
                        return;
                    }

                    $scope.popDelOpen = true;
                }

                $scope.showPopup = function (id) {
                    if(id){
                        $scope.consumer = Consumer.getConsumerInfo({"id" : id},function () {
                            $scope.consumer.id = id;

                            $scope.consumer.curDepart = {
                                id : $scope.consumer.department_id ,
                                name : $scope.consumer.department_name
                            };

                            $scope.consumer.curRole = {
                                id : $scope.consumer.role_id ,
                                name : $scope.consumer.role_name
                            };
                            $scope.consumer.curType = {
                                id : $scope.consumer.type ,
                                name : ''
                            };
                            $scope.consumer.typeList = Consumer.getConsumerType(function () {
                                angular.forEach($scope.consumer.typeList, function(value, key){
                                    if(value.id == $scope.consumer.type){
                                        $scope.consumer.curType.name = value.name;
                                    }
                                });
                            });
                            initData();
                        });
                    }else{
                        $scope.consumer = {
                            name : '',
                            code : '',
                            type: ''
                        };
                        $scope.curType = {
                            id : '',
                            name : ''
                        }
                        $scope.consumer.typeList = Consumer.getConsumerType(function (){});
                        initData();
                    }

                    $scope.popupOpen = true;
                }

                function initData() {

                    $scope.consumer.postData = function () {
                        var data = angular.fromJson(angular.toJson($scope.consumer));
                        data.type = data.curType.id;
                        if($scope.consumer.id){
                            Consumer.edit( data ,function (data) {
                                dealData(data);
                            })
                        }else{
                            Consumer.add( data ,function (data) {
                                dealData(data);
                            })
                        }

                        function dealData (data) {
                            if(data.result){
                                alert(data.msg);

                                if($scope.consumer.id){
                                    $scope.pageChanged($scope.curPage, true);
                                }else{
                                    $scope.pageChanged(1, true);
                                }

                                $scope.popupOpen = false;
                            }else{
                                if (data.code == 103) {
                                    alert("您没有权限执行此项操作！");
                                }else{
                                    alert(data.msg);
                                }
                            }
                        }
                    }
                }
                $scope.$on('clickBody', function(){
                    $rootScope.toggleDrop(window.event,$scope.consumer,'popAdminSelect');
                });
		})
	}
});
