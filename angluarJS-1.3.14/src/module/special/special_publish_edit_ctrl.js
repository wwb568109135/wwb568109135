'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {

		require('common/service/special')(app);
		require('common/directive/timepicker')(app);
		require('common/directive/checkbox')(app);
		require('common/directive/crumb')(app);
		require('bower_component/jquery-ui/themes/smoothness/jquery-ui.min.css');
		require('bower_component/jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.min.css');

		app.register.controller('SpecialPublishEditCtrl',
			function($scope, $http, $rootScope, $location, $routeParams, Special,FileUploader,$timeout){
				var items = $routeParams.items,
					isMulti = items.split('_').length > 1,
					href = $location.url(),
					urlParams = href.split('?')[1],
					clientId = $routeParams.clientId;

				$scope.sid = $routeParams.id;
				// 配置导航参数
				$rootScope.setSepcialFlowInfo($routeParams.special_id,$routeParams.page_type_id,$routeParams.parent_id,$scope);

				if(!isMulti){
					$scope.special = Special.getPublishEdit({id : items},function () {
						setDatas($scope);
					});
				}else{
					$scope.special = Special.getPublishMultiEdit({ids : items},function () {
						setDatas($scope);
					});
				}



				// 初始化数据
				function setDatas($scope) {
					clientId = clientId ? clientId : $scope.special.client_id;
					$scope.pictures = $scope.special.pictures || [];
					// $scope.positions = $scope.special.position || [];
					$scope.positions = $scope.special.position || [];

					if(typeof $scope.positions === 'string'){
						$scope.positions = [{
							pos: $scope.positions,
							start_time: getDateString(0) + ' 10:00:00',
							end_time: getDateString(1) + ' 09:59:59',
							modify : false
						}];
					}

					$scope.platforms = Special.getPlatform(function () {
						if(!isMulti){
							$scope.initCheck($scope.special.platform, $scope.platforms);
							$scope.initCheckAll('platform');
						}
					});

					$scope.memberTypes = Special.getConsumerTypeList(function () {
						if(!isMulti){
							$scope.initCheck($scope.special.consumer_id, $scope.memberTypes);
							$scope.initCheckAll('memberType');
						}

					});

					$scope.channels = Special.getChannelList(function () {
						if(!isMulti){
							$scope.initCheck($scope.special.channel_id, $scope.channels);
							$scope.initCheckAll('channel');
						}
					});

					$scope.clients = Special.getListByClientId({client_id: clientId},function () {
						if(!isMulti){
							var ids = $scope.special.client_version_id;

							angular.forEach($scope.clients, function(val, k){
								k = k.replace(' ', '_');
								//console.log(k);
								$scope.initCheck(ids, val);

								if(k.indexOf('$') == -1){
									$scope.initCheckAll(k);
								}
							});
						}
					});

					$scope.addEnterRow('position');
					$scope.addEnterRow('picture');
				}

				// 删除档期（行）
				$scope.deleteEnterRow = function ($index,type) {
					switch(type){
						case 'position':
							$scope.positions.splice($index,1);
							break;
						case 'picture':
							$scope.pictures.splice($index,1);
							break;
						default:
							console.log('type为空！');
							break;
					}
				}

				function getDateString(AddDayCount) {
					var dd = new Date(),
						y,m,d;

					dd.setDate(dd.getDate() + AddDayCount);
					y = dd.getFullYear();
					m = dd.getMonth() + 1;
					d = dd.getDate();

					return y + "-" + (m >= 10 ? m : '0' + m) + "-" + (d >= 10 ? d : '0' + d);
				}

				// 增加档期（行）
				$scope.addEnterRow = function (type) {
					switch(type){
						case 'picture':
							var date = new Date(),
								obj = {
									id: "1",
									child_page_id: "1",
									start_time: getDateString(0) + ' 10:00:00',
									end_time: getDateString(1) + ' 09:59:59',
									phone_pic_src: "/css/images/680x326.png",
									pad_pic_src: "/css/images/640x590.png",
									modify : false
								}

							$scope.pictures.push(obj);
							break;
						case 'position':
							var date = new Date(),
								obj = {
									pos: "",
									start_time: getDateString(0) + ' 10:00:00',
									end_time: getDateString(1) + ' 09:59:59',
									modify : false
								}

							$scope.positions.push(obj);
							break;
						default:
							console.log('type为空！');
							break;
					}


				}

				// 提交表单
				$scope.postData = function (flag) {
					var url = !isMulti ? 'admin.php/Special/editSpecial/' : 'admin.php/special/editSpecialBatch?ids=' + items;

					var checkBox = {
							tempName : '',
						},
						clients = [],
						pictures = [],
						positions = [];

					$('input:checkbox[value]').each(function (i) {
						var name = this.name,
							curName = name,
							check = this.checked,
							value = this.value;

						angular.forEach($scope.clients, function(value, key){
							key = key.replace(' ', '_');
							if(key == name){
								curName = 'clients';
							}
						});

						if(checkBox.tempName != name && !checkBox[curName]){
							checkBox[curName] = [];
						}

						if(check){
							checkBox[curName].push(value);
						}

						checkBox.tempName = name;
					})

					angular.forEach($scope.pictures, function(element, key){
						if(element.modify || element.modify == undefined){
							pictures.push(element);
						}
					});


					angular.forEach($scope.positions, function(element, key){
						if(element.modify || element.modify == undefined){
							positions.push(element);
						}
					});

					if(!checkTime(positions)){
						alert('MZT位置时间有重叠，请检查！');
						return;
					}

					if(!checkTime(pictures)){
						alert('档期图时间有重叠，请检查！');
						return;
					}

					function checkTime(arr) {
						var element;

						for (var j = 0; j < arr.length; j++) {
							element = arr[j];

							var startTime = new Date(element.start_time).getTime(),
								endTime = new Date(element.end_time).getTime(),
								start, end;

							for (var i = 0; i < arr.length; i++) {
								if(j != i){
									start = new Date(arr[i].start_time).getTime();
									end = new Date(arr[i].end_time).getTime();
									// console.log(j,i,startTime,endTime,start,end);
									if((startTime >= start && startTime <= end) || (endTime >= start && endTime <= end)){
										return false;
									}
								}

							};
						};

						return true;
					}



					// console.log($scope.special);

					var data = {
			                'id' : $scope.special.id,
			                'name' : $scope.special.name,
			                'title' : $scope.special.title,
			                'start_time' : $scope.special.start_time,
			                'end_time' : $scope.special.end_time,
			                'client_id' : $scope.special.client_id,
			                'consumer_id' : checkBox.memberType,
			                'channel_id' : checkBox.channel,
			                'platform' : checkBox.platform,
			                'client_version_id' : checkBox.clients,
			                'pictures' : pictures,
			                'position' : positions,
			                'is_sync_time' : $scope.special.is_sync_time,
			                'display' : $scope.special.display,
			            },
			            transFn = function(data) {
			                return $.param(data);
			            },
			            postCfg = {
			                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			                transformRequest: transFn
			            };

			        angular.forEach(data, function(value, key){
			        	if(value == ''){
			        		delete(data[key])
			        	}
			        });

			        // console.log(data);

			        $http.post(url, data, postCfg)
			            .success(function(data){
			            	if (data.code == 1) {
			            		alert(data.msg);
			            		var param = {
			            			page_type_id : $routeParams.page_type_id,
			            			special_id : $routeParams.special_id,
			            			parent_id : $routeParams.parent_id
			            		};

			            		window.location.href = "#/special/"+ $routeParams.id +"/publish?" + $.param(param);
			            	}else{
			            		alert(data.msg);
			            	}
			            });
				}

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
		            url: '/admin.php?c=Special&a=uploadPic'
		        });

		        uploader.filters.push({
                    name: 'imageFilter',
                    fn: function(item , options) {
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                    }
                });

                uploader.onAfterAddingFile = function (item) {
                	var reader = new FileReader();

	                reader.onload = onLoadFile;
	                reader.readAsDataURL(item._file);

	                function onLoadFile(event) {
	                    var img = new Image();
	                    img.onload = onLoadImage;
	                    img.src = event.target.result;
	                }

	                function onLoadImage() {
	                	var messure = deviceMesure[$scope.type];

	                	if(this.width == messure.width && this.height == messure.height){
	                		uploader.uploadAll();

	                		if(uploader.queue.length > 1){
	                			uploader.removeFromQueue(0);
	                		}
	                	}else {
	                		alert("预售图尺寸有误!正确尺寸为：" + messure.width + 'x' + messure.height);
	                	}
	                }
                }

                uploader.onSuccessItem = function(fileItem, response, status, headers) {
                	if(response.result){
                		$scope.pictures[$scope.index][$scope.type + '_pic_src'] = response.data[$scope.type + '_pic_src'];
                		$scope.pictures[$scope.index].modify = true;
                	}else {
                		alert('报错了');
                	}
                };

                $scope.selectFile = function ($event,type,index) {
                	$event.stopPropagation();

                	uploader.url = '/admin.php?c=Special&a=uploadPic&type=' + type;

                	var inputFile = $event.toElement.previousElementSibling;

                	$timeout(function () {
                		inputFile.click();
                	}, 0)

                	$scope.type = type;
                	$scope.index = index;
                }

                $scope.changeStatus = function (obj) {
                	// console.log(obj);
                	obj.modify = true;
                }

                $scope.setGlobalTime = function (value,type) {
                	switch(type){
                		case 'start':
                			$scope.syncTime(value,$scope.positions[0],'start_time');
                			$scope.syncTime(value,$scope.pictures[0],'start_time');
                			break;
                		case 'end':
                			$scope.syncTime(value,$scope.positions[$scope.positions.length - 1],'end_time');
                			$scope.syncTime(value,$scope.pictures[$scope.pictures.length - 1],'end_time');
                			break;
                	}
                }

                $scope.syncTime = function (value, obj, key) {
                	if(obj){
                		obj[key] = value;
                	}
                }
		});

	}
})

