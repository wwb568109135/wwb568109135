
/**
 * Created by an.han on 16/10/15.
 * 基于 express 的接口处理定义
 * See http://expressjs.com/zh-cn/4x/api.html
 */

module.exports = {
  api: '/api/gooddata',
	response: function (req, res) {
		let data = {
			name:"gooddata",
			data: ["1","3333","222","56ddgf"]
		}
    res.send(data);
  }
}