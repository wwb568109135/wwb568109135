import {Component} from "react";
import {Modal,Alert,Confirm} from '../../components/common/Modal';
import * as api from "../../api";

interface Props {
    // 订单ID
    orderFormId?:string
    // 实际支付的价格
    remainNeedPayMoney?:number
    // 订单状态
    orderFormState:string,
    // array,允许行为列表
    allowActionList?:any,
    // 支付渠道
    payChannel?:string,
    // 汇款状态 ORDER_UNREMIT:订单未汇款 | ORDER_REMITTED_UNCONFIRM: 订单已汇款待财务确认 | ORDER_REMITTED_CONFIRMED 订单已汇款并且财务已确认"
    remittanceState?:string
}

export default class PaymentState extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        orderFormState: "",
        allowActionList: [],
        payChannel: "",
        remittanceState: ""
    }
    setPayUrl(){
        let gopayUrl;
        let payChannel = this.props.payChannel;
        let price = util.price(this.props.remainNeedPayMoney/100);
        let pid = this.props.orderFormId;
        let type;
        /* 支付模式；PAY_BEFORE/PAY_AFTER 先款(在线支付,包括汇款支付)/后款(货到付款)*/
        // payMode: string,
        /* 支付方式，依赖payMode; 0: WX, 1: ALIPAY, 2: UNIONPAY, 3: REMITTANCE*/
        // payChannel?: string,
        if( payChannel == "REMITTANCE"){
            type = 5
        }else if( payChannel == "WX" || payChannel == "WX_GZH" ){
            type = 1
        }else if( payChannel == "ALIPAY"){
            type = 2
        }else if( payChannel == "UNIONPAY"){
            type = 3
        }
        //
        let source = "purchase"
        return "/pay?type="+type+"&price="+price+"&pid="+pid+"&source="+source;
        // return "/pay?type="+type+"&price="+price+"&pid="+pid;
    }
    cancelOrderForm() {
        Confirm({
            title:"提示",
            content:"是否取消订单？",
            btnText:["否","是"],
            onOk:() => {
                log('cancel');
                api.common.order_2b.cancel({
                    orderId: this.props.orderFormId,
                    reason: "用户主动取消"
                }).then(res => {
                    if(res.success) {
                        Alert({
                            title:"提示",
                            content:"已成功取消该订单",
                            btnText:"知道了",
                            onOk:()=>{
                                location.reload();
                            }
                        });
                    } else {
                        alert(res);
                        log.color("%clog:", "background: red", res);
                    }
                });
            }
        });
    }
    confirmComplete() {
        Confirm({
            title:"提示",
            content:"是否确认收货？",
            btnText:["否","是"],
            onOk:() => {
                log('confirm');
                api.common.order_2b.confirm_complete({
                    orderId: this.props.orderFormId
                }).then(res => {
                    if(res.success) {
                        Alert({
                            title:"提示",
                            content:"已确认收货",
                            btnText:"知道了",
                            onOk:()=>{
                                location.reload();
                            }
                        });
                    } else {
                        alert(res);
                        log.color("%clog:", "background: red", res);
                    }
                });
            }
        });
    }
    render() {
        let orderFormState = this.props.orderFormState;
        let allowActionList = this.props.allowActionList;
        let payChannel = this.props.payChannel;
        let remittanceState = this.props.remittanceState;

        let footerActionClassName;
        if(allowActionList.indexOf("BEFORE_PAY") != -1) {
            footerActionClassName = "btn-half";
        } else {
            footerActionClassName = "big-max-btn";
        }
        let gopayUrl;
        gopayUrl = this.setPayUrl();

        return (
            <div className={`app-footer ${footerActionClassName}`}>
                {
                    allowActionList.indexOf("AFTER_CANCEL_UNDELIVERY") != -1 || allowActionList.indexOf("AFTER_CANCEL_PRE_DELIVERY") != -1 || allowActionList.indexOf("BEFORE_CANCEL_PAYED") != -1 ?
                        <a onClick={this.cancelOrderForm.bind(this)} className="btn bg-red">取消订单</a> : ""
                }
                {
                    allowActionList.indexOf("BEFORE_PAY") != -1 && payChannel != "REMITTANCE" ?
                        <div>
                            <a onClick={this.cancelOrderForm.bind(this)} className="btn">取消订单</a>
                            <Link to={gopayUrl} className="btn bg-red">去支付</Link>
                        </div> : ""
                }
                {
                    allowActionList.indexOf("BEFORE_PAY") != -1 && payChannel == "REMITTANCE" ?
                        <div>
                            <a onClick={this.cancelOrderForm.bind(this)} className="btn">取消订单</a>
                            <Link to={"/purchase/confirmBill?orderId=" + this.props.orderFormId } className="btn bg-red">
                                {
                                    // TODO: 接口问题
                                    remittanceState == "ORDER_REMITTED_UNCONFIRM" ? "修改汇款凭证" : "去汇款"
                                }
                            </Link>
                        </div> : ""
                }
                {
                    allowActionList.indexOf("BEFORE_COMPLETE") != -1 || allowActionList.indexOf("AFTER_RECEIPT") != -1 ?
                        <a onClick={this.confirmComplete.bind(this)} className="btn bg-red">确认收货</a> : ""
                }
                {
                    orderFormState.indexOf("COMPLETE") != -1 || orderFormState.indexOf("CANCEL") != -1 ?
                        <Link to="/purchase" className="btn bg-red">再次购买</Link> : ""
                }
            </div>
        )
    }
}
