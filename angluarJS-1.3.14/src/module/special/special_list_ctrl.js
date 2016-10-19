'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {
		require('common/service/special')(app);
		require('common/service/common')(app);
		require('common/directive/checkbox')(app);
		require('common/directive/pager')(app);
		require('common/directive/popup')(app);
		require('common/directive/crumb')(app);


		app.register.controller('SpecialListCtrl', ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'Special', 'Common', 'getApi',

			function($scope, $http, $rootScope, $location, $routeParams, Special, Common, getApi){

				$scope.pageChanged = function (newPageNumber) {
					$scope.newPageNumber = newPageNumber;
				    $scope.specials = Special.getCateList({
				        "pageNo" : newPageNumber,
				        "search" : $scope.filtText
				        } , function () {
                    });
				}

				$scope.pageChanged(1);

                $scope.isPopup = false;      //是否开弹窗
                $scope.selectType = '';      //分类类型 中文
                $scope.realType = '';        //分类类型 实际参数
                $scope.name = '';            //分类名称
                $scope.sellCode = '';        //开售代号
                $scope.subType = '';         //子品类
                $scope.sellType = '';        //在售类型
                $scope.fullName = '';        //_拼出来的全名
                $scope.types = {             //realType: selectType
                    '1': '大促',
                    '2': '子品类',
                    '3': '品牌日',
                    '4': '日常',
                    '5': '其他'
                };


                // 打开弹窗
                $scope.popupAddSpType = function(id, name, type) {
                    if (name !== "未分类") {
                        $scope.isPopup = true;
                    }
                    $scope.itemId = id;
                    splitFullName(type, name);//拆分MZT分类全名
                    $scope.realType = type;
                }

                // 关闭弹窗
                $scope.cancel = function(){
                    $scope.isPopup = false;
                    $scope.name = '';
                    $scope.selectType = '';
                    $scope.sellCode = '';        //开售代号
                    $scope.subType = '';         //子品类
                    $scope.sellType = '';        //在售类型
                }


                // 选择类型
                $scope.passType = function(type){
                    $scope.selectType = $scope.types[type];
                    $scope.realType = type;
                }

                //新增MZT类型
                $scope.addSpType = function(){
                    jointFullName($scope.realType); //拼接全名
                    if ($scope.fullName) {
                        Special.createType({
                            name: $scope.fullName,
                            type: $scope.realType
                        }, function(data) {
                            if (data.result) {
                                $scope.cancel();//关闭弹窗
                                data.data.cate_num = 0;
                                $scope.specials.list.unshift(data.data);
                            } else {
                                alert(data.msg);
                            }
                        });
                    }
                }

                //编辑MZT类型
                $scope.editSpType = function(id){
                    //console.log($scope.realType)
                    jointFullName($scope.realType); //拼接全名
                    if ($scope.fullName) {
                        Special.createType({
                            id: id,
                            name: $scope.fullName,
                            type: $scope.realType
                        }, function(data) {
                            if (data.result) {
                                $scope.cancel();//关闭弹窗
                                $scope.pageChanged($scope.newPageNumber);
                                alert(data.msg);
                            } else {
                                alert(data.msg);
                            }
                        });
                    }
                }

                //删除MZT类型
                $scope.delete = function () {
                    var ids = Common.getChecksValue('check');

                    Special.delCate({ids: ids}, function(data){
                        if(data.result){
                            //删除view数据
                            $scope.pageChanged($scope.newPageNumber);

                            alert(data.msg);
                        } else {
                            alert(data.msg);
                        }

                        $scope.popDelOpen = false;
                    });
                }

                $scope.preDelete = function () {
                    var ids = Common.getChecksValue('check');

                    if(ids == ''){
                        alert('请选择要删除的分类！');
                        return;
                    }

                    $scope.popDelOpen = true;
                }

                //点击body关闭下拉
                $scope.$on('clickBody', function(){
                    $rootScope.toggleDrop(window.event,$scope,'popAdminSelect');
                });

                //拼接MZT分类全名
                function jointFullName(type){
                    switch (type) {
                        case '1':
                            if(checkValid($scope.sellCode) && checkValid($scope.sellType) && checkValid($scope.name)){
                                $scope.fullName = '[' + $scope.sellCode + '_大促]_' + $scope.sellType + '-' + $scope.name;
                            } else {
                                $scope.fullName = false;
                            }
                            break;
                        case '2':
                            if(checkValid($scope.sellCode) && checkValid($scope.sellType) && checkValid($scope.name) && checkValid($scope.subType)){
                                $scope.fullName = '[' + $scope.sellCode + '_子品类]_' + $scope.subType + '_' + $scope.sellType + '-' + $scope.name;
                            } else {
                                $scope.fullName = false;
                            }
                            break;
                        case '3':
                            if (checkValid($scope.sellType)) {
                                $scope.fullName = '[品牌日]_' + $scope.sellType;
                            } else {
                                $scope.fullName = false;
                            }
                            break;
                        case '4':
                            if(checkValid($scope.name)){
                                $scope.fullName = '[日常]_' + $scope.name;
                            } else {
                                $scope.fullName = false;
                            }
                            break;
                        case '5':
                            if(checkValid($scope.name)){
                                $scope.fullName = '[其他]_' + $scope.name;
                            } else {
                                $scope.fullName = false;
                            }
                            break;
                        default:
                            $scope.fullName = name;
                    }
                    return $scope.fullName;
                }

                //拆分MZT分类全名
                function splitFullName(type, name){
                    var _name = name.split('_'),
                        _len = _name.length;
                    if (name && _name && _len > 1) {
                        switch (type) {
                            case '1'://大促
                                $scope.name = _name[2].split('-')[1];           //分类名称
                                $scope.sellCode = _name[0].replace('[', '');    //开售代号
                                $scope.sellType = _name[2].split('-')[0];       //在售类型
                                break;
                            case '2'://子品类
                                $scope.name = _name[3].split('-')[1];           //分类名称
                                $scope.sellCode = _name[0].replace('[', '');    //开售代号
                                $scope.subType = _name[2];                      //子品类
                                $scope.sellType = _name[3].split('-')[0];       //在售类型
                                break;
                            case '3'://品牌日
                                $scope.sellType = _name[1];                     //在售类型
                                break;
                            case '4'://日常
                            case '5'://其他
                                $scope.name = _name[1];
                                break;
                            default:
                                $scope.selectType = "";
                                $scope.name = name;
                        }
                    } else {
                        $scope.name = name;
                    }
                    $scope.selectType = $scope.types[type];
                }

                //检查填写项合法性
                function checkValid(str) {
                    if (/^\s*$/.test(str)) {
                        alert('不能留空');
                        return false;
                    } else {
                        if (/-|_/.test(str) === true) {
                            alert('不能包含符号"_"和"-"');
                            return false;
                        } else {
                            return true;
                        }
                    }
                }

		}]);
	}



})

