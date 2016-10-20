"use strict";

define(function(require, exports, module) {

	module.exports = function(app) {
		app.register.directive('pager', [ function(){
			// Runs during compile
			return {
				// name: '',
				// priority: 1,
				// terminal: true,
				// scope: {}, // {} = isolate, true = child, false/undefined = no change
				// controller= function($scope, $element, $attrs, $transclude) {},
				// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
				// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
				// template: '',
				templateUrl: '/common/directive/pager.html',
				// replace: true,
				// transclude: true,
				// compile= function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link : function($scope, iElm, iAttrs, controller) {
					var pager = {},
						curPager;

					$scope.pagers = [];

					var initPager = function () {
						pager = $scope.$eval(iAttrs.pager);
						$scope.pageIndex = iAttrs.pageIndex - 1;

						if(pager.pageNum != ''){
							$scope.pagers[iAttrs.pageIndex - 1] = pager;
							curPager = $scope.curPager = pager;
						}
					}

					$scope.prev = function () {
						$scope.goTo(curPager.pageNo - 1);
					}
					$scope.next = function () {
						$scope.goTo(curPager.pageNo + 1);
					}
					$scope.setCorrectPage = function (pageNo) {
						if(pageNo > curPager.totalPage){
							return curPager.totalPage;
						}else if(pageNo <= 0){
							return 1;
						}

						return pageNo;
					}
					$scope.isValidPage = function (pageNo) {
						if(pageNopageNo > curPager.totalPage){
							alert('已经是最后一个页了！');
						}else if(pageNo){
							alert('已经是')
						}
					}
					$scope.goTo = function (pageNo) {
						if(curPager.pageNo == curPager.pageRander && arguments[1]){
							alert('已经是第'+ curPager.pageNo +'页了！');
							return;
						}

						var rander = pageNo ? pageNo : curPager.pageNo;

						rander = $scope.setCorrectPage(rander);

						var begin = (rander - 1) * curPager.pageNum,
							end = rander * curPager.pageNum;

						$scope.goToPage(rander);

						// curPager.materials = $scope.style.materials.slice(begin,end);

						curPager.pageNo = rander;
						$scope.curPager.pageNo = rander;
					}
					$scope.resetData = function (arry) {
						var total = arry.length,
							totalPage = Math.ceil(total / $scope.pager.pageNum);

						curPager.total = total;
						curPager.totalPage = totalPage;
					}

					$scope.$watch(initPager, true);
				}
			};
		}]);
	}

})

