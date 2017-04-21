import {Component} from "react";
import * as api from "./../../api";
import {Alert} from "../common/Modal";
interface data {
    type?: number,
    name?: string,
    text?: string
}
interface Props {
    data?: [data],
    isShow?: boolean,
    curIndex?: number,
    onSetCouponDataFn?: (index: number, data, isShowcoupon: boolean) => void,
    onCloseCouponpBoxFn?: () => void,
    index?: number,
}
export default class PopChooseCouponOrder extends Component<Props, any> {
    constructor(props) {
        super(props);
        this.state = {
            curIndex: this.props.index == -1 ? -1 : this.props.index
        }
    }

    clickLiPay(index, data) {
        log(index);
        log(data);
        log("PopChooseCouponOrder-clickLiPay-吧状态存在远端的服务器上，２０００毫秒后模拟存储成功了，然后改变页面的状态")

        this.setState({
            curIndex: index
        })
        let val;
        let isShowcoupon;

        if ($("#PopChooseCouponLi" + index).attr("class") == "get") {
            val = null;
            isShowcoupon = false
        } else {
            val = data;
            isShowcoupon = true
        }

        let key = "coupon";
        api.common.setFillOrderSession({
            /* 多级键值用"."分隔，如invoice.invoiceType */
            key: key,
            val: val
        }).then((rv) => {
            if (val == null) {

            }
            if (rv.success) {
                this.props.onSetCouponDataFn(index, data, isShowcoupon);
                this.props.onCloseCouponpBoxFn();
            } else {
                Alert("选择支付方式，服务异常，请稍后再试！")
            }
        })

    }

    closePayBox() {
        log("PopChooseCouponOrder-closePayBox");
        this.props.onCloseCouponpBoxFn();
    }

    render() {

        return (
            <div className={this.props.isShow ? "mod-pop-box pop-bottom" : "mod-pop-box pop-bottom hide"}>
                <div className="pop-inner select-coupon-inner fadeInUp">
                    <div className="pop-hd">
                        <a href="javascript:void(0)" className="iconfont icon-close fl" onClick={this.closePayBox.bind(this) } />
                        <h3>选择优惠券</h3>
                    </div>

                    <div className="pop-bd">
                        <div className="mod-coupon coupon-center">
                            <ul>
                                {
                                    this.props.data.map((item2, key) => {
                                        let item: any = item2;

                                        let li_className = "";

                                        if (this.props.index == key) {
                                            li_className = "get";
                                        } else {
                                            li_className = "";
                                        }

                                        return (
                                            <li className={li_className} id={"PopChooseCouponLi" + key} key={item.couponItemId}
                                            onClick={this.clickLiPay.bind(this, key, item) }>
                                                <div className="coupon-box">
                                                    <div className="price">
                                                        <p>¥<strong>{item.couponAmount / 100 }</strong></p>
                                                        <p>{item.ruleMap.couponRuleShortDesc }</p>
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
                                                    {(() => {
                                                        if(this.props.index == key){
                                                            return (
                                                                <div className="tag">
                                                                    <i className="iconfont icon-check2"></i><br />
                                                                    <em>已选择</em>
                                                                </div>
                                                            )
                                                        }else{
                                                            return (
                                                                <div className="tag">
                                                                    <a href="javascript:void(0)">点击使用</a>
                                                                </div>
                                                            )
                                                        }
                                                    })() }

                                                </div>
                                            </li>

                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>

            </div>

        )
    }
}
