'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {
		var config = require('common/config');
		require('common/service/page')(app);
		require('bower_component/zeroclipboard/dist/ZeroClipboard.min');
		require('common/directive/crumb')(app);
		require('common/directive/timepicker')(app);
		require('bower_component/jquery-ui/themes/smoothness/jquery-ui.min.css');
		require('bower_component/jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.min.css');

		app.register.controller('PreviewCtrl', ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'Page', 'util', '$filter',

			function($scope, $http, $rootScope, $location, $routeParams, Page, util, $filter){

				var id = $routeParams.id;
				var client = $routeParams.client || 'phone';
				var page_id = $routeParams.page_id;
				var cdi_type_id = $routeParams.cdi_type_id;
				var time = $routeParams.time;
				$rootScope.pageClass = client;
				$scope.time = $rootScope.curTime;

				if(id){
					// 获取MZT
					$scope.list = Page.getList({special_id: id, client: client}, function(){
						var list = $scope.list;

						angular.forEach(list, function(v, k){
							v.customName = util.getSpPageName(v);
						})

						$scope.setCurOption();
					});

					$scope.rules = Page.getCdiRules({
						is_all: 0
					}, function(re){
						$scope.cur_cdi_type = '默认';
						angular.forEach($scope.rules, function(v, k) {
							if (cdi_type_id == v.rule_id) {
								$scope.cur_cdi_type = v.name;
							}
						})
					});


					$scope.change = function(pageId,pageType,parentId){
						var params = {
						    client: client,
						    page_id: pageId,
						    parent_id : parentId,
						    page_type_id : pageType
						}, url;

						$scope.pageId = pageId;

						angular.extend($routeParams, params);

						url = '/preview/' + id + '?' + $.param($routeParams);

						$location.url(url);
					}

					$scope.changeCdiType = function(ruleId, ruleName){
						var params = {
						    cdi_type_id : ruleId
						}, url;

						angular.extend($routeParams, params);
						//console.log($routeParams);

						url = '/preview/' + id + '?' + $.param($routeParams);

						$location.url(url);
						$scope.cur_cdi_type = ruleName;
					}

					$scope.changeTime = function(){
						var timeStamp = new Date($scope.time).getTime()/1000;
						var params = {
						    time : timeStamp
						}, url;

						angular.extend($routeParams, params);

						url = '#/preview/' + id + '?' + $.param($routeParams);
						// console.log(url);
						// $location.url(url);

						location.href = url;
						$rootScope.curTime = $scope.time;
					}

					$scope.setCurOption = function(){
						var list = $scope.list;

						$.each(list, function(k, v){
							var isParent = v.parent_id == page_id;

							if(isParent) {
							    $scope.curOption = {
							        id : v.parent_id,
							        name : v.parent_name,
							        parent_id : v.parent_id,
							        page_type : v.page_type
							    };
							}

							$.each(v.data,function (k,rule) {
							    rule.extended = isParent;

							    $.each(rule.data,function (k,page) {
							        if(page.page_id == page_id) {
							            $scope.curOption = {
							                id : page.page_id,
							                name : page.page_name,
							        		parent_id : v.parent_id,
							       		 	page_type : page.page_type
							            };

							            rule.extended = true;

							            return false;
							        }
							    })
							})
						})

						// if(!$scope.curOption) $scope.curOption = list[0];
					}

					$scope.$on('clickBody', function(){
						$scope.isDrop = false;
					})

					$scope.$watch('curOption', function(newValue, oldValue){
						if(!newValue) return false;

						$scope.change(newValue.id, newValue.page_type, newValue.parent_id);

						console.log(newValue.id, newValue.page_type, newValue.parent_id);
						$scope.curUrl = getUrl(newValue);
						createQrcode(getUrl(newValue));
						// $('iframe').load(function(){
						// 	$('iframe').height($('iframe').contents().find('body').height());
						// })

						new ZeroClipboard( document.getElementById("btn-copy") );
					})



					// window.addEventListener('message', function (e) {
					// 	console.log(e.data);
					// });

					// $(window).on('message', function(e){
					// 	console.log(e.originalEvent.data);
					// })
				}

				// 切换到其他平台
                $scope.toOtherClient = function(client){
                    var params = {
                        client: client,
                        page_id: page_id
                    }, url;

                    angular.extend($routeParams, params)

                    url = '/preview/' + id + '?' + $.param($routeParams);

                    $location.url(url);
                }

                $scope.toSpecialPage = function(e){
                	e.preventDefault();
                	location.href = $scope.curUrl;
                }

				function createQrcode(url){
					jQuery('#qrcode').html('').qrcode({
						text: url
					});
				}

				function getUrl(page){
					var param = $.param({
						id: page.id,
						page_type_id: page.page_type,
						client: client,
						time: time,
						cdi_type_id: cdi_type_id
					})
					if(config.env === 'fe'){
						return '/module/preview/iframe.html?' + param;
					} else {
						// 发布后链接，有缓存
						// return '/index.php/Special/page?' + param;

						// 发布前连接，没缓存
						return location.origin + '/admin.php/Page/viewpage?' + param;
					}
				}

				// 复制并打开url
				$scope.toUrl = function (url){
					window.open(url);
				}

				$scope.$on('clickBody', function(){
                    $rootScope.toggleDrop(window.event,$scope,'tableXlStyleManage');
                });

		}])
	}



})

