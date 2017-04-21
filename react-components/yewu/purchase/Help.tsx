import {Component} from "react";

interface Props {
    // array,允许行为列表
    allowActionList?:any,
    // 支付渠道
    payChannel?:string
}

export default class Help extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        allowActionList: [],
        payChannel: ""
    }

    render() {
        let allowActionList = this.props.allowActionList;
        let payChannel = this.props.payChannel;

        return (
            <div className="center mvm">
                <p className="light">有疑问请致电咨询</p>
                <p className="light"><a className="light" href="tel://4001191159">400-119-1159</a></p>
                {
                    allowActionList.indexOf("BEFORE_PAY") != -1 && payChannel != "REMITTANCE" ?
                        <p className="tdu pts"><Link to="/pay/callbackFail">支付遇到问题？</Link></p> : ""
                }
            </div>
        )
    }
}
