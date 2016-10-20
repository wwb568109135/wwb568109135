'use strict';

define(function(require, exports, module) {



    var util = angular.module('util', []);

    util.factory('util', ['$http', '$q',
        function($http, $q) {
            var config = {

            };

            return {

                promise: function(id) {
                    var deferred = $q.defer();

                    var promise = $http.get('api/module.json?a=111').
                    then(function(data) {
                        deferred.resolve(data.data.data);
                        console.log(data)
                    })

                    return promise;
                },

                /**
                 * 是否相交
                 *
                 * 判断元素1、2是否相交，返回布尔
                 * 通过两元素中点判断，y轴上中点坐标差值的绝对值小于height之和的一半，x轴上的中点坐标差值的绝对值小于width之和的一半，则相交
                 */
                isIntersected: function(src, tar) {
                    var $src = $(src),
                        $tar = $(tar),
                        offsetSrc = $src.offset(),
                        heightSrc = $src.outerHeight(),
                        widthSrc = $src.outerWidth(),
                        offsetTar = $tar.offset(),
                        widthTar = $tar.outerWidth(),
                        heightTar = $tar.outerHeight();

                    if (!$src.length || !$tar.length) return false;

                    if (Math.abs((offsetSrc.top + heightSrc / 2) - (offsetTar.top + heightTar / 2)) > (heightSrc + heightTar) / 2) return false;
                    if (Math.abs((offsetSrc.left + widthSrc / 2) - (offsetTar.left + widthTar / 2)) > (widthSrc + widthTar) / 2) return false;

                    return true;
                },

                /**
                 * 通过MZT分仓、销售类型、用户类型生成MZT名称，用以快速区分
                 */
                getSpPageName: function(page) {
                    var warehouse = {
                        'VIP_NH': '南海',
                        'VIP_BJ': '北京',
                        'VIP_HZ': '华中',
                        'VIP_SH': '上海',
                        'VIP_CD': '成都'
                    }, guest = {
                        'new': '新客',
                        'old': '老客'
                    }, saleType = {
                        '0': '预售',
                        '1': '开售'
                    };

                    return [warehouse[page.warehouse || 'VIP_NH'], guest[page.guest || 'new'], saleType[page.sale_type || 0]].join(' - ');
                },

                /**
                 * 把 px 转为 %
                 */
                getPercentageByPixel: function(child, parent) {
                    return {
                        left: (child.left.slice(0, -2) / parent.width * 100).toFixed(5) + '%',
                        top: (child.top.slice(0, -2) / parent.height * 100).toFixed(5) + '%',
                        width: (child.width.slice(0, -2) / parent.width * 100).toFixed(5) + '%',
                        height: (child.height.slice(0, -2) / parent.height * 100).toFixed(5) + '%'
                    }
                },

                /**
                 * 把 % 转为 px
                 */
                getPixelByPercentage: function(child, parent) {
                    return {
                        left: Math.round(child.left.slice(0, -1) / parent.width * 100) + 'px',
                        top: Math.round(child.top.slice(0, -1) / parent.height * 100) + 'px',
                        width: Math.round(child.width.slice(0, -1) / parent.width * 100) + 'px',
                        height: Math.round(child.height.slice(0, -1) / parent.height * 100) + 'px'
                    }
                }





            };
        }
    ]);

    module.exports = util;

})