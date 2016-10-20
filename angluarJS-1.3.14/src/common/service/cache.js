'use strict';

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.factory('Cache', ['$resource', 'getApi',

            function($resource, getApi) {

                return $resource('permission.json', {}, {

                    getCacheList: {
                        url: getApi('getCacheList'),
                        isArray: true,
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                // console.log(data.data);
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },
                    clearCache : {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('clearCache'),
                    }

                });
            }
        ]);

    }



})


