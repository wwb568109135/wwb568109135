import {Component} from "react";
import TopBar from "./../TopBar";

interface Props {
    current?:string
    seeOrderFn?:()=>void
}
export default class SuccessOrderPay extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        current: ""
    }
    render() {
        return (
            <div>
                <TopBar isHideBackIcon={"1"} title="下单" backUrl="/"/>
                <div className="app-content fx-hd">
                    <div className="mod-blankslate order-status">
                        <div className="bg"/>
                        <h3>下单成功</h3>
                        <p className="light center fsl">供应商3天内发货，请耐心等待</p>
                        <ul className="status-list">
                            <li className="on"><label>下单</label><span /></li>
                            <li className={this.props.current == "DengDaiShouHuo" ? "on":""}><label>等待收货</label><span />
                            </li>
                            <li><label>完成</label><span /></li>
                        </ul>
                        <Link to="/product/list?type=tyre" className="mod-btn primary block">继续采购</Link>
                        <a onClick={this.props.seeOrderFn} className="mod-btn default block">查看订单</a>
                        <div className="light center mtl">发票或其他问题请致电<a className="light" href="tel://4001191159">400-119-1159</a></div>
                    </div>
                </div>
                

                {this.props.children}
            </div>
        )
    }
}
