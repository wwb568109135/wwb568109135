'use strict';

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.factory('Cdi', ['$resource', 'getApi',

            function($resource, getApi) {

                return $resource('permission.json', {}, {

                    getCdiRuleList: {
                        url: getApi('getCdiRuleList'),
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
                    getCdiRuleInfo: {
                        url: getApi('getCdiRuleInfo'),
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },
                    getUserGroupList: {
                        url: getApi('getUserGroupList'),
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
                    deleteCdiRule: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('deleteCdiRule'),
                    },
                    addCdiRule : {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('addCdiRule'),
                    },
                    editCdiRule : {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('editCdiRule'),
                    }

                });
            }
        ]);

    }



})


