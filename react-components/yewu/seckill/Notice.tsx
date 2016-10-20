import {Component} from "react";
import {Alert} from "./../../components/common/Modal";

export default class Notice extends Component<serverApi.promotion.list_notices.Response, any> {
    constructor(props) {
        super(props);
    }

    showMsgBox(item:any) {
        Alert({
            title: item.title,
            content: item.content,
            btnText: "知道了",
            onOk:()=>{}
        });
    }

    render() {
        let noticeList = this.props.noticeList;
        if(noticeList.length > 0) {
            return <a className="link-tips" href="javascript:;" onClick={this.showMsgBox.bind(this, noticeList[0])}><i className="iconfont icon-inform"></i>{noticeList[0].title}</a>
        } else {
            return null;
        }
    }
}
