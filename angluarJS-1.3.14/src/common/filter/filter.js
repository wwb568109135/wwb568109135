'use strict';

define(function(require, exports, module) {

    var filter = angular.module('filter', []);

    filter.filter('time', function(){
    	return function(time){
    		return '现在时间: ' + time;
    	}

    })

    filter.filter('time1', function(){
        return function(timeStr){
            var splite_index = timeStr.indexOf(' ');
            return timeStr.substr(0,splite_index);
        }
    })

    filter.filter('time2', function(){
        return function(timeStr){
            var splite_index = timeStr.indexOf(' ');
            return timeStr.substr(splite_index+1);
        }
    })

    filter.filter('trustHtml', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }])

    filter.filter('consumer_type', function() {
        return function(str) {
            var ids = str.split(',');
            var names = [];
            $.each(ids, function(i) {
                if (ids[i] == '0') {
                    names.push('不区分');
                } else if (ids[i] == '1') {
                    names.push('新客');
                } else if (ids[i] == '2') {
                    names.push('老客');
                }
            });
            names = names.join(', ');
            return names;
        }
    });

    filter.filter('sale_type', function() {
        return function(str) {
            var ids = str.split(',');
            var names = [];
            $.each(ids, function(i) {
                if (ids[i] == '0') {
                    names.push('不区分');
                } else if (ids[i] == '1') {
                    names.push('预热');
                } else if (ids[i] == '2') {
                    names.push('开售');
                }
            });
            names = names.join(', ');
            return names;
        }
    });

    filter.filter('warehouse', function() {
        return function(str) {
            var ids = str.split(',');
            var names = [];
            $.each(ids, function(i) {
                switch (this) {
                    case '0':
                        names.push('不区分');
                        break;
                    case '1':
                        names.push('华南仓');
                        break;
                    case '2':
                        names.push('华北仓');
                        break;
                    case '3':
                        names.push('华东仓');
                        break;
                    case '4':
                        names.push('西南仓');
                        break;
                    case '5':
                        names.push('华中仓');
                        break;
                }
            });
            names = names.join(', ');
            return names;
        }
    })

    filter.filter('crowd', function() {
        return function(obj) {
            var names = [];
            $.each(obj, function(i) {
                names.push(this.name);
            });
            names = names.join(', ');
            return names;
        }
    });

    filter.filter('channel', function() {
        return function(obj) {
            var names = [];
            $.each(obj, function(i) {
                names.push(this.channel_name);
            });
            names = names.join(', ');
            return names;
        }
    });

    module.exports = filter;

})
