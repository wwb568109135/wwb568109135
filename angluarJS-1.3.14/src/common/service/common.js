'use strict';

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.factory('Common', [ '$http',
            function($http, $scope) {
            	function getChecksValue(name) {
					var ids = [];

					$('input:checked[name='+ name +'][value]').each(function (i) {
						ids.push(this.value);
					})

					return ids;
				};

            	function getChecksValueIndex(name) {
					var ids = [];

					$('input:checked[name='+ name +'][value]').each(function (i) {
						ids.push(this.value);
					})

					return ids;
				};

				function doPost(url,data,callback) {
					var transFn = function(data) {
						// console.log($.param(data));
					    return $.param(data);
					},
					postCfg = {
					    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
					    ,transformRequest: transFn
					};

					$http.post(url , data , postCfg)
				    .success(function(data){
				    	callback(data);
				    });
				}

                return {
                	getChecksValue : getChecksValue,
                	doPost : doPost
                };
            }
        ]);

    }
})


