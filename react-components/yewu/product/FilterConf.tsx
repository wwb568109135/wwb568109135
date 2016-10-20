
/*
* 配置说明:
* 注意同一大类中不要用相同的key值，否则state键值可能会冲突
* swipes 配置项最多配置3个subs
* 配置项不允许空值
*/
export let config = {
	"tyre":{// 轮胎
		"selects":[
			{
				"key":"brandId",
				"text":"品牌",
				"influence":"pattern"
			},
			{
				"key": "pattern",
	            "text": "花纹"
			},
			{
	            "key": "antiExplosion",
	            "text": "防爆"
	        }
		],
		"swipes":[
			{
				"type":"swipe",
				"key":"sizeSelect",
				"text":"规格",
				"subs":[
					{
						"key": "width",
			            "text": "胎面宽",
						"influence":"aspectRatio"
					},
					{
						"key": "aspectRatio",
			            "text": "扁平比"
					},
					{
						"key": "size",
			            "text": "直径"
					}
				]
			}
		]
	},
	"battery":{// 蓄电池
		"selects":[
			{
                "key": "brandId",
                "text": "品牌"
            },
            {
                "key": "size",
                "text": "尺寸"
            },
            {
                "key": "capacity",
                "text": "容量"
            }
		]
	},
	"motor_oil":{//机油
		"selects":[
			{
                "key": "brandId",
                "text": "品牌",
				"influence":"category"
            },
            {
                "key": "category",
                "text": "系列"
            },
            {
                "key": "state",
                "text": "状态"
            }
		],
		"swipes":[
			{
				"type":"swipe",
				"key":"moreSelect",
				"text":"更多筛选",
				"subs":[
					{
						"key": "capacity",
						"text": "容量"
					},
					{
						"key": "grade",
						"text": "等级"
					},
					{
						"key": "viscosity",
						"text": "粘度"
					}
				]
			}
		]
	}
}

export class FilterConfig {

}
