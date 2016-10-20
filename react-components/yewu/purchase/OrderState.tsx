import {Component} from "react";
import Timer from "../common/Timer";

interface Props {
    // 订单状态
    orderFormState:string,
    // 支付渠道
    payChannel?:string,
    // 汇款状态 ORDER_UNREMIT:订单未汇款 | ORDER_REMITTED_UNCONFIRM: 订单已汇款待财务确认 | ORDER_REMITTED_CONFIRMED 订单已汇款并且财务已确认"
    remittanceState?:string,
    // 订单取消时间
    cancelTimeStamp?:number,
    // 订单取消原因
    cancelReason?:string,
    // 倒计时Map,key为AUTO_CANCEL,AUTO_COMPLETE,AUTO_PRE_DELIVERY"
    countDownMap?:countDownMapObj,
}

interface countDownMapObj {
    AUTO_CANCEL?: number,
    AUTO_COMPLETE?: number,
    AUTO_PRE_DELIVERY?: number
}

export default class OrderState extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        orderFormState: "",
        payChannel: "",
        remittanceState: "",
        cancelTimeStamp: 0,
        cancelReason: "",
        countDownMap: {
            AUTO_CANCEL: 0,
            AUTO_COMPLETE: 0,
            AUTO_PRE_DELIVERY: 0
        }
    }

    render() {
        let orderFormState = this.props.orderFormState;
        let payChannel = this.props.payChannel;
        let remittanceState = this.props.remittanceState;
        let cancelTimeStamp = this.props.cancelTimeStamp;
        let cancelReason = this.props.cancelReason;
        let countDownMap = this.props.countDownMap;

        let orderFormStateText, stateDesc;
        switch (orderFormState) {
            case "ORDER_BEFORE_UNPAY":
                orderFormStateText = "订单已创建，等待支付";

                if (payChannel == "REMITTANCE") {
                    if (remittanceState == "ORDER_REMITTED_UNCONFIRM") {
                        orderFormStateText = "已汇款，等待供应商确认收款";
                    } else {
                        orderFormStateText = "订单未支付，请汇款";
                    }
                }
                break;
            case "ORDER_BEFORE_PAYED":
                orderFormStateText = "未发货，等待供应商发货";
                break;
            case "ORDER_BEFORE_DELIVERYED":
                orderFormStateText = "已发货，等待确认收货";
                break;
            case "ORDER_BEFORE_COMPLETE":
                orderFormStateText = "订单已完成";
                break;
            case "ORDER_BEFORE_CANCEL_UNPAY":
                orderFormStateText = "订单已取消";
                break;
            case "ORDER_BEFORE_CANCEL_PAYED":
                orderFormStateText = "订单已取消";
                break;

            case "ORDER_AFTER_UNDELIVERY":
                orderFormStateText = "未发货，等待供应商发货(货到付款)";
                break;
            case "ORDER_AFTER_PRE_DELIVERY":
                orderFormStateText = "未发货，等待供应商发货(货到付款)";
                break;
            case "ORDER_AFTER_DELIVERYED":
                orderFormStateText = "已发货，请耐心等待收货(货到付款)";
                break;
            case "ORDER_AFTER_RECEIPT":
                orderFormStateText = "等待供应商结算(货到付款)";
                break;
            case "ORDER_AFTER_COMPLETE_RECEIPT":
                orderFormStateText = "订单已完成(货到付款)";
                break;
            case "ORDER_AFTER_COMPLETE_DIRECT":
                orderFormStateText = "订单已完成(货到付款)";
                break;
            case "ORDER_AFTER_CANCEL_UNDELIVERY":
                orderFormStateText = "订单已取消(货到付款)";
                break;
            case "ORDER_AFTER_CANCEL_PRE_DELIVERY":
                orderFormStateText = "订单已取消(货到付款)";
                break;
        }

        if (this.props.countDownMap) {
            let AUTO_CANCEL = Math.abs(countDownMap["AUTO_CANCEL"]);
            let AUTO_COMPLETE = Math.abs(countDownMap["AUTO_COMPLETE"]);
            let AUTO_PRE_DELIVERY = Math.abs(countDownMap["AUTO_PRE_DELIVERY"]);

            if (AUTO_CANCEL && orderFormState == "ORDER_BEFORE_UNPAY") {
                stateDesc = <div>
                    <p className="light" style={{marginTop: ".22rem"}}>还剩 <Timer leftMs={AUTO_CANCEL} layout="dd天HH小时mm分ss秒" interval={1000}/> 来完成支付</p>
                    <p className="light" style={{marginTop: ".22rem"}}>超时订单将自动取消</p>
                </div>
            } else if (AUTO_COMPLETE) {
                stateDesc = <div>
                    <p className="light" style={{marginTop: ".22rem"}}>还剩 <Timer leftMs={AUTO_COMPLETE} layout="dd天HH小时mm分ss秒" interval={1000}/> 来确认收货</p>
                    <p className="light" style={{marginTop: ".22rem"}}>超时订单将自动确认收货</p>
                </div>
            } else if (AUTO_PRE_DELIVERY) {
                stateDesc = <div>
                    <p className="light" style={{marginTop: ".22rem"}}><Timer leftMs={AUTO_PRE_DELIVERY} layout="dd天HH小时mm分ss秒" interval={1000}/> 后，供应商可发货</p>
                </div>
            } else if (orderFormState.indexOf('CANCEL') != -1) {
                stateDesc = <div>
                    {
                        cancelReason ? <p className="light" style={{marginTop: ".22rem"}}>取消理由：{cancelReason}</p> : ""
                    }
                    <p className="light" style={{marginTop: ".22rem"}}>取消时间：{util.date(cancelTimeStamp)}</p>
                </div>
            } else {
                stateDesc = "";
            }
        }

        return (
            <li>
                <h4>订单状态：{orderFormStateText}</h4>
                {stateDesc}
            </li>
        )
    }
}
