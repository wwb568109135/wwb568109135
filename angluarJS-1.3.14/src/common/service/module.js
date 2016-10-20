'use strict';

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.factory('Module', ['$resource', 'getApi',

            function($resource, getApi) {

                return $resource('', {}, {
                    getList: {
                        url: getApi('getModuleList'),
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

                    get: {
                        url: getApi('getModule'),
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },

                    remove: {
                        url: getApi('removeModule')
                    },

                    update: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            // console.log(data);
                            if(data.result){
                                return data.data;
                            } else {
                                alert(data.msg ? data.msg : '报错了！')
                            }

                        },
                        url: getApi('updateModule'),
                        // url: 'admin.php/Plugins/editProductPurchase',
                    },

                    updateBrand: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        isArray: true,
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            // console.log(data);
                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }

                        },
                        url: getApi('updateModuleBrand'),
                        // url: 'admin.php/Plugins/editProductPurchase',
                    },

                    updateProduct: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        isArray: true,
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            // console.log(data);
                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }

                        },
                        url: getApi('updateModuleProduct'),
                        // url: 'admin.php/Plugins/editProductPurchase',
                    }


                });
            }
        ]);

    }



})


