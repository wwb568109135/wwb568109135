'use strict';

/**
 * 定义首页控制器
 */
define(function(require, exports, module) {

	module.exports = function(app) {

		require('common/directive/timepicker')(app);
        require('common/directive/crumb')(app);
        require('common/directive/popup')(app);
        require('common/directive/popupImg')(app);
        require('common/directive/checkbox')(app);
        require('common/service/index')(app);
        require('common/service/special')(app);
        require('bower_component/jquery-ui/themes/smoothness/jquery-ui.min.css');
        require('bower_component/jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.min.css');

		app.register.controller('IndexCtrl', ['$scope', '$http', '$rootScope','FileUploader', '$timeout' , '$location', '$routeParams', 'Index','Special', 'getApi', function($scope, $http, $rootScope, FileUploader, $timeout, $location, $routeParams, Index, Special, getApi){
            $scope.isSearch = $location.path().indexOf('search') > -1 ? true : false;
            $scope.name = $routeParams.name;

            // console.log($scope.isSearch);
            /*init function*/
            $scope.ajaxGetlistsData = function(ajaxData, tabIndex){
                var url = $scope.isSearch ? getApi('getSpecialSearchList') : getApi('getSpecialList');

                tabIndex = tabIndex || 0;

                $http({ //test
                    method:'GET',
                    url: url ,
                    params: ajaxData
                }).success(function(ret){
                    if(ret && ret.data){
                        $scope.tabInitIndex = tabIndex;

                        $scope.listsData['data'] = ret.data;

                        //list data
                        $scope.initData();

                    }else{
                        alert('暂无数据！');
                    }
                });
            }

            $http({
                method:'GET',url: getApi('getSpecialType')
            }).success(function(ret){
                ret.data.unshift({
                    id : '',
                    name : '全部'
                })
                $scope.cateLists = ret.data;
            });

            $scope.pageChanged = function (newPageNumber) {
                var data = {};

                $scope.curPage = newPageNumber;

                if($scope.isSearch){
                    data = {
                        name: $scope.name,
                        page_id : $scope.page_id,
                        special_type_id : $scope.curCate ? $scope.curCate.id : '' ,
                        special_status : $scope.curStatus ? $scope.curStatus.param : '' ,
                        special_num : $scope.special_num,
                        start_time : $scope.start_time,
                        end_time : $scope.end_time,
                        pageNo : newPageNumber
                    }
                }else{
                    data = {
                        type: $scope.tabs[ $scope.tabInitIndex ].param,
                        cate: $scope.curCate ? $scope.curCate.id : '',
                        pageNo : newPageNumber
                    }
                    // if ( $scope.tabInitIndex == 5 ) {
                    //     $scope.excelUpdateAjax();
                    // }
                    if ( $scope.tabInitIndex == 1 ) {
                        data = {
                            check_created: 1,
                            sale_department_id: $scope.sale_department_ids,
                            page: newPageNumber
                        };
                        $scope.getVirtualSpecial(data);
                    }
                }

                if ( $scope.tabInitIndex == 0) {
                    $scope.ajaxGetlistsData( data , $scope.tabInitIndex);
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

            // $scope.toPreview = function($evnet, page, special_id){
            //     $evnet.preventDefault();
            //     // 'http://mtms_0721.mst-admin.vip.vip.com/admin.php/Page/viewpage?id=549&page_type_id=1&client=phone';
            //     $location.url('/admin.php/Page/viewpage?id='+ page.id +'&page_type_id=1&client=phone');
            //     // $location.url('/page/edit/' + page.id + '?page_type_id=1&special_id=' + special_id + '&parent_id=' + page.parent_id);
            // }


            //init fold, checkbox
            $scope.initData = function(){
                var i = 'data',
                    data = $scope.listsData[i].list,
                    tempNum = 0,
                    curData,curChild;

                $scope.childPage = {};
                $scope.childPageRule = {};//子页面用户群体
                $scope.rule_checks = [];//选中的子页面用户群体

                for(var key in data){
                    curData = data[key];

                    if( tempNum ){
                        curData['fold'] = true;
                    }else{
                        tempNum++;
                        curData['fold'] = true;

                        // $scope.setFold(curData);

                    }

                    curData['checked'] = false;

                    for(var z in curData['child_pages']){
                        curChild = curData['child_pages'][z];
                        curChild['checked'] = false;

                        // $scope.childPage[curData.id] = curChild
                    }
                }
            }

            $scope.getBrandItem = function(brandId){
                var result,
                    data = $scope.listsData['data'].list;

                for(var i in data){
                    if(data[i]['id'] == brandId){
                        result =  data[i];
                        break;
                    }
                }
                return result;
            }

            $scope.selectAll = function($event, brandId){
                if(!$scope.getBrandItem(brandId)['child_pages'].length){ return;}

                var _checked = $event.target.checked,
                    _child_pages = $scope.getBrandItem(brandId)['child_pages'];
                for(var i in _child_pages){
                    _child_pages[i]['checked'] = _checked;
                }
            }

            $scope.isSelectedAll = function(brandId) {
                if(!$scope.getBrandItem(brandId)['child_pages'].length) return;

                var _isCheckedAll = true,
                    _child_pages = $scope.getBrandItem(brandId)['child_pages'];

                for(var i in _child_pages){
                    if(!_child_pages[i]['checked']){
                        _isCheckedAll = false;
                        break;
                    }
                }

                return _isCheckedAll;
            };

            $scope.getSelectedArr = function(){
                var _tabListsData = $scope.listsData['data'].list,
                    _brandList = [],
                    _tplList = [],
                    _curBrand,_brand,_tpl;

                for(var i in _tabListsData){
                    _brand = _tabListsData[i];
                    _brand['checked'] && _brandList.push( _brand['id'] );

                    for(var j in _brand['child_pages']){
                        _tpl = _brand['child_pages'][j];
                        if( _tpl['checked'] || _brand['checked']){
                            if(_brandList.indexOf(_brand.id) == -1){
                                _brandList.push(_brand['id']);
                            }

                            _tplList.push( _tpl['id'] );
                        }
                    }
                }

                return {
                    brandList : _brandList,
                    tplList : _tplList
                }
            }

            $scope.down_excel = function (id,url,is_purchase_type) {
                // alert("down_excel");
                console.log(id,url,is_purchase_type);

                Special.updaterDownload({
                        id : id,
                        is_purchase: is_purchase_type //1 品购  //0非品购
                    },function (data) {
                        if (data.result) {
                            console.log(data);
                            window.open(url);
                        }else{
                            alert("报错了");
                        }
                });
            }
            $scope.excelUpdateAjax = function(){
                Special.excelUpdate({
                    pageNo:$scope.curPage
                },function (data) {

                    if(data.list.length != 0){
                        // $scope.tabInitIndex = tabIndex;

                        //list data
                        $scope.excelUpdateData = data;
                        // $scope.excelUpdateData.total = 50; //mock
                    }else{
                        alert('数组为空了');
                    }
                });
            }

            //获取虚拟档期数据
            $scope.getVirtualSpecial = function(data) {
                var data = data || {};
                Special.getVirtual(data, function(data) {
                    $scope.virtualSpecial = data;
                });
            }

            //获取虚拟档期营业部选项
            $scope.getSaleDepartmentList = function() {
                Special.getSpecialAttributeList({
                    column: 'sale_department'
                }, function(data) {
                    $scope.sale_departments = data;
                });
            }

            //切换TAB
            $scope.clickTabBtn = function(index){
                $scope.tabInitIndex = index;

                if (index == 1 ) {
                    $scope.getSaleDepartmentList();
                    $scope.pageChanged(1);
                }else {
                    $scope.pageChanged(1);
                }

            }

            $scope.setFold = function(item){
                var thisTabData = $scope.listsData['data'].list;

                for(var i in thisTabData){
                    if(thisTabData[i]['id'] == item.id){
                        thisTabData[i]['fold'] = !thisTabData[i]['fold'];
                    }else{
                        thisTabData[i]['fold'] = true;
                    }
                }

                $scope.childPage[item.id] = item.child_pages;

                $scope.setChildPageRules(item);

            }

            //设置子页面人群维度复选框选项
            $scope.setChildPageRules = function(item){
                $scope.childPageRule[item.id] = [];
                //console.log($scope.childPage[item.id]);
                angular.forEach($scope.childPage[item.id], function(v, k) {
                    if ($scope.childPageRule[item.id].indexOf(v.rule_name) < 0) {
                        $scope.childPageRule[item.id].push(v.rule_name);
                    }
                });
            }

            $scope.tplItemShow = function(tplItem, tplId, brandId){
                var display = tplItem.display == 0 ? 1 : 0;

                Index.updateStatus({
                        "child_page_id" : tplItem.id,
                        "display" : display
                    },function (data) {
                        if(data.result){
                            tplItem.display = data.data;
                        }else{
                            for(var key in data.data){
                                if(key){
                                    alert(data.data[key]);
                                    break;
                                }
                            }
                        }
                })
            }

            $scope.showBigImg = function(url){
                $scope.bigImg = url || '';
            }

            $scope.closeBigImg = function(){
                $scope.bigImg = '';
            }

            $scope.toggleShow = function(e,name){
                e.stopPropagation()
                $scope[name] = !$scope[name];
            }

            $scope.setSelectValue = function (key,value) {
                $scope[key] = value;
            }

            $scope.$on('clickBody',function () {
                $scope.cateListShow = false;
                $scope.statusShow = false;

            });

            $scope.getCateLists = function(cate){
                $scope.curCate = cate;
                $scope.ajaxGetlistsData({
                    type:$scope.tabs[ $scope.tabInitIndex ].param,
                    cate:cate
                }, $scope.tabInitIndex);
            }

            $scope.outUrl = function(e){
                e.preventDefault();

                var ids = $scope.getSelectedArr().tplList.join('_');

                if(ids == ''){
                    alert('请选择要导出url的MZT！');
                    return
                }

                window.open(getApi('exportsUrl') + '?ids=' + ids)
            }

            $scope.goAdvSearch = function (e) {
                if(e.keyCode == 13){
                    location.href = '#/search/' + ($scope.name || '');
                }
            }

            $scope.copyTpl = function(e){
                var index = $scope.tabInitIndex,
                    ids = $scope.getSelectedArr().brandList.join(',');

                e.preventDefault();

                if(ids == ''){
                    alert('请选择要复制的MZT！');
                    return
                }

                Index.copyTpl({"ids" : ids},function () {
                    alert('复制成功');

                    // 由于
                    if($scope.tabInitIndex > 1){
                        setTimeout(function () {
                            $('.fanye .page-no:first').click();
                        }, 0);
                    }else{
                        $scope.pageChanged(1);
                    }
                })
            }

            $scope.delete = function(e){
                var ids = $scope.getSelectedArr().tplList.join('_');

                e ? e.preventDefault() : window.event.preventDefault();

                if(ids == ''){
                    alert('请选择要删除的MZT！');
                    return
                }

                $scope.deleteData = Index.deleteTpl({"ids" : ids},function (data) {
                    // alert("删除子页面成功");

                    if($scope.tabInitIndex > 1){
                        setTimeout(function () {
                            $('.fanye .page-no:first').click();
                        }, 0);
                    }else{
                        $scope.pageChanged($scope.curPage);
                    }

                    $scope.popDelOpen = false;
                })
            }

            $scope.preDelete = function (e) {
                var ids = $scope.getSelectedArr().tplList.join(',');

                e.preventDefault();

                if(ids == ''){
                    alert('请选择要删除的子页面');
                    return;
                }

                $scope.popDelOpen = true;
            }


            //tab
            $scope.tabInitIndex = 0;
            //init data
            $scope.listsData = {
                data : {
                    list : {

                    }
                }
            };
            $scope.editsData = {
                showEditsBox : false
            };

            $scope.tabs = [{
                'name' : '全部',
                'index' : '0',
                'param' : 'all'
            },{
                'name' : '待办MZT',
                'index' : '1',
                'param' : 'todo'
            },
            // {
            //     'name' : '已上线',
            //     'index' : '1',
            //     'param' : 'started'
            // },
            // {
            //     'name' : '未上线',
            //     'index' : '2',
            //     'param' : 'unstart'
            // },
            // {
            //     'name' : '已下线',
            //     'index' : '3',
            //     'param' : 'closed'
            // },
            // {
            //     'name' : '草稿',
            //     'index' : '4',
            //     'param' : 'test'
            // },
            // {
            //     'name' : '待更新',
            //     'index' : '5',
            //     'param' : 'toBeUpdated'
            // }
            ];

            $scope.cateListShow = false;

            $scope.pageChanged(1);

            $scope.hideEditsBox = function(){
                $scope.editsData.showEditsBox = false;
            }

            /**
             * upload 相关逻辑
             * deviceMesure PHONE预售图尺寸：680*326，PAD预售图尺寸：640*590
             */
            var deviceMesure = {
                "phone" : {
                    'width' : 680,
                    'height' : 326
                },
                "pad" : {
                    'width' : 640,
                    'height' : 590
                }
            }

            var uploader = $scope.uploader = new FileUploader({
                url: getApi('uploadPic')
            });

            uploader.filters.push({
                name: 'imageFilter',
                fn: function(item , options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            });

            uploader.onAfterAddingFile = function (item) {
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(item._file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var messure = deviceMesure[$scope.type];

                    if(this.width == messure.width && this.height == messure.height){
                        uploader.uploadAll();

                        if(uploader.queue.length > 1){
                            uploader.removeFromQueue(0);
                        }
                    }else {
                        alert("预售图尺寸有误!正确尺寸为：" + messure.width + 'x' + messure.height);
                    }
                }
            }

            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                if(response.result && response.code == 1){
                    $scope.editsData[$scope.type + '_img'] = response.data[$scope.type + '_pic_src'];
                }else {
                    alert('报错了');
                }
            };

            $scope.selectFile = function ($event,type) {
                $event.stopPropagation();

                uploader.url = '/admin.php?c=Special&a=uploadPic&type=' + type;

                var inputFile = $event.toElement.previousElementSibling;

                $timeout(function () {
                    inputFile.click();
                }, 0)

                $scope.type = type;
            }

            $scope.toCreateSpecial = function($event){
                $event.preventDefault();
                $location.url('/special/create');
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

                console.log(param);

                $location.url('/preview/' + id + '?' + $.param(param));
            }

            $scope.edits = function(e){
                e.preventDefault();
                var ids = $scope.getSelectedArr().tplList;

                if(ids.length == 0){
                    alert('请选择要修改的子页面！');
                    return
                }

                Index.checkRelease({
                    childPageIds : ids.join(',')
                    },function (data) {
                    if(data.result){
                        var $JmultiEdit = $('#JmultiEdit');

                        $scope.editsData = {
                            display : '0',
                            start_time : '',
                            end_time : '',
                            phone_img : '',
                            pad_img : '',
                            position : '',
                            showEditsBox : true
                        };

                        $JmultiEdit.find('img').removeAttr('src');
                        $JmultiEdit.find('input').val('');
                    }else{
                        if(data.code == 109){
                            var data = data.data;
                            for(var key in data){
                                if(key){
                                    for(var k in data[key]){
                                        alert(data[key][k]);
                                        return
                                    }
                                }
                            }
                        }else{
                            alert(data.msg);
                        }

                    }
                })
            }

            $scope.pullAutoSyncSwitch = function (specialId,$event) {
                var target = $event.target,
                    $target = $(target),
                    act = $target.attr('data-action'),
                    opposite = act == 'open' ? 'close' : 'open';

                $scope.pullToSwitch(specialId, act, function () {
                    $target.attr('data-action', opposite);

                    if(opposite == 'open'){
                        $target.removeClass('swithBtnOpen');
                        $target.addClass('swithBtnClose');
                    }else {
                        $target.removeClass('swithBtnClose');
                        $target.addClass('swithBtnOpen');
                    }
                } )

            }

            $scope.pullToSwitch = function (specialId,act,fn) {
                Special.pullAutoSyncSwitch({
                    act : act,
                    specialId : specialId
                    },function (data) {
                    if(data.result){
                        if(fn){
                            fn();
                        }
                    }else{
                        alert('接口错误');
                    }
                })
            }

            $scope.indexBatchEdit = function () {
                var list = $scope.getSelectedArr();

                $scope.editsData.childPageIds = $scope.getSelectedArr().tplList.join(',');

                Index.indexBatchEdit($scope.editsData,function (data) {
                    if(data.result){
                        alert(data.msg);

                        // angular.forEach($scope.childPage, function(brand, key){
                        //     angular.forEach(brand, function(tpl, key){
                        //         if(list.tplList.indexOf && list.tplList.indexOf(tpl.id) > -1){
                        //             if($scope.editsData.start_time != ''){
                        //                 tpl.start_time = $scope.editsData.start_time;
                        //             }
                        //             if($scope.editsData.end_time != ''){
                        //                 tpl.end_time = $scope.editsData.end_time;
                        //             }
                        //             if($scope.editsData.display != ''){
                        //                 tpl.display = $scope.editsData.display;
                        //             }
                        //             if($scope.editsData.phone_img != ''){
                        //                 tpl.image = $scope.editsData.phone_img;
                        //             }

                        //             if($scope.editsData.position != ''){
                        //                 tpl.position = $scope.editsData.position;
                        //             }
                        //         }
                        //     });
                        // });
                        //

                        $scope.pageChanged($scope.curPage);
                        $scope.editsData.showEditsBox = false;
                    }else{
                        alert(data.msg);
                    }
                })
            }

            $scope.reset = function (e) {
                e.preventDefault();

                $scope.name = '';
                $scope.page_id = '';
                $scope.curStatus = {};
                $scope.curCate = {};
                $scope.start_time = '';
                $scope.end_time = '';

                $scope.pageChanged(1);
            }

            //选择用户群体
            $scope.select_rule = function(e, brandId) {
                $scope.rule_checks = [];
                $(e.target).siblings().children('input:checkbox[name = rule][value]').each(function(i) {
                    if (this.checked) {
                        $scope.rule_checks.push(this.value);
                    }
                });
                //console.log($scope.rule_checks);

                angular.forEach($scope.childPage[brandId], function(value, key) {
                    if ($scope.rule_checks.indexOf(value.rule_name) >= 0) {
                        $scope.childPage[brandId][key].checked = true;
                        //console.log($scope.childPage[brandId][key]);
                    } else {
                        $scope.childPage[brandId][key].checked = false;
                    }
                });
                //console.log($scope.childPage[brandId]);

            }

            //按用户群筛选子页面
            $scope.filter_rule = function (rule) {
                if ($scope.rule_checks.length) {
                    if ($scope.rule_checks.indexOf(rule.rule_name) >= 0) {
                        return rule;
                    }
                } else {
                    return rule;
                }
            }

            //按营业部筛选虚拟档期
            $scope.filter_virtual = function(id) {
                $scope.isDropSelect2 = false;
                $scope.sale_department_ids = id;
                $scope.pageChanged(1);
            }

            $scope.$on('clickBody', function() {
                $rootScope.toggleDrop(window.event, $scope, 'popAdminSelect');
            });

		}]);
	}
})
