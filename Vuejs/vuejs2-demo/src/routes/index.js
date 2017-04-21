
// import index from "pages/index"
const index = r => require(['pages/index'], r);


// const goodIndex = r => require.ensure([], () => r(require('pages/good/index')), '/good')
// const goodList = r => require.ensure([], () => r(require('pages/good/list')), '/list')
// const goodDetail = r => require(['pages/good/detail'], r);



const goodIndex = r => require(['pages/good/index'], r);
const goodList = r => require(['pages/good/list'], r);
const goodDetail = r => require(['pages/good/detail'], r);

const login = r => require(['components/common/login'], r);
const wwb = r => require(['pages/wwb'], r);
const notFound = r => require(['components/common/notfound'], r);


const hello = r => require(['components/hello'], r);
// const Wwb = r => require(['pages/wwb'], r);
// const ceshi = r => require(['components/ceshi'], r);
// const user = r => require(['pages/user/index'], r);
// const userdDefault = r => require(['pages/user/default'], r);
// const userHaha = r => require(['pages/user/haha'], r);
// const userXixi = r => require(['pages/user/xixi'], r);

// const jquery1 = r => require(['pages/jquery1'], r);
// const swiper = r => require(['pages/swiper'], r);



// 根目录
const rootPath = '';

import auth from '../util/auth'

function requireAuth( to,form ,next){
  console.log("requireAuth－入口-坚持登录的状态业务")

  if ( !auth.loggedIn() ) {
    // if ( 1 ){
    console.log("没有登录，去登录")
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    console.log("登录了")
    next()
  }  
}

// 页面路由
const routes = [
  {
    path: '/', 
    component:index,
    beforeEnter:requireAuth
    // redirect: {
    //   name: 'hello'
    // }
  },
  {
    path: '/wwb', 
    component: wwb
  },
  // {
  //   path: '/jquery1', 
  //   component: jquery1
  // }, 
  {
    path: '/login', 
    component: login
  },
  // {
  //   path: '/ceshi', 
  //   component: ceshi
  // },
  {
    path: '/hello', 
    component: hello, 
    name: 'hello'
  },
  // {
  //   path: '/swiper', 
  //   component: swiper
  // },
  {
    path: '/good', component: goodIndex, 
  },
  {
    path: '/good/list/:id', component: goodList, 
  },
  {
    path: '/good/detail/:id', component: goodDetail, 
  },
  // {
  //   path: '/good', component: goodIndex, 
  //     children: [
  //       // UserHome will be rendered inside User's <router-view>
  //       // when /user/:id is matched
  //       // { path: '', component: notFound },
				
  //       // UserProfile will be rendered inside User's <router-view>
  //       // when /user/:id/profile is matched
  //       { path: 'list', component: goodList },

  //       // UserPosts will be rendered inside User's <router-view>
  //       // when /user/:id/posts is matched
  //       { path: 'detail', component: goodDetail }
  //     ]
  // },
].map(route => {
  route.path = rootPath + route.path;
  return route;
});


// 404 页
routes.push({path: '*', component: notFound, name: 'notFound'});

export default routes;
