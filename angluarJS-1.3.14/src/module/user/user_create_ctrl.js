'use strict';

define(function(require, exports, module) {
    module.exports = function(app) {
        require('common/service/user')(app);
        require('common/service/common')(app);
        require('common/directive/checkbox')(app);

        app.register.controller('UserCreateCtrl', ['$scope', '$http', '$rootScope', '$routeParams' , 'Common', 'getApi', 'User', function($scope, $http, $rootScope , $routeParams , Common, getApi, User){
                //初始化数据

                // 修改相关逻辑
                var id = $routeParams.id;

                if(id){
                    $scope.user = User.getUserInfo({"id" : id},function () {
                        $scope.setSelectValue('curDepart',{
                            id : $scope.user.department_id ,
                            name : $scope.user.department_name
                        });

                        $scope.setSelectValue('curRole',{
                            id : $scope.user.role_id ,
                            name : $scope.user.role_name
                        });

                        initData();
                    });
                }else{
                    $scope.user = {
                        name : ''
                    }
                    $scope.curRole = {
                        id : '',
                        name : ''
                    }
                    initData();
                }

                function initData() {
                    $scope.roles = User.getRoles(function () {});
                    $scope.departs = User.getDepartList(function () {});
                    $scope.clients = User.getClients(function () {
                        if(id){
                            angular.forEach($scope.clients, function(value, key){
                                if($scope.user.client_ids.split(',').indexOf(value.id) > -1){
                                    value.check = true;
                                }
                            });
                        }
                    });
                }

                $scope.$on('clickBody', function(){
                    $scope.isDropRole = false;
                    $scope.isDropDepart = false;
                });

                $scope.setSelectValue = function (key,value) {
                    $scope[key] = value;
                }

                function dealData (data) {
                    if(data.result){
                        alert(data.msg);

                        location.href = '#/user/list';
                    }else{
                        if (data.code == 103) {
                            alert("您没有权限执行此项操作！");
                        }else{
                            alert(data.msg);
                        }

                    }
                }

                $scope.postData = function () {
                    var data = {
                            name : $scope.user.username,
                            role_id : $scope.curRole.id,
                            client_ids : []
                        }

                    $('input:checkbox[name=client][value]').each(function (i) {
                        if(this.checked){
                            data.client_ids.push(this.value);
                        }
                    });

                    data.client_ids = data.client_ids.join(',');

                    if(id){
                        data.id = id;
                        User.edit( data ,function (data) {
                            dealData(data);
                        })
                    }else{
                        User.add( data ,function (data) {
                            dealData(data);
                        })
                    }
                }

        }])
    }
})
