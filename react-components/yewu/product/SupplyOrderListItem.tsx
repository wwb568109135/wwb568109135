import {Component} from "react";

interface Props {
    // 供应商名称
    supplyName: string,
    // 询价状态
    consultStatus: string,
    // 询价时间
    createTime?: number,
    // 询价订单ID
    consultPriceId: string
}

export default class SupplyOrderListItem extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        supplyName: "",
        consultStatus: "",
        createTime: 0,
        consultPriceId: ""
    }

    render() {
        let supplyName = this.props.supplyName;
        let consultStatus = this.props.consultStatus;
        let requestType:string;
        switch(consultStatus) {
            case "WAIT":
                consultStatus = "等待报价";
                requestType = "wait";
                break;
            case "FINISHED":
                consultStatus = "已报价";
                requestType = "finished";
                break;
            case "REFUSED":
                consultStatus = "拒绝报价";
                requestType = "refused";
                break;
            case "ORDERED":
                consultStatus = "已下单";
                requestType = "ordered";
                break;
            case "BACK_TIMEOUT":
                consultStatus = "报价超时";
                requestType = "backTimeout";
                break;
            case "ORDER_TIMEOUT":
                consultStatus = "下单超时";
                requestType = "orderTimeout";
                break;
        }
        let createTime = this.props.createTime;
        let consultPriceId = this.props.consultPriceId;

        return (
            <li>
                <Link to={`/product/supplyOrderDetail?type=${requestType}&consultPriceId=${consultPriceId}`}>
                    <span className="fr highlight pts">
                        {
                            util.getParam("type") == "all" ||
                            util.getParam("type") == "" ||
                            (util.getParam("type") == "finished" && consultStatus != "已报价") ||
                            (util.getParam("type") == "wait" && consultStatus != "等待报价") ? <span>{consultStatus}</span> : ""
                        }
                        <i className="iconfont icon-arrowright" />
                    </span>
                    <h4>{supplyName}</h4>
                    <p>询价时间：{util.date(createTime)}</p>
                </Link>
            </li>
        )
    }
}
