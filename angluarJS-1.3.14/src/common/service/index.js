'use strict';

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.factory('Index', ['$resource', 'getApi',

            function($resource, getApi) {

                return $resource('', {}, {
                    copyTpl: {
                        url: getApi('copyTpl'),
                        isArray : true,
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert(data.msg)
                            }
                        }
                    },
                    deleteTpl: {
                        url: getApi('deleteTpl'),
                        isArray : true,
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert(data.msg)
                            }
                        }
                    },
                    exportsUrl: {
                        url: getApi('exportsUrl'),
                        isArray : true,
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                alert(data.msg);
                                return data.data;
                            } else {
                                alert(data.msg)
                            }
                        }
                    },
                    updateStatus: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('updateStatus'),
                    },
                    indexBatchEdit: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('indexBatchEdit'),
                    },
                    checkRelease: {
                        url: getApi('checkRelease'),
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            return data;
                        }
                    }

                });
            }
        ]);

    }



})


