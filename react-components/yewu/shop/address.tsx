import * as api from "../../api";
import TopBar from "../../components/TopBar";


export default class Address extends Common.Warp<any, any> {
    constructor(props) {
        super(props)
    }

    needLogin = true

    static mapStateToProps(state, ownProps) {
        return {
            login: state.loginState.login
        }
    }

    loadData() {
        return api.shop.manage.list_recv_address({})
    }

    render() {
        let addressData = this.state.addressInfos || [];

        let AddBtnTemp = <div className="mtl phm">
            <Link to="/accounts/agreement" className="mod-btn primary block">添加收货地址</Link>
        </div>

        if(addressData.length === 2) AddBtnTemp = <div className="mod-end"><p>修改或删除收货地址</p><p>请致电 <a className="light" href="tel://4001191159">400-119-1159</a></p></div>

        return (
            <div>
                <TopBar title="收货地址" backUrl="/accounts/shop" />
                <div className="app-content fx-hd">
                    <div className="mod-art-list">
                        <ul>
                            {
                                addressData.map((item,index) => {
                                    return (
                                        <li key={index}>
                                            <h4><span>{item.receiverName} </span>{item.contactPhone}</h4>
                                            <p className="light">{item.address}</p>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    {AddBtnTemp}
                </div>
            </div>
        )
    }
}
