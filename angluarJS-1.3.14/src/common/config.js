"use strict";

/**
 * 配置文件
 */
define(function(require, exports, module) {

    module.exports = {
        /**
        * 环境配置入口
        *
        * - fe，本地开发环境，接口为静态json文件
        * - dev，联调开发环境，接口为php
        * - prod，模拟线上环境，接口为php
        */
        env: 'dev',

        host: {
            fe: '/api/',
            dev: '/',
            prod: 'http://mtms_112.m.vip.com/client/src/api/'
        },

        /**
        * 通过环境信息获取对应api地址
        *
        * special，MZT
        * - getSpecialById，根据MZTid获取MZT信息
        * - getSpecialProperty，获取MZT对应的MZT属性
        * - getTypeList，获取MZT类型列表
        * - getClientTypeList，获取客户端类型列表
        * - createType，创建MZT类型
        * - createSpecial，创建MZT
        *
        * module，模块
        * - xxx，xx
        *
        * page，页面
        * - xxx，xx
        *
        *
        *
        * role，角色
        * - xxx，xx
        *
        */
        api: {
            fe: {
                getSpecial: 'getSpecial.json',
                getSpecialProperty: 'getSpecialProperty.json',
                getClientList: 'getClientList.json',
                getTypeList: 'getTypeList.json',
                createType: 'createType.json',
                createSpecial: 'createSpecial.json',
                updateSpecial: 'updateSpecial.json',
                getTemplateList: 'getTemplateList.json',
                getPageList: 'getPageList.json',
                getPage: 'getPage.json',
                getModuleList: 'getModuleList.json',
                getModule: 'getModule.json',
                addModule: 'addModule.json',
                copyPage: 'copyPage.json',
                createPage: 'createPage.json',
                updateModule: 'updateModule.json',
                removeModule: 'removeModule.json',
                getPublishList : 'getPublishList.json',
                getPublishEdit : 'getPublishEdit.json',
                getPublishMultiEdit : 'getPublishMultiEdit.json',
                getConsumerTypeList : 'getConsumerTypeList.json',
                getChannelList : 'getChannelList.json',
                getListByClientId : 'getListByClientId.json',
                getUserList: 'getUserList.json',
                getUserFiltList: 'getUserFiltList.json',
                getRoles: 'getRoles.json',
                getDepartList: 'getDepartList.json',
                editUser: 'editUser.json',
                getRoleList: 'getRoleList.json',
                getPermissions: 'getPermissions.json',
                getRoleFiltList: 'getRoleFiltList.json',
                editRole: 'editRole.json',
                editPermission: 'editPermission.json',
				getPermissionTypeList: 'getPermissionTypeList.json',
                getPermissionFiltList: 'getPermissionFiltList.json',
                updatePage: 'updatePage.json',
                getStyleList : 'getStyleList.json',
                getStyleFiltList : 'getStyleFiltList.json',
                getStyleTypes : 'getStyleTypes.json',
                deleteStyle : 'deleteStyle.json',
                editStyle : 'editStyle.json',
                updateModuleBrand : 'updateModuleBrand.json',
                updateModuleProduct: 'updateModuleProduct.json',
                uploadPic: 'uploadPic.json',
                getShareListByKW: 'getShareListByKW.json',
                getFlags: 'getFlags.json'
            },
            dev: {
                getSpecialList       : 'admin.php/special/getSpecialList',
                getSpecialSearchList : 'admin.php/special/search',

                copyTpl              : 'admin.php/special/copySpecial',
                deleteTpl            : 'admin.php/ChildPage/deleteChildPage',
                editTpl              : 'admin.php/special/copySpecial',
                getSpecial           : 'getSpecial',
                getSpecialProperty   : 'admin.php/special/getSpecialProperty',
                getSpecialType       : 'admin.php/special/getTypeList',
                getClientList        : 'admin.php/special/getClientTypeList',
                getCateList: 'admin.php/special/getCateList',
                getTypeList          : 'admin.php/special/getTypeList',
                createType           : 'admin.php/special/createType',
                createSpecial        : 'admin.php/special/createSpecial',
                updateSpecial        : 'admin.php/special/updateSpecial',
                delCate : 'admin.php/special/delCate',

                getVirtualSpecial    : 'admin.php/virtualSpecial/getSpecialList',
                getSpecialVirtualInfo: 'admin.php/virtualSpecial/getSpecialVirtualInfo',
                getSpecialAttributeList: 'admin.php/virtualSpecial/getSpecialAttributeList',
                getCdiTypeByVreId    : 'admin.php/virtualSpecial/getCdiTypeByVreId',

                updateModule         : 'admin.php/Plugins/editPlugin',
                updateModuleBrand    : 'admin.php/Plugins/saveBrandSort',
                updateModuleProduct  : 'admin.php/Plugins/saveProductSort',
                removeModule         : 'admin.php/Plugins/deletePlugin',
                getPage              : 'admin.php/special/getPage',
                getPageList          : 'admin.php/specialMade/getTplList',
                addModule            : 'admin.php/Plugins/addPluginNew',
                copyPage             : 'admin.php/specialMade/copyTpl',
                createPage           : 'admin.php/childPage/doMakeChildPage',
                createParentPage     : 'admin.php/special/createParentPage',
                getPublishList       : 'admin.php/specialRelease/index/?id=:id',
                getPublishEdit       : 'admin.php/special/getEditSpecialData/?id=:id',
                getPublishMultiEdit  : 'api/getPublishMultiEdit.json',
                getConsumerTypeList  : 'admin.php/ConsumerType/getConsumerTypeList',
                getChannelList       : 'admin.php/Channel/getChannelList',
                getListByClientId    : 'admin.php/clientVersion/getListByClientId/?client_id=:client_id',
                addSubPage           : 'admin.php/role/doAdd',
                editSubPage          : 'admin.php/role/doEdit',
                editMultiSubPage     : 'admin.php/role/doEdit',
                deleteSubPage        : 'admin.php/specialRelease/deleteChildPage/',
                getUserList          : 'admin.php/user/getUserList',
                getUserFiltList      : 'admin.php/user/getUserList',
                getRoles             : 'admin.php/role/getRoleList',
                getDepartList        : 'admin.php/department/getDepartmentList',
                getUserInfo          : 'admin.php/user/getUserInfo',
                getClients           : 'admin.php/client/getClients',
                addUser              : 'admin.php/user/doAdd',
                editUser             : 'admin.php/user/doUpdate',
                deleteUser           : 'admin.php/user/doDelete',
                getRoleList          : 'admin.php/role/getRoleListPage',
                getPermissions       : 'admin.php/role/getActList',
                getRoleFiltList      : 'admin.php/role/getRoleListPage',
                getRoleInfo          : 'admin.php/role/getRoleInfo',
                getUserInRole        : 'admin.php/role/deleteUserCheck',
                addRole              : 'admin.php/role/doAdd',
                editRole             : 'admin.php/role/doEdit',
                deleteRole           : 'admin.php/role/doDelete',
                getSpecialCategories : 'admin.php/specialCate/getList',

                getStyleList         : 'admin.php/style/getStylesPage',
                getStyleSources      : 'admin.php/styleSource/getStyleSources',
                getStyleInfo         : 'admin.php/style/getStyleInfo',
                addStyle             : 'admin.php/style/doAdd',
                editStyle            : 'admin.php/style/doEdit',
                deleteStyle          : 'admin.php/style/doDelete',
                uploadCoverPic       : 'admin.php/style/uploadCoverPic',
                uploadResource       : 'admin.php/styleSource/doUpload',

                getStyleCate         : 'admin.php/styleCate/getStyleCates',
                getTemplateList      : 'admin.php/Template/getTplList',
                getComponentList     : 'admin.php/component/getComponentsPage',
                getComponentInfo     : 'admin.php/component/getComponentInfo',
                addComponent         : 'admin.php/component/doAdd',
                editComponent        : 'admin.php/component/doEdit',
                deleteComponent      : 'admin.php/component/doDelete',
                getStyleCateList     : 'admin.php/styleCate/getStyleCatesPage',
                getStyleCateInfo     : 'admin.php/styleCate/getStyleCateInfo',
                addStyleCate         : 'admin.php/styleCate/doAdd',
                editStyleCate        : 'admin.php/styleCate/doEdit',
                deleteStyleCate      : 'admin.php/styleCate/doDelete',
                getModuleList        : 'admin.php/Plugins/getPluginList',
                updatePage           : 'admin.php/special/savePage',

                uploadPic            : 'admin.php/special/uploadPic',

                getClientVersionList : 'admin.php/clientVersion/getClientVersionsPage',
                getClientVersionInfo : 'admin.php/clientVersion/getClientVersionInfo',
                getPlatform          : 'admin.php/Platform/getPlatform',
                addClientVersion     : 'admin.php/clientVersion/doAdd',
                editClientVersion    : 'admin.php/clientVersion/doEdit',
                deleteClientVersion  : 'admin.php/clientVersion/doDelete',

                getClientsList       : 'admin.php/client/getClientsPage',
                getClientInfo        : 'admin.php/client/getClientInfo',
                addClient            : 'admin.php/client/doAdd',
                editClient           : 'admin.php/client/doEdit',
                deleteClient         : 'admin.php/client/doDelete',

                getConsumerList      : 'admin.php/consumerType/getConsumerTypesPage',
                getConsumerInfo      : 'admin.php/consumerType/getConsumerTypeInfo',
                addConsumer          : 'admin.php/consumerType/doAdd',
                editConsumer         : 'admin.php/consumerType/doEdit',
                deleteConsumer       : 'admin.php/consumerType/doDelete',
                getConsumerType      : 'admin.php/consumerType/getTypeList',

                publish              : 'admin.php/specialRelease/doRelease/',
                exportsUrl           : 'admin.php/Special/downloadUrlExcel',
                updateStatus         : 'admin.php/childPage/updateStatus',
                indexBatchEdit       : 'admin.php/special/batchEditChildPages',
                checkRelease         : 'admin.php/special/checkRelease',

                getLogList           : 'admin.php/log/getLogList',
                deleteLog            : 'admin.php/log/doDelete',
                getIpList            : 'admin.php/log/getIpList',

                getShareListByKW     : 'admin.php/Plugins/getShareListByKW',
                pullAutoSyncSwitch   : 'admin.php/specialRelease/autoSyncSwitch',

                getDapInfos          : 'admin.php/dap/getDapInfos',
                getLabelBySearch     : 'admin.php/dap/getLabelBySearch',
                saveDapOption        : 'admin.php/dap/saveDapOption',
                getPageDapInfo       : 'admin.php/dap/getPageDapInfo',

                getCdiRuleList       : 'admin.php/cdi/getRuleList',
                getCdiRuleInfo       : 'admin.php/cdi/getRuleInfo',
                addCdiRule           : 'admin.php/cdi/doAdd',
                editCdiRule          : 'admin.php/cdi/doEdit',
                deleteCdiRule        : 'admin.php/cdi/doDelete',

                getUserGroupList     : 'admin.php/cdi/getUserGroupList',
                getCdiRules          : 'admin.php/cdi/getRuleList',

                getTplListByFilt     : 'admin.php/ChildPage/getTplListByFilt',


                pullToPageSync       : 'admin.php/ChildPage/pullToSync',
                getBusinessExcel     : 'admin.php/importData/getBusinessExcel',
                godoUpload           : 'admin.php/importData/doUpload',
                updaterDownload      : 'admin.php/importData/download',
                excelUpdate          : 'admin.php/excelUpdate/list',
                updateDisplay        : 'admin.php/childPage/updateDisplay',


                getResysdRoleList    : 'admin.php/Resysd/getRoleList',   //获取规则列表
                getResysdRole        : 'admin.php/Resysd/getRole',    //获取规则详情
                addResysdRole        : 'admin.php/Resysd/addRole', //新增规则
                editResysdRole       : 'admin.php/Resysd/editRole',   //编辑规则
                delResysdRole        : 'admin.php/Resysd/delRole',  //删除规则

                getCacheList : 'admin.php/system/reFlush',
                clearCache : 'admin.php/system/cleanCache',

                getBrandIds: 'admin.php/brandHall/getBrandIds',
                setBrandIds: 'admin.php/brandHall/setBrandIds',

                getSnapshotList: 'admin.php/PluginSnapshot/getSnapshotList',
                addSnapshot: 'admin.php/PluginSnapshot/addSnapshot',
                delSnapshot: 'admin.php/PluginSnapshot/delSnapshot',

                getVreTypeStatusList : "admin.php/specialRelease/getVreTypeStatusList", 
                setVreStatus:"admin.php/specialRelease/setVreStatus",
                pullRepalceFile:"admin.php/system/upDateJs",
            }
        }
    };
});
