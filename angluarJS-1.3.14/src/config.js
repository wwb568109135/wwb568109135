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
        env: 'fe',

        host: {
            fe: '/api/',
            dev: '/client/src/api/',
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
                getTemplateList: 'getTemplateList.json',
                getPageList: 'getPageList.json',
                getPage: 'getPage.json',
                getModuleList: 'getModuleList.json',
                getModule: 'getModule.json',
                special_publish_list: 'special_publish_list.json',
                special_publish_edit: 'special_publish_edit.json'
            },
            dev: {
                getSpecial: 'getSpecial',
                getSpecialProperty: 'getSpecialProperty',
                getClientTypeList: 'getClientTypeList',
                getTypeList: 'getTypeList',
                createType: 'createType',
                createSpecial: 'createSpecial',
                special_publish_list: 'special_publish_list',
                special_publish_edit: 'special_publish_edit'
            }
        }
        console.log(env)

    };

});