<template>
  <div>
    <p class="welcome">
      欢迎使用来到商品首页
    </p>
    
    <div @click="go">
      < === 点击返回首页
    </div>
    <router-view></router-view>
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
          path: '/hello'
        })

      },
    },
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped>

</style>
