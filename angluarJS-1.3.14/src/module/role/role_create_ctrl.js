'use strict';

define(function(require, exports, module) {
    module.exports = function(app) {
        require('common/service/role')(app);
        require('common/service/common')(app);
        require('common/directive/checkbox')(app);

        app.register.controller('RoleCreateCtrl', function($scope, $http, $rootScope, $routeParams , Role, Common, getApi){
            var id = $routeParams.id;

            if(id){
                $scope.role = Role.getRoleInfo({"id" : id},function () {
                    $scope.role.name = $scope.role.roleInfo.name;
                    $scope.types = $scope.role.actList;

                    // console.log($scope);

                    angular.forEach($scope.types, function(value, key){
                        $scope.initCheckAll('check' + key);
                    });
                })

            }else{
                $scope.role = {
                    name : ''
                };

                $scope.types = Role.getPermissions(function () {
                });
            }

            function dealData (data) {
                if (data.result) {
                    alert(data.msg);
                    window.location.href = "#/role/list";
                }else{
                    alert(data.msg);
                }
            }

            $scope.postData = function () {
                var data = {
                        name : $scope.role.name,
                        roleActs : []
                    };

                $('input:checkbox[value]').each(function (i) {
                    if(this.checked){
                        data.roleActs.push(this.value);
                    }
                });

                if(id){
                    data.id = id;
                    Role.edit( data ,function (data) {
                        dealData(data);
                    })
                }else{
                    Role.add( data ,function (data) {
                        dealData(data);
                    })
                }
            }
        })
    }
})

