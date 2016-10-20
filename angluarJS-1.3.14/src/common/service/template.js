'use strict';

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.factory('Template', ['$resource', 'getApi',

            function($resource, getApi) {

                return $resource('', {}, {

                    getList: {
                        url: getApi('getTemplateList'),
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
                        url: getApi('getTemplate'),
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


