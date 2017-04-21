<template>
  <section class="login-view">

      <div class="form-group">
        <input type="text" name="username" class="form-control" placeholder="请输入手机/邮箱">
        <div class="input-bg"></div>
      </div>
      <div class="form-group">
        <input type="text" name="password" class="form-control" PLACEHOLDER="请输入密码">
        <div class="input-bg"></div>
      </div>
      <button type="button" @click="login" class="submit">登录111</button>
  
  </section>
</template>


<script>
import auth from "../../util/auth"
export default {
  methods:{
			login () {
			// auth.login("")
			let _this = this;
			console.log("去调用后端接口,然后拿数据之后，把sessionid写在本地上，根据对应的结果跳转去他页面,这里可以不用用vuex，关于登陆状态的话，取：sessionStorage.token ")
    	auth.login("joe@example.com","password1",function(data){
				alert("login-success,执行回调去首页")
				_this.$router.push("/")
			});
			
      return false;
    }
  }
}
</script>