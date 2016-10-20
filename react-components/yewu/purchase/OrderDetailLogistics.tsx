import TopBar from "../TopBar";
import {Component} from "react";

interface Props {
    // 快递数据
    dataKd: any,
    // 收货数据
    dataDelivery: any,
    // 返回
    onHideLogistics: () => void
}

export default class OrderDetailLogistics extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    render() {
        log.color("%clog", "background: red;color: white;", this.props);
        let logisticsName = this.props.dataKd.logisticsName || "";
        let wayBillId = this.props.dataKd.wayBillId || "";
        let address = this.props.dataDelivery.address || "";
        let kdDetail = this.props.dataKd.itemList || [];
        return (
            <div>
                <TopBar title="物流信息" backHandler={this.props.onHideLogistics} />
                <div className="app-content fx-hd pas">
                    <div className="mod-checklist">
                        <p><label className="light">承运来源：</label>{logisticsName}</p>
                        <p><label className="light">运单编号：</label>{wayBillId}</p>
                        <p><label className="light">收货地址：</label>{address}</p>
                    </div>
                    <div className="mod-logistics mts">
                        <ul className="line-body">
                            {
                                kdDetail.map((item, index) => {
                                    let currentClsName:string = "";
                                    if(index == 0) {
                                        currentClsName = "now";
                                    }
                                    return <li key={"item-" + index} className={currentClsName}>
                                        <i />
                                        <p>{item.content}</p>
                                        <p className="fss light">{util.date(item.timeStamp)}</p>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }


}
