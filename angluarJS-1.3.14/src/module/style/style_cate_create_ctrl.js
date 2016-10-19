'use strict';

define(function(require, exports, module) {
    module.exports = function(app) {
        require('common/service/style')(app);
        require('common/service/common')(app);

        app.register.controller('StyleCateCreateCtrl', ['$scope', '$http', '$rootScope', '$routeParams' , 'Style', 'Common', 'getApi', function($scope, $http, $rootScope , $routeParams , Style, Common , getApi){
                // 修改相关逻辑
                var id = $routeParams.id;

                if(id){
                    $scope.cate = Style.getStyleCateInfo({"id" : id},function () { })
                }else{
                    $scope.cate = {
                        style_cate_code : '',
                        name : ''
                    }
                }

                function dealData (data) {
                    if(data.result){
                        alert(data.msg);

                        location.href = '#/style/cate/list';
                    }else{
                        if (data.code == 103) {
                            alert("您没有权限执行此项操作！");
                        }else{
                            alert(data.msg);
                        }

                    }
                }

                $scope.postData = function () {
                    var data = angular.fromJson(angular.toJson($scope.cate));

                    if(id){
                        Style.editCate( data ,function (data) {
                            dealData(data);
                        })
                    }else{
                        Style.addCate( data ,function (data) {
                            dealData(data);
                        })
                    }
                }

        }])
    }
})
