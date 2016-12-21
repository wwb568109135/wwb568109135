<template>
  <div id="App">
    
    <v-header></v-header>

    路由部分：<br />
    <router-link to="/">/</router-link><br />

    <router-link to="/hello">/hello</router-link><br />
  
    <router-link to="/wwb">/wwb</router-link><br />
    
    <router-link to="/good">good</router-link><br />
    <router-link to="/good/list">good-list</router-link><br />
    <router-link to="/good/detail">good-detail</router-link><br />
    <hr />
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
  }
}
</script>

<style>
  .box{
    min-height: 400px;
    width: 100%;
    background: blueviolet
  }
</style>
