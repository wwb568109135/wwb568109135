import {Component} from "react";

interface Props {
    // 物流类型,值为LOGISTICS_KD(快速发货),LOGISTICS_SUPPLY(供应商发货),LOGISTICS_DIY(物流发货)
    logisticsType:string,
    // 订单ID
    orderFormId:string,
    // 货运公司或物流公司的名称
    logisticsName?:string,
    // 物流单号
    wayBillId?:string,
    // 送货员手机
    deliveryPhone?:string,
    // 显示快递信息
    onShowLogistics?: () => void
}

export default class Logistics extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        logisticsType: "",
        orderFormId: "",
        logisticsName: "",
        wayBillId: "",
        deliveryPhone: ""
    }

    render() {
        let logisticsType = this.props.logisticsType;
        let orderFormId = this.props.orderFormId;
        let logisticsName = this.props.logisticsName;
        let wayBillId = this.props.wayBillId;
        let deliveryPhone = this.props.deliveryPhone;

        let logisticsBrief:JSX.Element;
        switch(logisticsType) {
            case "LOGISTICS_KD":
                logisticsBrief = <a onClick={this.props.onShowLogistics}>
                    <span className="fr light fsm">查看快递信息<i className="iconfont icon-arrowright"></i></span>
                    {logisticsBrief}
                    <h4>物流：{logisticsName}</h4>
                    <h5>运单号：{wayBillId}</h5>
                </a>;
                break;
            case "LOGISTICS_DIY":
                logisticsBrief = <div>
                    <h4>物流：{logisticsName}</h4>
                    <h5>运单号：{wayBillId}</h5>
                </div>;
                break;
            case "LOGISTICS_SUPPLY":
                logisticsBrief = <div>
                    <h4>物流：供应商负责货运</h4>
                    <h5>送货员手机：{deliveryPhone}</h5>
                </div>;
                break;
        }

        return (
            <li>
                {logisticsBrief}
            </li>
        )
    }
}
