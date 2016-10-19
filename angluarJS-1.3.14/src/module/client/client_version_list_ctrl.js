'use strict';

define(function(require, exports, module) {
    module.exports = function(app) {
        require('common/directive/checkbox')(app);
        require('common/directive/crumb')(app);
        require('common/directive/popup')(app);
        require('common/service/client')(app);
        require('common/service/common')(app);

        app.register.controller('ClientVersionListCtrl', function($scope, $http, $rootScope, Client , Common, getApi,$templateCache){

                $scope.pageChanged = function (newPageNumber) {
                    $scope.curPage = newPageNumber;
                    $scope.versions = Client.getClientVersionList({
                        "page" : newPageNumber,
                        "filter_name" : $scope.filtText
                        } , function () {
                    });
                }

                $scope.pageChanged(1);

                $scope.delete = function () {
                    var ids = Common.getChecksValue('check');

                    Client.deleteVersion({ ids : ids},function  (data) {
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
                        alert('请选择要删除的客户端版本号！');
                        return;
                    }

                    $scope.popDelOpen = true;
                }

                $scope.showPopup = function (id) {
                    if(id){
                        $scope.version = Client.getClientVersionInfo({"id" : id},function () {
                            $scope.version.id = id;

                            $scope.version.curClient = {
                                id : $scope.version.client_id ,
                                name : $scope.version.client_name
                            };

                            $scope.version.curPlatform = {
                                id : $scope.version.platform_id ,
                                name : $scope.version.platform_name
                            };

                            initData();
                        });
                    }else{
                        $scope.version = {
                            name : '',
                            code : ''
                        };

                        $scope.curClient = {
                            name : '',
                            id : ''
                        };

                        $scope.curPlatform = {
                            name : '',
                            id : ''
                        };
                        initData();
                    }

                    $scope.popupOpen = true;
                }

                function initData() {
                    $scope.version.clients = Client.getClients(function () {});
                    $scope.version.platforms = Client.getPlatform(function () {});

                    $scope.version.postData = function () {
                        var data = angular.fromJson(angular.toJson($scope.version));

                        data.client_id = $scope.version.curClient.id;
                        data.platform_id = $scope.version.curPlatform.id;

                        if($scope.version.id){
                            Client.editVersion( data ,function (data) {
                                dealData(data);
                            })
                        }else{
                            Client.addVersion( data ,function (data) {
                                dealData(data);
                            })
                        }

                        function dealData (data) {
                            if(data.result){
                                alert(data.msg);

                                if($scope.version.id){
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

                $scope.$on('clickBody', function(){
                    $rootScope.toggleDrop(window.event,$scope.version,'popAdminSelect');
                });
        })
    }
});
