'use strict';

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.factory('Page', ['$resource', 'getApi',

            function($resource, getApi) {

                return $resource('', {}, {

                    getSnapshotList: {
                        url: getApi('getSnapshotList'),
                        // isArray: true,
                        transformResponse: function(data){
                            var data = JSON.parse(data);
                            // console.log( data.data);

                            if(data.data.list.length != 0 ){
                                return data.data;
                            } else {
                                console.log('无组件数据！')
                            }
                        }
                    },
                    addSnapshot: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('addSnapshot'),
                        // isArray: true,
                        transformResponse: function(data){
                            // alert("add-DATA-Snapshot");
                            // console.log( data);
                            var data = JSON.parse(data);
                            return data;
                        }
                    },
                    delSnapshot: {
                        url: getApi('delSnapshot'),
                        // isArray: true,
                        transformResponse: function(data){
                            // alert("delSnapshot");
                            // console.log( data);
                            var data = JSON.parse(data);
                            return data;
                        }
                    },
                    getList: {
                        url: getApi('getPageList'),
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

                    get: {
                        url: getApi('getPage'),
                        // url: 'admin.php/Special/getPage',
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },

                    getSaleType: {
                        url : '/admin.php/childPage/getSaleType',
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },

                    getWarehouse: {
                        url: '/admin.php/childPage/getWarehouse',
                        isArray : true,
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },

                    getConsumerType: {
                        url: '/admin.php/childPage/getConsumerType',
                        isArray : true,
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },

                    addModule: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('addModule'),

                        transformResponse: function(data){
                            // console.log('data-addModule');
                            // console.log(data);

                            var data = JSON.parse(data);
                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },

                    create: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('createPage'),
                    },

                    createParent: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        url: getApi('createParentPage'),
                    },

                    copy: {
                        url: getApi('copyPage'),
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },

                    update: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            // console.log(data)
                            return $.param(data);
                        },
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            // console.log(data);
                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }

                        },
                        url: getApi('updatePage'),
                    },

                    getDapInfos: {
                        url: getApi('getDapInfos'),
                        // url: 'admin.php/Special/getPage',
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

                    getLabelBySearch: {
                        url: getApi('getLabelBySearch'),
                        // url: 'admin.php/Special/getPage',
                        isArray : true,
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },

                    saveDapOption : {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            return $.param(data);
                        },
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            // console.log(data);
                            if(data.result){
                                return data;
                            } else {
                                alert(data.msg)
                            }

                        },
                        url: getApi('saveDapOption'),
                    },

                    getPageDapInfo: {
                        url: getApi('getPageDapInfo'),
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },

                    getCdiRules: {
                        url: getApi('getCdiRules'),
                        // url: '/api/getUserGroup.json',
                        isArray : true,
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data.data;
                            } else {
                                alert('报错了！')
                            }
                        }
                    },
                    getTplListByFilt: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            // console.log(data)
                            return $.param(data);
                        },
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            // console.log(data);
                            if(data.result){
                                return data;
                            } else {
                                alert('报错了！')
                            }

                        },
                        url: getApi('getTplListByFilt'),
                    },

                    pullToPageSync: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            // console.log(data)
                            return $.param(data);
                        },
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            // console.log(data);
                            if(data.result){
                                return data;
                            } else {
                                alert('报错了！')
                            }

                        },
                        url: getApi('pullToPageSync'),
                    },


                    getResysdRoleList: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            // console.log(data)
                            return $.param(data);
                        },
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data;
                            } else {
                                alert('报错了！')
                            }

                        },
                        url: getApi('getResysdRoleList')
                    },
                    getResysdRole: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            // console.log(data)
                            return $.param(data);
                        },
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            // console.log(data);
                            if(data.result){
                                return data;
                            } else {
                                alert('报错了！')
                            }

                        },
                        url: getApi('getResysdRole')
                    },
                    addResysdRole: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            // console.log(data)
                            return $.param(data);
                        },
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            // console.log(data);
                            if(data.result){
                                return data;
                            } else {
                                alert('报错了！')
                            }

                        },
                        url: getApi('addResysdRole')
                    },
                    editResysdRole: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            // console.log(data)
                            return $.param(data);
                        },
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            // console.log(data);
                            if(data.result){
                                return data;
                            } else {
                                alert('报错了！')
                            }

                        },
                        url: getApi('editResysdRole')
                    },
                    delResysdRole: {
                        method: 'post',
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(data){
                            // console.log(data)
                            return $.param(data);
                        },
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            // console.log(data);
                            if(data.result){
                                return data;
                            } else {
                                alert('报错了！')
                            }

                        },
                        url: getApi('delResysdRole')
                    },

                    getSpecialVirtualInfo: {
                        url: getApi('getSpecialVirtualInfo'),
                        transformResponse: function(data){
                            var data = JSON.parse(data);

                            if(data.result){
                                return data;
                            } else {
                                //alert(data.msg)
                            }
                        }
                    },

                    getCdiTypeByVreId: {
                        url: getApi('getCdiTypeByVreId'),
                        isArray: true,
                        transformResponse: function(data){
                            var data = JSON.parse(data);
                            if(data.result){
                                return data.data;
                            } else {
                                console.log(data.msg)
                            }
                        }
                    }

                });
            }
        ]);

    }



})


