import {Component} from "react";
import TopBar from "../../components/TopBar";


export default class Shop extends Component<any, any> {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <TopBar title="店铺管理" backUrl="/accounts"/>
                <div className="app-content fx-hd bg-white">
                    <div className="mod-link-list">
                        <ul>
                            <li><Link to="/accounts/info">基本信息</Link></li>
                            <li><Link to="/accounts/service">商品列表</Link></li>
                            <li><Link to="/accounts/employees">员工管理</Link></li>
                            <li><Link to="/accounts/address">收货地址</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
