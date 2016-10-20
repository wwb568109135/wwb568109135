"use strict";

define(function(require, exports, module) {

	module.exports = function(app) {

		app.register.directive('specialModule', function ($timeout, $rootScope, Module,$routeParams,$sce) {
			return {
				restrict: 'EA',
				// scope: {
				// 	module: '=specialModule',
				// 	index: '=index'
				// },

				controller: function($scope, $element, $attrs){

				},

				link: function(scope, iElement, iAttrs, controller){
					var iframe = iElement.find('iframe'),
						win = iframe.get(0) ? iframe.get(0).contentWindow : null,
						client = $rootScope.client;

					// 改变module，需要自适应iframe高度
					scope.$watch('module', function(newValue, oldValue){
						if(!win) {
							initModule();
							return
						}

						scope.src = client != 'pc' ? ('/demo/module.html?client=' + client) : ('/demo/pc/module.html?client=' + client);
						// console.log('before load');
						iframe.load(function(){
						// console.log('after load');
							try{
								win.renderer.init({
									config: JSON.parse(JSON.stringify(scope.module))
								});
							}catch(e){
								console.log('渲染落地页出错:' + e.message);
							}

							$timeout(function(){
								// iframe.contents获取document对象，必须在onload后获取，因为前后的文档树不一样，对应的document对象也不同
								iframe.height(iframe.contents().height());
								iframe.height(iframe.contents().height());
								initModule();
							}, 1100)
						})
					})

					// 初始化模块
					function initModule(){
						// console.log($rootScope);
						// 删除模块
						scope.remove = function ($event, module) {
							$event.stopPropagation();
							Module.remove({
									id: module.id,
									module_type_id: module.module_type_id,
									page_type_id: $routeParams.page_type_id,
									page_id : $routeParams.id,
									client : $rootScope.client
								}, function (res) {
									if(res.result){
										$rootScope.page.moduleList.splice(scope.$index, 1);
										$rootScope.setComponentId($rootScope.page.moduleList,res.data.new_sort);
										$rootScope.updatePage();
										$rootScope.curModule = '';
										$rootScope.curEditType = '';
										$rootScope.curBlock = '';
									} else {
										alert('报错');
									}

							})
						}


						// 编辑模块
						scope.edit = function ($event) {
							var module = scope.module;
                            setTimeout(function(){
                                $rootScope.moduleEditorScroll();
                            },100);

							// console.log("edit");
							// console.log($rootScope);
							$event.stopPropagation();
							$rootScope.curModule = scope.module;
							$rootScope.curModuleIdx = scope.$index;
							$rootScope.curEditType = module.module_type_id;
							//console.log($rootScope.curEditType)

						}

						switch(scope.module.module_type_id) {

							// 品购组件
							case 'purchase':

								scope.handleKeydown = function($event) {
									$event.stopPropagation();
									if ($event.keyCode == 17 && !$event.shiftKey) {//按住Ctrl键
										scope.isKeydown = 1;
									} else if ($event.keyCode == 16 && !$event.ctrlKey) {//按住Shift键
										scope.isKeydown = 2;
									}
									if ($event.ctrlKey && $event.shiftKey) {//按住Ctrl+Shift键
										scope.isKeydown = 3;
									}
								}

								scope.handleMouseover = function($event) {
									$event.stopPropagation();
									//鼠标移入编辑区自动聚焦，以响应键盘事件
									if ($($event.target).hasClass('hotspot-wrapper')) {
										$event.target.focus();
									}
								}

								scope.handleMousedown = function($event){
									$event.stopPropagation();
									var list, item, el,
										commonStyle = 'background:#328d8f;position:absolute; opacity:.7;';

									if (!$($event.target).hasClass('ui-resizable-handle')) {
										if (scope.isKeydown) {
											switch (scope.isKeydown) {
												//按住Ctrl键，生成横向两个热区
												case 1:
													el = [$('<div style="' + commonStyle + ' border-right:2px solid #88FF40"></div>'),
														$('<div style="' + commonStyle + '"></div>')
													];
													break;
													//按住Shift键，生成纵向两个热区
												case 2:
													el = [$('<div style="' + commonStyle + ' border-bottom:2px solid #88FF40"></div>'),
														$('<div style="' + commonStyle + '"></div>')
													];
													break;
													//按住Shift键，生成横纵四个热区
												case 3:
													el = [$('<div style="' + commonStyle + ' border-right:2px solid #88FF40;border-bottom:2px solid #88FF40"></div>'),
														$('<div style="' + commonStyle + 'border-bottom:2px solid #88FF40"></div>'),
														$('<div style="' + commonStyle + 'border-right:2px solid #88FF40;"></div>'),
														$('<div style="' + commonStyle + '"></div>')
													];
													break;

												default:
													break;
											}
											angular.forEach(el, function(value, key) {
												el[key].css({
													left: $event.offsetX,
													top: $event.offsetY
												});
											});
											//没有按快捷键生成一个热区
										} else {
											var el = $('<div style="' + commonStyle + '"></div>');
											el.css({
												left: $event.offsetX,
												top: $event.offsetY
											});
										}

										$('.hotspot-wrapper', $event.currentTarget.parentNode).append(el);
										scope.curDrawingHotspot = {
											left: $event.offsetX,
											top: $event.offsetY,
											el: el
										}
									}

								}

								scope.handleMousemove = function($event){
									$event.preventDefault();
									if(scope.curDrawingHotspot && !$($event.target).hasClass('ui-resizable-handle')){

										if (scope.isKeydown &&　scope.curDrawingHotspot.el.length > 1) {
											switch (scope.isKeydown) {
												//按住Ctrl键，生成横向两个热区
												case 1:
													scope.curDrawingHotspot.el[0].css({
														width: ($event.offsetX - scope.curDrawingHotspot.left) / 2,
														height: ($event.offsetY - scope.curDrawingHotspot.top)
													});
													scope.curDrawingHotspot.el[1].css({
														left: $event.offsetX - ($event.offsetX - scope.curDrawingHotspot.left) / 2,
														width: ($event.offsetX - scope.curDrawingHotspot.left) / 2,
														height: ($event.offsetY - scope.curDrawingHotspot.top)
													});
													break;
												//按住Shift键，生成纵向两个热区
												case 2:
													scope.curDrawingHotspot.el[0].css({
														width: ($event.offsetX - scope.curDrawingHotspot.left),
														height: ($event.offsetY - scope.curDrawingHotspot.top) / 2
													});
													scope.curDrawingHotspot.el[1].css({
														top: $event.offsetY - ($event.offsetY - scope.curDrawingHotspot.top) / 2,
														width: ($event.offsetX - scope.curDrawingHotspot.left),
														height: ($event.offsetY - scope.curDrawingHotspot.top) / 2
													});
													break;
												//按住Shift键，生成横纵四个热区
												case 3:
													scope.curDrawingHotspot.el[0].css({
														width: ($event.offsetX - scope.curDrawingHotspot.left) / 2,
														height: ($event.offsetY - scope.curDrawingHotspot.top) / 2
													});
													scope.curDrawingHotspot.el[1].css({
														left: $event.offsetX - ($event.offsetX - scope.curDrawingHotspot.left) / 2,
														width: ($event.offsetX - scope.curDrawingHotspot.left) / 2,
														height: ($event.offsetY - scope.curDrawingHotspot.top) / 2
													});
													scope.curDrawingHotspot.el[2].css({
														top: $event.offsetY - ($event.offsetY - scope.curDrawingHotspot.top) / 2,
														width: ($event.offsetX - scope.curDrawingHotspot.left) / 2,
														height: ($event.offsetY - scope.curDrawingHotspot.top) / 2
													});
													scope.curDrawingHotspot.el[3].css({
														top: $event.offsetY - ($event.offsetY - scope.curDrawingHotspot.top) / 2,
														left: $event.offsetX - ($event.offsetX - scope.curDrawingHotspot.left) / 2,
														width: ($event.offsetX - scope.curDrawingHotspot.left) / 2,
														height: ($event.offsetY - scope.curDrawingHotspot.top) / 2
													});
													break;

												default:
													break;
											}
										//没有按快捷键生成一个热区
										} else {
											scope.curDrawingHotspot.el.css({
												width: $event.offsetX - scope.curDrawingHotspot.left,
												height: $event.offsetY - scope.curDrawingHotspot.top
											});
										}

									}
								}

								scope.handleMouseup = function($event){
									//$event.stopPropagation();//加上会导致点击就拖动
									if (scope.curDrawingHotspot && !$($event.target).hasClass('ui-resizable-handle')) {
										if (scope.isKeydown) {
											switch (scope.isKeydown) {
												//按住Ctrl键，生成横向两个热区
												case 1:
													var config = [{
														left: scope.curDrawingHotspot.left,
														top: scope.curDrawingHotspot.top,
														height: $event.offsetY - scope.curDrawingHotspot.top,
														width: ($event.offsetX - scope.curDrawingHotspot.left) / 2 - 2,
													}, {
														left: scope.curDrawingHotspot.left + ($event.offsetX - scope.curDrawingHotspot.left) / 2,
														top: scope.curDrawingHotspot.top,
														height: $event.offsetY - scope.curDrawingHotspot.top,
														width: ($event.offsetX - scope.curDrawingHotspot.left) / 2 - 2,
													}];

													break;
												//按住Shift键，生成纵向两个热区
												case 2:
													var config = [{
														left: scope.curDrawingHotspot.left,
														top: scope.curDrawingHotspot.top,
														height: ($event.offsetY - scope.curDrawingHotspot.top) / 2 - 2,
														width: $event.offsetX - scope.curDrawingHotspot.left,
													}, {
														left: scope.curDrawingHotspot.left,
														top: scope.curDrawingHotspot.top + ($event.offsetY - scope.curDrawingHotspot.top) / 2,
														height: ($event.offsetY - scope.curDrawingHotspot.top) / 2 - 2,
														width: $event.offsetX - scope.curDrawingHotspot.left,
													}];
													break;
												//按住Shift键，生成横纵四个热区
												case 3:
													var config = [{
														left: scope.curDrawingHotspot.left,
														top: scope.curDrawingHotspot.top,
														height: ($event.offsetY - scope.curDrawingHotspot.top) / 2 - 2,
														width: ($event.offsetX - scope.curDrawingHotspot.left) / 2 - 2,
													}, {
														left: scope.curDrawingHotspot.left + ($event.offsetX - scope.curDrawingHotspot.left) / 2,
														top: scope.curDrawingHotspot.top,
														height: ($event.offsetY - scope.curDrawingHotspot.top) / 2 - 2,
														width: ($event.offsetX - scope.curDrawingHotspot.left) / 2 - 2,
													}, {
														left: scope.curDrawingHotspot.left,
														top: scope.curDrawingHotspot.top + ($event.offsetY - scope.curDrawingHotspot.top) / 2,
														height: ($event.offsetY - scope.curDrawingHotspot.top) / 2 - 2,
														width: ($event.offsetX - scope.curDrawingHotspot.left) / 2 - 2,
													}, {
														left: scope.curDrawingHotspot.left + ($event.offsetX - scope.curDrawingHotspot.left) / 2,
														top: scope.curDrawingHotspot.top + ($event.offsetY - scope.curDrawingHotspot.top) / 2,
														height: ($event.offsetY - scope.curDrawingHotspot.top) / 2 - 2,
														width: ($event.offsetX - scope.curDrawingHotspot.left) / 2 - 2,
													}];
													break;

												default:
													break;
											}

											if (config[0].height > 50 && config[0].width > 50) {
												angular.forEach(config, function(value, key) {
													scope.createHotspot(value);
												});
											}
											angular.forEach(scope.curDrawingHotspot.el, function(value, key) {
												scope.curDrawingHotspot.el[key].remove();
											});

										//没有按快捷键生成一个热区
										} else {

											var config = {
												left: scope.curDrawingHotspot.left,
												top: scope.curDrawingHotspot.top,
												height: $event.offsetY - scope.curDrawingHotspot.top,
												width: $event.offsetX - scope.curDrawingHotspot.left,
											}

											if (config.width > 0 && (config.height > 50 || config.width > 50)) {
												scope.createHotspot(config);
											}
											scope.curDrawingHotspot.el.remove();
										}

										delete scope.curDrawingHotspot;

										scope.isKeydown = 0;
									}
								}

								scope.handleMouseout = function($event){
									$event.stopPropagation();
									scope.handleMouseup($event);
									$($event.target).blur();
								}


								scope.handleClick = function($event){
									scope.createHotspot($event);
								}

								scope.removeBlock = function($event, block, $index){
									$event.stopPropagation();
									scope.module.model.list.splice($index, 1);
									$rootScope.curModule = scope.module;
								}

								scope.stopEvent = function($event){
									$event.stopPropagation();
								}

								scope.editBlock = function($event, block, $index){
									$event.stopPropagation();
									$('.templetZtmb-contentUploadDraw').removeClass('active');
									$($event.target).addClass('active');

									$rootScope.curBlock = block;
									$rootScope.curModule = scope.module;
									$rootScope.curModuleIdx = scope.$index;
									$rootScope.curBlock.index = typeof $rootScope.curBlock.index == "undefined" ? 0: $rootScope.curBlock.index;

									if ($rootScope.curBlock.index == 0 ) {
										$rootScope.curEditType = 'purchaseProductHotspot';
										$rootScope.newBlockPosition.key = $rootScope.curBlock.position;
									} else if( $rootScope.curBlock.index == 1){
										$rootScope.curEditType = 'purchaseUrlHotspot';
									}else if( $rootScope.curBlock.index == 2){
										$rootScope.curEditType = 'purchaseIndexHotspot';
									}else if( $rootScope.curBlock.index == 3){
										$rootScope.curEditType = 'purchaseVirtualProductHotspot';
									}else if( $rootScope.curBlock.index == 4){
										$rootScope.curEditType = 'purchaseAppCategoryHotspot';
									}else{
										console.log("第一次-editBlock");
										$rootScope.curEditType = 'purchaseProductHotspot';
										$rootScope.newBlockPosition.key = $rootScope.curBlock.position;
									}
									// if(block.position !== undefined){
									// 	$rootScope.curEditType = 'purchaseProductHotspot';
									// 	$rootScope.newBlockPosition.key = $rootScope.curBlock.position;
									// } else {
									// 	$rootScope.curEditType = 'purchaseUrlHotspot';
									// }
								}

								scope.stop = function($event, ui, block){
									block.left = ui.position.left + 'px';
									block.top = ui.position.top + 'px';
									$rootScope.curModule = scope.module;
								}

								// 创建品购商品热区
								scope.createHotspot = function(config){
									var idx, obj, list,
										blockConfig = {
											width: config.width + 'px',
											height: config.height + 'px'
										},
										list = scope.module.model.list = scope.module.model.list || [];

									idx = $rootScope.getHotspotIdx($.map(list, function(v){return v.position}));

									obj = angular.extend(blockConfig, {
										left: config.left + 'px',
										top: config.top + 'px',
										position: idx
									})

									scope.module.model.list.push(obj);
									scope.bindResize();
									$rootScope.curModule = scope.module;
								}

								$rootScope.getHotspotIdx = function(list){
									var idx, arr;

									arr = list.sort(function(a, b){return a - b;});

									// 特殊情况，列表为0或列表数字连续
									if(!arr.length) return 0;
									if(arr[arr.length - 1] == arr.length - 1) return arr.length;

									for(var i = 0; i < arr.length; i++){
										if(i != arr[i]) {
											idx = i;
											break;
										}
									}

									return idx
								}

								scope.initHotspot = function(){

									if ($rootScope.pageModel == 0) {
										console.log("简约模式下，品购组件：不处理%换px");
									}else{

										$timeout(function(){
											scope.bindResize();

											$('.J_block', iElement).each(function(k, v){
												scope.module.model.list[k].width = $(v).width() + 'px';
												scope.module.model.list[k].height = $(v).height() + 'px';
												scope.module.model.list[k].left = v.offsetLeft + 'px',
												scope.module.model.list[k].top = v.offsetTop + 'px'
											});
										}, 0);
									}
								}

								scope.bindResize = function(){
									$timeout(function(){
										$('.J_block', iElement).resizable({
											resize: function(event, ui){
												event.stopPropagation();
												ui.element.scope().block.width = ui.element.width() + 'px';
												ui.element.scope().block.height = ui.element.height() + 'px';
												$rootScope.curModule = scope.module;
											}
										});
									})
								}


								scope.initHotspot();

								var module = scope.module;
								if(!module.model) module.model = {
									list : [],
									phone_pic_src : '',
									pad_pic_src : ''
								}

								break;

							// 头图组件
							case 'head':
								scope.isHeadShow = false;
								scope.handleMousedown = function($event){
									$event.stopPropagation();
									var list, item;

									if(!$($event.target).hasClass('ui-resizable-handle')){
										var el = $('<div style="background:#328d8f; position:absolute; opacity:.7"></div>');
										$('.hotspot-wrapper', $event.currentTarget.parentNode).append(el);

										el.css({
											left: $event.offsetX,
											top: $event.offsetY
										});

										scope.curDrawingHotspot = {
											left: $event.offsetX,
											top: $event.offsetY,
											el: el
										}
									}

								}

								scope.handleMousemove = function($event){
									$event.preventDefault();

									if(scope.curDrawingHotspot && !$($event.target).hasClass('ui-resizable-handle')){
										scope.curDrawingHotspot.el.css({
											width: $event.offsetX - scope.curDrawingHotspot.left,
											height: $event.offsetY - scope.curDrawingHotspot.top
										});
									}
								}

								scope.handleMouseup = scope.handleMouseout = function($event){
									// $event.stopPropagation();
									if(scope.curDrawingHotspot && !$($event.target).hasClass('ui-resizable-handle')){
										var config = {
											left: scope.curDrawingHotspot.left,
											top: scope.curDrawingHotspot.top,
											height: $event.offsetY - scope.curDrawingHotspot.top,
											width: $event.offsetX - scope.curDrawingHotspot.left,
										}

										if(config.width > 0 && (config.height > 50 || config.width > 50)){
											scope.createHotspot(config);
										}

										scope.curDrawingHotspot.el.remove();
										delete scope.curDrawingHotspot;
									}
								}

								scope.removeBlock = function($event, block, $index){
									$event.stopPropagation();
									scope.module.model.list.splice($index, 1);
									$rootScope.curModule = scope.module;
								}

								scope.editBlock = function($event, block, $index){
									// alert("editBlock-toutu");
									$event.stopPropagation();
									$rootScope.curBlock = block;
									$rootScope.curModule = scope.module;
									$rootScope.curEditType = 'headHotspot';
									$rootScope.curModuleIdx = scope.$index;
									$('.templetZtmb-contentUploadDraw').removeClass('active');
									$($event.target).addClass('active');
									console.log($scope);
								}

								scope.popAnchor = function($event, block, $index){
									$event.stopPropagation();
									$rootScope.curBlock = block;
									$rootScope.curModule = scope.module;
									$rootScope.curEditType = 'headAnchor';
								}

								//定时任务
								scope.setTiming = function($event, block, $index){
									$event.stopPropagation();
									$rootScope.curBlock = block;
									$rootScope.curModule = scope.module;
									$rootScope.curEditType = 'timing';
								}

								//简约模式下 切换
								scope.toggleImgSrc = function($event, block, $index){
									$event.stopPropagation();
									console.log("toggleImgSrc");
									if ( scope.isHeadShow ) {
										scope.isHeadShow = false;
									}else{
										scope.isHeadShow = true;
									}
								}


								scope.stop = function($event, ui, block){
									// console.log(scope.module);
									$rootScope.curModule = scope.module;
									block.left = ui.position.left + 'px';
									block.top = ui.position.top + 'px';
								}

								// 创建图片热区
								scope.createHotspot = function(config){
									var obj, list,
										blockConfig = {
											width: config.width + 'px',
											height: config.height + 'px',
											type: 1
										},
										list = scope.module.model.list = scope.module.model.list || [];


									obj = angular.extend(blockConfig, {
										left: config.left + 'px',
										top: config.top + 'px'
									})

									scope.module.model.list.push(obj);
									scope.bindResize();
									$rootScope.curModule = scope.module;
								}

								scope.initHotspot = function(){
									if ($rootScope.pageModel == 0) {
										console.log("简约模式下，头图组件：不处理%换px");
									}else{
										$timeout(function(){
											scope.bindResize();

											$('.J_block', iElement).each(function(k, v){
												scope.module.model.list[k].width = $(v).width() + 'px';
												scope.module.model.list[k].height = $(v).height() + 'px';
												scope.module.model.list[k].left = v.offsetLeft + 'px';
												scope.module.model.list[k].top = v.offsetTop + 'px';
											});
										}, 0);
									}

								}

								scope.bindResize = function(){
									$timeout(function(){
										$('.J_block', iElement).resizable({
											resize: function(event, ui){
												event.stopPropagation();
												ui.element.scope().block.width = ui.element.width() + 'px';
												ui.element.scope().block.height = ui.element.height() + 'px';
												$rootScope.curModule = scope.module;
											}
										});
									})
								}

								scope.initHotspot();

								var module = scope.module;
								if(!module.model) module.model = {
									list : [],
									phone_pic_src : '',
									pad_pic_src : ''
								}

								break;

 							// 自定义参数组件~~~
							case 'custom_config':
								$rootScope.CUSTOM_CONFIG_CONFIG = $rootScope.CUSTOM_CONFIG_CONFIG || {};

								// ~~~ 如果没有选择热区类型，则不用设
								var aSpot = scope.module.source ?  (scope.module.source.spot_options || []) : [];
								if( !aSpot.length ){
									return;
								}

								scope.handleMousedown = function($event){
									$event.stopPropagation();
									var list, item;

									if(!$($event.target).hasClass('ui-resizable-handle')){
										var el = $('<div style="background:#328d8f; position:absolute; opacity:.7"></div>');
										$('.hotspot-wrapper', $event.currentTarget.parentNode).append(el);

										el.css({
											left: $event.offsetX,
											top: $event.offsetY
										});

										scope.curDrawingHotspot = {
											left: $event.offsetX,
											top: $event.offsetY,
											el: el
										}
									}

								}

								scope.handleMousemove = function($event){
									$event.preventDefault();

									if(scope.curDrawingHotspot && !$($event.target).hasClass('ui-resizable-handle')){
										scope.curDrawingHotspot.el.css({
											width: $event.offsetX - scope.curDrawingHotspot.left,
											height: $event.offsetY - scope.curDrawingHotspot.top
										});
									}
								}

								scope.handleMouseup = scope.handleMouseout = function($event){
									// $event.stopPropagation();
									if(scope.curDrawingHotspot && !$($event.target).hasClass('ui-resizable-handle')){
										var config = {
											left: scope.curDrawingHotspot.left,
											top: scope.curDrawingHotspot.top,
											height: $event.offsetY - scope.curDrawingHotspot.top,
											width: $event.offsetX - scope.curDrawingHotspot.left,
										}

										if(config.width > 0 && (config.height > 50 || config.width > 50)){
											scope.createHotspot(config);
										}

										scope.curDrawingHotspot.el.remove();
										delete scope.curDrawingHotspot;
									}


								}

								scope.removeBlock = function($event, block, $index){
									$event.stopPropagation();
									scope.module.model.list.splice($index, 1);
									$rootScope.curModule = scope.module;
								}

								scope.editBlock = function($event, block, $index){
									$event.stopPropagation();
									$rootScope.curBlock = block;
									$rootScope.curModule = scope.module;
									$rootScope.curEditType = 'custom_config_spot';
									$rootScope.curModuleIdx = scope.$index;
									$('.templetZtmb-contentUploadDraw').removeClass('active');
									$($event.target).addClass('active');
								}

								scope.popAnchor = function($event, block, $index){
									$event.stopPropagation();
									$rootScope.curBlock = block;
									$rootScope.curModule = scope.module;
									$rootScope.curEditType = 'custom_config';
								}

								scope.stop = function($event, ui, block){
									// console.log(scope.module);
									$rootScope.curModule = scope.module;
									block.left = ui.position.left + 'px';
									block.top = ui.position.top + 'px';
								}

								// 创建图片热区
								scope.createHotspot = function(config){
									var obj, list,
										blockConfig = {
											width: config.width + 'px',
											height: config.height + 'px',
											type: 1
										},
										list = scope.module.model.list = scope.module.model.list || [];

									obj = angular.extend(blockConfig, {
										left: config.left + 'px',
										top: config.top + 'px'
									})

									scope.module.model.list.push(obj);
									scope.bindResize();
									$rootScope.curModule = scope.module;
								}

								scope.initHotspot = function(){
									if ($rootScope.pageModel == 0) {
										console.log("简约模式下，自定义组件：不处理%换px");
									}else{
										$timeout(function(){
											scope.bindResize();

											$('.J_block', iElement).each(function(k, v){
												scope.module.model.list[k].width = $(v).width() + 'px';
												scope.module.model.list[k].height = $(v).height() + 'px';
												scope.module.model.list[k].left = v.offsetLeft + 'px';
												scope.module.model.list[k].top = v.offsetTop + 'px';
											});
										}, 0);
									}
								}

								scope.bindResize = function(){
									$timeout(function(){
										$('.J_block', iElement).resizable({
											resize: function(event, ui){
												event.stopPropagation();
												ui.element.scope().block.width = ui.element.width() + 'px';
												ui.element.scope().block.height = ui.element.height() + 'px';
												$rootScope.curModule = scope.module;
											}
										});
									})
								}

								scope.initHotspot();

								var module = scope.module;
								if(!module.model) module.model = {
									list : [],
									phone_pic_src : '',
									pad_pic_src : ''
								}

								break;

							// 档期楼层组件
							case 'brand_with_product':
							case 'brand':
								// scope.module.needCss = true;
								scope.editBlock = function($event, block, $index){
									$event.stopPropagation();
									$rootScope.curBlock = block;
									$rootScope.curModule = scope.module;
									$rootScope.curEditType = 'brandHotspot';
									$rootScope.curModuleIdx = scope.$index;
								}

								scope.editAll = function () {
									$rootScope.curBlock = '';
									$rootScope.curModule = scope.module;
									$rootScope.curEditType = 'brandEditAll';
									$rootScope.curModuleIdx = scope.$index;
								}

								// 初始化档期
								scope.init = function(){
									var module = scope.module, modelList, modelDefault;

									// 初始化model
									module.model = module.model || {};
									module.model.list = module.model.list || [];
									module.model.batch = module.model.batch || {
											is_click : 'true',
											is_coupon : 'true',
											is_collect : 'false',
											is_watermark: 'false',
											watermark : ""
										};

									// 全局设置可否点击与是否显示收藏人数
									module.model.is_click = module.model.is_click || 'true';
									module.model.is_collect = module.model.is_collect || 'false';
									module.model.is_phone_style = module.model.is_phone_style || 'true';
									module.model.show_type = module.model.show_type || 'uion';

									// 初始化extend
									if(!module.extend) module.extend =  {
										page : {
											isPaging : 'false',
						             		limit : 20,
						             		offset : 10
										}
									}

									modelList = module.model.list;
									modelDefault = {
										// brand_id: "151256",
										// brand_name: "圣诞节卡机看将扩大是",
										is_click : 'true',
										is_coupon : 'true',
										is_collect : 'false',
										is_watermark : 'false',
										watermark : ""
									};

									// 初始化单个档期数据
									var arr = scope.module.data || [];
									$.each(arr, function(k, v){
										var model = modelList[k];
										// 没初始化过，或id没改变过，使用默认档期配置数据
										if(!model || (model && model.brand_id != v.brand_id)){
											model = $.extend({}, modelDefault);
											$.extend(model, {
												brand_id: v.brand_id,
												brand_name: v.brand_name
											})
										}
										// 改变module.data的结构，分解为原始数据及扩展数据
										arr[k] = {
											origin: v,
											extend: model
										}

									});

									module.labels = [];
									module.brandLabels = [];
									module.searchKey = '';

									// 初始化档期标签数据
									if(module.model.labelName && module.model.label) {
										var ids = module.model.label.split(',');

										angular.forEach(module.model.labelName.split(','), function(value, key){
											var obj = {};
											obj.name = value;
											obj.tagId = ids[key];

											module.labels.push(obj);
										});
									}
								}

								scope.init();
								break;

							//商品楼层组件
							case 'product':
								// scope.module.needCss = true;
								scope.editBlock = function($event, block, $index){
									$event.stopPropagation();
									$rootScope.curBlock = block;
									$rootScope.curModule = scope.module;
									$rootScope.curEditType = 'productHotspot';
									$rootScope.curModuleIdx = scope.$index;
								}

								scope.editAll = function () {
									$rootScope.curBlock = '';
									$rootScope.curModule = scope.module;
									$rootScope.curEditType = 'productEditAll';
									$rootScope.curModuleIdx = scope.$index;
								}

								// 初始化商品
								scope.init = function(){
									var module = scope.module, modelList, modelDefault;

									// 初始化model
									if(!module.model) module.model = {list:[], batch: {
										is_watermark: 'false',
										watermark : ""
									}};

									// 初始化extend
									if(!module.extend) module.extend =  {
										page : {
											is_personality : 'true',
											isPaging : 'false',
						             		limit : 20,
						             		offset : 10
										}
									}

									module.model.is_phone_style = module.model.is_phone_style || 'true';

									modelList = module.model.list;
									modelDefault = {
										is_watermark : 'false',
										watermark : ""
									};

									// 初始化单个商品数据
									var arr = scope.module.data || [];
									$.each(arr, function(k, v){
										var model = modelList[k];
										// 没初始化过，或id没改变过，使用默认档期配置数据
										if(!model || (model && model.product_id != v.product_id)){
											model = $.extend({}, modelDefault);
											$.extend(model, {
												brand_id: v.brand_id,
												product_id: v.product_id,
												product_name: v.product_name
											})
										}
										// 改变module.data的结构，分解为原始数据及扩展数据
										arr[k] = {
											origin: v,
											extend: model
										}

									})
								}

								scope.init();
								break;

							// 悬浮球组件
							case 'suspend':
								scope.handleMousedown = function($event){
									$event.stopPropagation();
									var list, item;

									if(!$($event.target).hasClass('ui-resizable-handle')){
										var el = $('<div style="background:#328d8f; position:absolute; opacity:.7"></div>');
										$('.hotspot-wrapper', $event.currentTarget.parentNode).append(el);

										el.css({
											left: $event.offsetX,
											top: $event.offsetY
										});

										scope.curDrawingHotspot = {
											left: $event.offsetX,
											top: $event.offsetY,
											el: el
										}
									}

								}

								scope.handleMousemove = function($event){
									$event.preventDefault();

									if(scope.curDrawingHotspot && !$($event.target).hasClass('ui-resizable-handle')){
										scope.curDrawingHotspot.el.css({
											width: $event.offsetX - scope.curDrawingHotspot.left,
											height: $event.offsetY - scope.curDrawingHotspot.top
										});
									}
								}

								scope.handleMouseup = scope.handleMouseout = function($event){
									// $event.stopPropagation();
									if(scope.curDrawingHotspot && !$($event.target).hasClass('ui-resizable-handle')){
										var config = {
											left: scope.curDrawingHotspot.left,
											top: scope.curDrawingHotspot.top,
											height: $event.offsetY - scope.curDrawingHotspot.top,
											width: $event.offsetX - scope.curDrawingHotspot.left,
										}

										if(config.width > 0 && (config.height > 50 || config.width > 50)){
											scope.createHotspot(config);
										}

										scope.curDrawingHotspot.el.remove();
										delete scope.curDrawingHotspot;
									}
								}

								scope.handleClick = function($event){
									scope.createHotspot($event);
								}

								scope.removeBlock = function($event, block, $index){
									$event.stopPropagation();
									scope.module.model.list.splice($index, 1);
									$rootScope.curModule = scope.module;
								}

								scope.stopEvent = function($event){
									$event.stopPropagation();
								}

								scope.editBlock = function($event, block, $index){
									$event.stopPropagation();
									$rootScope.curBlock = block;
									$rootScope.curModule = scope.module;
									$rootScope.curModuleIdx = scope.$index;
									if(block.position !== undefined){
										$rootScope.curEditType = 'suspendHotspot';
										$rootScope.newBlockPosition.key = $rootScope.curBlock.position;
									} else {
										$rootScope.curEditType = 'suspendHotspot';
									}
									$('.templetZtmb-contentUploadDraw').removeClass('active');
									$($event.target).addClass('active');
								}

								scope.stop = function($event, ui, block){
									block.left = ui.position.left + 'px';
									block.top = ui.position.top + 'px';
									$rootScope.curModule = scope.module;
								}

								// 创建品购商品热区
								scope.createHotspot = function(config){
									// console.log(scope.module);
									var idx, obj, list,
										blockConfig = {
											width: config.width + 'px',
											height: config.height + 'px'
										},
										list = scope.module.model.list = scope.module.model.list || [];

									idx = $rootScope.getHotspotIdx($.map(list, function(v){return v.position}));

									obj = angular.extend(blockConfig, {
										left: config.left + 'px',
										top: config.top + 'px',
										position: idx
									})

									scope.module.model.list.push(obj);
									scope.bindResize();
									$rootScope.curModule = scope.module;
								}

								$rootScope.getHotspotIdx = function(list){
									var idx, arr;

									arr = list.sort(function(a, b){return a - b;});

									// 特殊情况，列表为0或列表数字连续
									if(!arr.length) return 0;
									if(arr[arr.length - 1] == arr.length - 1) return arr.length;

									for(var i = 0; i < arr.length; i++){
										if(i != arr[i]) {
											idx = i;
											break;
										}
									}

									return idx
								}

								scope.initHotspot = function(){
									if ($rootScope.pageModel == 0) {
										console.log("简约模式下，悬浮球组件：不处理%换px");
									}else{
										$timeout(function(){
											scope.bindResize();

											$('.J_block', iElement).each(function(k, v){
												scope.module.model.list[k].width = $(v).width() + 'px';
												scope.module.model.list[k].height = $(v).height() + 'px';
												scope.module.model.list[k].left = v.offsetLeft + 'px',
												scope.module.model.list[k].top = v.offsetTop + 'px'
											});
										}, 0);
									}
								}

								scope.bindResize = function(){
									$timeout(function(){
										$('.J_block', iElement).resizable({
											resize: function(event, ui){
												event.stopPropagation();
												ui.element.scope().block.width = ui.element.width() + 'px';
												ui.element.scope().block.height = ui.element.height() + 'px';
												$rootScope.curModule = scope.module;
											}
										});
									})
								}

								scope.initHotspot();

								scope.init = function () {
									scope.module.model = scope.module.model || {
										list : [],
										suspend_pic_src : "",
										phone_pic_src : "",
										pad_pic_src : ""
									}
								}

								scope.init();

								break;

							//领劵组件
							case 'coupon' :
								var model = {
										"coupon_id":{
											"new":"",
											"old":""
										},
										"is_jump" : "false",
										"jump_url" : "",
										"jump_title" : "",
										"is_blank" : "true",
									    "is_diff_new_old": "false", //默认没有选择
										"text_success": "恭喜，红包已送到您的个人帐户中！",
										"text_fail": "红包已经被抢光，下次还有机会哒！",
										"text_already": "您已领过本红包了喔！",
										"text_unsupport": "对不起，您暂不符合领券要求。",
										"text_saleout": "晚来一步，券已经被抢光了。"
									},
									newModel;

								newModel = angular.extend({}, model, scope.module.model);
								// console.log(scope.module);
								scope.module.model = newModel;

								break;

							//导航条组件
							case 'nav':

								scope.editBlock = function($event, block, $index){
									$event.stopPropagation();
									$rootScope.curBlock = block;
									$rootScope.curModule = scope.module;
									$rootScope.curEditType = 'navHotspot';
									$rootScope.curModuleIdx = scope.$index;
									$('.templetZtmb-contentUploadDraw').removeClass('active');
									$($event.target).addClass('active');
								}

								scope.init = function(){
									var module = scope.module;
									if(!module.model) {
										module.model = {
											list : [],
											selected : 1
										}
									}
								}

								scope.init();

								break;

							//海淘组件
							case 'haitao':
								// scope.module.needCss = true;
								scope.editBlock = function($event, block, $index){
									$event.stopPropagation();
									$rootScope.curBlock = block;
									$rootScope.curModule = scope.module;
									$rootScope.curEditType = 'haitaoHotspot';
								}

								scope.editAll = function () {
									$rootScope.curBlock = '';
									$rootScope.curModule = scope.module;
									$rootScope.curEditType = 'haitaoEditAll';
									$rootScope.curModuleIdx = scope.$index;
								}

								// 初始化商品
								scope.init = function(){
									var module = scope.module, modelList, modelDefault;

									// 初始化model
									if(!module.model) module.model = {
										list:[],
										batch: {
											is_watermark: 'false',
											watermark : ""
										}
									};

									// 初始化extend
									if(!module.extend) module.extend =  {
										page : {
											isPaging : 'false',
						             		limit : 20,
						             		offset : 10
										}
									}

									modelList = module.model.list;
									modelDefault = {
										pic : '',
										flag : {
											id : '',
											name : '',
											pic : ''
										},
										areaOutput : '',
										haitao_desc : '',
										is_watermark : 'false',
										watermark : ""
									};

									// 初始化单个商品数据
									var arr = scope.module.data || [];
									$.each(arr, function(k, v){
										var model = modelList[k];
										// 没初始化过，或id没改变过，使用默认档期配置数据
										if(!model || (model && model.product_id != v.product_id)){
											model = $.extend({}, modelDefault);
											$.extend(model, {
												brand_id: v.brand_id,
												product_id: v.product_id,
												product_name: v.product_name,
												areaOutput: v.areaOutput
											})
										}
										// 改变module.data的结构，分解为原始数据及扩展数据
										arr[k] = {
											origin: v,
											extend: model
										}

									});

									// console.log(arr);
								}

								scope.init();
								break;

							//美妆组件
							case 'beauty':
								// scope.module.needCss = true;
								scope.editBlock = function($event, block, $index){
									$event.stopPropagation();
									$rootScope.curBlock = block;
									$rootScope.curModule = scope.module;
									$rootScope.curEditType = 'beautyHotspot';
									$rootScope.curModuleIdx = scope.$index;
								}

								scope.editAll = function () {
									$rootScope.curBlock = '';
									$rootScope.curModule = scope.module;
									$rootScope.curEditType = 'beautyEditAll';
									$rootScope.curModuleIdx = scope.$index;
								}

								// 初始化商品
								scope.init = function(){
									var module = scope.module, modelList, modelDefault;

									// 初始化model
									if(!module.model) module.model = {
										list:[],
										batch: {
											is_watermark: 'false',
											watermark : ""
										}
									};

									// 初始化extend
									if(!module.extend) module.extend =  {
										page : {
											isPaging : 'false',
						             		limit : 20,
						             		offset : 10
										}
									}

									modelList = module.model.list;
									modelDefault = {
										pic : '',
										beauty_desc : '',
										is_watermark : 'false',
										watermark : ""
									};

									// 初始化单个商品数据
									var arr = scope.module.data || [];
									$.each(arr, function(k, v){
										var model = modelList[k];
										// 没初始化过，或id没改变过，使用默认档期配置数据
										if(!model || (model && model.product_id != v.product_id)){
											model = $.extend({}, modelDefault);
											$.extend(model, {
												brand_id: v.brand_id,
												product_id: v.product_id,
												product_name: v.product_name
											})
										}
										// 改变module.data的结构，分解为原始数据及扩展数据
										arr[k] = {
											origin: v,
											extend: model
										}

									});

									// console.log(arr);
								}

								scope.init();
								break;

							//家居组件
							case 'collect':
								// scope.module.needCss = true;
								scope.editBlock = function($event, block, $index){
									$event.stopPropagation();
									$rootScope.curBlock = block;
									$rootScope.curModule = scope.module;
									$rootScope.curEditType = 'collectHotspot';
									$rootScope.curModuleIdx = scope.$index;
								}

								scope.editAll = function () {
									$rootScope.curBlock = '';
									$rootScope.curModule = scope.module;
									$rootScope.curEditType = 'collectEditAll';
									$rootScope.curModuleIdx = scope.$index;
								}

								// 初始化商品
								scope.init = function(){
									var module = scope.module, modelList, modelDefault;

									// 初始化model
									if(!module.model) module.model = {
										list:[],
										batch: {
											is_watermark: 'false',
											watermark : ""
										}
									};

									// 初始化extend
									if(!module.extend) module.extend =  {
										page : {
											isPaging : 'false',
						             		limit : 20,
						             		offset : 10
										}
									}

									modelList = module.model.list;
									modelDefault = {
										pic : '',
										subTitle : '',
										collect_price : '',
										is_watermark : 'false',
										watermark : ""
									};

									// 初始化单个商品数据
									var arr = scope.module.data || [];
									$.each(arr, function(k, v){
										var model = modelList[k];
										// 没初始化过，或id没改变过，使用默认档期配置数据
										if(!model || (model && model.product_id != v.product_id)){
											model = $.extend({}, modelDefault);
											$.extend(model, {
												brand_id: v.brand_id,
												product_id: v.product_id,
												product_name: v.product_name
											})
										}
										// 改变module.data的结构，分解为原始数据及扩展数据
										arr[k] = {
											origin: v,
											extend: model
										}

									});

									// console.log(arr);
								}

								scope.init();
								break;

							//子频道
							case 'channel':
								// 初始化商品
								scope.init = function(){
									var module = scope.module;

									// 初始化model
									if(!module.model) {
										module.model = {
										};

										module.extend = {
										};
									}
								}

								scope.init();
								break;

							//富文本
							case 'editor':
								scope.module.needCss = true;
								scope.init = function(){
									var module = scope.module;

									// 初始化model
									if(!module.model) {
										module.model = {
											text : ''
										};
									}

									// module.text = $sce.trustAsHtml(module.model.text);

									// scope.$watch('module.model.text', function(newValue, oldValue, scope) {
									// 	module.text = $sce.trustAsHtml(newValue);
									// });
								}

								scope.init();
								break;

							//视频组件
							case 'video':
								var module = scope.module;
								if(!module.model) module.model = {
									video_placehold_pic_src : ''
								}
								break;
						}
						// end switch
					}


				},

				templateUrl: '/common/directive/module.html'
			}
		});

	}

})

