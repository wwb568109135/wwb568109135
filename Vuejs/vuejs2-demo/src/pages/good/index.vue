<template>
  <div>
    <p class="welcome">
      欢迎使用来到商品首页
    </p>
    <div @click="go">
      <===点 击返回首页 </div>
        热卖商品列表：
        <ul>
          <li>
            <router-link to="/good/list/1">good1</router-link><br />
          </li>
          <li>
            <router-link to="/good/list/2">good2</router-link><br />
          </li>
          <li>
            <router-link to="/good/list/3">good3</router-link><br />
          </li>
          <li>
            <router-link to="/good/list/4">good4</router-link><br />
          </li>
        </ul>
    </div>
</template>

<script>
  // import {mapState} from 'vuex';
  export default {
    methods: {
      go:function(){
        // debugger
        // alert("go")
        this.$router.push({
          path: '/'
        })
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>