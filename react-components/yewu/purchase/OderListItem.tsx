import {Component} from "react";
import {Modal, Alert, Confirm} from '../../components/common/Modal';
import * as api from "../../api";

interface props {
    data: serverApi.common.order_2b.list.by_shop.Response_orderList
}

export default class OderListItem extends Component<props, {}> {
    constructor(props) {
        super(props);
    }
    setPayUrl() {
        let payChannel = this.props.data.payChannel;
        let gopayUrl;
        let price = util.price(this.props.data.needPayMoney / 100);
        let pid = this.props.data.orderFormId
        let type;
        /* 支付模式；PAY_BEFORE/PAY_AFTER 先款(在线支付,包括汇款支付)/后款(货到付款)*/
        // payMode: string,
        /* 支付方式，依赖payMode; 0: WX, 1: ALIPAY, 2: UNIONPAY, 3: REMITTANCE*/
        // payChannel?: string,
        if (payChannel == "REMITTANCE") {
            type = 5
        } else if (payChannel == "WX"　|| payChannel == "WX_GZH") {
            type = 1
        } else if (payChannel == "ALIPAY") {
            type = 2
        } else if (payChannel == "UNIONPAY") {
            type = 3
        }
        let source = "purchase"
        return "/pay?type=" + type + "&price=" + price + "&pid=" + pid + "&source=" + source;
    }
    btns() {
        let orderFormState = this.props.data.orderFormState;
        let allowActionList = this.props.data.allowActionList;
        let payChannel = this.props.data.payChannel;
        let remittanceState = this.props.data.remittanceState;

        let footerActionClassName;
        if (allowActionList.indexOf("BEFORE_PAY") != -1) {
            footerActionClassName = "";
        } else {
            footerActionClassName = "fr";
        }

        let gopayUrl;
        gopayUrl = this.setPayUrl();

        return (
            <div className="mod-btns">
                {
                    allowActionList.indexOf("AFTER_CANCEL_UNDELIVERY") != -1 || allowActionList.indexOf("AFTER_CANCEL_PRE_DELIVERY") != -1 || allowActionList.indexOf("BEFORE_CANCEL_PAYED") != -1 ?
                        <a onClick={this.cancelOrderForm.bind(this) } className={`mod-btn cancel ${footerActionClassName}`}>取消订单</a> : ""
                }
                {
                    allowActionList.indexOf("BEFORE_PAY") != -1 && payChannel != "REMITTANCE" ?
                        <div>
                            <a onClick={this.cancelOrderForm.bind(this) } className="mod-btn cancel">取消订单</a>
                            <Link to={gopayUrl} className="mod-btn highlight">去支付</Link>
                        </div> : ""
                }
                {
                    allowActionList.indexOf("BEFORE_PAY") != -1 && payChannel == "REMITTANCE" ?
                        <div>
                            <a onClick={this.cancelOrderForm.bind(this) } className="mod-btn cancel">取消订单</a>
                            <Link to={"/purchase/confirmBill?orderId=" + this.props.data.orderFormId } className="mod-btn highlight">
                                {
                                    // TODO: 接口问题
                                    remittanceState == "ORDER_REMITTED_UNCONFIRM" ? "修改汇款凭证" : "去汇款"
                                }
                            </Link>
                        </div> : ""
                }
                {
                    allowActionList.indexOf("BEFORE_COMPLETE") != -1 || allowActionList.indexOf("AFTER_RECEIPT") != -1 ?
                        <a onClick={this.confirmComplete.bind(this) } className={`mod-btn highlight ${footerActionClassName}`}>确认收货</a> : ""
                }
                {
                    orderFormState.indexOf("COMPLETE") != -1 || orderFormState.indexOf("CANCEL") != -1 ?
                        <Link to="/purchase" className={`mod-btn highlight ${footerActionClassName}`}>再次购买</Link> : ""
                }

            </div>
        )
    }
    itemList(item, index, orderFormId) {
        return (
            <li key={index}>
                <Link to={`/purchase/orderDetail?oid=${orderFormId}`}>
                    <div className="pic">
                        <img src={`${util.getImgSrc(item.photoIdList, '272x272')}`} alt/>
                    </div>
                    <div className="cont">
                        <h3 className="title">
                            {item.productName}
                        </h3>
                        <div className="info">
                            <div className="now-price">￥{util.price(item.pricePerUnit / 100) }</div>
                            <div className="light">x{item.count}</div>
                        </div>
                    </div>
                </Link>
            </li>
        )
    }
    cancelOrderForm(e) {
        e.preventDefault();
        Confirm({
            title: "提示",
            content: "是否取消订单？",
            btnText: ["否", "是"],
            onOk: () => {
                log('cancel');
                api.common.order_2b.cancel({
                    orderId: this.props.data.orderFormId,
                    reason: "用户主动取消"
                }).then(res => {
                    if (res.success) {
                        Alert({
                            title: "提示",
                            content: "已成功取消该订单",
                            btnText: "知道了",
                            onOk: () => {
                                Common.Event.publish('deleteOrderListItem', res.order ||this.props.data);
                            }
                        });
                    } else {
                        Alert({
                            title: "错误",
                            content: "取消订单失败",
                            btnText: "知道了",
                        });
                        log.color("%clog:", "background: red", res);
                    }
                });
            }
        });
    }
    confirmComplete(e) {
        e.preventDefault();
        Confirm({
            title: "提示",
            content: "是否确认收货？",
            btnText: ["否", "是"],
            onOk: () => {
                log('confirm');
                api.common.order_2b.confirm_complete({
                    orderId: this.props.data.orderFormId
                }).then(res => {
                    if (res.success) {
                        Alert({
                            title: "提示",
                            content: "已确认收货",
                            btnText: "知道了",
                            onOk: () => {
                                Common.Event.publish('deleteOrderListItem', res.order ||this.props.data);
                            }
                        });
                    } else {
                        Alert({
                            title: "错误",
                            content: "确认收货失败",
                            btnText: "知道了",
                        });
                        log.color("%clog:", "background: red", res);
                    }
                });
            }
        });
    }
    orderState() {

        let orderFormState = this.props.data.orderFormState;
        let payChannel = this.props.data.payChannel;
        let remittanceState = this.props.data.remittanceState;

        let statesText = {
            ORDER_BEFORE_UNPAY: "未支付",
            ORDER_BEFORE_PAYED: "等待供应商发货",
            ORDER_BEFORE_DELIVERYED: "已发货",
            ORDER_BEFORE_COMPLETE: "已完成",
            ORDER_BEFORE_CANCEL_UNPAY: "已取消",
            ORDER_BEFORE_CANCEL_PAYED: "已取消",

            ORDER_AFTER_UNDELIVERY: "等待供应商发货",
            ORDER_AFTER_PRE_DELIVERY: "等待供应商发货",
            ORDER_AFTER_DELIVERYED: "已发货",
            ORDER_AFTER_RECEIPT: "等待供应商结算",
            ORDER_AFTER_COMPLETE_RECEIPT: "已完成",
            ORDER_AFTER_COMPLETE_DIRECT: "已完成",
            ORDER_AFTER_CANCEL_UNDELIVERY: "已取消",
            ORDER_AFTER_CANCEL_PRE_DELIVERY: "已取消"
        }

        let oderStateText = statesText[orderFormState] || '';
        if (orderFormState == 'ORDER_BEFORE_UNPAY') {
            if (payChannel == "REMITTANCE") {
                if (remittanceState == "ORDER_REMITTED_UNCONFIRM") {
                    oderStateText = "已汇款，等待收款";
                }
            }
        }

        return <span className="fr">{oderStateText}</span>

    }

    render() {
        let data = this.props.data

        return (
            <div className="mod-box-list">
                <div className="box-hd">
                    {this.orderState() }
                    订单号：{data.orderFormId}
                </div>
                <div className="mod-pic-list order-pic-list">
                    <ul>
                        {
                            data.itemList.map((item, index) => (
                                this.itemList(item, index, data.orderFormId)
                            ))
                        }
                    </ul>
                    <div className="pic-ft">
                        共{data.itemList.length}件商品&nbsp; &nbsp; 合计：<span className="highlight">￥{util.price(data.needPayMoney / 100) }</span>
                        {this.btns() }
                    </div>
                </div>
            </div>

        )
    }
}
