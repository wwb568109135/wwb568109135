'use strict';

define(function(require, exports, module) {
    module.exports = function(app) {
        require('common/directive/checkbox')(app);
        require('common/directive/crumb')(app);
        require('common/directive/popup')(app);
        require('common/service/client')(app);
        require('common/service/common')(app);

        app.register.controller('ClientListCtrl', function($scope, $http, $rootScope, Client , Common, getApi,$templateCache){

                $scope.pageChanged = function (newPageNumber) {
                    $scope.curPage = newPageNumber;
                    $scope.clients = Client.getList({
                        "page" : newPageNumber,
                        "filter_name" : $scope.filtText
                        } , function () {
                    });
                }

                $scope.pageChanged(1);

                $scope.delete = function () {
                    var ids = Common.getChecksValue('check');

                    Client.delete({ ids : ids},function  (data) {
                        if(data.result){
                            alert(data.msg);
                            $scope.pageChanged($scope.curPage);
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
                        alert('请选择要删除的客户端！');
                        return;
                    }

                    $scope.popDelOpen = true;
                }

                $scope.showPopup = function (id) {
                    if(id){
                        $scope.client = Client.getClientInfo({"id" : id},function () {
                            $scope.client.id = id;

                            initData();
                        });
                    }else{
                        $scope.client = {
                            name : '',
                            code : ''
                        };
                        initData();
                    }

                    $scope.popupOpen = true;
                }

                function initData() {
                    $scope.client.postData = function () {
                        var data = angular.fromJson(angular.toJson($scope.client));

                        if($scope.client.id){
                            Client.edit( data ,function (data) {
                                dealData(data);
                            })
                        }else{
                            Client.add( data ,function (data) {
                                dealData(data);
                            })
                        }

                        function dealData (data) {
                            if(data.result){
                                alert(data.msg);

                                if($scope.client.id){
                                    $scope.pageChanged($scope.curPage);
                                }else{
                                    $scope.pageChanged(1);
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
        })
    }
});
