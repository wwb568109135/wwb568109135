import {Component} from "react";
import ShelvesList from "../../containers/home/IndexOrder/Shelves";
import get_unprocessed_data = serverApi.shop.info.get_unprocessed_data;
/**
 * UrgentOrder:加急订单
 * RegularOrder:普通订单
 * Bill:账单
 * ShelvesList:货架列表
 */

export default class IndexOrder extends Component<get_unprocessed_data.Response, {}> {
    static defaultProps = {
        bill: {
            cnt: 0,
            latestCreateTime: 0,
        },
        normal: {
            cnt: 0,
            latestCreateTime: 0,
        },
        urgentaction: {
            cnt: 0,
            latestCreateTime: 0,
            isIn: 0,
        }
    };
    constructor(props) {
        super(props);
    }

    render() {
        const {bill, normal, urgentaction} = this.props;
        const urgentactionMsg = urgentaction.cnt > 0 ?
            `您有${urgentaction.cnt}个加急订单（${util.date(urgentaction.latestCreateTime, "hh:mm")}）`:
            "HTW提醒你，你还没有加急订单，赶紧去下单吧。";
        const normalMsg = normal.cnt > 0 ?
            `您有${normal.cnt}个普通订单（${util.date(normal.latestCreateTime, "hh:mm")}）`:
            "HTW提醒你，你还没有普通订单，赶紧去下单吧。";
        const billFlowMsg = bill.isIn ? "收入" : "支出";
        const billMsg = bill.cnt > 0 ?
            `您有${bill.cnt}笔新的${billFlowMsg}（${util.date(bill.latestCreateTime, "hh:mm")}）`:
            "HTW提醒你，你还没有账单，赶紧去下单吧。";

        return (
            <div className="mod-art-list system-list jsIndexOrder">
                <ul>
                    <li>
                        <Link to="urgentOrder">
                            <i className="icon icon-urgent"></i>
                            <h4>加急订单</h4>
                            <p className="light">
                                订单明细 / 加急
                            </p>
                            {/*<i className="iconfont icon-tips"></i>*/}
                        </Link>
                    </li>
                    <li>
                        <Link to="regularOrder">
                            <i className="icon icon-normal"></i>
                            <h4>普通订单</h4>
                            <p className="light">
                                订单明细 / 普通
                            </p>
                            {/*<i className="iconfont icon-tips"></i>*/}
                        </Link>
                    </li>
                    <li>
                        <Link to="bill">
                            <i className="icon icon-bill"></i>
                            <h4>账&nbsp;&nbsp;单</h4>
                            <p className="light">
                                账单收支明细 / 收支
                            </p>
                        </Link>
                    </li>
                    <ShelvesList />
                </ul>
            </div>
        )
    }
}
