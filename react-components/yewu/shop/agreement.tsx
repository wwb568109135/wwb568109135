import {Component} from "react";
import TopBar from "../../components/TopBar";


export default class Agreement extends Component<any, any> {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <TopBar title="新增地址协议"/>
                <div className="app-content fx-hd bg-white">
                    <div className="mod-box-list">
                        <ul className="mod-art-list">
                            <li>
                                <h4>请保证所提供的联系信息为真实有效的！</h4>
                                <p className="light fsm">
                                    如在往后履行订单的过程中，车云网络按您确认核实过的联系信息发货但该信息不存在或错误，导致货品无法成功送达的，车云网络有权向您索赔包含运费、实际损失在内的赔偿，并保留向您追究法律责任的权利。</p>
                            </li>
                        </ul>
                    </div>
                    <div className="mtl phm">
                        <Link to="/accounts/add_address" className="mod-btn primary block">同意</Link>
                    </div>
                </div>
            </div>
        )
    }
}
