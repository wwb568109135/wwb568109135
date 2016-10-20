import * as api from "../../api";
import TopBar from "../../components/TopBar";


export default class ShopInfo extends Common.Warp<any, any> {
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
        return api.shop.info.shop_info_detail({});
    }

    content() {
        let shopInfo = this.state;
        let mapText = ['不可安装','全部','普通'];

        return (
            <div>
                <TopBar title="基本信息"/>
                <div className="app-content fx-hd bg-white">
                    <div className="mod-coupon-list basic-info">
                        <ul>
                            <li>
                                <label>商家名称：</label><p>{shopInfo.name}</p>
                            </li>
                            <li>
                                <label>商家地址：</label><p>{shopInfo.addr}</p>
                            </li>
                            <li>
                                <label>商家联系人：</label><p>{shopInfo.man}</p>
                            </li>
                            <li>
                                <label>营业执照店名：</label><p>{shopInfo.companyName}</p>
                            </li>
                            <li>
                                <label>商家广告语：</label><p>{shopInfo.introduction}</p>
                            </li>
                            <li>
                                <label>服务时间：</label><p>{shopInfo.businessHours}</p>
                            </li>
                            <li>
                                <label>商家积分：</label><p>{shopInfo.currentJifen}</p>
                            </li>
                            <li>
                                <label>移动电话：</label><p>{shopInfo.mobile}</p>
                            </li>
                            <li>
                                <label>电话（固话）：</label><p>{shopInfo.tel}</p>
                            </li>
                            <li>
                                <label>轮胎安装能力：</label><p>{mapText[shopInfo.erectility]}</p>
                            </li>
                            <li>
                                <label>促销数量：</label><p>{shopInfo.promotionMax}</p>
                            </li>
                            <li>
                                <label>支付宝账号：</label><p>{shopInfo.alipay}</p>
                            </li>
                            <li>
                                <label>星级：</label>
                                <span className={'mod-grade grade-'+shopInfo.grade}>
                                    <i className="iconfont icon-start"/><i className="iconfont icon-start"/><i
                                    className="iconfont icon-start"/><i className="iconfont icon-start"/><i
                                    className="iconfont icon-start"/>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
