'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {

		require('common/service/style')(app);

		app.register.controller('StyleCreateCtrl', ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'Style', 'FileUploader', '$timeout',

			function($scope, $http, $rootScope, $location, $routeParams, Style,FileUploader,$timeout){
				var id = $routeParams.id;

				if(id){
					$scope.style = Style.getStyleInfo(function () {
						setDatas($scope);

						$scope.pager.resetData($scope.style.materials);

						$scope.pager.goTo();
					});
				}else{
					$scope.style = {
					    "name": "",
					    "type": "",
					    "default": "",
					    "preview": "http://placehold.it/150x150",
					    "css" : "",
					    "js" : "",
					    "materials" : []
					}

					setDatas($scope);
				}

				function setDatas($scope) {
					// $scope.pictures = $scope.style.pictures;

					$scope.types = Style.getStyleTypes(function () {
						angular.forEach($scope.types, function(value, key){
							if(value.id == $scope.style.type){
								$scope.curType = value;
							}
						});
					});

					$scope.pager = {
						total : 0,
						totalPage : 1,
						pageNo : 1,
						pageNum : 10,
						pageRander : 1,
						materials : [],
						prev : function () {
							this.goTo(this.pageNo - 1);
						},
						next : function () {
							this.goTo(this.pageNo + 1);
						},
						setCorrectPage : function (pageNo) {
							if(pageNo > this.totalPage){
								return this.totalPage;
							}else if(pageNo <= 0){
								return 1;
							}

							return pageNo;
						},
						isValidPage : function (pageNo) {
							if(pageNopageNo > this.totalPage){
								alert('已经是最后一个页了！');
							}else if(pageNo){
								alert('已经是')
							}
						},
						goTo : function (pageNo) {
							if(this.pageNo == this.pageRander && arguments[1]){
								alert('已经是第'+ this.pageNo +'页了！');
								return;
							}

							var rander = pageNo ? pageNo : this.pageNo;

							rander = this.setCorrectPage(rander);

							var begin = (rander - 1) * this.pageNum,
								end = rander * this.pageNum;

							this.materials = $scope.style.materials.slice(begin,end);

							this.pageNo = rander;
						},
						resetData : function (arry) {
							var total = arry.length,
								totalPage = Math.ceil(total / $scope.pager.pageNum);

							this.total = total;
							this.totalPage = totalPage;
						}
					}

					// $scope.addEnterRow();
				}

				$scope.deleteEnterRow = function (index) {
					var trueIndex = ($scope.pager.pageNo - 1) * $scope.pager.pageNum + index;

					$scope.style.materials.splice(trueIndex,1);
					$scope.pager.materials.splice(index,1);

					$scope.pager.resetData($scope.style.materials);

					$scope.pager.goTo($scope.pager.pageNo);
				}

				$scope.postData = function (flag) {
					var data = $scope.style.toJSON(),
			            transFn = function(data) {
			                return $.param(data);
			            },
			            postCfg = {
			                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			                transformRequest: transFn
			            };

			        console.log(data);

			        $http.post('api/deleteStyle.json', data, postCfg)
			            .success(function(data){
			            	if (data.result) {
			            		alert(data.msg);

			            		window.location.href = "#/style/list";
			            	}else{
			            		alert(data.msg);
			            	}
			            });
				}

				$scope.setSelectValue = function (key,value) {
				    $scope[key] = value;
				}

				$scope.$on('clickBody', function(){
                    $scope.isDropType = false;
                });

				/**
				 * upload 相关逻辑
				 * deviceMesure PHONE预售图尺寸：680*326，PAD预售图尺寸：640*590
				 */
				var deviceMesure = {
					"phone" : {
						'width' : 680,
						'height' : 326
					},
					"pad" : {
						'width' : 640,
						'height' : 590
					}
				}

				var uploader = $scope.uploader = new FileUploader({
		            url: '/admin.php?c=Style&a=uploadPic'
		        });

		        uploader.filters.push({
                    name: 'imageFilter',
                    fn: function(item , options) {
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                    }
                });

                uploader.onAfterAddingFile = function (item) {
	                uploader.uploadAll();
                }

                uploader.onSuccessItem = function(fileItem, response, status, headers) {
                	if(response.result){
                		if($scope.type == 'preview'){
                			$scope.style.preview = response.data.preview;
                		}else{
                			$scope.style.materials.push(response.data);
                		}
                	}else {
                		alert('报错了');
                	}
                };

                uploader.onCompleteAll = function () {
            		if(uploader.queue.length > 1){
            			uploader.clearQueue();
            		}

            		if($scope.type == 'material'){
            			var pager = $scope.pager;

            			pager.resetData($scope.style.materials);
            			pager.goTo(pager.totalPage);
            		}
                }

                $scope.selectFile = function ($event,type) {
                	$event.stopPropagation();
                	$event.preventDefault();

                	if(type == 'preview'){
                		uploader.url = 'api/uploadPreview.json';
                	}else{
                		uploader.url = 'api/uploadMaterial.php';
                	}

                	var inputFile = $event.toElement.previousElementSibling;

                	$timeout(function () {
                		inputFile.click();
                	}, 0)

                	$scope.type = type;
                }
		}]);

	}



})

