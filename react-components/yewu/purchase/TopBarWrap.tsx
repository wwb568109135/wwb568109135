import {Component} from "react";
import TopBar from "../TopBar";

interface Props {
    // url参数
    urlParams: string,
    // 为空未普通订单，非空未专属供应订单
    consultPriceId: string
}

export default class TopBarWrap extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        urlParams: "",
        consultPriceId: ""
    }

    render() {
        let urlParams = this.props.urlParams;
        let consultPriceId = this.props.consultPriceId;
        let topBar;
        if(urlParams != "") {
            if(consultPriceId == "") {
                topBar = <TopBar title="订单详情" backUrl="/purchase/orderList"/>
            } else {
                topBar = <TopBar title="订单详情" backUrl="/product/supplyOrderList?type=finished"/>
            }
        } else {
            topBar = <TopBar title="订单详情"/>
        }

        return (
            <div>{topBar}</div>
        )
    }
}
