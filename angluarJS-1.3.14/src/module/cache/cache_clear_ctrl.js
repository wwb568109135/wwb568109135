'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {
        require('common/service/cache')(app);
        require('common/service/style')(app);
        require('common/directive/timepicker')(app);
        require('bower_component/jquery-ui/themes/smoothness/jquery-ui.min.css');
        require('bower_component/jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.min.css');

		app.register.controller('CacheClearCtrl', ['$scope', '$http', '$rootScope', '$location', '$routeParams', '$rootElement', 'FileUploader', '$timeout','Cache','Style',

			function($scope, $http, $rootScope, $location, $routeParams, $rootElement, FileUploader,$timeout, Cache,Style){
                $scope.childPage = {},

                $scope.cates = Style.getStyleCate(function () {

                });

                $scope.getStyleList = function (cate) {
                    Style.getStyleList({
                        "page" : 1,
                        "style_cate_id" : $scope.cate_id,
                        "is_default" : '',
                        "pageNum" : 200,
                        "filter_name" : ''
                    }, function(data){
                        $scope.styleList = data.list;
                    });
                }

                $scope.search = function () {
                    if($scope.style_id) {
                        $scope.specials = Cache.getCacheList({
                                style_id : $scope.style_id,
                                start_time : $scope.start_time,
                                end_time : $scope.end_time,
                            },function () {
                                angular.forEach($scope.specials, function(value, key){
                                    value.fold = true;
                                });
                            });
                    }else{
                        alert('请选择样式！');
                    }
                }

                $scope.getPageList = function (special) {
                    special.fold = !special.fold;

                    $scope.childPage[special.id] = special.child_page;
                }

                $scope.getBrandItem = function(brandId){
                    var result,
                        data = $scope.specials;

                    for(var i in data){
                        if(data[i]['id'] == brandId){
                            result =  data[i];
                            break;
                        }
                    }
                    return result;
                }

                $scope.selectAll = function($event, brandId){
                    if(!$scope.getBrandItem(brandId)['child_page'].length){ return;}

                    var _checked = $event.target.checked,
                        _child_page = $scope.getBrandItem(brandId)['child_page'];

                    for(var i in _child_page){
                        _child_page[i]['checked'] = _checked;
                    }
                }

                $scope.selectAllSpecial = function($event){
                    var _checked = $event.target.checked;

                    angular.forEach($scope.specials, function(value, key){
                        value.checked = _checked;
                        angular.forEach(value.child_page, function(page, k){
                            page.checked = _checked;
                        });
                    });
                }

                $scope.$watch('specials', function(newValue, oldValue, scope) {
                    if(newValue){
                        $scope.page_ids = [];

                        angular.forEach(newValue, function(value, key){
                            angular.forEach(value.child_page, function(page, k){
                                if(page.checked) {
                                    $scope.page_ids.push(page.id);
                                }
                            });
                        });
                    }
                }, true);

                $scope.clearCache = function (page_id) {
                    if(confirm('此功能不能在高峰时期使用，确认要清缓存？')){
                        Cache.clearCache({
                            page_id : page_id ? page_id : $scope.page_ids
                        },function (res) {
                            if(res.result){
                                alert(res.msg);
                            }else{
                                alert(res.msg);
                            }
                        })
                    }
                }

                $scope.toSpecialEdit = function($evnet, special){
                    $evnet.preventDefault();
                    $location.url('/special/edit/' + special.id);
                }

                $scope.toPageEdit = function($evnet, page, special_id){
                    $evnet.preventDefault();
                    $location.url('/page/edit/' + page.id + '?page_type_id=1&special_id=' + special_id + '&parent_id=' + page.parent_id);
                }

                $scope.toPreview = function($event, item, id){
                    $event.preventDefault();

                    var param = {
                        page_type_id : 1,
                        special_id : id,
                        parent_id : item.parent_id,
                        page_id: item.id,
                        client: 'phone'
                    }

                    $location.url('/preview/' + id + '?' + $.param(param));
                }
        }])
    }



})

