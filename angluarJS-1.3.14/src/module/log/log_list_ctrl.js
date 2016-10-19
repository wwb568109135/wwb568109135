'use strict';

define(function(require, exports, module) {
	module.exports = function(app) {
        require('common/directive/checkbox')(app);
        require('common/directive/crumb')(app);
        require('common/directive/popup')(app);
        require('common/service/log')(app);
        require('common/service/common')(app);

		app.register.controller('LogListCtrl', function($scope, $http, $rootScope, Log , Common, getApi,$templateCache){
                $scope.curIp = {
                    id : "",
                    name : "下拉选择IP"
                };

                $scope.ips = Log.getIpList(function () {
                    $scope.ips.unshift($scope.curIp);
                });


                $scope.pageChanged = function (newPageNumber) {
                    $scope.curPage = newPageNumber;
                    $scope.logs = Log.getList({
                        "page" : newPageNumber,
                        "filter_ip_address" : $scope.curIp.id,
                        "filter_username" : $scope.filtText
                        } , function () {
                    });
                }

                $scope.pageChanged(1);

                $scope.delete = function () {
                    var ids = Common.getChecksValue('check');

                    Log.delete({ ids : ids},function  (data) {
                        if(data.result){
                            alert(data.msg);
                            $scope.pageChanged($scope.curPage);
                        }else{
                            alert(data.msg);
                        }

                        $scope.popDelOpen = false;
                    })
                }

                $scope.preDelete = function () {
                    var ids = Common.getChecksValue('check');

                    if(ids == ''){
                        alert('请选择要删除的客户类型！');
                        return;
                    }

                    $scope.popDelOpen = true;
                }

                $scope.$on('clickBody', function(){
                    $rootScope.toggleDrop(window.event,$scope,'tableXlStyleManage');
                });
		})
	}
});
