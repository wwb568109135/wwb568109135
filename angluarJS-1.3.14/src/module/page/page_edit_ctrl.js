'use strict';

define(function(require, exports, module) {

    module.exports = function(app) {

        //加载服务
        require('common/service/special')(app);
        require('common/service/template')(app);
        require('common/service/page')(app);
        require('common/service/module')(app);
        require('common/service/util');
        //加载指令
        require('common/directive/module')(app);
        require('common/directive/module_editor')(app);
        require('common/directive/crumb')(app);
        require('common/directive/popup')(app);

        //加载样式
        require('css/page.css');
        require('css/jquery-ui.css');


        //控制器依赖注入
        app.register.controller('PageEditCtrl', ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'Special', 'Template', 'Page', 'Module', '$rootElement', 'FileUploader', '$timeout','$interval', 'getApi', 'util',
            function($scope, $http, $rootScope, $location, $routeParams, Special, Template, Page, Module, $rootElement, FileUploader, $timeout, $interval, getApi, util){

                var id,
                    special_id,
                    page_type_id,
                    client,
                    pageModel; //简约模式( page_model=0 ) 和预览模式 ( page_model=1 )

                // 右边编辑区数据
                $rootScope.edit = {};
                $rootScope.curModule = '';
                $rootScope.curEditType = '';
                $rootScope.newBlockPosition = {key: 0};

                // 中间可视化模块数据
                $rootScope.page = [];
                $scope.isPageListVisible = true;
                // $scope.isPageListVisible = false;

                // 通用参数
                id = $routeParams.id;
                special_id = $routeParams.special_id;
                page_type_id = $scope.page_type_id = $routeParams.page_type_id;
                client = $rootScope.client = $routeParams.client || 'phone';
                pageModel = $rootScope.pageModel = $routeParams.page_model || 1;

                $scope.parentId = $routeParams.parent_id;
                $scope.special_id = special_id;
                $scope.id = $routeParams.id;

                $rootScope.pageClass = client;
                $rootScope.pageModel = pageModel;

                $scope.isShowAddSnapshot = false; //是否显示添加快照
                $scope.isShowDelSnapshot = false;

                // 有id则为编辑
                if(id){
                    // 获取页面信息
                    // if (pageModel == 1) {
                    //     console.log("pageModel = 1 预览模式");
                    // }else{
                    //     console.log("pageModel = 0 简约模式");
                    // }
                    $rootScope.page = Page.get({
                        id: id,
                        page_type_id: page_type_id,
                        client: $rootScope.client,
                        page_model: pageModel
                    },function () {
                        $rootScope.$watch('curModule', function(newValue, oldValue, scope) {
                            // console.log(newValue.data,oldValue.data);
                            if($rootScope.curModule){
                                if(angular.toJson(newValue.model) != angular.toJson(oldValue.model) || angular.toJson(newValue.extend) != angular.toJson(oldValue.extend) || angular.toJson(newValue.data) != angular.toJson(oldValue.data)){
                                    $rootScope.curModule.modify = true;
                                }
                            }
                        }, true);
                    });

                }

                // 获取模板列表
                $scope.templateList = Template.getList(function(){
                    // $scope.curTemplate = $scope.spTypeList[0];
                });

                // 获取模块列表
                $scope.moduleList = Module.getList({type:1}, function(data){
                });

                $scope.delSnapshot = function(id,name){
                    // console.log("delSnapshot");
                    // $scope.isShowDelSnapshot = true;
                    if(confirm("组件名称："+ name +" \n 确认删除此当前组件快照吗？")){
                        Page.delSnapshot({
                            id:id
                        },function(data){
                            // console.log(data);
                            if (data.code == 0) {
                                alert("删除组件快照失败");
                            }else{
                                // console.log("删除组件快照成功");
                                $scope.updateSnapshotListData();
                            }
                        });
                    }
                }

                $scope.updateSnapshotListData = function(){
                    $scope.snapshotListData = Page.getSnapshotList({
                        pageNo: $scope.snapshotPageNo,
                        pageNum: 9
                    });
                }

                //获取组件快照数据的方法
                $scope.getsnapshotList = function(pageNo){
                    $scope.snapshotPageNo = pageNo;

                    Page.getSnapshotList({
                        pageNo: pageNo,
                        pageNum: 9
                    }, function(data){
                        // console.log("获取组件快照数据的方法");
                        $scope.snapshotListData = data;
                    });
                }

                $scope.getsnapshotList(1);


                //导出组件快照按钮
                $scope.exportSnapshot = function($event, module,index){
                    // console.log("index:"+index);
                    // console.log(module);

                    if( module.modify){
                        alert("组件有修改，请先保存组件，然后再导出组件快照!");
                        return;
                    }

                    $scope.isShowAddSnapshot = true;
                    // console.log("导出组件快照");
                    $scope.exportSnapshotModule = module;
                    $rootScope.exportSnapshotIndex = index;
                }
                //弹出添加组件快照的模板相关
                $scope.addSnapshotData = {
                    inputname : "",
                    confirmInfo : function () {
                        var params = $scope.exportSnapshotModule;
                        // console.log(params);

                        var model = $.extend(true, {}, params.model);

                        function changeToPercentage1(){
                            // console.log("changeToPercentage1");
                            // 将热区的pixel转为%
                            var index = $rootScope.exportSnapshotIndex;
                            var parent = $('.special-module .hotspot-wrapper:eq('+ index +')');
                            if(model && model.list && model.list.length){
                                var list = model.list;
                                $.each(list, function (k, v) {
                                    $.extend(v, util.getPercentageByPixel(v, {width: parent.width(), height: parent.height()}));
                                })
                            }
                        }

                        if ($scope.addSnapshotData.inputname.length == 0 ) {
                            alert("组件快照的名字不能为空");
                        }else{

                            //处理将热区的pixel转为%  包括：品购/头图/自定义组件/悬浮球
                            if ($scope.exportSnapshotModule.module_type_id == "purchase" || $scope.exportSnapshotModule.module_type_id == "head" || $scope.exportSnapshotModule.module_type_id == "custom_config" || $scope.exportSnapshotModule.module_type_id == "suspend" ) {
                                changeToPercentage1();
                            }

                            Page.addSnapshot({
                                name: $scope.addSnapshotData.inputname,
                                style_group_id: $scope.exportSnapshotModule.style_group_id,
                                model: model != null && model ?  model : [],
                                extend: $scope.exportSnapshotModule.extend != null && $scope.exportSnapshotModule.extend ?  $scope.exportSnapshotModule.extend : [],
                                source: $scope.exportSnapshotModule.source != null && $scope.exportSnapshotModule.source ?  $scope.exportSnapshotModule.source : [],
                                module_type: $scope.exportSnapshotModule.module_type_id
                            },function (data) {
                                // console.log(data);
                                if (data.code == 1) {
                                    // console.log("添加组件快照成功");
                                    $scope.isShowAddSnapshot = false;
                                    $scope.addSnapshotData.inputname = "";

                                    $scope.updateSnapshotListData();

                                }else{
                                    alert("添加组件快照失败");
                                }

                                // console.log(params.model.list);

                            });

                        }

                    }
                }

                /*分页数据 结束*/

                // 获取页面列表
                $scope.pageList = Page.getList({
                    special_id: special_id,
                    client : client
                }, function(data){
                    $.each(data, function(k, v){
                        var isParent = v.parent_id == id;

                        if(isParent) {
                            $scope.curPage = {
                                id : v.parent_id,
                                name : v.parent_name
                            };
                        }

                        $.each(v.data,function (k,rule) {
                            rule.extended = isParent;

                            $.each(rule.data,function (k,page) {
                                if(page.page_id == id) {
                                    $scope.curPage = {
                                        id : page.page_id,
                                        name : page.page_name
                                    };

                                    rule.extended = true;

                                    return false;
                                }
                            })
                        })
                    });
                });

                // 触发页面列表
                $scope.triggerPageList = function($event, item){
                    $event.stopPropagation();
                    // $scope.isPageListVisible = !$scope.isPageListVisible;
                }

                // 跳转到编辑页
                $scope.toEditPage = function($event, id, pageType, parentId){
                    $event.stopPropagation();

                    var params = {
                        id : id,
                        page_type_id : pageType,
                        parent_id : parentId,
                        special_id : special_id,
                        page_model:pageModel //添加简约模式/预览模式
                    };

                    angular.extend($routeParams, params);

                    $location.url('/page/edit/' + id + '?' + $.param($routeParams));
                }

                // 调换组件顺序handler，临时解决，需要修复插入数据无法初始化的bug
                $scope.onSort = function($item, $partFrom, $partTo, $indexFrom, $indexTo){
                    // var a = $scope.page.moduleList.splice($indexTo, 1);
                    // $scope.page.moduleList.splice($indexTo, 0, a[0]);
                    // $rootScope.updatePage();

                    // var a = $scope.page.moduleList.splice($indexTo, 1);
                    // $scope.page.moduleList.push(a[0]);

                    var list = $scope.page.moduleList;
                    $scope.page.moduleList = [];

                    $timeout(function(){
                        $scope.page.moduleList = list;
                        $rootScope.updatePage('component');
                    }, 50);

                    $scope.svMove = false;
                }

                // 商品、档期等数据移动
                $scope.onDataSort = function($item, $partFrom, $partTo, $indexFrom, $indexTo, module){
                    module.modify = true;
                }

                // 拖动开始时
                $scope.onSortStart = function($item, $part, $index, $helper,$event){
                    // if($item.modify) {
                    //     alert('拖动前，请保存组件！');
                    //     return false;
                    // }
                    //
                    // alert("addModule");
                    console.log($event);


                    $scope.svMove = true;
                }
                // 拖动结束时
                $scope.onSortStop = function($item, $part, $index, $helper){
                    // if($item.modify) {
                    //     alert('拖动前，请保存组件！');
                    //     return false;
                    // }


                    $scope.svMove = false;
                }

                $scope.$on('clickBody', function(){
                    // $scope.isPageListVisible = false;
                })

                $scope.addModule = function($event, ui){
                    var module = ui.draggable.scope().module;
                    //.is_snapshot 组件快照的拖拽组件
                    if ($(ui.draggable).hasClass('is_snapshot')) {
                        Page.addModule({
                            is_snapshot:1, //区分是否模板组件的
                            snapshot_id:module.id,// 组件模板的id
                            component_list: $scope.getModuleList(),
                            module_type_id: "1",
                            module_type: "1",
                            page_type_id: page_type_id,
                            page_id: id,
                            client: $rootScope.client
                        }, function(data){
                            // console.log("组件快照-data");
                            // console.log(data);

                            $scope.page.moduleList.push(data);
                            $rootScope.setComponentId($scope.page.moduleList,data.new_sort);
                            $rootScope.updatePage();
                        });

                    }else{
                        Page.addModule({
                            component_list: $scope.getModuleList(),
                            module_type_id: module.cate_id,
                            module_type: module.code,
                            page_type_id: page_type_id,
                            page_id: id,
                            client: $rootScope.client
                        }, function(data){
                            $scope.page.moduleList.push(data);
                            $rootScope.setComponentId($scope.page.moduleList,data.new_sort);
                            $rootScope.updatePage();
                        });
                    }

                }

                // 更新页面，上报组件顺序
                $rootScope.updatePage = function(rander){

                    Page.update({
                        component_list: $scope.getModuleList(),
                        client: $rootScope.client,
                        page_id: id,
                        page_type_id: page_type_id
                    },function (data) {
                        if(rander === 'component'){
                            $rootScope.setComponentId($scope.page.moduleList,data.component_list);
                            setEditFlowFix();
                        }
                    })
                }

                // 获取当前模块id列表
                $scope.getModuleList = function(){
                    var list = $scope.page.moduleList;
                    return $.map(list, function(v){return v.id});
                }

                $scope.drop = function(event, ui){
                    $scope.addModule(event, ui);
                }

                /**
                 * upload 相关逻辑
                 */
                var uploader = $scope.uploader = new FileUploader({
                    url: 'admin.php/Plugins/uploadPic',
                    autoUpload : "true"
                });

                uploader.filters.push({
                    name: 'imageFilter',
                    fn: function(item , options) {
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                    }
                });

                uploader.onSuccessItem = function(fileItem, response, status, headers) {

                    if(response.result && response.code == 1){
                        var data = response.data;


                        // 头图不用切割，所以拿的参数还是pic_src
                        switch($scope.type){
                            case 'phone':
                                if($scope.curRuleId){
                                    $rootScope.curModule.model['rule_pic_src'][$scope.curRuleId]['phone_pic_src'] = data.pic_src;
                                } else {
                                    $rootScope.curModule.model[$scope.type + '_pic_src'] = data.pics || data.pic_src;
                                }
                                break;

                            case 'pad':
                                if ($scope.curRuleId) {
                                    $rootScope.curModule.model['rule_pic_src'][$scope.curRuleId]['pad_pic_src'] = data.pic_src;
                                } else {
                                    $rootScope.curModule.model[$scope.type + '_pic_src'] = data.pics || data.pic_src;
                                }
                                break;

                            case 'suspend':
                                $rootScope.curModule.model[$scope.type + '_pic_src'] = data.pics || data.pic_src;
                                break;

                            case 'floorSingle':
                                $rootScope.curBlock.extend.watermark = data.pic_src;
                                break;

                            case 'floorBatch':
                                $rootScope.curModule.model.batch.watermark = data.pic_src;
                                break;

                            case 'share':
                                $rootScope.curModule.model.bg = data.pic_src;
                                break;

                            case 'phone_after':
                                $rootScope.curModule.model[$scope.type + '_pic_src'] = data.pic_src;
                                break;

                            case 'pad_after':
                                $rootScope.curModule.model[$scope.type + '_pic_src'] = data.pic_src;
                                break;

                            case 'multi':
                                var len = $rootScope.curModule.data.length,
                                    num = fileItem.file.name.replace(/.(?:jpg|jpeg|png|bmp)$/,'');

                                num = parseInt(num, 10);

                                // 根据图片的名称来做为序列，去替换对应model数据
                                if(num <= len && $rootScope.curModule.data[num - 1]){
                                    $rootScope.curModule.data[num - 1].extend.pic = data.pic_src;
                                }

                                break;

                            case 'single':
                                $rootScope.curBlock.extend.pic = data.pic_src;
                                break;

                            default :
                                $rootScope.curModule.model[$scope.type + '_pic_src'] = data.pic_src;
                                //扩展自定义参数的图片存储~~~
                                if( $rootScope.curModule.source ){
                                    $rootScope.curModule.source.PIC_TYPE = $scope.type;
                                    $rootScope.CUSTOM_CONFIG_CONFIG.bChangePic = !$rootScope.CUSTOM_CONFIG_CONFIG.bChangePic;
                                }
                        }

                    }else {
                        alert('报错了');
                    }
                };

                uploader.onCompleteAll = function () {
                    if(uploader.queue.length > 1){
                        uploader.clearQueue();
                    }

                    if($scope.type === 'multi'){
                        $rootScope.multi_pic_tips = '上传完毕！请按确认按钮，预览图片。';
                    }
                }

                // 由于头图不用切割，所以增加参数tool来扩展，tool为'split'的时候为切割。
                //当需要配置多人群个性化图时增加ruleId参数
                $scope.selectFile = function ($event,type,tool,ruleId) {
                    $event.stopPropagation();

                    $rootScope.curModule.pics = [];

                    var params = '';

                    switch(tool){
                        case 'splice':
                            params = '?is_spliced=true';
                            break;
                        case 'origin':
                            params = '?origin_name=1';
                            break;
                        default:
                            break;
                    }

                    uploader.url = 'admin.php/Plugins/uploadPic' + params;

                    var inputFile = $($event.toElement).parent().next();

                    $timeout(function () {
                        inputFile.click();
                    }, 0)

                    $scope.type = type;
                    $scope.curRuleId = ruleId;
                }

                // 切换2种模式
                $scope.changePageModel = function(val){
                    console.log("切换模式"+val);

                    var params = $.param({
                        page_type_id: page_type_id,
                        special_id: special_id,
                        parent_id: $scope.parentId,
                        client: client,
                        id:id,
                        page_model: val
                    }), url;

                    url = '/page/edit/' + id + '?' + params;
                    $rootScope.isShowPopStyle = false; //选择样式组
                    $location.url(url);
                }


                // 切换到其他平台
                $scope.toOtherClient = function(client){
                    var params = $.param({
                        page_type_id: page_type_id,
                        special_id: special_id,
                        parent_id: id,
                        client: client,
                        page_model: pageModel
                    }), url;

                    url = '/page/edit/' + id + '?' + params;

                    $rootScope.isShowPopStyle = false; //选择样式组

                    $location.url(url);
                }

                // 更新组件
                $scope.updateModule = function(mod,index){
                    // alert("updateModule");
                    var module = mod || $rootScope.curModule,
                        index = index,
                        params;


                    if(!mod.modify){
                        return;
                    }

                    params = {
                        client: $rootScope.client,
                        component_list: $scope.getModuleList(),
                        id: module.id,
                        page_id: id,
                        page_type_id: page_type_id,
                        module_type_id: module.module_type_id,
                        style_group_id: module.style_group_id
                    }

                    // 区分不同组件提交的数据
                    switch(module.module_type_id){
                        case 'purchase':
                            params.model = module.model;
                            // console.log(params.model);

                            changeToPercentage();
                            update(index);
                            break;

                        case 'head':
                            // alert("head-updateModule");

                            params.model = $.extend({},{
                                list: [],
                                anchor: "",
                                phone_pic_src: "",
                                pad_pic_src: ""
                            }, module.model);

                            // console.log(params.model);

                            changeToPercentage();
                            update(index);
                            break;

                        case 'brand_with_product':
                            module.data = module.data || [];
                            params.model = {
                                label : module.model.label,
                                labelName : module.model.labelName,
                                is_click : module.model.is_click,
                                show_type : module.model.show_type,
                                list: $.map(module.data, function(v){return v.extend}),
                                brand_start_time: module.model.brand_start_time,
                                brand_end_time: module.model.brand_end_time,
                                is_phone_style : 'true',
                                extend_product_num: module.model.extend_product_num
                            };

                            params.extend = module.extend;
                            params.extend.page.offset = params.extend.page.limit;
                            update(index);
                            break;

                        case 'brand':
                            module.data = module.data || [];
                            params.model = {
                                label : module.model.label,
                                labelName : module.model.labelName,
                                is_click : module.model.is_click,
                                is_collect : module.model.is_collect,
                                is_phone_style : module.model.is_phone_style,
                                show_type : module.model.show_type,
                                list: $.map(module.data, function(v){return v.extend}),
                                resysd_id: module.model.resysd_id || '',
                                brand_start_time: module.model.brand_start_time,
                                brand_end_time: module.model.brand_end_time,
                            };

                            params.extend = module.extend;
                            params.extend.page.offset = params.extend.page.limit;

                            if(params.model.list.length){
                                // Module.updateBrand({
                                //     brand_ids: $.map(module.data, function(v){return v.extend.brand_id}),
                                //     floor: module.floor,
                                //     page_id: id
                                // }, function(data){
                                //     update(index);
                                // })

                                // 这个版本去掉调整顺序功能
                                update(index);
                            } else {
                                update(index);
                            }
                            //console.log(params);

                            break;

                        case 'product':
                            module.data = module.data || [];
                            params.model = {
                                list: $.map(module.data, function(v){ if(v) return v.extend}),
                                resysd_id: module.model.resysd_id || '',
                                is_phone_style : module.model.is_phone_style
                            };

                            params.extend = module.extend;
                            params.extend.page.offset = params.extend.page.limit;

                            // todo. excel数据被清空。
                            // if(params.model.list.length){
                            //     Module.updateProduct({
                            //         product_data: $.map(module.data, function(v){
                            //             return {
                            //                 product_id: v.extend.product_id,
                            //                 brand_id: v.extend.brand_id
                            //             }
                            //         }),
                            //         floor: module.floor,
                            //         page_id: id

                            //     }, function(data){
                            //         update(index);
                            //     })
                            // } else {
                            //     update(index);
                            // }

                            update(index);

                            break;

                        case 'share':
                            params.model = module.model;
                            update(index);
                            break;

                        case 'countdown':
                            params.model = module.model;
                            update(index);

                            break;

                        case 'coupon':
                            params.model = module.model;
                            params.model.phone_info = {
                                before_img : params.model.phone_pic_src || '',
                                after_img : params.model.phone_after_pic_src || '',
                                saleout_img : params.model.phone_saleout_pic_src || ''
                            }
                            params.model.pad_info = {
                                before_img : params.model.pad_pic_src || '',
                                after_img : params.model.pad_after_pic_src || '',
                                saleout_img : params.model.pad_saleout_pic_src || ''
                            }
                            update(index);
                            break;

                        case 'suspend':
                            params.model = module.model;

                            changeToPercentage();
                            update(index);

                            break;

                        case 'nav':
                            params.model = module.model;
                            update(index);

                            break;

                        case 'haitao':
                            module.data = module.data || [];
                            params.model = {
                                list: $.map(module.data, function(v){ if(v) return v.extend})
                            };

                            params.extend = module.extend;
                            params.extend.page.offset = params.extend.page.limit;

                            // console.log(params);

                            if(params.model.list.length){
                                Module.updateProduct({
                                    product_data: $.map(module.data, function(v){
                                        return {
                                            product_id: v.extend.product_id,
                                            brand_id: v.extend.brand_id
                                        }
                                    }),
                                    floor: module.floor,
                                    page_id: id

                                }, function(data){
                                    update(index);
                                })
                            } else {
                                update(index);
                            }

                            break;

                        case 'beauty':
                            module.data = module.data || [];
                            params.model = {
                                list: $.map(module.data, function(v){ if(v) return v.extend})
                            };

                            params.extend = module.extend;
                            params.extend.page.offset = params.extend.page.limit;

                            // console.log(params);

                            if(params.model.list.length){
                                Module.updateProduct({
                                    product_data: $.map(module.data, function(v){
                                        return {
                                            product_id: v.extend.product_id,
                                            brand_id: v.extend.brand_id
                                        }
                                    }),
                                    floor: module.floor,
                                    page_id: id

                                }, function(data){
                                    update(index);
                                })
                            } else {
                                update(index);
                            }

                            break;

                        case 'collect':
                            module.data = module.data || [];
                            params.model = {
                                list: $.map(module.data, function(v){ if(v) return v.extend})
                            };

                            params.extend = module.extend;
                            params.extend.page.offset = params.extend.page.limit;

                            // console.log(params);

                            if(params.model.list.length){
                                Module.updateProduct({
                                    product_data: $.map(module.data, function(v){
                                        return {
                                            product_id: v.extend.product_id,
                                            brand_id: v.extend.brand_id
                                        }
                                    }),
                                    floor: module.floor,
                                    page_id: id

                                }, function(data){
                                    update(index);
                                })
                            } else {
                                update(index);
                            }

                            break;
                        case 'allbackground':
                            params.model = module.model;
                            // params.model.bodycolor = module.bodycolor;

                            // console.log(params);
                            if ( params.model.bodycolor.length == 6 ) {
                                update(index);
                            } else{
                                alert("颜色值码必须为6位");
                            }
                            break;


                        case 'channel':
                            params.model = {
                                channel_id : module.extend.selected.id
                            };
                            params.extend = {
                                page : {
                                    isPaging: true
                                }
                            };

                            update(index);
                            break;

                        // 自定义组件
                        case 'custom_config':
                            params.source = module.source;
                            params.model = module.model;
                            changeToPercentage();
                            // if(!checkBNeed(module))return;
                            update(index);

                            break;

                        case 'editor':
                            params.model = module.model;

                            update(index);
                            break;

                        case 'video':
                            // alert("提交-video");
                            params.model = module.model;
                            // console.log('params.model');
                            // console.log(params.model);

                            update(index);
                            break;
                        default :
                            update(index);
                            break;
                    }

                    function update(index){
                        // console.log('update:'+ index);

                        Module.update(params, function(data){
                            // 把返回结果插入组件列表，因为组件id有可能改变

                            $scope.page.moduleList[index] = data;
                            $rootScope.curEditType = '';

                            $scope.setComponentId($scope.page.moduleList,data.new_sort);

                            //更新页面，上报组件顺序
                            $rootScope.updatePage();
                        })
                    }

                    function changeToPercentage(){
                        // 将热区的pixel转为%
                        var parent = $('.special-module .hotspot-wrapper:eq('+ index +')');
                        if(params.model && params.model.list && params.model.list.length){
                            var list = params.model.list;
                            $.each(list, function (k, v) {
                                $.extend(v, util.getPercentageByPixel(v, {width: parent.width(), height: parent.height()}));
                            })
                        }
                    }

                    // 检验必填项是否填写，alert出提示
                    // 容错处理自定义组件没有配置项的情况
                    function checkBNeed(module){
                        var config = !!module.source.custom_configs ? module.source.custom_configs : [];
                        //console.log(config);
                        var data = !!module.model ? module.model : {};
                        //console.log(data);
                        for(var i=0;i<config.length;i++){
                            var id = config[i].id;
                            if(config[i].bNeed == true && (data[id] == "" || data[id] == undefined)){
                                alert("组件 " + module.style_group + " " + config[i].des + ' 为必须填写项目，不能为空！');
                                return false;
                            }
                        }
                        return true;
                    }
                }

                $rootScope.setComponentId = function (moduleList, sort) {
                    // console.log(moduleList);
                    if(!sort) {
                        return;
                    }

                    var ids = sort.split(',');
                    if(page_type_id === '1'){
                        angular.forEach($scope.page.moduleList, function(v, k){
                            v.id = ids[k];
                        });
                    }
                }

                // 设置样式
                /**
                 * @param style
                 * @param bResetModel是否重置model
                 */
                $scope.setStyle = function(style, bResetModel){
                    var curModule = $rootScope.curModule;
                    var tmp=[];//暂存依赖值列表，数组每次初始化
                    $rootScope.moduleEditorScroll();
                    // 数组去重
                    function setUnique(arr) {
                        var hash = {},
                        len = arr.length,
                        result = [];
                        for (var i = 0; i < len; i++){
                            if (!hash[arr[i]]){
                                hash[arr[i]] = true;
                                result.push(arr[i]);
                            }
                        }
                        return result;
                    }

                    // 数组去除空的项目
                    function replaceEmptyItem(arr){
                        for(var i=0,len=arr.length;i<len;i++){
                            if(!arr[i]|| arr[i]==''){
                                arr.splice(i,1);
                                len--;
                            }
                        }
                    }

                    //更新样式，还是选择当前样式cu]f`asdfsdfdjdsf
                    var bSameStyle = false;
                    if( curModule.style_group_id == style.id ){
                        bSameStyle = true;
                        var cacheModel = $.extend(true, {}, curModule.model);

                    }

                    curModule.style_group = style.name;
                    curModule.style_group_id = style.id;

                    curModule.modify = true;
                    $rootScope.isShowPopStyle = false; //选择样式组

                    //~~~
                    if( bResetModel ){
                        curModule.model = style.model || {};
                    }
                    //初始化自定义参数数据，对没有初始值， 将string转成json, 将'true'转成true, 设置model默认值
                    //再次点击时候此处不会执行，相应执行module.js的initCustomConfig方法
                    if( curModule.module_type_id == 'custom_config' ){
                        if(  bSameStyle ){ curModule.model = cacheModel }
                        //有数据
                        if( (curModule.source = style.source)  ){
                            var custom_configs = curModule.source.custom_configs;
                            if( custom_configs ){
                                //将'true','false'转成true,false
                                curModule.model = curModule.model || {};
                                $.each(custom_configs, function(index, val) {
                                    // 初始化依赖值内容，数组去重，并且兼容旧组件没有该配置项，设为null，在下边列表再去重
                                    if (val.dep == undefined){
                                        val.dep='';
                                    }
                                    // console.log('遍历每个配置项dep数据'+val.dep);
                                    $.each(val.dep.split(","), function(index, val) {
                                        tmp.push(val);
                                    });
                                    // console.log('所有dep数据'+tmp);

                                    if(val.bNeed.toString()==='true' || val.bNeed === true){  //必填
                                        val.bNeed = true;
                                    }else{
                                        val.bNeed = false;
                                        curModule.model[ val.id ] = curModule.model[ val.id ] || val.defaultVal;
                                    }

                                    //重置图片
                                    if( val.type === 'img' && !bSameStyle ){
                                        var id = val.id;
                                        curModule.model[ id ] = curModule.model[ id ] || {};
                                        $.each(val.imgData, function(index, val) {
                                            curModule.model[ id ][ val.id ] = ' ';
                                        });
                                    }

                                });
                                curModule.dep = setUnique(tmp);//去重
                                replaceEmptyItem(curModule.dep);//去空格
                                curModule.selectDep = curModule.source.selectDep;
                                // console.log(curModule);
                            }
                        }
                    };

                }

                //导入品购id 导入非品购id 按钮
                $scope.toUploadExcel = function(type){
                    angular.extend($routeParams, {
                        parent_id: $scope.parentId,
                        page_id : id,
                        type : type
                    })

                    $location.url('/page/'+ special_id +'/upload?' + $.param($routeParams));
                }
                //生成子页面 按钮
                $scope.toCreateChildrenPage = function(){
                    angular.extend($routeParams, {
                        template_id: 1,
                        parent_id: $scope.parentId,
                        list_length: $scope.pageList[0].data.length
                    })

                    $location.url('/page/create/sub?' + $.param($routeParams));
                }
                //复制本页 按钮 业务已经隐藏
                $scope.copyPage = function(){
                    Page.copy({id: id, page_type_id: page_type_id}, function(data){
                        $location.url('/page/edit/' + data.id + '?page_type_id=' + data.page_type_id + '&special_id=' + special_id + '&parent_id=' + data.id);
                    })
                }

                //新增父页面 按钮 业务已经隐藏
                $scope.createPage = function(){
                    Page.createParent({special_id : special_id}, function(data){
                        if(data.result){
                            data = data.data;

                            $location.url('/page/edit/' + data.page_id + '?page_type_id=' + data.page_type_id + '&special_id=' + special_id + '&parent_id=' + data.page_id);
                        }
                    })
                }

                $scope.deleteImg = function(attr, ruleId){
                    if (ruleId) {
                        $rootScope.curModule.model.rule_pic_src[ruleId][attr] = ' ';
                    } else{
                        $rootScope.curModule.model[attr] = ' ';

                        setTimeout(function() {
                            $('input[uploader]').val('');
                        }, 0);
                    }

                }

                // 同步MZT开关 按钮
                $scope.pullAutoSyncSwitch = function (specialId,$event) {
                    var target = $event.target,
                        $target = $(target),
                        act = $target.attr('data-action'),
                        opposite = act == 'open' ? 'close' : 'open';

                    // console.log(specialId,act);

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

                // 同步MZT开关
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

                // 关闭开关
                $scope.pullToSwitch(special_id, 'close');

                function canLeavePage() {
                    var flag = true;

                    $.each($rootScope.page.moduleList, function (key, value) {
                        if(value.modify){
                            flag = false;
                            return false;
                        }
                    })

                    return flag;
                }

                $scope.$on('$destroy', function() {
                   window.onbeforeunload = undefined;
                });

                $scope.$on('$locationChangeStart', function(event, next, current) {
                    if(!canLeavePage()) {
                        if(!confirm("你还有没有保存的组件，确定离开页面？")) {
                            event.preventDefault();
                        }
                    }
                });

                /**
                 * 设置浮动
                 */
                function setEditFlowFix() {
                    var $modules = $('.module'),
                        $editFlow = $modules.find('.templetZtmb-contentUploadDrawRightpad'),
                        st = $(window).scrollTop();


                    $editFlow.each(function (i) {
                        var $this = $(this),
                            $module = $modules.eq(i),
                            oft = $module.offset().top - 10,
                            maxFlow = oft + $module.height() - $this.height(),
                            left = $module.offset().left + $module.width() + 20 - $(window).scrollLeft();

                        // console.log(st, oft,maxFlow);
                        if(st > oft && st < maxFlow){
                            $this.addClass('fix-top').css({
                                left : left,
                                top : 10
                            })
                        } else if(st >= maxFlow){
                            $this.removeClass('fix-top').css({
                                left : 'auto',
                                top : maxFlow - oft
                            })
                        } else{
                            $this.removeClass('fix-top').css({
                                left : 'auto',
                                top : 0
                            })
                        }
                    })
                }

                // 设置左边编辑区，在编辑区滚动的时候悬浮
                function setZujianFix(){
                    var Zujian = $('.templetZt-Zujian'),
                        leixing_height = parseInt($(".leixing").height()),
                        wst = $(window).scrollTop();

                    if(wst >= 192 + leixing_height ) {
                    // if(wst >= 192) {
                        Zujian.addClass('Zujian-fix').css({
                            position : 'fixed',
                            top : 10
                        })
                    } else {
                        Zujian.removeClass('Zujian-fix').css({
                            position : 'relative',
                            top : 0
                        })
                    }

                }

                // 设置左边编辑区内组件，在可视区内滚动
                function setZujianScroll(){
                    var zujianBg = $('.zujianBg'),
                        e_zujian = $('.zujian'),
                        Zujian = $('.templetZt-Zujian'),
                        // 获取可视区的高度，这里可以规避兼容模式的影响
                        de = document.documentElement,
                        db = document.body,
                        cm = (document.compatMode === "CSS1Compat"),
                        iH = cm ? de.clientHeight : db.clientHeight;
                    if (Zujian.css('position') == 'fixed') {
                        zujianBg.addClass('Zujian-scroll').css({
                            height : iH - 150,
                            'overflow-x' : 'hidden',
                            'overflow-y' : 'auto'
                        });
                        e_zujian.css('overflow', 'hidden');
                    } else {
                        zujianBg.addClass('Zujian-scroll').css({
                            height : iH - 300,
                            'overflow-x' : 'hidden',
                            'overflow-y' : 'auto'
                        });
                        e_zujian.css('overflow', 'hidden');
                    }
                }


                // 设置模块编辑区，在可视区内滚动
                $rootScope.moduleEditorScroll = function(){
                    var popmoduleEditor = $(".popAdd"),
                        moduleEditor = $(".m-configSign"),
                        // 获取可视区的高度，这里可以规避兼容模式的影响
                        de = document.documentElement,
                        db = document.body,
                        cm = (document.compatMode === "CSS1Compat"),
                        iH = cm ? de.clientHeight : db.clientHeight;
                        moduleEditor.addClass('moduleEditor-scroll').css({
                            height : iH - popmoduleEditor.position().top - $('.popAddTitle').height() - $('.popAddFloorInput').height() - $('.popAdminBtnNewpagelast').height() -120,
                            'overflow-x' : 'hidden',
                            'overflow-y' : 'auto'
                        });
                }


                //$viewContentLoaded- 当视图加载完成，DOM渲染完成之后触发，视图所在的$scope发出该事件。
                $scope.$on('$viewContentLoaded', function(event, next, current) {
                    window.onbeforeunload = function () {
                        if(!canLeavePage()) {
                            window.event.returnValue = "你还有没有保存的组件，确定离开页面？";
                        }
                    };

                    $(window).bind('scroll',function () {
                        setEditFlowFix();
                        setZujianFix();
                        setZujianScroll();
                    });

                    // 页面没有滚动，但是调整大小的时候触发
                    $(window).bind('resize',function () {
                        setZujianScroll();
                        $rootScope.moduleEditorScroll();
                    })
                });

                //预览 按钮
                $scope.toPreview = function () {
                    var url = '#/preview/'+ $scope.special_id +'?page_type_id='+ $scope.page_type_id +'&special_id='+ $scope.special_id +'&parent_id='+ $scope.parentId +'&client='+ $scope.client +'&page_id='+ $scope.id;

                    window.open(url);
                };

                // 绑定dap排序
                $scope.bindDapSort = function () {
                    $scope.dapData = Page.getPageDapInfo({
                        special_id : special_id
                    },function () {
                        var dap = $scope.dapData;

                        if(dap.type == -1){
                            alert('绑定DAP前必须生成子页面。');
                            return;
                        }

                        dap.step = 1;
                        dap.dapList = [];

                        dap.updateDap = function (type) {
                            this.curSaleType = type;
                            this.step = 2;
                        };

                        dap.setDap = function (id, name) {
                            switch(this.curSaleType){
                                case '0':
                                    this.data.pre.id = id;
                                    this.data.pre.name = name;
                                    break;
                                case '1':
                                    this.data.pre.id = id;
                                    this.data.pre.name = name;
                                    break;
                                case '2':
                                    this.data.onsale.id = id;
                                    this.data.onsale.name = name;
                                    break;
                            }

                            this.step = 1;
                        };

                        dap.search = function ($event) {
                            var self = this;
                            if(!$event || $event.keyCode == 13){
                                console.log(self.searchKey,Page);
                                $scope.dapData.dapList = Page.getDapInfos({
                                        search_key : self.searchKey
                                    },function () {
                                        // console.log(2);
                                    })
                            }
                        };

                        dap.confirmInfo = function () {
                            var self = this,
                                pre_id = this.data.pre.id,
                                onsale_id = this.data.onsale.id;

                            // 不同类型判断
                            if(self.dap_switch == 1){
                                switch( self.type){
                                    case '0':
                                        if(pre_id == -1){
                                            alert('必须绑定排序ID');
                                            return
                                        }
                                        break;
                                    case '1':
                                        if(pre_id == -1){
                                            alert('必须绑定预热排序ID');
                                            return
                                        }
                                        break;
                                    case '2':
                                        if (onsale_id == -1) {
                                            alert('必须绑定在售排序ID');
                                            return
                                        };
                                        break;
                                    case '3':
                                        if(pre_id == -1){
                                            alert('必须绑定预热排序ID');
                                            return
                                        }
                                        if (onsale_id == -1) {
                                            alert('必须绑定在售排序ID');
                                            return
                                        };
                                        break;
                                }
                            }


                            Page.saveDapOption({
                                special_id : special_id,
                                dap_switch : this.dap_switch,
                                type : self.type,
                                pre_id : pre_id,
                                onsale_id : self.type == 0 ? pre_id : onsale_id,
                                // name : self.searchKey
                            },function (res) {
                                if(res.result){
                                    alert(res.msg);
                                    self.show = false;
                                }
                            })
                        }

                        dap.show = true;
                    })
                }





                // })();
                // proRecData --end

                // 爆款推荐
                initTypeRecData('proRecData', {   //默认值
                    method: 'search.product.base',
                    page: '100631',
                    warehouse: 'VIP_NH',
                    fields: 'name,id,img,to_warehouse,link,brand_id,pid,market_price,vipshop_price,agio,is_display,sell_time_from,sell_time_to'
                });

                // 爆款推荐
                initTypeRecData('brandRecData', {   //默认值
                    method: 'search.brand.base',
                    page: '190009',
                    warehouse: 'VIP_NH',
                    fields: 'mobile_image_one,logo,name,id,img,to_warehouse,link,brand_id,pid,market_price,vipshop_price,agio,is_display,sell_time_from,sell_time_to'
                }, 1);

                // initTypeRecData('brandRecData');

                /**
                 * 初始化爆款推荐
                 * 1.特定的数据，在html定义的数据
                 * @param  {[type]} typeRecData [爆款类型, 'proRecData' | 'brandRecData']
                 * @param  {[type]} ofiledsDefault [爆款默认数据]
                 * @param  {[type]} type [分类， 商品爆款： 0，  档期爆款： 1，  默认： 0]
                 * @return {[type]}             [description]
                 */
                function initTypeRecData(typeRecData, ofiledsDefault, type){
                    // 商品爆款推荐 http://wiki.corp.vipshop.com/pages/viewpage.action?pageId=58767224~~~start
                    $scope[typeRecData] = {
                        showLayer        : false,
                        showMoreRuleList : false,
                        showMoreRuleCtn  : false,
                        curRuleIndex     : -1,
                        curEditType      : 'edit',  // edit, add
                        ruleList: []
                    };


                    // var oData = $scope[typeRecData];

                    //数据重置
                    $scope[typeRecData].fnResetData = function () {
                        $scope[typeRecData].showLayer = false;
                        $scope[typeRecData].showMoreRuleList = false;
                    };

                    //添加一个规则
                    $scope[typeRecData].fnAddRule = function () {
                        if( $scope[typeRecData].curEditType == 'add' )return;

                        if( $scope[typeRecData].ruleList[0] && !$scope[typeRecData].ruleList[0].id ){
                            $scope[typeRecData].fnSwitchRule(0);
                            return;
                        }

                        $scope[typeRecData].ruleList.unshift({
                            id: '',
                            name: '',
                            fields: $.extend(true, {}, ofiledsDefault)
                        });
                        $scope[typeRecData].curRuleData = $scope[typeRecData].ruleList[0];
                        $scope[typeRecData].curEditType = 'add';
                        $scope[typeRecData].ruleList[0].bAddItem = true;  //添加
                        $scope[typeRecData].fnSwitchRule(0);
                    }
                    //删除一个规则
                    $scope[typeRecData].fnDelRule = function (index) {
                        if( !oVerify.delRule() )return;

                        // 删除规则
                        var id = '';
                        if( id = $scope[typeRecData].ruleList[index].id ){
                            Page.delResysdRole({
                                id: id
                            },function (res) {
                                if(res.code == 1){
                                    $scope[typeRecData].ruleList.splice(index, 1);
                                    if( index === $scope[typeRecData].curRuleIndex ){
                                        $scope[typeRecData].curEditType = 'edit';
                                        $scope[typeRecData].dataBk = null;
                                        $scope[typeRecData].fnSwitchRule(0);
                                    }else if( index < $scope[typeRecData].curRuleIndex ){
                                        $scope[typeRecData].fnSwitchRule($scope[typeRecData].curRuleIndex-1);
                                    }
                                    $scope[typeRecData].fnUpdateRuleNameList();
                                    //如果全部删除了
                                    if(!$scope[typeRecData].ruleList.length){
                                        $scope[typeRecData].fnSetResysd();
                                    }
                                }else{
                                    alert(res.msg);
                                }
                            });
                        }else{
                            $scope[typeRecData].ruleList.splice(index, 1);
                            if( index === $scope[typeRecData].curRuleIndex ){
                                $scope[typeRecData].fnSwitchRule(0);
                            }
                        }

                    }
                    //显示隐藏规则列表
                    $scope[typeRecData].fnShowMoreList = function () {
                        if(!($scope[typeRecData].showMoreRuleList=!$scope[typeRecData].showMoreRuleList)){
                            $('.m-proRecRule .ruleList .ctn').scrollTop(0);
                        }
                    };
                    //显示隐藏规则内容
                    $scope[typeRecData].fnShowMoreCtn = function () {
                        if(!($scope[typeRecData].showMoreRuleCtn=!$scope[typeRecData].showMoreRuleCtn)){
                            $('.m-proRecRule .ruleCtn .ctn').scrollTop(0);
                        }
                    };

                    //添加， 修改
                    $scope[typeRecData].fnUpdate = function (){
                        $rootScope.curModule.modify = true;
                        if( !oVerify.confirm() )return;

                        if( $scope[typeRecData].curEditType == 'add' ){
                            Page.addResysdRole({
                                type: type || 0,
                                fields: $scope[typeRecData].curRuleData.fields
                            },function (res) {
                                if(res.code == 1){
                                   alert('添加成功');
                                   $scope[typeRecData].curEditType = 'edit';
                                   $scope[typeRecData].curRuleData.bAddItem = false;
                                   $scope[typeRecData].curRuleData.bEdit = false;
                                   $scope[typeRecData].curRuleData.id = $scope[typeRecData].curRuleData.fields.id = res.data;
                                   $scope[typeRecData].curRuleData.name = $scope[typeRecData].curRuleData.fields.name;
                                   $scope[typeRecData].ruleNameList.push($scope[typeRecData].curRuleData.name);
                                }else{
                                   alert(res.msg);
                                }
                            });
                        }else{
                            Page.editResysdRole({
                                id: $scope[typeRecData].curRuleData.id,
                                type: type || '0',
                                fields: $scope[typeRecData].curRuleData.fields
                            },function (res) {
                                if(res.code == 1){
                                   $scope[typeRecData].curRuleData.bEdit = false;
                                   $scope[typeRecData].fnSetResysd();
                                   $scope[typeRecData].showLayer = false;
                                   $scope[typeRecData].curRuleData.name = $scope[typeRecData].curRuleData.fields.name;
                                   $scope[typeRecData].fnUpdateRuleNameList();
                                }else{
                                    alert(res.msg);
                                }
                            });

                        }


                    }

                    // 更新规则名列表
                    $scope[typeRecData].fnUpdateRuleNameList = function () {
                        $scope[typeRecData].ruleNameList = [];
                        $.each($scope[typeRecData].ruleList, function(index, val) {
                            $scope[typeRecData].ruleNameList.push(val.fields.name);
                        });
                    }

                    $scope[typeRecData].fnSwitchRule = function (index) {
                        $scope[typeRecData].curRuleIndex = index;
                        $scope[typeRecData].curRuleData = $scope[typeRecData].ruleList[index];
                        if( $scope[typeRecData].curRuleData && $scope[typeRecData].curRuleData.bAddItem ){
                            $scope[typeRecData].curEditType = 'add';
                        }else{
                            $scope[typeRecData].curEditType = 'edit';
                        }
                    };

                    // 商品爆款推荐 http://wiki.corp.vipshop.com/pages/viewpage.action?pageId=58767224~~~ end
                    $scope[typeRecData].fnShowData = function () {
                        console.log($scope[typeRecData].curRuleData);
                    };

                    $scope.$watch('brandRecData.showLayer', function (newValue, oldValue) {
                         $rootScope.popupOpen = $scope[typeRecData].showLayer;
                    });


                    $scope[typeRecData].fnSetResysd = function (){
                        if( !$scope[typeRecData].curRuleData ){
                            $scope.curModule.model.resysd_id = '';
                            $scope.curModule.search.name = $scope.curModule.model.resysd_name = '';
                            return;
                        }
                        $scope.curModule.model.resysd_id = $scope[typeRecData].curRuleData.id;
                        $scope.curModule.search.name = $scope[typeRecData].curRuleData.fields.name;
                    }


                    // 校验
                    var oVerify = {
                        //切换时检查是否可以切换
                        switchRule: function () {
                            var res = true;

                            //添加规则时
                            // if( $scope[typeRecData].curEditType == 'add' && !confirm('是否放弃添加当前规则') )return false;

                            //修改已有规则时，做了修改且不同意放弃修改(没修改过就不做限制)
                            if( $scope[typeRecData].curRuleData.bEdit && !confirm('是否放弃当前规则修改') )return false;

                            return res;
                        },

                        //是否可以删除规则
                        delRule: function () {
                            var res = confirm('删除后不能恢复，确定删除吗？');
                            return res;
                        },

                        confirm: function () {
                            var res = true;
                            var ruleName = $scope[typeRecData].curRuleData.fields.name;
                            if( !$.trim(ruleName) ){
                                alert('请填写规则名称！');
                                return false;
                            }


                            if( $scope[typeRecData].curEditType == 'add' ){
                                if( ~$scope[typeRecData].ruleNameList.indexOf( ruleName ) ){
                                    alert('规则名称已经存在，请改另一规则名称');
                                    return false;
                                }
                            }else{
                                $scope[typeRecData].fnUpdateRuleNameList();
                                var ruleList = $scope[typeRecData].ruleNameList;
                                var index = ruleList.indexOf( ruleName );
                                var lastIndex = ruleList.lastIndexOf( ruleName )
                                if( ~index && index!=lastIndex ){
                                    alert('规则名称已经存在，请改另一规则名称');
                                    return false;
                                }
                            }
                            return res;
                        }
                    };


                }



                //同步到其他子页面 按钮
                $scope.toSyncOthers = function () {

                    var fitlerName = ['saleType', 'warehouse', 'consumerType', 'rule'];

                    $scope.popupSyncOpen = true;

                    $scope.syncData = {
                        pageList : $scope.pageList,
                        isReuseExcel : true,
                        curPage : $scope.curPage,
                        step : 1,
                        pageIds : [],
                        toCheckAll : function (type,$event) {
                            var data = this[type];

                            angular.forEach(data.list, function(value, key){
                                value.checked = data.checked;
                            });

                            setTimeout(function () {
                                $scope.syncData.switchFilter()
                            }, 0);
                        },
                        switchFilter : function () {
                            var self = this;

                            Page.getTplListByFilt({
                                id:this.curPage.id,
                                client:client,
                                special_id:special_id,
                                rule : this.rules,
                                warehouse : this.warehouses,
                                consumer_type : this.consumerTypes,
                                sale_type : this.saleTypes
                            },function (res) {
                                if(res.result){
                                    self.pageList = res.data;
                                }else{
                                    alert(res.msg);
                                }
                            })
                        },
                        confirmInfo : function () {
                            if(this.pageIds.length == 0){
                                alert('请选择要同步的子页面');
                                return;
                            }

                            this.toStep(2);
                        },
                        toStep : function (step) {
                            this.step = step;
                        },
                        postData : function () {
                            var ids = this.pageIds;

                            if(ids.length > 0 ){
                                Page.pullToPageSync({
                                    base_id:this.curPage.id,
                                    id : ids,
                                    isReuseExcel : this.isReuseExcel
                                },function (res) {
                                    if(res.result) {
                                        alert(res.msg);
                                        $scope.popupSyncOpen = false;
                                    }else{
                                        alert(res.msg);
                                    }
                                })
                            }else{
                                alert('请选择要同步的子页面！');
                            }
                        },
                        init : function () {
                            var self = this;

                            this.saleType = {
                                checked : false,
                                list : Page.getSaleType(function () {
                                        var arr = [];

                                        angular.forEach(self.saleType.list, function(value, key){
                                            if(Number.isInteger(+key)){
                                                arr.push(value);
                                            }
                                        });

                                        self.saleType.list = arr;
                                    })
                            }

                            this.consumerType = {
                                checked : false,
                                list : Page.getConsumerType(function () {})
                            };

                            this.rule = {
                                checked : false,
                                list : Page.getCdiRules(function () {
                                    self.rule.list.unshift({
                                        rule_id : '',
                                        rule_name : '默认'
                                    });
                                })
                            };

                            this.warehouse = {
                                checked : false,
                                list : Page.getWarehouse(function () {})
                            };
                        }
                    }

                    $scope.syncData.init();

                    // 监听数据变化
                    angular.forEach(fitlerName, function(value, key){
                        $scope.$watch('syncData.'+ value +'.list', function(newValue, oldValue, scope) {
                            if(newValue){
                                // 拿到选中的数据，并重新存到一个数组里面
                                $scope.syncData[value + 's'] = $.map(newValue,function (v,k) {
                                    if(v.checked) {
                                        return value == 'rule' ? v.rule_id : v.id;
                                    }
                                });

                                // 处理全选
                                if($scope.syncData[value + 's'].length == $scope.syncData[value].list.length){
                                    $scope.syncData[value].checked = true;
                                }else{
                                    $scope.syncData[value].checked = false;
                                }
                            }
                        }, true);
                    });

                    // 监听数据变化
                    $scope.$watch('syncData.pageList', function(newValue, oldValue, scope) {
                        if(newValue){
                            angular.forEach(newValue, function(parent, key){
                                angular.forEach(parent.data, function(rule, key){
                                    angular.forEach(rule.data, function(page, key){
                                        var pageId = page.page_id,
                                            index = $scope.syncData.pageIds.indexOf(pageId);

                                        if(pageId == $scope.syncData.curPage.id) {
                                            return
                                        }

                                        if(page.checked) {
                                            index == -1 && $scope.syncData.pageIds.push(pageId);
                                        }else{
                                            index != -1 && $scope.syncData.pageIds.splice(index,1);
                                        }
                                    });
                                });
                            });
                        }
                    }, true);
                }

                // $scope.toSyncOthers();

                // ueditor
                //
                $scope._simpleConfig = {
                    //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
                    toolbars:[[
                        'fullscreen', 'source', '|', 'undo', 'redo', '|',
                        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'autotypeset', 'pasteplain', '|', 'forecolor', 'backcolor', 'cleardoc', '|',
                        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                        'fontfamily', 'fontsize', '|',
                        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
                        'link', 'unlink', 'anchor', '|', 'insertimage'
                    ]],
                    //focus时自动清空初始化时的内容
                    autoClearinitialContent:true,
                    //关闭字数统计
                    wordCount:false,
                    //关闭elementPath
                    elementPathEnabled:false,
                    autoHeightEnabled : false,
                    initialFrameHeight : 500,
                    enableAutoSave: false,
                }
        }])
    }



})

