'use strict';

define(function(require, exports, module) {
    module.exports = function(app) {
        require('common/service/component')(app);
        require('common/service/common')(app);

        app.register.controller('ComponentCreateCtrl', ['$scope', '$http', '$rootScope', '$routeParams' , 'Component', 'Common', 'getApi', function($scope, $http, $rootScope , $routeParams , Component, Common, getApi){

                $scope.cates = Component.getStyleCate(function () {});

                $scope.$on('clickBody', function(){
                    $scope.isDropStyleCate = false;
                });

                // 修改相关逻辑
                var id = $routeParams.id;

                if(id){
                    $scope.component = Component.getComponentInfo({"id" : id},function () {
                        $scope.curStyleCate = {
                            id : $scope.component.style_cate_id ,
                            name : $scope.component.style_cate_name
                        };

                        $scope.component.common = $scope.component.is_common;
                    })
                }else{
                    $scope.component = {
                        name : '',
                        is_common : ''
                    }
                    $scope.curStyleCate = {
                        id : ''
                    }
                }

                function dealData (data) {
                    if(data.result){
                        alert(data.msg);

                        location.href = '#/component/list';
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
                            name : $scope.component.name,
                            style_cate_id : $scope.curStyleCate.id,
                            is_common : $scope.component.is_common
                        }

                    if(id){
                        data.id = id;

                        Component.edit( data ,function (data) {
                            dealData(data);
                        })
                    }else{
                        Component.add( data ,function (data) {
                            dealData(data);
                        })
                    }
                }

        }])
    }
})
