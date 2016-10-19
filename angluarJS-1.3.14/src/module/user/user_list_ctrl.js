'use strict';

define(function(require, exports, module) {
	module.exports = function(app) {
        require('common/directive/checkbox')(app);
        require('common/directive/crumb')(app);
        require('common/directive/popup')(app);
        require('common/service/user')(app);
        require('common/service/common')(app);

		app.register.controller('UserListCtrl', function($scope, $http, $rootScope, User , Common, getApi,$templateCache){

                $scope.pageChanged = function (newPageNumber, refresh) {
                    if ($scope.curPage != newPageNumber || refresh) {
                        $scope.curPage = newPageNumber;
                        $scope.users = User.getList({
                            "page": newPageNumber,
                            "filter_name": $scope.filtText
                        }, function() {});
                    }
                }

                $scope.pageChanged(1,true);

                $scope.delete = function () {
                    var ids = Common.getChecksValue('check');

                    User.delete({ ids : ids},function  (data) {
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
                        alert('请选择要删除的用户！');
                        return;
                    }

                    $scope.popDelOpen = true;
                }

                $scope.showPopup = function (id) {
                    //console.log($scope);
                    if(id){
                        $scope.user = User.getUserInfo({"id" : id},function () {
                            $scope.user.id = id;

                            // $scope.user.curDepart = {
                            //     id : $scope.user.department_id ,
                            //     name : $scope.user.department_name
                            // };

                            $scope.user.curRole = {
                                ids : $scope.user.role_ids ,
                                name : $scope.user.role_name
                            };

                            initData();
                        });
                    }else{
                        $scope.user = {
                            name : ''
                        };

                        $scope.curRole = {
                            ids : '',
                            name : ''
                        }

                        initData();
                    }

                    $scope.popupOpen = true;
                }

                function initData() {
                    $scope.user.roles = User.getRoles(function() {
                        if ($scope.user.id) {
                            angular.forEach($scope.user.roles, function(value, key) {
                                angular.forEach($scope.user.curRole.ids, function(v, k) {
                                    if (value.id == v) {
                                        value.check = true;
                                    }
                                });
                            });
                        }
                        $scope.initCheckAll('role');
                    });
                    console.log($scope);
                    // $scope.user.departs = User.getDepartList(function () {});
                    $scope.user.clients = User.getClients(function () {
                        if($scope.user.id){
                            angular.forEach($scope.user.clients, function(value, key){
                                if($scope.user.client_ids.split(',').indexOf(value.id) > -1){
                                    value.check = true;
                                }
                            });

                            $scope.initCheckAll('client');
                        }
                    });

                    $scope.user.postData = function () {
                        var data = {
                                name : $scope.user.username,
                                role_ids: []
                            }

                        $('input:checkbox[name=role][value]').each(function (i) {
                            if(this.checked){
                                data.role_ids.push(this.value);
                            }
                        });
                        data.role_ids = data.role_ids.join(',');

                        //console.log(data);

                        if($scope.user.id){
                            data.id = $scope.user.id;
                            User.edit( data ,function (data) {
                                dealData(data);
                            })
                        }else{
                            User.add( data ,function (data) {
                                dealData(data);
                            })
                        }

                        function dealData (data) {
                            if(data.result){
                                alert(data.msg);

                                if($scope.user.id){
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
                    $rootScope.toggleDrop(window.event,$scope.user,'popAdminSelect');
                });
		})
	}
});
