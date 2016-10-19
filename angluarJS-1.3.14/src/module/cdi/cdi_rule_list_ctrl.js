'use strict';

define(function(require, exports, module) {
    module.exports = function(app) {
        require('common/directive/timepicker')(app);
        require('common/directive/checkbox')(app);
        require('common/directive/crumb')(app);
        require('common/directive/popup')(app);
        require('common/service/cdi')(app);
        require('common/service/common')(app);

        require('bower_component/jquery-ui/themes/smoothness/jquery-ui.min.css');
        require('bower_component/jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.min.css');

        app.register.controller('CdiRuleCtrl', ['$scope', '$http', '$rootScope', 'Cdi', 'Common', 'getApi', function($scope, $http, $rootScope, Cdi, Common, getApi){
                $scope.pageChanged = function (newPageNumber) {
                    $scope.newPageNumber = newPageNumber;
                    $scope.rules = Cdi.getCdiRuleList({
                        "page" : newPageNumber,
                        "filter_name" : $scope.filtText
                        } , function () {
                    });
                }

                $scope.pageChanged(1);

                $scope.delete = function () {
                    var ids = Common.getChecksValue('check');

                    Cdi.deleteCdiRule( { rule_ids : ids} ,function (data) {
                        if(data.result){
                            alert(data.msg);
                            $scope.pageChanged($scope.curPage);
                        }else{
                            alert(data.msg);
                        }
                    });

                    $scope.popDelOpen = false;
                }

                $scope.preDelete = function () {
                    var ids = Common.getChecksValue('check');

                    if(ids == ''){
                        alert('请选择要删除的用户群');
                        return;
                    }

                    $scope.popDelOpen = true;
                }

                // 弹出层
                $scope.showPopup = function (id) {
                    if(id){
                        $scope.rule = Cdi.getCdiRuleInfo({rule_id : id},function () {
                            initData();
                        })
                    }else{
                        $scope.rule = {
                            rule_id : '',
                            rule_name : '',
                            user_group : [],
                            begin_time : '',
                            end_time : '',
                            action : '',
                            enabled : 1
                        };

                        initData();
                    }

                    $scope.popupOpen = true;
                }

                function initData() {
                    // 获取用户群列表
                    $scope.rule.userGroup = Cdi.getUserGroupList({},function () {
                        $scope.rule.curUserGroup = {
                            id : $scope.rule.user_group_id,
                            name :  $scope.rule.user_group_name
                        };
                    });

                    // 提交表单处理
                    $scope.rule.postData = function () {
                        var data = {
                                rule_id : $scope.rule.rule_id,
                                rule_name : $scope.rule.rule_name,
                                user_group : $scope.rule.curUserGroup.id,
                                begin_time : $scope.rule.begin_time,
                                end_time : $scope.rule.end_time,
                                action : $scope.rule.action,
                                enabled : $scope.rule.enabled,
                            };

                        if(data.rule_id){
                            Cdi.editCdiRule( data ,function (data) {
                                dealData(data);
                            })
                        }else{
                            Cdi.addCdiRule( data ,function (data) {
                                dealData(data);
                            })
                        }

                        function dealData (data) {
                            if(data.result){
                                alert(data.msg);

                                if($scope.rule.id){
                                    $scope.pageChanged($scope.curPage);
                                }else{
                                    $scope.pageChanged(1);
                                }

                                $scope.popupOpen = false;
                            }else{
                                alert(data.msg);
                            }
                        }
                    }
                }

                $scope.$on('clickBody', function(){
                    $rootScope.toggleDrop(window.event,$scope.rule,'popAdminSelect');
                });
        }])
    }

})

