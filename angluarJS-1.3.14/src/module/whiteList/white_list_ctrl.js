'use strict';

define(function(require, exports, module) {
    module.exports = function(app) {
        require('common/directive/timepicker')(app);
        require('common/directive/checkbox')(app);
        require('common/directive/crumb')(app);
        require('common/directive/popup')(app);
        require('common/service/common')(app);
        require('common/service/whitelist')(app);

        require('bower_component/jquery-ui/themes/smoothness/jquery-ui.min.css');
        require('bower_component/jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.min.css');

        app.register.controller('WhiteListCtrl', ['$scope', '$http', '$rootScope', 'Common', 'WhiteList', 'getApi', function($scope, $http, $rootScope, Common, WhiteList, getApi){
            $scope.ids = {
                nh_ids:'',
                sh_ids:'',
                cd_ids:'',
                bj_ids:'',
                hz_ids:''
            };


            $scope.postData = function(){
                var data = $scope.ids;
                angular.forEach(data, function(v, k){
                    if(typeof(v) == 'string'){
                        data[k] = v.replace(/\s+/g ,',');
                    }
                });
                console.log(data);
                $('.tips-ok').hide();
                WhiteList.setBrandIds(data, function(re) {
                    //console.log(re);
                    if (re.code === 1) {
                        $('.tips-ok').show();
                    }
                });
            };

            function initData() {
                $scope.ids = WhiteList.getBrandIds(function(re) {
                    //console.log(re);
                });
            }

            initData();
        }])
    }

})

