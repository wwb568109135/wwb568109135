'use strict';

define(function(require, exports, module) {

	module.exports = function(app) {
        require('common/service/special')(app);

		app.register.controller('PageIdUploadCtrl', ['$scope', '$http', '$rootScope', '$location', '$routeParams', '$rootElement', 'FileUploader', '$timeout','Special',

			function($scope, $http, $rootScope, $location, $routeParams, $rootElement, FileUploader,$timeout, Special){
                $scope.special_id = $routeParams.special_id;
                $scope.uploadType = $routeParams.type;

    			/**
    			 * upload 相关逻辑
    			 */
                // 确定按钮
                var uploader = $scope.uploader = new FileUploader({
                    url: 'admin.php/importData/doUpload?special_id=' + $routeParams.id + '&isPurchase=' + $scope.uploadType  + '&is_business=0',
                    alias : 'excel_file'
                });

                uploader.onSuccessItem = function(fileItem, response, status, headers) {
                    if(response.result){
                        alert(response.msg);
                        // location.href = '#/special/'+ $routeParams.id +'/publish?' + $.param($routeParams);
                        location.href = '#/page/edit/'+ $routeParams.page_id +'?page_type_id='+ $routeParams.page_type_id +'&special_id='+ $routeParams.special_id +'&parent_id=' + $routeParams.parent_id;
                        // http://mst-admin.vip.vip.com/#/page/edit/869?page_type_id=1&special_id=122&parent_id=130
                    }else{
                        alert(response.msg);
                    }
                };

                uploader.onCompleteAll = function() {
                    // 清空队列
                    uploader.clearQueue();
                    $scope.fileName = '';
                    $('#Jfile').val('');
                }

                uploader.onAfterAddingFile = function (item) {
                    if(uploader.queue.length > 1){
                        uploader.removeFromQueue(0);
                    }

                    $scope.fileName = item.file.name;
                }

                init();

                $scope.downEcexl = function () {
                    Special.updaterDownload({
                            id : $scope.updaterDownload_id,
                            is_purchase: $scope.uploadType 
                        },function (data) {
                            console.log(data);
                            window.open($scope.excel_path);
                    });
                }

                $scope.selectFile = function ($event,type,index) {
                    var inputFile = $('#Jfile');

                    $timeout(function () {
                        inputFile.click();
                    }, 0);
                }

                $scope.postData = function () {
                    if ( (typeof $scope.isUplaodShow != "undefined" && $scope.isUplaodShow) && (typeof $scope.ischeckShow != "undefined" && $scope.ischeckShow) ) {
                        console.log("勾选了商务文件,执行商务上传直接上传逻辑：is_business = 1");
                        Special.godoUpload({
                                special_id : $scope.special_id,
                                isPurchase: $scope.uploadType,   //1 品购  //0非品购
                                is_business: 1
                            },function (data) {
                                console.log(data);
                                if(data.code == 1 ){
                                    alert("上传商务execl表格成功！");
                                    window.location.href = '#/page/edit/'+ $routeParams.page_id +'?page_type_id='+ $routeParams.page_type_id +'&special_id='+ $routeParams.special_id +'&parent_id=' + $routeParams.parent_id;
                                }else{
                                    alert(data.msg);
                                }
                        });
                    }else{
                        console.log("执行正常的文件上传逻辑：is_business = 0");
                        if(!$scope.fileName || $scope.fileName == ''){
                            alert('请选择导入的excel！');
                            return;
                        }else{
                            uploader.uploadAll();
                        }

                    }
                }

                function init(){
                    console.log($scope);
                    //是否显示灰色按钮
                    Special.getBusinessExcel({
                            special_id : $scope.special_id,
                            is_purchase: $scope.uploadType   //1 品购  //0非品购
                        },function (data) {
                            console.log(data);
                            if (data.code == 0) {
                                $scope.isUplaodShow = false;
                            }else{
                                $scope.isUplaodShow = true;
                                $scope.ischeckShow = true;
                                $scope.excel_path = data.data.excel_path;
                                $scope.updaterDownload_id = data.data.id;
                            }
                    });

                }

        }])
    }



})

