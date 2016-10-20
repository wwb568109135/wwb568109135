"use strict";

define(function(require, exports, module) {

	module.exports = function(app) {

		app.register.directive('crumb', ['$rootScope','$routeParams', function($rootScope,$routeParams){
			// Runs during compile
			return {
				// name: '',
				// priority: 1,
				// terminal: true,
				scope: {
					crumb: '=',
					specialId: '=',
					pageTypeId: '=',
					parentId: '=',
					pageId: '='
				}, // {} = isolate, true = child, false/undefined = no change
				// controller: function($scope, $element, $attrs, $transclude) {},
				// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
				// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
				// template: '',
				templateUrl: '/common/directive/crumb.html',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function($scope, iElm, iAttrs, controller) {

					var home = {
							text: '首页',
						    href: '#index'
						},style = {
						    text: '样式管理',
						    href: '#/style/list'
						},styleCate = {
						    text: '样式分组管理',
						    href: '#/style/cate/list'
						},user = {
						    text: '用户管理',
						    href: '#/user/list'
						},role = {
						    text: '角色管理',
						    href: '#/role/list'
						},component = {
						    text: '组件管理',
						    href: '#/component/list'
						},consumer = {
						    text: '客户类型管理',
						    href: '#/consumer/list'
						},client = {
						    text: '客户端管理',
						    href: '#/client/list'
						},clientVersion = {
						    text: '客户端版本管理',
						    href: '#/client_version/list'
						},log = {
						    text: '日志管理',
						    href: '#/log/list'
						},rule = {
						    text: '用户群管理',
						    href: '#/cdi/list'
											},special = {
						    text: 'MZT分类管理',
						    href: '#/special/list'
						},whiteList = {
							text: 'id白名单',
							href: '#/whiteList/edit'
						},
						sid,tid,pid,pgid,pStr;

					function initConfig (newScope) {
						sid = $routeParams.special_id ? $routeParams.special_id : $scope.specialId;
						tid = $routeParams.page_type_id ? $routeParams.page_type_id : $scope.pageTypeId;
						pid = $routeParams.parent_id ? $routeParams.parent_id : $scope.parentId;
						pgid = $routeParams.page_id ? $routeParams.page_id : $scope.pageId;
						pgid = pgid ? pgid : pid;

						pStr = pid ? ('&parent_id=' + pid) : ''

						$scope.config = {
							'search' : [home, {
								text: '高级搜索',
								href: ''
							}],
							'specialCreate' : [ home , {
								    text: 'MZT属性',
								    href: ''
								}],
							'specialEditFlow' : [ home , {
								    text: 'MZT属性',
								    href: '#/special/edit/'+ sid +'?page_type_id='+ 0 +'&special_id='+ sid + pStr
								},{
									text: '编辑MZT',
								    href: '#/page/edit/'+ pid +'?page_type_id='+ 0 +'&special_id='+ sid + pStr
								},{
									text: '发布预览',
								    href: '#/special/'+ sid +'/publish' +'?page_type_id='+ 0 +'&special_id='+ sid + pStr
								}],
							'styleList' : [ home , style],
					    	'styleCreate' : [ home , style , {
								    text: '新增样式',
								    href: ''
								}],
							'userList' : [ home , user],
							'roleList' : [ home , role],
							'componentList' : [ home , component],
							'consumerList' : [ home , consumer],
							'clientList' : [ home , client],
							'clientVersionList' : [ home , clientVersion],
							'styleCateList' : [ home , style, styleCate],
							'logList' : [ home , log],
							'preview' : [ home, {
							    text: 'MZT预览',
							    href: ''
							}],
							'ruleList' : [ home , rule],
							'specialList' : [ home , special],
							'whiteList' : [ home , whiteList],
					    };

					}

					initConfig();

					$scope.curPos = iAttrs.crumb;
					$scope.crumbIndex = iAttrs.crumbIndex ? iAttrs.crumbIndex : $scope.config[$scope.curPos].length - 1;

				    $scope.$watch('specialId', function(newValue, oldValue, scope) {
				    	initConfig (scope)
				    });
				}
			};
		}]);

	}

})


