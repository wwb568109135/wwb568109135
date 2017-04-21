import {Component} from "react";
import * as api from "./../../api";
import {Alert} from "../common/Modal";
let initData = [
    {
        type: 1,
        name: "wxPay", //wxPay ylPay huikuanPay daofuPay
        text: "微信支付"
    },
    {
        type: 2,
        name: "aliPay", //wxPay ylPay huikuanPay daofuPay
        text: "支付宝支付"
    },
    {
        type: 3,
        name: "ylPay", //wxPay ylPay huikuanPay daofuPay
        text: "银联支付"
    },
    {
        type: 4,
        name: "huikuanPay", //wxPay ylPay huikuanPay daofuPay
        text: "货到付款"
    },
    {
        type: 5,
        name: "daofuPay", //wxPay ylPay huikuanPay daofuPay
        text: "公对公汇款"
    }
];

interface data {
    type: number,
    name: string,
    text: string
}
interface Props {
    data: data,
    isShow?: boolean,
    curIndex?: number,
    onSetPayDataFn: (index: number, data) => void,
    onClosePayBoxFn: () => void,
    current?: string,
    subUrl?: string
}
export default class PopPayWayOrder extends Component<Props, any> {
    constructor(props) {
        super(props);
        this.state = {
            curIndex: this.props.data.type ? this.props.data.type : 0
        }
    }

    static defaultProps = {
        isShow: false
    }

    clickLiPay(index, data) {
        log(index);
        log(data);
        log("吧状态存在远端的服务器上，２０００毫秒后模拟存储成功了，然后改变页面的状态")

        this.setState({
            curIndex: index
        })

        // /* 支付模式；PAY_BEFORE/PAY_AFTER 先款(在线支付,包括汇款支付)/后款(货到付款)*/
        // payMode: string,
        // /* 支付方式，依赖payMode; 0: WX, 1: ALIPAY, 2: UNIONPAY, 3: REMITTANCE*/
        // payChannel?: string,
        let key;
        let val;
        if (index == 4) { //货到付款
            key = "payMode";
            val = "PAY_AFTER";
            api.common.setFillOrderSession({
                /* 多级键值用"."分隔，如invoice.invoiceType */
                key: "payChannel",
                val: ""
            }).then(rv => {
                log("货到付款，设置payChannel为‘’　")
            })

            api.common.setFillOrderSession({
                /* 多级键值用"."分隔，如invoice.invoiceType */
                key: "useWallet",
                val: false
            }).then(rv => {
                log("货到付款，不能使用账户余额‘’　")
            })

        } else {
            key = "payChannel";
            if (index <= 3) {
                val = (data.type - 1) + "";
            } else if (index == 5) {
                val = "3";
            }
            api.common.setFillOrderSession({
                /* 多级键值用"."分隔，如invoice.invoiceType */
                key: "payMode",
                val: "PAY_BEFORE"
            }).then(rv => {
                log("非货到付款，设置payMode　为‘PAY_BEFORE’　")
            })

        }
        api.common.setFillOrderSession({
            key: key,
            val: val
        }).then((rv) => {

            if (rv.success) {
                this.props.onSetPayDataFn(index, data);
                this.props.onClosePayBoxFn();
            } else {
                Alert("选择支付方式，服务异常，请稍后再试！")
            }
        })
    }

    getisWxShow() {
        let _window: any = window;
        let isWxShow = _window.navigator.userAgent.toLowerCase().match(/micromessenger/i) == "micromessenger" ? 1 : 0;
        if (isWxShow) {
            return true
        } else {
            return false
            // return true
        }
    }

    closePayBox() {
        log("PopPayWayOrder-closePayBox");
        this.props.onClosePayBoxFn();
    }
    isShowWX(key) {
        let _isWx = this.getisWxShow();
        if (_isWx) {
            //微信只是支持微信支付　和貨到付款形式
            if (key == 0 || key == 3) {
                return "block"
            } else {
                return "none"
            }
        } else {
            return "block"
        }
    }
    render() {
        log(this)
        log(initData)
        return (
            <div className={this.props.isShow ? "mod-pop-box pop-bottom" : "mod-pop-box pop-bottom hide"}>
                <div className="pop-inner">
                    <div className="pop-hd">
                        <a href="javascript:void(0)" onClick={this.closePayBox.bind(this) }
                            className="iconfont icon-close fl"/>
                        <h3>支付方式</h3>
                    </div>
                    <div className="pop-bd">
                        <div className="mod-link-list">
                            <ul>
                                {initData.map((data, key) => {
                                    return (
                                        <li style={{ display: this.isShowWX(key) }} data-index={key} key={key} onClick={this.clickLiPay.bind(this, key + 1, data) }>
                                            <a href="javascript:void(0)">
                                                {data.text}
                                                <i className={this.state.curIndex == key + 1 ? "iconfont icon-check" : ""} />
                                                {(
                                                    () => {
                                                        if (key == 4) {
                                                            return (
                                                                <p className="highlight">注：汇款公司名称必须与发票抬头一致</p>
                                                            )
                                                        }
                                                    }
                                                )() }
                                            </a>
                                        </li>
                                    )
                                }) }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
