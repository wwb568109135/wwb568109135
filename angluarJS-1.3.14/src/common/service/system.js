'use strict';

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.factory('System', ['$resource', 'getApi',

            function($resource, getApi) {

                return $resource('special.json', {}, {
                    pullRepalceFile : {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('pullRepalceFile')
                    }

                });
            }
        ]);

    }



})


