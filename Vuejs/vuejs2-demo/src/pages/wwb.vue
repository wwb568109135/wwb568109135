<template>
	<div style="margin:10px">
		这是wwb个人的的页面首页
		<br />
		<br />
		<br />
		<el-table :data="tableData" :stripe="true">
			<el-table-column prop="date" label="日期" width="180">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="180">
			</el-table-column>
			<el-table-column prop="address" label="地址">
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
export default {
	data(){
		return {
			goodurl: "/good/detail/"+ this.$route.params.id,
			tableData: [
				{
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, 
				{
					date: '2016-05-04',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1517 弄'
				},
				{
					date: '2016-05-03',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1516 弄'
				}
			]
        }
	},
	methods:{
		go:function(){
			// debugger
			// alert("go")
			this.$router.go(-1);
		},
	}
}
</script>
