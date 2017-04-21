<template>
	<div>
		这是商品详情首页--{{$route.params.id}}

		<br />
		mockdata.name:{{mockdata.name}}
		<br />
		<br />
		<br />
		循环mock数据：
		<div v-for="(item,index) in mockdata.data">
			index-{{index+1}}:{{item}}
		</div>
		<br />
		<br />
		<div @click="go">
			点击返回 ==>
		</div>
		<br />
		这是商品的图片
		<img src="../../assets/img/logo.png" />

	</div>
</template>

<script>


export default {
	data(){
		return {
			goodurl: "/good/detail/"+ this.$route.params.id,
			mockdata:{}
		}
	},
	methods:{
		getdata:function(){
			let _this = this;
			this.$http.get('/api/gooddata').then(function(response){
				// 响应成功回调
				console.log("响应成功回调")
				console.log(response)
				// debugger
				_this.mockdata = response.body
			}, function(response){
					// 响应错误回调
				console.log("响应成功回调")
				console.log(response)
			});
		},
		go:function(){
			// debugger
			// alert("go")
			this.$router.go(-1);
		},
	},
	mounted(){
		this.getdata()
	}
}
</script>
