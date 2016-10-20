import * as api from "../../api";
import Toast from "./../common/Toast";

interface Props {
    data: Array<serverApi.shop.coupon.coupon_item>
    /** 物流单号 */
    isShow: boolean
    onGetCouponFn: (item:Array<serverApi.shop.coupon.coupon_item>, key: any) => void
    clickShowPopCouponFN: () => void
}

export default class ProductCoupon extends Common.Warp<Props, any> {
    constructor(props) {
        super(props);
    }

    getCoupon(item, key) {
        log("ProductCoupon - getCoupon")
        log(item);
        let req = {
            "couponDefineId": item.couponDefineId,
            "couponItemId": item.couponItemId
        }
        api.shop.coupon.pick_up(req).then(rv => {
            if (!rv.errorId) {
                this.props.onGetCouponFn(item, key);
                Toast("领取成功", 2000)
            } else {
                Toast(<span>{rv.errorDesc}</span>, 2000)
            }
        })
    }

    clickShowPopCouponFN() {
        log("ProductCoupon - clickShowPopCouponFN")
        this.props.clickShowPopCouponFN();
    }

    content() {
        log(this)
        return (
            <div>
                <div className="mod-pop-box pop-bottom" style={{ display: this.props.isShow ? "block" : "none" }}>
                    <div className="pop-inner fadeInUp">
                        <div className="pop-hd">
                            <a href="javascript:void(0)" onClick={this.clickShowPopCouponFN.bind(this) } className="iconfont icon-close fl" />
                            <h3>领券</h3>
                        </div>
                            <div className="pop-bd">
                                <div className="mod-coupon coupon-center">
                                    <ul>
                                        {this.props.data.map((item, key) => {
                                            {/*
                                             优惠券领取状态 PICKED: 已领取 | UNPICKED: 未领取 | LACK: 已派发完毕(抢完)
                                        */}
                                            let _className = "";
                                            if (item.couponState == "LACK") {
                                                _className = "off"
                                            } else if (item.couponState == "PICKED") {
                                                _className = "get"
                                            } else if (item.couponState == "UNPICKED") {
                                                _className = ""
                                            }
                                            return (
                                                <li key={key} className={_className}>
                                                    <div className="coupon-box">
                                                        <div className="price">
                                                            <p>¥<strong>{item.couponAmount/100}</strong></p>
                                                            <p>{item.ruleMap.couponRuleShortDesc}</p>
                                                        </div>
                                                        <div className="info">
                                                            {(() => {
                                                                let data = item.ruleMap.couponRuleDescList.length != 0 ? item.ruleMap.couponRuleDescList : [];
                                                                return data.map((data1, key) => {
                                                                    return (
                                                                        <p key={data1}>
                                                                            {data1}
                                                                        </p>
                                                                    )
                                                                })
                                                            })() }
                                                        </div>
                                                        <div className="tag">
                                                            {/*
                                                             优惠券领取状态 PICKED: 已领取 | UNPICKED: 未领取 | LACK: 已派发完毕(抢完)
                                                        */}
                                                            {(() => {
                                                                if (item.couponState == "LACK") {
                                                                    return (
                                                                        <div>
                                                                            <i className="iconfont icon-cry" /><br />
                                                                            <em>已派抢完</em>
                                                                        </div>
                                                                    )
                                                                } else if (item.couponState == "PICKED") {
                                                                    return (
                                                                        <div>
                                                                            <i className="iconfont icon-check2" /><br />
                                                                            <em>已经领取</em>
                                                                        </div>
                                                                    )
                                                                } else if (item.couponState == "UNPICKED") {
                                                                    return (
                                                                        <a href="javascript:void(0)" onClick={this.getCoupon.bind(this, item, key) }>立即领取</a>
                                                                    )
                                                                }
                                                            })() }
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        }) }
                                    </ul>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        )
    }


}
