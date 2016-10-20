"use strict";

/**
 * 程序主入口
 */
define(function(require, exports, module) {

    var appConfig = angular.module('appConfig', ['ngResource']),
        envConfig = require('common/config'),
        env = envConfig['env'],
        host = envConfig['host'][env],
        apiList = envConfig['api'][env],
        flag = false;

    appConfig.run(['$rootScope', '$location','$http',
        function($rootScope, $location,$http) {
            $rootScope.toIndex = function(){
                $location.url('/');
            }

            $rootScope.searchKeyUp = function (event,pageScope,fn) {
                if(event.keyCode == 13){
                    pageScope[fn]();
                }
            }

            $rootScope.toggleShow = function(e,name){
                e.stopPropagation()
                $rootScope[name] = !$rootScope[name];
            }

            $rootScope.setSepcialFlowInfo = function (sid,tid,pid,scope) {
                scope.specialId = sid;
                scope.pageTypeId = tid;
                scope.parentId = pid;
            }

            $rootScope.$on('clickBody',function () {
                $rootScope.isSysShow = false;
                $rootScope.isToplistShow = false;
                $rootScope.isNoticeBoardShow = false;
            });

            // 获取用户数据
            $rootScope.getUserInfo = function () {
                $http.get('admin.php/user/getLoginedInfo').
                    success(function(data, status, headers, config) {
                        if(data.result){
                            $('#Jusername').html(data.data.username)
                        }else{
                            // alert('获取用户数据错误！')
                        }
                    });
            }

            $rootScope.toggleDrop = function (e,$scope,className) {
                var $drops = $('.'+ className +'[drop-name]');

                $.each($drops,function (key,value) {
                    var name = value.getAttribute('drop-name');

                    // console.log($scope[name]);
                    if($scope){
                        if(e.target != value){
                            $scope[name] = false;
                        }else {
                            $scope[name] = !$scope[name];
                        }
                    }
                })
            }

            $rootScope.getUserInfo();

            // 新增全局返回顶部功能
            $(window).bind('scroll',function () {
                var rocket = $('.rocket'),
                    st = document.body.scrollTop;

                if(st > 500){
                    rocket.fadeIn();
                }else {
                    rocket.fadeOut();
                }
            })

        }
    ]);

    appConfig.config(['$httpProvider', function($httpProvider){
    	$httpProvider.interceptors.push(function($rootScope) {
    	  return {
    	    'request': function(config) {
    	   		$rootScope.loading = true;
    	    	return config;
    	    },

    	    'response': function(response) {
                var data = response.data;

                if(data && response.config.url.indexOf('admin.php') > -1 && !flag){
                    // console.log(response)
                    if(!data.result) {
                        if(data.code == 101){
                            // alert('请先登录！');
                            // location.href = data.data.url;
                            flag = true;
                        }
                    }
                }

                $rootScope.loading = false;
                return response

    	    }
    	  };
    	});
    }]).

    factory('getApi', [function(){
        return function(api){
            if(!api) return false;
            return host + apiList[api];
        }
    }]);

    module.exports = appConfig;
});
