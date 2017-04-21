import {Component} from "react";
import TopBar from "./../TopBar";

interface Props {
    title?:string,
	errorCode?:string,
	text?:string
}

export default class RequestFailHTMLPay extends Component<Props, {}> {
    constructor(props) {
        super(props)
    }
    render() {

		let title = this.props.title || "异常页面";
		let errorCode = this.props.errorCode || "抱歉，页面出错了~";
		let text = this.props.text || "点击头部返回首页";

        return (
            <div>
                <TopBar title={title} backUrl="/" />
                <div className="app-content fx-hd">
                    <div className="mod-blankslate page-error">
                        <div className="bg" />
                        <h3>{errorCode}</h3>
                        <p className="light center fsl">{text}</p>
                    </div>
                </div>
                {this.props.children}
            </div>
        )
    }
}
