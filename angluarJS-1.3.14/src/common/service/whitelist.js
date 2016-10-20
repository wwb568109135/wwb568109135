'use strict';

define(function(require, exports, module) {
    module.exports = function(app) {
        app.register.factory('WhiteList', ['$resource', 'getApi',

            function($resource, getApi) {

                return $resource('', {}, {
                    getBrandIds: {
                        url: getApi('getBrandIds'),
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },
                    setBrandIds: {
                        url: getApi('setBrandIds'),
                        //isArray : true,
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data;
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
