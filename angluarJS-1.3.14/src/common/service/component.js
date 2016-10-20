'use strict';

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.factory('Component', ['$resource', 'getApi',

            function($resource, getApi) {

                return $resource('component.json', {}, {

                    getComponentList: {
                        url: getApi('getComponentList'),
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },
                    getComponentInfo: {
                        url: getApi('getComponentInfo'),
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },
                    getStyleCate: {
                        url: getApi('getStyleCate'),
                        isArray : true,
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },
                    delete: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('deleteComponent'),
                    },
                    add : {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('addComponent'),
                    },
                    edit : {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('editComponent'),
                    }

                });
            }
        ]);

    }



})


