'use strict';

define(function(require, exports, module) {
    module.exports = function(app) {
        app.register.factory('Log', ['$resource', 'getApi',

            function($resource, getApi) {

                return $resource('userList.json', {}, {
                    getList: {
                        url: getApi('getLogList'),
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },
                    getIpList: {
                        url: getApi('getIpList'),
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
                        url: getApi('deleteLog'),
                    }
                });
            }
        ]);

    }



})


