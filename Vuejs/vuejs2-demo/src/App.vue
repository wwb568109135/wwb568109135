<template>
  <div id="App">
    <v-header></v-header>
    路由部分：<br />
    <router-link to="/">/</router-link><br />
    <router-link to="/hello">/hello</router-link><br />
    <router-link to="/wwb">/wwb</router-link><br />

    <router-link to="/good">good-index</router-link><br />
    <router-link to="/good/list/3">good-list-3</router-link><br />
    <div @click="goDetail">good-detail-4</div><br />
    <hr />
    vue-resource:<br />
    http://www.cnblogs.com/axl234/p/5899137.html
    <div class="box">
      <router-view></router-view>
    </div>
  
    <v-footer></v-footer>
  </div>
</template>

<script>
import vHeader from './components/common/header'
import vFooter from './components/common/footer'
export default {
  name: 'App',
  components: {
    vHeader,
    vFooter
  },
  methods:{
    goDetail(){
      console.log("这里执行点击钩子，可以用js来控制逻辑")
      this.$router.push("/good/detail/4")
    }
  }
}
</script>

<style>
  .box {
    min-height: 400px;
    width: 100%;
    background: blueviolet
  }
</style>