// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import routes from './routes/index';
// import storeOption from './store';
import App from './app';

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

// Vue.use(ElementUI);
// Vue.use(Vuex);
Vue.use(VueRouter);

// 创建一个路由对象用于管理页面的路由
const router = new VueRouter({
  mode: 'history',
  routes: routes
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
