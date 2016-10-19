'use strict';

define(function(require, exports, module) {
    module.exports = function(app) {
        require('common/directive/checkbox')(app);
        require('common/directive/crumb')(app);
        require('common/directive/popup')(app);
        require('common/service/role')(app);
        require('common/service/common')(app);

        app.register.controller('RoleListCtrl', ['$scope', '$http', '$rootScope', 'Role', 'Common', 'getApi', function($scope, $http, $rootScope, Role, Common, getApi){
                $scope.pageChanged = function (newPageNumber , refresh) {
                    if($scope.newPageNumber != newPageNumber || refresh) {
                        $scope.newPageNumber = newPageNumber;
                        $scope.roles = Role.getRoleList({
                            "page" : newPageNumber,
                            "filter_name" : $scope.filtText
                            } , function () {
                        });
                    }
                }

                $scope.pageChanged(1,true);

                $scope.checkUserInRole = function () {
                    var data = Role.getUserInRole({ ids : Common.getChecksValue('check')},function () {
                        if(data.code == 105){
                            $scope.popRoleOpen = true;
                            $scope.popDelOpen = false;
                        }else{
                            $scope.delete();
                        }
                    })
                }

                $scope.delete = function () {
                    var ids = Common.getChecksValue('check');

                    Role.delete( { ids : ids} ,function (data) {
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
                    });

                    $scope.popDelOpen = false;
                }

                $scope.preDelete = function () {
                    var ids = Common.getChecksValue('check');

                    if(ids == ''){
                        alert('请选择要删除的角色');
                        return;
                    }

                    $scope.popDelOpen = true;
                }

                $scope.showPopup = function (id) {
                    if(id){
                        $scope.role = Role.getRoleInfo({"id" : id},function () {
                            $scope.role.name = $scope.role.name;
                            initData();
                        })

                    }else{
                        $scope.role = {
                            name : ''
                        };
                        initData();
                    }

                    $scope.popupOpen = true;
                }

                function initData() {
                    $scope.role.clients = Role.getClients(function () {
                        if($scope.role.id){
                            angular.forEach($scope.role.clients, function(value, key){
                                angular.forEach($scope.role.client_ids, function(v, k){
                                    if(value.id == v){
                                        value.check = true;
                                    }
                                });
                            });
                            $scope.initCheckAll('client');
                        }
                    });
                    $scope.role.specials = Role.getSpecialCategories(function () {
                        if($scope.role.id){
                           angular.forEach($scope.role.specials, function(value, key){
                                angular.forEach($scope.role.spl_cate_ids, function(v, k){
                                    if(value.id == v){
                                        value.check = true;
                                    }
                                });
                            });
                            $scope.initCheckAll('special');
                        }
                    });
                    $scope.role.postData = function () {
                        var data = {
                                name : $scope.role.name,
                                client_ids : [],
                                spl_cate_ids: []
                            };

                        $('input:checkbox[name = client][value]').each(function (i) {
                            if(this.checked){
                                data.client_ids.push(this.value);
                            }
                        });
                        $('input:checkbox[name = special][value]').each(function (i) {
                            if(this.checked){
                                data.spl_cate_ids.push(this.value);
                            }
                        });
                        data.client_ids = data.client_ids.join(',');
                        data.spl_cate_ids = data.spl_cate_ids.join(',');
                        //console.log($scope);
                        if($scope.role.id){
                            data.id = $scope.role.id;
                            Role.edit( data ,function (data) {
                                dealData(data);
                            })
                        }else{
                            Role.add( data ,function (data) {
                                dealData(data);
                            })
                        }

                        function dealData (data) {
                            if(data.result){
                                alert(data.msg);
                                if($scope.role.id){
                                    $scope.pageChanged($scope.newPageNumber, true);
                                }else{
                                    $scope.pageChanged(1, true);
                                }

                                $scope.popupOpen = false;
                            }else{
                                alert(data.msg);
                            }
                        }
                    }
                }
        }])
    }

})

