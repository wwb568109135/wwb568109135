<template>
	<div>
		这是页面首页
		<div v-if="token != ''">
				登陆了，token为：
				{{token}}
				<br />
				<el-button type="primary" @click="logout">logout</el-button>
		</div>

		<div v-else>
				没有登陆<br />
				<router-link to="/login">
				点击登陆
				</router-link>
		</div>
	</div>
</template>
<script>
import auth from "../util/auth"
export default {
	data(){
		return {
			token:"",
		}
	},
	mounted(){
		this.token = sessionStorage.token ? sessionStorage.token :""
	},
	methods:{
		logout(){
			let _this = this;
			auth.logout(function(){
				alert("退出登陆,首页状态改变");
				// debugger
				_this.token = "";
				_this.$router.push("/login")
			})
		}
	}
}
</script>