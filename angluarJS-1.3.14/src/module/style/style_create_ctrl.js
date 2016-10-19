'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {

		require('common/service/style')(app);
		require('common/service/common')(app);
		require('common/directive/popupImg')(app);
		require('common/directive/crumb')(app);

		app.register.controller('StyleCreateCtrl', ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'Style', 'FileUploader', '$timeout', 'Common', 'getApi',

			function($scope, $http, $rootScope, $location, $routeParams, Style,FileUploader,$timeout,Common,getApi){
				var id = $routeParams.id;

				$scope.imgFilt = '|jpg|png|jpeg|bmp|gif|';

				//编辑
				if(id){
					$scope.style = Style.getStyleInfo({
						id : id
					},function () {

						setDatas($scope);

						$scope.style.materials = Style.getStyleSources({
							ids : $scope.style.source_ids
						},function () {
							$scope.pager.resetData($scope.style.materials);

							$scope.pager.goTo();
						});




					});
				//创建
				}else{
					$scope.style = {
					    "name": "",
					    "style_cate_id": "",
					    "is_default": "",
					    "thumb": "",
					    "css" : "",
					    "js" : "",
					    "materials" : [],
					    "source": {	//~~~
					    	"spot_options": [],
					    	"custom_configs": [],
					    	"selectDep" : ""
					    }
					};

					// //自定义参数数据
					// $scope.style.source = [];	//~~~


					setDatas($scope);
				}

				function setDatas($scope) {
					// $scope.pictures = $scope.style.pictures
					$scope.cates = Style.getStyleCate(function () {
						angular.forEach($scope.cates, function(value, key){
							if(value.id == $scope.style.style_cate_id){
								$scope.curType = value;

								//~~~
								if( value.style_cate_code == 'custom_config' && id ){
									//如果没有数据则初始化一下
									if( !$scope.style.source ){
										$scope.style.source = {
											"spot_options": [],
											"custom_configs": []
										}
									}else{
										//将'true','false'转成true,false
										var custom_configs = $scope.style.source.custom_configs;
										if( custom_configs ){
											$.each(custom_configs, function(index, val) {
												custom_configs[index].bNeed = val.bNeed=='true'  ? true : false;
											});
										}else{
											$scope.style.source.custom_configs = [];
										}

									}

									$scope.fnInitCustomSpot();
								}

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

				function dealData (data) {
				    if(data.result){
		                alert(data.msg);

		                window.location.href = "#/style/list";
		            }else{
		                alert(data.msg);
		            }
				}

				$scope.postData = function () {

					// if( $scope.curType.style_cate_code == 'custom_config' ){
					// 	//保存选中的热区类型
					// 	$scope.fnSaveSpotOptions();
					// }else{
					// 	// $scope.style.source = '';
					// }
					$scope.fnSaveSpotOptions();


					// $scope.style.source = JSON.stringify($scope.style.source);


				    var data = angular.fromJson(angular.toJson($scope.style));

			        data.style_cate_id = $scope.curType ? $scope.curType.id : '';
			        data.source_ids = [];

			        if(data.materials.length > 0){
			        	angular.forEach(data.materials, function(element, key){
			        		data.source_ids.push(element.id);
			        	});

			        	data.source_ids = data.source_ids.join(',');
			        }

				    if(id){
				    	data.id = id;
				        Style.edit( data ,function (data) {
				            dealData(data);
				        })
				    }else{
				        Style.add( data ,function (data) {
				            dealData(data);
				        })
				    }
				}

				$scope.setSelectValue = function (key,value) {
				    $scope[key] = value;
				    //在切换分类时，如果选了自定义，且$scope.style.source是Null，给一个初始值
				    if( value.style_cate_code == 'custom_config'){

				    	if( !$scope.style.source ){
				    		$scope.style.source = {
								"spot_options": [],
								"custom_configs": []
							};
				    	}else{
			    			var custom_configs = $scope.style.source.custom_configs;
                            if( custom_configs ){
                                //将'true','false'转成true,false
                                $.each(custom_configs, function(index, val) {
                                    if(val.bNeed.toString()=='true'){  //必填
                                        val.bNeed = true;
                                    }else{
                                        val.bNeed = false;
                                    }
                                });
                                $scope.fnInitCustomSpot();
                            }else{
                                curModule.source.custom_configs = [];
                            }
				    	}
				    }
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

		        function modifyFilters (name,type) {
		        	var flag = false;

        			angular.forEach(uploader.filters, function(filter, key){
        				if(filter.name == name){
        					if(type == 'del'){
        						uploader.filters.splice(key,1);
        					}
        				}
        			})

					if(type == 'add' && !flag){
						uploader.filters.push({
				            name: 'imageFilter',
				            fn: function(item , options) {
				                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
				            }
				        });
					}
		        }

                uploader.onAfterAddingFile = function (item) {
	                uploader.uploadAll();
                }

                uploader.onSuccessItem = function(fileItem, response, status, headers) {
                	if(response.result){
                		if($scope.type == 'thumb'){
                			$scope.style.thumb = response.data.thumb;
                		}else{
                			$scope.style.materials.unshift(response.data);
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
            			pager.goTo(1);
            		}
                }

                $scope.selectFile = function ($event,type) {
                	$event.stopPropagation();
                	$event.preventDefault();

                	if(type == 'thumb'){
                		uploader.url = getApi('uploadCoverPic');
                		modifyFilters('imageFilter','add');
                	}else{
                		uploader.url = getApi('uploadResource');
                		modifyFilters('imageFilter','del');
                	}

                	var inputFile = $event.toElement.previousElementSibling;

                	$timeout(function () {
                		inputFile.click();
                	}, 0)

                	$scope.type = type;
                }


                // 自定义参数-start
                ;(function () {

                	$scope.tempStyle = { float:'left', width: '30%', display: 'inline-block' };	//~~~

                	//自定义模块的方法都放到oConfig命名空间下
					var oConfig = $scope.oConfig = {};
					oConfig.otherSpot = [];
					oConfig.bNeedSpot = false;	//是否添加热区

					//默认会有下面5种类型
					var aDefaultId = [1,2,3,4,5];
					oConfig.defaultSpotSeletType = [false, false, false, false, false];
					oConfig.defaultSpot = [
						{
							id: aDefaultId[0],
							name: '普通链接'
						},
						{
							id: aDefaultId[1],
							name: '商品列表'
						},
						{
							id: aDefaultId[2],
							name: '商品详情'
						},
						{
							id: aDefaultId[3],
							name: '锚点跳转'
						},
						{
							id: aDefaultId[4],
							name: '返回首页'
						}
					];
					//将默认热区 和 其它热区 区分出来
					$scope.fnInitCustomSpot = function () {
						var aAllSpot = $scope.style.source.spot_options;
						if( aAllSpot && aAllSpot.length ){	//如果有热区数据
							//默认热区
							var otherSpotIndex = aAllSpot.length;
							$.each(aAllSpot, function(index, val) {
								if( !~aDefaultId.indexOf(+val.id) ){
									otherSpotIndex = index;
									return false;
								}
							});

							//其它热区类型
							oConfig.otherSpot = aAllSpot.slice(otherSpotIndex);
							var defaultSpot = aAllSpot.slice(0,otherSpotIndex);
							var aTemp = [];
							$.each(defaultSpot, function(index, val) {
								 aTemp[index] = +val.id;
							});

							$.each(oConfig.defaultSpot, function(index, val) {
								 oConfig.defaultSpotSeletType[index] = ~aTemp.indexOf(+val.id) ? true : false;
							});
						}
					};

					// 保存添加的热区,默认的选区在前面
					$scope.fnSaveSpotOptions = function () {
						if( !$scope.style.source )return;	//如果不是自定义组件，且无source则返回；
						var defaultSpot = [];
						$.each(oConfig.defaultSpotSeletType, function(index, bSelect) {
							 if( bSelect ){
							 	defaultSpot.push( oConfig.defaultSpot[index] );
							 }
						});
						$scope.style.source.spot_options = defaultSpot.concat( oConfig.otherSpot );
					};


					//添加其它热区类型（一般用于点击后有回调的情况）
					oConfig.fnAddSpot = function () {
						oConfig.otherSpot.push({});
					};
					//删除其它热区类型
					oConfig.fnDeleteSpot = function (index) {
						oConfig.otherSpot.splice(index, 1);
					};

                	//添加一个参数
					oConfig.fnAddConfig = function(type){
						switch(type){
							case 'text':
								$scope.style.source.custom_configs.push({
									type       : type,		//参数类型
									typeDes    : '文本',		//参数名称
									id         : '',		//参数id
									des        : '',		//参数描述，给运营的描述
									dep        : '',		//依赖关系
									bNeed      : true, 		//用户是否必填
									defaultVal : '' 		//参数选填默认值
								});
								break;
							case 'textarea':
								$scope.style.source.custom_configs.push({
									type       : type,		//参数类型
									typeDes    : '文本框',		//参数名称
									id         : '',		//参数id
									des        : '',		//参数描述，给运营的描述
									dep        : '',		//依赖关系
									bNeed      : true, 		//用户是否必填
									comment    : '',        //使用说明或者注意事项，在placeholder显示
									defaultVal : '' 		//参数选填默认值
								});
								break;
							case 'img':
								$scope.style.source.custom_configs.push({
									type       : type,		//参数类型
									typeDes    : '图片',		//参数名称
									id         : '',		//参数id
									des        : '',		//参数描述，给运营的描述
									dep        : '',		//依赖关系
									bNeed      : false, 	//用户是否必填
									defaultVal : {},	 	//参数选填默认值
									imgData    : [{}]		//多个图片，[{ id: '', des: '' }, { id: '', des: '' }, ...]
								});
								break;
							// case 'color':
							// 	$scope.style.source.custom_configs.push({
							// 		type       : type,		//参数类型
							// 		typeDes    : '颜色',		//参数名称
							// 		id         : '',		//参数id
							// 		des        : '',		//参数描述，给运营的描述
							//      dep        : '',		//依赖关系
							// 		bNeed      : true, 		//用户是否必填
							// 		defaultVal : ''	 		//参数选填默认值
							// 	});
							// 	break;
							case 'select':
								$scope.style.source.custom_configs.push({
									type       : type,		//参数类型
									typeDes    : '下拉',		//参数名称
									id         : '',		//参数id
									des        : '',		//参数描述，给运营的描述
									dep        : '',		//依赖关系
									bNeed      : false, 	//用户是否必填
									defaultVal : '',	 	//参数选填默认值
									options     :[{ val:'', des:'' },{ val:'', des:'' }]
								});
								break;
							case 'time':
								$scope.style.source.custom_configs.push({
									type       : type,		//参数类型
									typeDes    : '时间',		//参数名称
									id         : '',		//参数id
									des        : '',		//参数描述，给运营的描述
									dep        : '',		//依赖关系
									bNeed      : true, 		//用户是否必填
									defaultVal : ''	 		//参数选填默认值
								});
								break;
							case 'link':
								$scope.style.source.custom_configs.push({
									type       : type,		//参数类型
									typeDes    : '链接',		//参数名称
									id         : '',		//参数id
									des        : '',		//参数描述，给运营的描述
									dep        : '',		//依赖关系
									bNeed      : true, 		//用户是否必填
									defaultVal : '' 		//参数选填默认值
								});
								break;
							case 'instruction':
								$scope.style.source.custom_configs.push({
									type       : type,		//参数类型
									typeDes    : '说明',		//参数名称
									id         : 'instruction',		//参数id
									des        : '',		//参数描述，给运营的描述
									dep        : '',		//依赖关系
									bNeed      : false, 		//用户是否必填
									defaultVal : '' 		//参数选填默认值
								});
								break;
							default:
								break;
						}
					};
					// 删除一个参数
					oConfig.fnDeleteConfig = function (index) {
						$scope.style.source.custom_configs.splice(index,1);
					};


					//添加某下拉参数下的一个选项
					oConfig.fnAddOption = function(index){
						$scope.style.source.custom_configs[index].options.push({ val:'', des:'' });
					};
					//删除某下拉参数下的一个选项
					oConfig.fnDeleteOption = function(index,DataOption) {
					    DataOption.splice(index,1);
					};

					//在某图片参数下添加一张图片
					oConfig.fnAddImg = function (index) {
						$scope.style.source.custom_configs[index].imgData.push({des: '', id: ''});
					};
					//在某图片参数下删除一张图片
					oConfig.fnDeleteImg = function(index, aImgData) {
						aImgData.splice(index,1);
					};

					//~~~
					oConfig.fnShowConfig = function(){
						$scope.fnSaveSpotOptions();
						console.log(JSON.stringify($scope.style.source));
						console.log($scope.style.source );
					};
                })();
                // 自定义参数-end



		}]);

	}



})

