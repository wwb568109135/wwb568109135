"use strict";

/**
 * 程序主入口
 */
define(function(require, exports, module) {

    require('common/app_config');
    require('common/service/util');
    require('common/filter/filter');
    require('file-upload');

    var app = angular.module('app', ['ngRoute', 'angular-lazyload', 'appConfig', 'ngAnimate', 'ngDragDrop', 'ngResource', 'util','angularFileUpload', 'filter', 'angularUtils.directives.dirPagination', 'angular-sortable-view', 'ng.ueditor']);

    //注册路由
    app.config(['$routeProvider', function($routeProvider) {
            $routeProvider
            // 首页
            .when('/index', {
                name: "首页",
                controller: 'IndexCtrl',
                controllerUrl: '/module/index/index_ctrl.js',
                templateUrl: '/module/index/index_tpl.html'
            })
            // 搜索
            .when('/search', {
                name: "搜索",
                controller: 'IndexCtrl',
                controllerUrl: '/module/index/index_ctrl.js',
                templateUrl: '/module/index/index_tpl.html'
            })

            // 搜过 - 关键字
            .when('/search/:name', {
                name: "搜索关键字",
                controller: 'IndexCtrl',
                controllerUrl: '/module/index/index_ctrl.js',
                templateUrl: '/module/index/index_tpl.html'
            })

            // -------------------------------- MZT -------------------------------------
            // 列表
            // .when('/special/list/:type/:keywork/:sortby', {
            //     name: "MZT列表",
            //     controller: 'SpecialListCtrl',
            //     controllerUrl: '/module/special/special_list_ctrl.js',
            //     templateUrl: '/module/special/special_list_tpl.html'
            // })

            // MZT分类管理列表
            .when('/special/list', {
                name: "MZT列表",
                controller: 'SpecialListCtrl',
                controllerUrl: '/module/special/special_list_ctrl.js',
                templateUrl: '/module/special/special_list_tpl.html'
            })


            // 创建属性录入
            .when('/special/create', {
                name: "MZT创建属性录入",
                controller: 'SpecialEditCtrl',
                controllerUrl: '/module/special/special_edit_ctrl.js',
                templateUrl: '/module/special/special_edit_tpl.html'
            })

            // 编辑
            .when('/special/edit/:id', {
                name: "MZT编辑",
                controller: 'SpecialEditCtrl',
                controllerUrl: '/module/special/special_edit_ctrl.js',
                templateUrl: '/module/special/special_edit_tpl.html'
            })

            // 预览
            .when('/preview/:id', {
                name: "预览",
                controller: 'PreviewCtrl',
                controllerUrl: '/module/preview/preview_ctrl.js',
                templateUrl: '/module/preview/preview_tpl.html'
            })

            // -------------------------------- 页面 -------------------------------------
            // 编辑
            .when('/page/edit/:id', {
                name: "页面编辑",
                controller: 'PageEditCtrl',
                controllerUrl: '/module/page/page_edit_ctrl.js',
                templateUrl: '/module/page/page_edit_tpl.html'
            })
            // 创建
            .when('/page/create', {
                name: "页面创建",
                controller: 'PageCreateCtrl',
                controllerUrl: '/module/page/page_create_ctrl.js',
                templateUrl: '/module/page/page_create_tpl.html'
            })

            // 创建子页面
            .when('/page/create/sub', {
                name: "子页面创建",
                controller: 'PageSubCreateCtrl',
                controllerUrl: '/module/page/page_sub_create_ctrl.js',
                templateUrl: '/module/page/page_sub_create_tpl.html'
            })

            // 一键导入id
            .when('/page/:id/upload', {
                name: "一键导入id",
                controller: 'PageIdUploadCtrl',
                controllerUrl: '/module/page/page_id_upload_ctrl.js',
                templateUrl: '/module/page/page_id_upload_tpl.html'
            })

            // -------------------------------- 用户 -------------------------------------
            // 列表
            .when('/user/list', {
                name: "用户列表",
                controller: 'UserListCtrl',
                controllerUrl: '/module/user/user_list_ctrl.js',
                templateUrl: '/module/user/user_list_tpl.html'
            })

            // 创建
            .when('/user/create', {
                name: "用户创建",
                controller: 'UserCreateCtrl',
                controllerUrl: '/module/user/user_create_ctrl.js',
                templateUrl: '/module/user/user_create_tpl.html'
            })

            // 编辑
            .when('/user/edit/:id', {
                name: "用户编辑",
                controller: 'UserCreateCtrl',
                controllerUrl: '/module/user/user_create_ctrl.js',
                templateUrl: '/module/user/user_create_tpl.html'
            })

            // -------------------------------- 角色管理 -------------------------------------
            // 列表
            .when('/role/list', {
                name: "角色列表",
                controller: 'RoleListCtrl',
                controllerUrl: '/module/role/role_list_ctrl.js',
                templateUrl: '/module/role/role_list_tpl.html'
            })

            // 创建
            .when('/role/create', {
                name: "角色创建",
                controller: 'RoleCreateCtrl',
                controllerUrl: '/module/role/role_create_ctrl.js',
                templateUrl: '/module/role/role_create_tpl.html'
            })

            // 编辑
            .when('/role/edit/:id', {
                name: "角色编辑",
                controller: 'RoleCreateCtrl',
                controllerUrl: '/module/role/role_create_ctrl.js',
                templateUrl: '/module/role/role_create_tpl.html'
            })

            // -------------------------------- 样式管理 -------------------------------------
            // 列表
            .when('/style/list', {
                name: "样式列表",
                controller: 'StyleListCtrl',
                controllerUrl: '/module/style/style_list_ctrl.js',
                templateUrl: '/module/style/style_list_tpl.html'
            })

            // 创建
            .when('/style/create', {
                name: "样式创建",
                controller: 'StyleCreateCtrl',
                controllerUrl: '/module/style/style_create_ctrl.js',
                templateUrl: '/module/style/style_create_tpl.html'
            })

            // 编辑
            .when('/style/edit/:id', {
                name: "样式编辑",
                controller: 'StyleCreateCtrl',
                controllerUrl: '/module/style/style_create_ctrl.js',
                templateUrl: '/module/style/style_create_tpl.html'
            })

            // -------------------------------- 样式分组管理 -------------------------------------
            // 列表
            .when('/style/cate/list', {
                name: "样式分组列表",
                controller: 'StyleCateListCtrl',
                controllerUrl: '/module/style/style_cate_list_ctrl.js',
                templateUrl: '/module/style/style_cate_list_tpl.html'
            })

            // 创建
            .when('/style/cate/create', {
                name: "样式分组创建",
                controller: 'StyleCateCreateCtrl',
                controllerUrl: '/module/style/style_cate_create_ctrl.js',
                templateUrl: '/module/style/style_cate_create_tpl.html'
            })

            // 编辑
            .when('/style/cate/edit/:id', {
                name: "样式分组编辑",
                controller: 'StyleCateCreateCtrl',
                controllerUrl: '/module/style/style_cate_create_ctrl.js',
                templateUrl: '/module/style/style_cate_create_tpl.html'
            })

            // -------------------------------- 组件管理 -------------------------------------
            // 列表
            .when('/component/list', {
                name: "组件列表",
                controller: 'ComponentListCtrl',
                controllerUrl: '/module/component/component_list_ctrl.js',
                templateUrl: '/module/component/component_list_tpl.html'
            })

            // 创建
            .when('/component/create', {
                name: "组件创建",
                controller: 'ComponentCreateCtrl',
                controllerUrl: '/module/component/component_create_ctrl.js',
                templateUrl: '/module/component/component_create_tpl.html'
            })

            // 编辑
            .when('/component/edit/:id', {
                name: "组件编辑",
                controller: 'ComponentCreateCtrl',
                controllerUrl: '/module/component/component_create_ctrl.js',
                templateUrl: '/module/component/component_create_tpl.html'
            })

            // -------------------------------- 客户端管理 -------------------------------------
            // 列表
            .when('/client/list', {
                name: "客户端列表",
                controller: 'ClientListCtrl',
                controllerUrl: '/module/client/client_list_ctrl.js',
                templateUrl: '/module/client/client_list_tpl.html'
            })

            // -------------------------------- 客户端版本管理 -------------------------------------
            // 列表
            .when('/client/version/list', {
                name: "客户端版本列表",
                controller: 'ClientVersionListCtrl',
                controllerUrl: '/module/client/client_version_list_ctrl.js',
                templateUrl: '/module/client/client_version_list_tpl.html'
            })

            // -------------------------------- 客户类型管理 -------------------------------------
            // 列表
            .when('/consumer/list', {
                name: "客户类型列表",
                controller: 'ConsumerListCtrl',
                controllerUrl: '/module/consumer/consumer_list_ctrl.js',
                templateUrl: '/module/consumer/consumer_list_tpl.html'
            })

            // -------------------------------- 日志管理 -------------------------------------
            // 列表
            .when('/log/list', {
                name: "日志列表",
                controller: 'LogListCtrl',
                controllerUrl: '/module/log/log_list_ctrl.js',
                templateUrl: '/module/log/log_list_tpl.html'
            })

            // -------------------------------- id白名单管理 -------------------------------------
            // 编辑
            .when('/whiteList/edit', {
                name: "id白名单",
                controller: 'WhiteListCtrl',
                controllerUrl: '/module/whiteList/white_list_ctrl.js',
                templateUrl: '/module/whiteList/white_list_tpl.html'
            })

            // -------------------------------- 模块 -------------------------------------
            // 列表
            .when('/module/list', {
                name: "模块列表",
                controller: 'ModuleListCtrl',
                controllerUrl: '/module/module_list_ctrl.js',
                templateUrl: '/module/module_list_tpl.html'
            })

            // 创建
            .when('/module/create', {
                name: "模块创建",
                controller: 'ModuleCreateCtrl',
                controllerUrl: '/module/module_create_ctrl.js',
                templateUrl: '/module/module_create_tpl.html'
            })

            // 编辑
            .when('/module/edit/:id', {
                name: "模块编辑",
                controller: 'ModuleEditCtrl',
                controllerUrl: '/module/module_edit_ctrl2.js',
                templateUrl: '/module/module_edit_tpl2.html'
            })

            // MZT - 发布 - 列表
            .when('/special/:id/publish', {
                name: "MZT发布列表",
                controller: 'SpecialPublishListCtrl',
                controllerUrl: '/module/special/special_publish_list_ctrl.js',
                templateUrl: '/module/special/special_publish_list_tpl.html'
            })

            // MZT - 发布 - 编辑
            .when('/special/:id/publish/edit/:items', {
                name: "MZT发布列表",
                controller: 'SpecialPublishEditCtrl',
                controllerUrl: 'module/special/special_publish_edit_ctrl.js',
                templateUrl: '/module/special/special_publish_edit_tpl.html'
            })

            // cdi管理
            .when('/cdi/list', {
                name: "cdi列表",
                controller: 'CdiRuleCtrl',
                controllerUrl: 'module/cdi/cdi_rule_list_ctrl.js',
                templateUrl: '/module/cdi/cdi_rule_list_tpl.html'
            })

            // MZT缓存管理
            .when('/cache/clear', {
                name: "清楚缓存",
                controller: 'CacheClearCtrl',
                controllerUrl: 'module/cache/cache_clear_ctrl.js',
                templateUrl: '/module/cache/cache_clear_tpl.html'
            })

            // MZT缓存管理
            .when('/system/replacefile', {
                name: "替换后台文件",
                controller: 'replaceFileCtrl',
                controllerUrl: 'module/system/replace_ctrl.js',
                templateUrl: '/module/system/replace_tpl.html'
            })

            // -------------------------------- 其他 -------------------------------------
            .otherwise({
                redirectTo: '/index'
            });
        }
    ]);

    app.run(['$rootScope', '$lazyload', '$window', '$http',
        function($rootScope, $lazyload, $window, $http) {
            //初始化按需加载
            $lazyload.init(app);
            app.register = $lazyload.register;

            // 点击body事件
            $rootScope.clickBody = function(){
                $rootScope.$broadcast('clickBody');
            }

            // 滚动事件
            jQuery(window).scroll(function(){
                $rootScope.$broadcast('scroll');
            });
        }
    ]);





    module.exports = app;
});
