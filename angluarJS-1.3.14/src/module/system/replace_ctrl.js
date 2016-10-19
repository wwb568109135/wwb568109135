'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {
        require('common/service/system')(app);

		app.register.controller('replaceFileCtrl', ['$scope', '$http', '$rootScope', '$location', '$routeParams', '$rootElement', 'FileUploader', '$timeout','System',

			function($scope, $http, $rootScope, $location, $routeParams, $rootElement, FileUploader,$timeout, System){


                $scope.postData = function () {
                    if($scope.path && $scope.txt){
                        System.pullRepalceFile({
                                path : $scope.path,
                                txt : $scope.txt,
                            },function (data) {
                                if(data.code == 1 ){
                                    alert(data.msg);                                    
                                }else{
                                    alert('替换失败');
                                }
                            });    
                    }else{
                        alert('路径和内容都必填！');
                    }
                    
                }

        }])
    }



})

