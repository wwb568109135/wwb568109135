'use strict';

define(function(require, exports, module) {
    module.exports = function(app) {
        app.register.factory('Consumer', ['$resource', 'getApi',

            function($resource, getApi) {

                return $resource('userList.json', {}, {
                    getList: {
                        url: getApi('getConsumerList'),
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },
                    getConsumerInfo: {
                        url: getApi('getConsumerInfo'),
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
                        url: getApi('deleteConsumer'),
                    },
                    add : {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('addConsumer'),
                    },
                    edit : {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('editConsumer'),
                    },
                    getConsumerType: {
                        url: getApi('getConsumerType'),
                        isArray: true,
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


