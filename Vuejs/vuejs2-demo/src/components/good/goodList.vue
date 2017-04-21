<template>
	<div>
		<h1>test demo html---FFFF</h1>
		这是商品列表组件首页
		<br />
		data:{{data}}

		<br />
		title:{{title}}
	</div>
</template>

<script>
	export default {
		data(){
			return {
				title: this.data ? this.data :""
			}
		},
		props:["data"]
	}
</script>