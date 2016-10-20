"use strict";

define(function(require, exports, module) {

    module.exports = function(app) {

        require('common/service/style')(app);
        require('common/service/special')(app);
        require('common/service/page')(app);
        require('common/directive/timepicker')(app);
        require('bower_component/jquery-ui/themes/smoothness/jquery-ui.min.css');
        require('bower_component/jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.min.css');


        app.register.directive('moduleEditor', function ($timeout, $rootScope, Style, Special, Page,  $routeParams) {
            return {
                restrict: 'EA',

                link: function(scope, iElement, iAttrs){

                    var client = $routeParams.client === 'pad' ? 'ipad' : 'iphone';

                    scope.$watch('curEditType', function(newValue, oldValue){

                        switch(newValue) {

                            // 品购组件 - 商品
                            case 'purchaseProductHotspot':
                                scope.initPurchase();
                                break;
                            // 品购组件 - URL
                            case 'purchaseUrlHotspot':
                                scope.initPurchase();
                                break;

                            // 品购组件 - 返回首页
                            case 'purchaseIndexHotspot':
                                scope.initPurchase();
                                break;

                            //品购组件 - 虚拟商品
                            case 'purchaseVirtualProductHotspot':
                                scope.initPurchase();
                                break;

                            //品购组件 - MZT支持跳转到原生品类页
                            case 'purchaseAppCategoryHotspot':
                                scope.initPurchase();
                                break;

                            // 品购组件
                            case 'purchase':
                                scope.initPurchase();
                                break;

                            // 图片组件 - 锚点
                            case 'headAnchor':
                                scope.initPicture();
                                break;

                            // 图片组件
                            case 'head':
                                scope.initPicture();
                                break;

                            // 图片组件 - 热区
                            case 'headHotspot':
                                scope.initPicture();
                                break;

                            // 档期组件
                            case 'brand':
                                scope.initBrand();
                                break;

                            // 档期组件
                            case 'brand_with_product':
                                scope.initBrand();
                                break;

                            // 档期组件 - 热区
                            case 'brandHotspot':
                                scope.initBrand();
                                break;

                            // 档期组件 - 批量编辑
                            case 'brandEditAll':
                                scope.initBrand();
                                break;

                            // 档期组件 - 设置标签
                            case 'brandLabel':
                                scope.initBrand();
                                break;

                            // 商品组件
                            case 'product':
                                scope.initProduct();
                                break;

                            // 商品组件 - 热区
                            case 'productHotspot':
                                scope.initProduct();
                                break;

                            // 商品组件 - 批量编辑
                            case 'productEditAll':
                                scope.initProduct();
                                break;

                            // 分享组件
                            case 'share':
                                scope.initShare();
                                break;

                            // 倒计时组件
                            case 'countdown':
                                scope.initCountdown();
                                break;

                            // 分享组件
                            case 'coupon':
                                scope.initCoupon();
                                break;

                            case 'couponNext':
                                scope.initCoupon();
                                break;

                            // 导航组件
                            case 'nav':
                                scope.initNav();
                                break;

                            // 导航组件 - 热区
                            case 'navHotspot':
                                scope.initNav();
                                break;

                            // 倒计时组件
                            case 'suspend':
                                scope.initSuspend();
                                break;

                            case 'suspendHotspot':
                                scope.initSuspend();
                                break;

                            // 海淘组件
                            case 'haitao':
                                scope.initHaitao();
                                break;

                            // 海淘组件 - 热区
                            case 'haitaoHotspot':
                                scope.initHaitao();
                                break;

                            // 海淘组件 - 批量编辑
                            case 'haitaoEditAll':
                                scope.initHaitao();
                                break;

                            // 美妆组件
                            case 'beauty':
                                scope.initBeauty();
                                break;

                            // 美妆组件 - 热区
                            case 'beautyHotspot':
                                scope.initBeauty();
                                break;

                            // 美妆组件 - 批量编辑
                            case 'beautyEditAll':
                                scope.initBeauty();
                                break;

                            // 商品收藏组件
                            case 'collect':
                                scope.initCollect();
                                break;

                            // 商品收藏组件 - 热区
                            case 'collectHotspot':
                                scope.initCollect();
                                break;

                            // 商品收藏组件 - 批量编辑
                            case 'collectEditAll':
                                scope.initCollect();
                                break;

                            // 倒计时组件
                            case 'suspend':
                                scope.initSuspend();
                                break;

                            case 'suspendHotspot':
                                scope.initSuspend();
                                break;

                            case 'channel':
                                scope.initChannel();
                                break;

                            //全局底色
                            case 'allbackground':
                                scope.initAllBackground();
                                break;

                            //自定义参数~~~
                            case 'custom_config':
                                scope.initCustomConfig();
                                break;

                            //自定义参数 -热区~~~
                            case 'custom_config_spot':
                                scope.initCustomConfigSpot();
                                break;

                            //富文本
                            case 'editor':
                                scope.initEditor();
                                break;


                            //定时任务
                            case 'timing':
                                scope.initPicture();
                                break;
                            //视频组件
                            case 'video':
                                scope.initVideo();
                                break;

                        }

                    })


                    // 品购组件初始化
                    scope.initPurchase = function(){
                        scope.triggerHotspotType = function($event){
                            $event.stopPropagation();
                            scope.isDropHotspotType = scope.isDropHotspotType ? false : true;
                            // console.log(scope.isDropHotspotType);
                        }

                        scope.changeToProductHotspot = function(){
                            // console.log("品购组件初始化-changeToProductHotspot");
                            if($rootScope.curBlock.position != undefined) return false;
                            $rootScope.curEditType = 'purchaseProductHotspot';
                            scope.isDropHotspotType = false;
                            delete $rootScope.curBlock.url;
                            delete $rootScope.curBlock.isBlank;

                            $rootScope.newBlockPosition.key = $rootScope.curBlock.position = $rootScope.getHotspotIdx($.map($rootScope.curModule.model.list || [], function(v){return v.position}));
                            $rootScope.curBlock.index = 0;
                        }

                        scope.changeToUrlHotspot = function(){
                            // console.log("品购组件初始化-changeToUrlHotspot");
                            // if($rootScope.curBlock.position  === undefined) return false;
                            $rootScope.curEditType = 'purchaseUrlHotspot';
                            scope.isDropHotspotType = false;
                            delete $rootScope.curBlock.position;
                            $rootScope.curBlock.url = '';
                            $rootScope.curBlock.isBlank = true;
                            $rootScope.curBlock.index = 1;
                        }

                        scope.changeToIndexHotspot = function(){
                            // console.log("品购组件初始化-changeToIndexHotspot");
                            $rootScope.curEditType = 'purchaseIndexHotspot';
                            scope.isDropHotspotType = false;
                            delete $rootScope.curBlock.url;
                            delete $rootScope.curBlock.isBlank;
                            delete $rootScope.curBlock.position;
                            $rootScope.curBlock.index = 2;
                        }

                        scope.changeToVirtualProductHotspot = function(){
                            // console.log("品购组件初始化-changeToVirtualProduct");
                            $rootScope.curEditType = 'purchaseVirtualProductHotspot';
                            scope.isDropHotspotType = false;
                            delete $rootScope.curBlock.url;
                            delete $rootScope.curBlock.isBlank;
                            delete $rootScope.curBlock.position;

                            $rootScope.curBlock.index = 3;
                        }

                        scope.changeToAppCategoryHotspot = function(){
                            // console.log("品购组件初始化-purchaseAppCategoryHotspot");
                            $rootScope.curEditType = 'purchaseAppCategoryHotspot';
                            scope.isDropHotspotType = false;
                            delete $rootScope.curBlock.url;
                            delete $rootScope.curBlock.isBlank;
                            delete $rootScope.curBlock.position;

                            $rootScope.curBlock.index = 4;
                        }


                        scope.$on('clickBody', function(){
                            scope.isDropHotspotType = false;
                        })

                        scope.cancelBlock = function(){
                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                        }

                        scope.updateBlock = function(){
                            var list = $rootScope.curModule.model.list, match;

                            // console.log("执行了品购组件下的-updateBlock");
                            // console.log($rootScope);

                            //品购热区 position
                            if($rootScope.curBlock.position != undefined) {
                                // $.each(list, function(k, v){
                                //  if(list[k].position == $rootScope.newBlockPosition.key) {
                                //      match = true;
                                //      return false;
                                //  }
                                // })

                                if(match){
                                    alert('位置重复，请重新输入');
                                } else {
                                    scope.curBlock.position = $rootScope.newBlockPosition.key;
                                    $rootScope.curEditType = '';
                                    $rootScope.curBlock = '';
                                }
                            } else {
                                $rootScope.curEditType = '';
                                $rootScope.curBlock = '';
                            }
                        }
                    }

                    // 图片组件初始化
                    scope.initPicture = function(){
                        scope.step = 1;
                        scope.options = [
                            {
                                id: 1,
                                name: '普通链接'
                            },
                            {
                                id: 2,
                                name: '商品列表'
                            },
                            {
                                id: 3,
                                name: '商品详情'
                            },
                            {
                                id: 4,
                                name: '锚点跳转'
                            },
                            {
                                id: 5,
                                name: '返回首页'
                            }
                        ];

                        scope.triggerHotspotType = function($event){
                            $event.stopPropagation();
                            scope.isDropHotspotType = scope.isDropHotspotType ? false : true;
                        }

                        scope.changeToProductHotspot = function(){
                            if($rootScope.curBlock.position != undefined) return false;
                            $rootScope.curEditType = 'purchaseProductHotspot';
                            scope.isDropHotspotType = false;
                            delete $rootScope.curBlock.url;
                            delete $rootScope.curBlock.isBlank;
                            $rootScope.newBlockPosition.key = $rootScope.curBlock.position = $rootScope.getHotspotIdx($.map($rootScope.curModule.model.list || [], function(v){return v.position}));
                        }

                        scope.changeToUrlHotspot = function(){
                            if($rootScope.curBlock.position  === undefined) return false;
                            $rootScope.curEditType = 'purchaseUrlHotspot';
                            scope.isDropHotspotType = false;
                            delete $rootScope.curBlock.position;
                            $rootScope.curBlock.url = '';
                            $rootScope.curBlock.isBlank = true;
                        }

                        scope.$on('clickBody', function(){
                            scope.isDropHotspotType = false;
                        })

                        scope.cancelBlock = function(){
                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                        }

                        scope.updateBlock = function(){
                            var list = $rootScope.curModule.model.list, match;

                            // if($rootScope.curBlock.position != undefined) {
                            //  $.each(list, function(k, v){
                            //      if(list[k].position == $rootScope.newBlockPosition.key) {
                            //          match = true;
                            //          return false;
                            //      }
                            //  })

                            //  if(match){
                            //      alert('位置重复，请重新输入');
                            //  } else {
                            //      scope.curBlock.position = $rootScope.newBlockPosition.key;
                            //      $rootScope.curEditType = '';
                            //      $rootScope.curBlock = '';
                            //  }
                            // } else {
                                $rootScope.curEditType = '';
                                $rootScope.curBlock = '';
                                $rootScope.curModule = $rootScope.curModule;
                            // }
                        }
                        scope.setPersonality = function(){
                            var model = $rootScope.curModule.model;
                            scope.step = 2;
                            if (model.rules) {
                                Page.getCdiRules({
                                    is_all: 0
                                }, function(re) {
                                    var newRules = [];
                                    var newRuleSrc = {};
                                    for (var i = 0; i < re.length; i++) {
                                        newRules.push({
                                            id: re[i].id,
                                            name: re[i].name,
                                            rule_id: re[i].rule_id,
                                            checked: false
                                        });
                                        newRuleSrc[re[i].id] = {
                                            phone_pic_src: '',
                                            pad_pic_src: ''
                                        };
                                    }
                                    angular.extend(newRules, model.rules);
                                    angular.extend(newRuleSrc, model.rule_pic_src);
                                    model.rules = newRules;
                                    model.rule_pic_src = newRuleSrc;
                                });
                                angular.forEach(model.rules, function(value, key) {
                                    model.rules[key].checked = JSON.parse(value.checked);
                                });
                            } else {
                                Page.getCdiRules({
                                    is_all: 0
                                }, function(re) {
                                    var rule_pic_src = {};
                                    model.rules = [];

                                    for (var i = 0; i < re.length; i++) {
                                        model.rules.push({
                                            id: re[i].id,
                                            name: re[i].name,
                                            rule_id: re[i].rule_id,
                                            checked: false
                                        });
                                        rule_pic_src[re[i].id] = {
                                            phone_pic_src: '',
                                            pad_pic_src: ''
                                        };
                                    }
                                    model = angular.extend(model, {
                                        'rule_pic_src': rule_pic_src
                                    });
                                });
                            }

                        }
                        scope.updatePersonality = function(){
                            scope.step = 1;
                        }
                    }

                    // 档期组件
                    scope.initBrand = function(){
                        scope.cancelBlock = scope.updateBlock = function(){
                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                        }

                        scope.saveEditingAll = function(batch){
                            var module = $rootScope.curModule;

                            $.each(module.data || [], function(k, v){
                                $.extend(v.extend, batch);
                            });

                            scope.cancelBlock();

                        }

                        scope.changeToBrandLabel = function () {
                            $rootScope.curEditType = 'brandLabel';
                        }
                        scope.changeToBrandProductLabel= function () {
                            $rootScope.curEditType = 'brandProductLabel';
                        }

                        scope.changeToBrand = function () {
                            $rootScope.curEditType = 'brand';
                        }

                        scope.changeToBrandProduct = function () {
                            $rootScope.curEditType = 'brand_with_product';
                        }

                        scope.addBrandLabel = function (label) {
                            var labels = $rootScope.curModule.labels,
                                flag = true;

                            $.each(labels,function () {
                                if(this.tagId == label.tagId) {
                                    flag = false;
                                }
                            })

                            if(flag) {
                                $rootScope.curModule.labels.push(label);
                            }else {
                                alert('标签不能重复设置。');
                            }
                        }

                        scope.removeBrandLabel = function (index) {
                            $rootScope.curModule.labels.splice(index,1);
                        }

                        scope.$watchCollection('curModule.labels', function(newValue, oldValue){
                            if(newValue){
                                var names = [],
                                    ids = [];

                                angular.forEach(newValue, function(value, key){
                                    names.push(value.name);
                                    ids.push(value.tagId);
                                });

                                $rootScope.curModule.model.labelName = names.join(',');
                                $rootScope.curModule.model.label = ids.join(',');
                            } else {
                            }
                        })

                        scope.searchBrandLabel = function ($event) {
                            var module = $rootScope.curModule;


                            if(!$event || $event.keyCode == 13){
                                if(module.searchKey == ''){
                                    alert('搜索条件不能为空！');
                                    return
                                }

                                // console.log(self.searchKey,Page);
                                module.brandLabels = Page.getLabelBySearch({
                                        search_key : module.searchKey
                                        // name : self.searchKey
                                    },function () {
                                        // console.log(2);
                                    })
                            }
                        }

                        //~~~
                         // 获取规则列表
                        Page.getResysdRoleList({
                            offset: 0,
                            size: 1000,
                            type: 1
                        }, function(res) {
                            if (res.code == 1) {
                                scope.brandRecData.ruleList = res.data.list;
                                scope.brandRecData.ruleNameList = []; //规则名，用于判断添加的规则名是否已经存在
                                $.each(scope.brandRecData.ruleList, function(index, val) {
                                    val.name = val.fields.name;
                                    scope.brandRecData.ruleNameList.push(val.name);
                                });

                            } else {
                                alert(res.msg);
                            }
                        });


                        scope.curModule.search = scope.curModule.search || {
                            name: ''
                        };

                        if (scope.curModule.model.resysd_fields) {
                            var name = scope.curModule.model.resysd_fields.fields.name;
                            if (name) {
                                scope.curModule.search.name = name;
                            }
                        }

                        //设置规则
                        scope.fnSetRule = function() {
                            var i = 0;
                            $.each(scope.brandRecData.ruleList, function(index, val) {
                                if (val.id == scope.curModule.model.resysd_id) {
                                    i = index;
                                    return;
                                }
                            });
                            scope.brandRecData.curRuleIndex = i;
                            scope.brandRecData.curRuleData = scope.brandRecData.ruleList[i];
                            scope.brandRecData.showLayer = true;
                            if (scope.brandRecData.curRuleData.id) {
                                scope.brandRecData.curEditType = 'edit';
                            } else {
                                scope.brandRecData.curEditType = 'add';
                            }
                            scope.bShowList = false;
                        };


                        scope.$watch('curModule.search.name', function(newValue, oldValue) {
                            if (newValue !== oldValue) {

                                var i = 0;
                                $.each(scope.brandRecData.ruleList, function(index, val) {
                                    if (newValue == val.name) {
                                        i++;
                                        return;
                                    }
                                });
                                if (!i) {
                                    scope.curModule.model.resysd_name = '';
                                    scope.curModule.model.resysd_id = '';
                                }
                            }



                        });

                        scope.bShowList = false;
                        scope.fnShowList = function() {
                            scope.bShowList = true;
                        }
                        scope.fnSetSearchName = function(item) {
                            scope.curModule.model.resysd_name = scope.curModule.search.name = item.name;
                            scope.curModule.model.resysd_id = item.id;

                            scope.bShowList = false;
                        };
                        //~~~




                        scope.setTimeRange = function (time, type) {
                            var module = $rootScope.curModule;
                            switch(type){
                                case 'start':
                                    module.model.brand_start_time = time;
                                    break;
                                case 'end':
                                    module.model.brand_end_time = time;
                                    break;
                            }

                            if(module.model.brand_start_time && module.model.brand_end_time){
                                var start = new Date(module.model.brand_start_time).getTime();
                                var end = new Date(module.model.brand_end_time).getTime();
                                if (start > end) {
                                    alert('结束时间不能小于开始时间');
                                }
                            }
                        }

                    }

                    // 档期组件
                    scope.initProduct = function(){
                        scope.cancelBlock = scope.updateBlock = function(){
                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                        }

                        scope.saveEditingAll = function(batch){
                            var module = $rootScope.curModule;

                            $.each(module.data || [], function(k, v){
                                $.extend(v.extend, batch);
                            });

                            scope.cancelBlock();
                        }

                        //~~~
                         // 获取规则列表
                        Page.getResysdRoleList({
                            offset: 0,
                            size: 1000,
                            type: 0
                        },function (res) {
                            if(res.code == 1){
                                scope.proRecData.ruleList = res.data.list;
                                scope.proRecData.ruleNameList = []; //规则名，用于判断添加的规则名是否已经存在
                                $.each(scope.proRecData.ruleList, function(index, val) {
                                    val.name = val.fields.name;
                                    scope.proRecData.ruleNameList.push(val.name);
                                });

                            }else{
                                alert(res.msg);
                            }
                        });


                        scope.curModule.search = scope.curModule.search || { name: ''};

                        if( scope.curModule.model.resysd_fields ){
                            var name = scope.curModule.model.resysd_fields.fields.name;
                            if(name){
                                scope.curModule.search.name = name;
                            }
                        }

                        //设置规则
                        scope.fnSetRule = function () {
                            var i = 0;
                            $.each(scope.proRecData.ruleList, function(index, val) {
                                 if( val.id == scope.curModule.model.resysd_id ){
                                    i = index;
                                    return;
                                 }
                            });
                            scope.proRecData.curRuleIndex = i;
                            scope.proRecData.curRuleData = scope.proRecData.ruleList[i];
                            scope.proRecData.showLayer = true;
                            if( scope.proRecData.curRuleData.id ){
                                scope.proRecData.curEditType = 'edit';
                            }else{
                                scope.proRecData.curEditType = 'add';
                            }
                            scope.bShowList = false;
                        };


                        scope.$watch('curModule.search.name', function (newValue, oldValue) {
                            if( newValue !== oldValue ){

                                var i = 0;
                                $.each(scope.proRecData.ruleList, function(index, val) {
                                    if( newValue == val.name ){
                                        i++;
                                        return;
                                    }
                                });
                                if(!i){
                                    scope.curModule.model.resysd_name = '';
                                    scope.curModule.model.resysd_id = '';
                                }
                            }



                        });

                        scope.bShowList = false;
                        scope.fnShowList = function () {
                            scope.bShowList = true;
                        }
                        scope.fnSetSearchName = function  (item) {
                            scope.curModule.model.resysd_name = scope.curModule.search.name = item.name;
                            scope.curModule.model.resysd_id = item.id;

                            scope.bShowList = false;
                        };

                    }

                    // 分享组件
                    scope.initShare = function(){
                        var module = $rootScope.curModule;

                        if(!module.model) module.model = {};

                        if(!module.model.is_tab) {
                            module.model.is_tab = 'false'
                        }

                        scope.cancelBlock = scope.updateBlock = function(){
                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                        }

                        scope.$watch('curModule.keyword', function(newValue, oldValue){
                            if(newValue){
                                if(oldValue === undefined || newValue === oldValue) module.droplist = '';

                                Special.getShareListByKW({
                                    keyword: module.keyword,
                                    plat_type: client
                                }, function(data){
                                    module.droplist = data.data.data.list;
                                })
                            } else {
                                module.droplist = '';
                            }
                        })

                        scope.chooseSharedId = function(item){
                            module.droplist = false;
                            module.model.plugin_id = item.id;
                        }
                    }

                    // 分享组件
                    scope.initCountdown = function(){
                        scope.cancelBlock = function(){
                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                        }
                    }

                    // 分享组件
                    scope.initCoupon = function(){
                        scope.cancelBlock = scope.updateBlock = function(){
                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                        }

                        scope.goToStep = function (curEditType) {
                            $rootScope.curEditType = curEditType;
                        }
                    }

                    // 悬浮球组件
                    scope.initSuspend = function(){
                        scope.options = [{
                            id: 1,
                            name: '普通链接'
                        },{
                            id: 2,
                            name: '收起弹层'
                        },{
                            id: 3,
                            name: '返回首页'
                        }]

                        scope.triggerHotspotType = function($event){
                            $event.stopPropagation();
                            scope.isDropHotspotType = scope.isDropHotspotType ? false : true;
                        }

                        scope.$on('clickBody', function(){
                            scope.isDropHotspotType = false;
                        })

                        scope.cancelBlock = function(){
                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                        }

                        scope.changeTabCount = function(){
                            var module = $rootScope.curModule, count = module.model.total, curCount = module.model.list.length;

                            if(count < curCount || count == curCount){
                                module.model.list.splice(count, curCount - count);
                            } else {
                                for(var i = 0; i < count - curCount; i++){
                                    module.model.list.push({
                                        "type" : 1,
                                        "url" : "",
                                        "title" : "",
                                        "isBlank": "true"
                                    })
                                }
                            }
                        }

                        scope.updateBlock = function(){
                            var list = $rootScope.page.moduleList[0].model.list, match;

                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                        }
                    }

                    // 导航组件
                    scope.initNav = function(){
                        // console.log("导航组件-初始化");
                        scope.options = [{
                            id: 1,
                            name: '普通链接'
                        },{
                            id: 2,
                            name: '档期列表'
                        },{
                            id: 3,
                            name: '商品列表'
                        },{
                            id: 4,
                            name: '锚点跳转'
                        },{
                            id: 5,
                            name: '返回首页'
                        }];

                        scope.triggerHotspotType = function($event){
                            $event.stopPropagation();
                            scope.isDropHotspotType = scope.isDropHotspotType ? false : true;
                        }

                        scope.$on('clickBody', function(){
                            scope.isDropHotspotType = false;
                        })

                        scope.cancelBlock = function(){
                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                        }

                        scope.changeTabCount = function(){
                            var module = $rootScope.curModule,
                                count, curCount;

                            module.model.list = module.model.list || [];

                            if(module){
                                count = module.model.total;
                                curCount = module.model.list.length;

                                if(count < curCount || count == curCount){
                                    module.model.list.splice(count, curCount - count);
                                } else {
                                    for(var i = 0; i < count - curCount; i++){
                                        module.model.list.push({
                                            "type" : 1,
                                            "url" : "",
                                            "title" : "",
                                            "isBlank": "true"
                                        })
                                    }
                                }
                            }
                        }
                    }

                    scope.initHaitao = function(){
                        $rootScope.multi_pic_tips = '批量上传图片';
                        scope.options = [{
                                "id": 1,
                                "name": "美国",
                                "pic": "http://b.appsimg.com/2015/08/12/6767/560368194fce4a438c41e94bb29291fe-am.jpg"
                            }, {
                                "id": 2,
                                "name": "澳大利亚",
                                "pic": "http://b.appsimg.com/2015/08/12/826/e2924155139bdee7eb9936cd084b7ed3-au.jpg"
                            }, {
                                "id": 3,
                                "name": "加拿大",
                                "pic": "http://b.appsimg.com/2015/08/12/3166/2dbc88dffe612ac3b2e06f8b15c30aaf-ca.jpg"
                            }, {
                                "id": 4,
                                "name": "荷兰",
                                "pic": "http://b.appsimg.com/2015/08/12/8751/3b1162821f0f6f51d7fe8af80e5e5ad1-du.jpg"
                            }, {
                                "id": 5,
                                "name": "英国",
                                "pic": "http://b.appsimg.com/2015/08/12/2089/ef25b96e475f32900f64c2802a46ae03-en.jpg"
                            }, {
                                "id": 6,
                                "name": "日本",
                                "pic": "http://b.appsimg.com/2015/08/12/8397/4bb8dded41026de37dcb359f7037e535-ja.jpg"
                            }, {
                                "id": 7,
                                "name": "法国",
                                "pic": "http://b.appsimg.com/2015/08/12/9547/787fc43d241203f04bea2238276b43ed-fr.jpg"
                            }, {
                                "id": 8,
                                "name": "德国",
                                "pic": "http://b.appsimg.com/2015/08/12/1677/6c39f8c01ecda94ea0a5ad4c1feb3e0d-ge.jpg"
                            }, {
                                "id": 9,
                                "name": "香港",
                                "pic": "http://b.appsimg.com/2015/08/12/7688/359997e934617678486bf3ea0ddce4d8-ho.jpg"
                            }, {
                                "id": 10,
                                "name": "意大利",
                                "pic": "http://b.appsimg.com/2015/08/12/552/f0038f59b7f4d0ca5fd8be4761f3f8cb-it.jpg"
                            }, {
                                "id": 11,
                                "name": "韩国",
                                "pic": "http://b.appsimg.com/2015/08/12/4495/23650654e54cdaac6164a950fb07a3b5-ko.jpg"
                            }, {
                                "id": 12,
                                "name": "葡萄牙",
                                "pic": "http://b.appsimg.com/2015/08/12/9810/e659c84c6e56620700d52f985ea2a578-po.jpg"
                            }, {
                                "id": 13,
                                "name": "台湾",
                                "pic": "http://b.appsimg.com/2015/08/12/7495/85a9eec5074073dbffff5f721a88c48b-ta.jpg"
                            }, {
                                "id": 14,
                                "name": "泰国",
                                "pic": "http://b.appsimg.com/2015/08/12/5244/2c535eaf81c4706505f099251fbb8f90-th.jpg"
                            },{
                                "id" : 15,
                                "name" : "地球",
                                "pic": "http://b.appsimg.com/2015/08/14/902/3abb5bf140533a94d18bbe9e53cc4ecd-eh.jpg"
                            }];
                        // console.log(scope.options);

                        scope.triggerHotspotType = function($event){
                            $event.stopPropagation();
                            scope.isDropHotspotType = scope.isDropHotspotType ? false : true;
                        }

                        scope.cancelBlock = scope.updateBlock = function(){
                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                            $rootScope.multi_pic_tips = '批量上传图片';
                        }

                        scope.$on('clickBody', function(){
                            scope.isDropHotspotType = false;
                        })

                        scope.saveEditingAll = function(batch){
                            var module = $rootScope.curModule;

                            $.each(module.data || [], function(k, v){
                                $.extend(v.extend, batch);
                            });

                            scope.cancelBlock();
                        }
                    }

                    // 海淘单品组件
                    scope.initBeauty = function(){
                        $rootScope.multi_pic_tips = '批量上传图片';

                        scope.cancelBlock = scope.updateBlock = function(){
                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                            $rootScope.multi_pic_tips = '批量上传图片';
                        }

                        scope.saveEditingAll = function(batch){
                            var module = $rootScope.curModule;

                            $.each(module.data || [], function(k, v){
                                $.extend(v.extend, batch);
                            });

                            scope.cancelBlock();
                        }
                    }

                    // 海淘单品组件
                    scope.initCollect = function(){
                        $rootScope.multi_pic_tips = '批量上传图片';

                        scope.cancelBlock = scope.updateBlock = function(){
                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                            $rootScope.multi_pic_tips = '批量上传图片';
                        }

                        scope.saveEditingAll = function(batch){
                            var module = $rootScope.curModule;

                            $.each(module.data || [], function(k, v){
                                $.extend(v.extend, batch);
                            });

                            scope.cancelBlock();
                        }
                    }

                    scope.initChannel = function () {
                        var module = $rootScope.curModule;

                        scope.options = Special.getChannelList(function () {
                            angular.forEach(scope.options, function(value, key){
                                if(value.id == module.model.channel_id) {
                                    module.extend.selected = value;
                                }
                            });
                        });

                        scope.$on('clickBody', function(){
                            scope.isDropHotspotType = false;
                        })

                        scope.triggerHotspotType = function($event){
                            $event.stopPropagation();
                            scope.isDropHotspotType = scope.isDropHotspotType ? false : true;
                        }

                        scope.cancelBlock = function(){
                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                        }
                    }

                    //全局底色
                    scope.initAllBackground = function(){
                        var module = $rootScope.curModule;

                        if(!module.model || typeof module.model.bodycolor == 'undefined') {
                            module.model = {
                                bodycolor : 'ffffff'
                            };
                        }

                        scope.cancelBlock = scope.updateBlock = function(){
                            // $rootScope.curModule = '';
                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                        }

                    }
                    var oConfig = {};
                    // 数组去重
                    oConfig.setUnique = function (arr) {
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
                    oConfig.replaceEmptyItem = function (arr){
                        for(var i=0,len=arr.length;i<len;i++){
                            if(!arr[i]|| arr[i]==''){
                                arr.splice(i,1);
                                len--;
                            }
                        }
                    }



                    //自定义参数组件 ~~~
                    var hasWatch = false;   //已经执行过一次initCustomConfig的模块index
                    
                    scope.cancelBlock = function(){
                        $rootScope.curEditType = '';
                        $rootScope.curBlock = '';
                    }

                    scope.initCustomConfig = function () {
                        var tmp=[];//暂存依赖值列表，数组每次初始化
                        var curModule = $rootScope.curModule;
                        //有数据
                        if(curModule.source){
                            var custom_configs = curModule.source.custom_configs;
                            // console.log(custom_configs);
                            if( custom_configs ){
                                //将'true','false'转成true,false
                                curModule.model = curModule.model || {};

                                // 从config拿到配置信息
                                $.each(custom_configs, function(index, val) {
                                    // 初始化依赖值内容，数组去重，并且兼容旧组件没有该配置项，设为null，在下边列表再去重
                                    if (val.dep == undefined){
                                        val.dep='';
                                    }
                                    // console.log('遍历每个配置项dep数据'+val.dep);
                                    $.each(val.dep.split(","), function(index, val) {
                                        tmp.push(val);
                                    });
                                    if(val.bNeed.toString()=='true'){  //必填
                                        val.bNeed = true;
                                    }else{
                                        val.bNeed = false;
                                        curModule.model[ val.id ] = curModule.model[ val.id ] || val.defaultVal;
                                    }
                                });
                                curModule.dep = oConfig.setUnique(tmp);//去重
                                oConfig.replaceEmptyItem(curModule.dep);//去空格
                                curModule.selectDep = curModule.source.selectDep;
                            }else{
                                curModule.source.custom_configs = [];
                            }

                        //无有数据
                        }else{
                            curModule.source = null;
                            return;
                        }

                        //存储图片到model，一个模块只执行一次
                        // if( !~aHasInitModule.indexOf( scope.curModule.style_group_id ) ){
                        if( !hasWatch ){
                            // aHasInitModule.push( scope.curModule.style_group_id );
                            hasWatch = true;
                            scope.$watch('CUSTOM_CONFIG_CONFIG.bChangePic', function (newValue, oldValue) {

                                if( !$rootScope.curModule.source )return false;

                                var model = $rootScope.curModule.model;
                                var picType = $rootScope.curModule.source.PIC_TYPE; //modelId_imgId
                                if( !picType )return;
                                var oldPic = model[picType+'_pic_src'];
                                var newPic = model[picType+'_pic_src'];

                                if( newValue !== oldValue && picType ){
                                    var index = picType.indexOf('_');
                                    var configId = picType.substring( 0, index);
                                    var imgId = picType.substring(index+1);

                                    model[configId] = model[configId] || {};
                                    model[configId][imgId] = newPic;
                                    delete model[picType+'_pic_src'];
                                }
                            },true);
                        }

                        //显示数据，临时
                        scope.fnShowConfig = function () {
                            console.log( $rootScope.curModule.model );
                            console.log(JSON.stringify($rootScope.curModule.model) );
                        }


                        //delImg
                        //需要约定的参数名字。后端参数一起变化
                        scope.delImg = function(index, id, imgData, imgDataItem) {
                            imgData.splice(index,1);
                            delete $rootScope.curModule.model[id][imgDataItem];
                            $rootScope.curModule.modify = true;
                        };


                        //addImg
                        //需要约定的参数名字。后端参数一起变化
                        scope.addImg = function (imgData) {
                            var tmp = imgData.pop();
                            imgData.push({
                                des    : tmp.des,//参数名称
                                id     : tmp.id//参数id
                            });
                            imgData.push({
                                des    : tmp.des,//参数名称
                                id     : ++tmp.id//参数id
                            });
                            $rootScope.curModule.modify = true;
                            //console.log(imgData);
                        }

                        // 设置依赖值
                        scope.setSetectDep = function (selectDep) {
                            curModule.source.selectDep = selectDep;
                            // 置空切换后的数据
                            $.each(custom_configs, function(index, val) {
                                // 组件说明字段保留不清空
                                // console.log(val.type);
                                if (val.type !== 'instruction'){
                                    curModule.model[val.id] = '';
                                }
                            });
                        }

                        // 根据依赖值显示
                        scope.showSelectDep = function (data, select) {
                            //console.log(data);
                            if(data.id){
                                // 选项不填默认为空，表示全部依赖,undefined兼容旧版本组件
                                if (data.dep == '' || data.dep == undefined){
                                    return true;
                                } else {
                                    //console.log(data.dep);
                                    var deps = data.dep.split(',');
                                    for (var i = deps.length - 1; i >= 0; i--) {
                                        if(select == deps[i]){
                                            return true;
                                        }
                                    };
                                }
                                return false;
                            }else{
                                return false;
                            }
                        }

                    };
                    //自定义参数组件 ~~~

                    //自定义参数组件-热区 ~~~
                    scope.initCustomConfigSpot = function () {


                        scope.options = $rootScope.curModule.source.spot_options;
                        scope.optionsObj = {};
                        $.each(scope.options, function(index, val) {
                             scope.optionsObj[val.id] = val.name;
                        });

                        scope.triggerHotspotType = function($event){
                            $event.stopPropagation();
                            scope.isDropHotspotType = scope.isDropHotspotType ? false : true;
                        }

                        scope.changeToProductHotspot = function(){
                            if($rootScope.curBlock.position != undefined) return false;
                            $rootScope.curEditType = 'purchaseProductHotspot';
                            scope.isDropHotspotType = false;
                            delete $rootScope.curBlock.url;
                            delete $rootScope.curBlock.isBlank;
                            $rootScope.newBlockPosition.key = $rootScope.curBlock.position = $rootScope.getHotspotIdx($.map($rootScope.curModule.model.list || [], function(v){return v.position}));

                        }

                        scope.changeToUrlHotspot = function(){
                            if($rootScope.curBlock.position  === undefined) return false;
                            $rootScope.curEditType = 'purchaseUrlHotspot';
                            scope.isDropHotspotType = false;
                            delete $rootScope.curBlock.position;
                            $rootScope.curBlock.url = '';
                            $rootScope.curBlock.isBlank = true;
                        }

                        scope.$on('clickBody', function(){
                            scope.isDropHotspotType = false;
                        })

                        scope.cancelBlock = function(){
                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                        }

                        scope.updateBlock = function(){
                            var list = $rootScope.curModule.model.list, match;

                            // if($rootScope.curBlock.position != undefined) {
                            //  $.each(list, function(k, v){
                            //      if(list[k].position == $rootScope.newBlockPosition.key) {
                            //          match = true;
                            //          return false;
                            //      }
                            //  })

                            //  if(match){
                            //      alert('位置重复，请重新输入');
                            //  } else {
                            //      scope.curBlock.position = $rootScope.newBlockPosition.key;
                            //      $rootScope.curEditType = '';
                            //      $rootScope.curBlock = '';
                            //  }
                            // } else {
                                $rootScope.curEditType = '';
                                $rootScope.curBlock = '';
                                $rootScope.curModule = $rootScope.curModule;
                            // }
                        }

                    };
                    //自定义参数组件-热区end ~~~

                    //富文本
                    scope.initEditor = function(){
                        var module = $rootScope.curModule;

                        scope.cancelBlock = scope.updateBlock = function(){
                            // $rootScope.curModule = '';
                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                            module.editing = false;
                        }

                        module.editing = true;
                    }

                    //视频组件
                    scope.initVideo= function(){
                        var module = $rootScope.curModule;
                        // console.log('test-initVideo');

                        scope.cancelBlock = scope.updateBlock = function(){
                            // $rootScope.curModule = '';
                            $rootScope.curEditType = '';
                            $rootScope.curBlock = '';
                        }
                    }

                    // 公共方法
                    scope.popStyle = function(){
                        Style.getStyleList({
                            "page" : 1,
                            "style_cate_id" : $rootScope.curModule.style_cate_id,
                            "is_default" : '',
                            "pageNum" : 200,
                            "filter_name" : ''
                        }, function(data){
                            $rootScope.styleList = data.list;
                            $rootScope.isShowPopStyle = true;
                        });
                    }

                },

                templateUrl: '/common/directive/module_editor.html'
            }
        });

    }

})







