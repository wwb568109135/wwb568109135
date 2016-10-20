'use strict';

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.factory('Permission', ['$resource', 'getApi',

            function($resource, getApi) {

                return $resource('permission.json', {}, {

                    getPermissionList: {
                        url: getApi('getPermissionList'),
                        isArray: true,
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },

                    getPermissionTypeList: {
                        url: getApi('getPermissionTypeList'),
                        isArray: true,
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },
                    getFiltList: {
                        url: getApi('getPermissionFiltList'),
                        isArray: true,
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },
                    editPermission: {
                        url: getApi('editPermission'),
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    }

                });
            }
        ]);

    }



})


