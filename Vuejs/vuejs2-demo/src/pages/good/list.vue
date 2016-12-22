<template>
	<div>
		这是商品列表的页面首页 
		<br />
		<br />
		<router-link :to="goodurl">good{{$route.params.id}},点击查看详情->></router-link><br />		
		<br />
		<br />

		other－list：
		<br />
		<br />
		<router-link to="/good/list/4">good/list/4</router-link><br />		
		<br />
		<br />
		<good-list data="父级传过来的数据-props(单向数据数据流)">
			<h1>test demo html---GGG</h1>
		</good-list>

		<br />

		本页mock－－静态方式数据：
		<br />
		{{mock1.d1}}

		<h6 v-for="data in mock1.d2">
			{{data}}
		</h6>
	</div>
</template>

<script>

import mock1 from "assets/mock/gooddata"
import goodList from "components/good/goodList"
export default {
	data(){
		return {
			mock1:mock1,
			goodurl: "/good/detail/"+ this.$route.params.id
		}
	},
	components:{
		goodList
	}
}
</script>