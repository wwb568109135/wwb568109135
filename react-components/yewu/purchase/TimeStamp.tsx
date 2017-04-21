import {Component} from "react";

interface Props {
    // 订单ID
    orderFormId:string,
    // 订单创建时间
    createTimeStamp:number,
    // 订单取消时间
    cancelTimeStamp?:number,
    // 最后支付时间
    lastPayTimeStamp?:number,
    // 发货时间
    deliveryTimeStamp?:number,
    // 订单完成时间
    completeTimeStamp?:number
}

export default class TimeStamp extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        orderFormId: "",
        createTimeStamp: 0,
        cancelTimeStamp: 0,
        lastPayTimeStamp: 0,
        deliveryTimeStamp: 0,
        completeTimeStamp: 0
    }

    render() {
        let orderFormId = this.props.orderFormId;
        let createTimeStamp = this.props.createTimeStamp;
        let cancelTimeStamp = this.props.cancelTimeStamp;
        let lastPayTimeStamp = this.props.lastPayTimeStamp;
        let deliveryTimeStamp = this.props.deliveryTimeStamp;
        let completeTimeStamp = this.props.completeTimeStamp;

        return (
            <div className="mod-checklist">
                <p>订单号：{orderFormId}</p>
                {
                    createTimeStamp ? <p>下单时间：{util.date(createTimeStamp)}</p> : ""
                }
                {
                    cancelTimeStamp ? <p>取消时间：{util.date(cancelTimeStamp)}</p> : ""
                }
                {
                    lastPayTimeStamp ? <p>支付时间：{util.date(lastPayTimeStamp)}</p> : ""
                }
                {
                    deliveryTimeStamp ? <p>发货时间：{util.date(deliveryTimeStamp)}</p> : ""
                }
                {
                    completeTimeStamp ? <p>完成时间：{util.date(completeTimeStamp)}</p> : ""
                }
            </div>
        )
    }
}
