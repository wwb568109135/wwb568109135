'use strict';

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.factory('Special', ['$resource', 'getApi',

            function($resource, getApi) {

                return $resource('special.json', {}, {

                    get: {
                        url: getApi('getSpecial'),
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },

                    getProperty: {
                        url: getApi('getSpecialProperty'),
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },

                    getTypeList: {
                        url: getApi('getTypeList'),
                        isArray: true,
                        // params: {id:'@id'},
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },

                    getCateList: {
                        url: getApi('getCateList'),
                        // isArray: true,
                        // params: {id:'@id'},
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },

                    createType: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('createType'),
                    },

                    delCate : {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('delCate'),
                    },

                    create: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('createSpecial'),
                    },

                    update: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('updateSpecial'),
                    },

                    getClientList: {
                        url: getApi('getClientList'),
                        isArray: true,
                        // params: {id:'@id'},
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },
                    getPublishList : {
                        method: 'get',
                        url : getApi('getPublishList'),
                        // url : '/admin.php/SpecialRelease/index/?id=:id',
                        transformResponse: function(data){
                            data = JSON.parse(data);
                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！');
                            }
                        }
                    },
                    getPublishEdit : {
                        method: 'get',
                        url : getApi('getPublishEdit'),
                        // url : '/admin.php/Special/getEditSpecialData/?id=:id',
                        transformResponse: function(data){
                            data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！');
                            }
                        }
                    },
                    getVreTypeStatusList : {
                        method: 'get',
                        url : getApi('getVreTypeStatusList'),
                        isArray: true,
                        transformResponse: function(data){
                            data = JSON.parse(data);
                            if(data.result && data.data.length != 0){
                                return data.data;
                            } else if(data.data.length == 0) {
                                console.log('返回VRE人群可见的数据为空');
                            }else{
                                alert('报错了！');
                            }
                        }
                    },
                    setVreStatus : {
                        // method: 'get',
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        url : getApi('setVreStatus'),
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        transformResponse: function(data){
                            data = JSON.parse(data);
                            if(data.result){
                                return data;
                            } else {
                                alert('报错了！');
                            }
                        }
                    },

                    getPublishMultiEdit : {
                        method: 'get',
                        url : getApi('getPublishMultiEdit'),
                        // url : 'api/special_publish_list.json',
                        transformResponse: function(data){
                            data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！');
                            }
                        }
                    },

                    getConsumerTypeList : {
                        method: 'get',
                        url : getApi('getConsumerTypeList'),
                        // url : '/admin.php/ConsumerType/getConsumerTypeList',
                        isArray: true,
                        transformResponse: function(data){
                            data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！');
                            }
                        }
                    },

                    getChannelList : {
                        method: 'get',
                        url : getApi('getChannelList'),
                        // url : '/admin.php/Channel/getChannelList',
                        isArray: true,
                        transformResponse: function(data){
                            data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！');
                            }
                        }
                    },

                    getListByClientId : {
                        method: 'get',
                        url : getApi('getListByClientId'),
                        // url : '/admin.php/clientVersion/getListByClientId/?client_id=:client_id',
                        transformResponse: function(data){
                            data = JSON.parse(data);
                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！');
                            }
                        }
                    },
                    getPlatform : {
                        method: 'get',
                        isArray : true,
                        url : getApi('getPlatform'),
                        // url : '/admin.php/clientVersion/getListByClientId/?client_id=:client_id',
                        transformResponse: function(data){
                            data = JSON.parse(data);
                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！');
                            }
                        }
                    },
                    delete: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('deleteSubPage'),
                    },
                    add : {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('addSubPage'),
                    },
                    edit : {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('editSubPage'),
                    },
                    publish : {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('publish'),
                    },

                    getShareListByKW : {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('getShareListByKW'),
                    },
                    pullAutoSyncSwitch : {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('pullAutoSyncSwitch')
                    },

                    getFlags: {
                        url: getApi('getFlags'),
                        isArray: true,
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },
                    getBusinessExcel : {
                        method: 'get',
                        url : getApi('getBusinessExcel'),
                        transformResponse: function(data){
                            data = JSON.parse(data);
                            if(data.result){
                                return data;
                            } else {
                                alert('报错了！');
                            }
                        }
                    },
                    godoUpload : {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('godoUpload')
                    },
                    updaterDownload : {
                        method: 'get',
                        url : getApi('updaterDownload'),
                        transformResponse: function(data){
                            data = JSON.parse(data);
                            if(data.result){
                                return data;
                            } else {
                                alert('报错了！');
                            }
                        }
                    },

                    excelUpdate: {
                        url: getApi('excelUpdate'),
                        transformResponse: function(data){
                            var data = JSON.parse(data);
                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },
                    updateDisplay : {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('updateDisplay')
                    },

                    getVirtual: {
                        url: getApi('getVirtualSpecial'),
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                //alert(data.msg)
                            }
                        }
                    },

                    getSpecialAttributeList: {
                        url: getApi('getSpecialAttributeList'),
                        isArray: true,
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                //alert('报错了！')
                            }
                        }
                    },

                });
            }
        ]);

    }



})


