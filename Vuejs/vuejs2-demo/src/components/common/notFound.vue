<template>
  <div>
  这是404组件页面
    <p>{{ title }}</p>
  </div>
</template>

<script>
  // import {mapState} from 'vuex'
  
  export default {
    data () {
      return {
        title: '404 Not Found!',
      }
    },
    // computed: mapState([
    //   'message'
    // ]),
    // mounted: function () {
    //   this.$store.commit('MESSAGE', '404 Not Found！');
    // },
    // components: {cTitle}
  }
</script>