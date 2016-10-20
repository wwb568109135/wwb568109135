'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {

		app.register.filter('time', function(){
			return function(time){
				return '现在时间: ' + time;
			}
		})

	}
	


})
