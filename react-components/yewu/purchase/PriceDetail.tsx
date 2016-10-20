import {Component} from "react";

interface Props {
    // 优惠前价格
    totalPriceBeforeCutOff:number,
    // 优惠后价格
    totalPriceAfterCutOff?: number,
    // 业务员优惠状态
    cutOffApplyState?:string,
    // 业务员优惠
    cutoffMoney?:number,
    // 活动优惠
    hdCutOff?:number,
    // 在线支付优惠
    onlinePayCutOff?:number,
    // 优惠券优惠
    couponCutOff?:number,
    // 钱包支付
    walletPayMoney?: number,
    // 实际支付的价格
    needPayMoney: number
}

export default class TimeStamp extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        totalPriceBeforeCutOff: 0,
        totalPriceAfterCutOff: 0,
        cutOffApplyState: "",
        cutoffMoney: 0,
        hdCutOff: 0,
        onlinePayCutOff: 0,
        couponCutOff: 0,
        walletPayMoney: 0,
        needPayMoney: 0
    }

    render() {
        let totalPriceBeforeCutOff = util.price(this.props.totalPriceBeforeCutOff/100);
        let totalPriceAfterCutOff = util.price(this.props.totalPriceAfterCutOff/100);
        let cutOffApplyState = this.props.cutOffApplyState;
        let cutoffMoney = util.price(this.props.cutoffMoney/100);
        let hdCutOff = util.price(this.props.hdCutOff/100);
        let onlinePayCutOff = util.price(this.props.onlinePayCutOff/100);
        let couponCutOff = util.price(this.props.couponCutOff/100);
        let walletPayMoney = util.price(this.props.walletPayMoney/100);
        let needPayMoney = util.price(this.props.needPayMoney/100);

        let cutOffApplyStateInfo;
        switch (cutOffApplyState) {
            case "IN_AUDIT":
                cutOffApplyStateInfo = "优惠申请中，请稍后查看";
                break;
            case "AUDIT_AGREE":
                cutOffApplyStateInfo = "-¥" + cutoffMoney;
        }

        let defaultPrice = util.price(0);

        return (
            <div className="mod-checklist">
                <ul>
                    <li>商品总额：<span className="fr highlight">¥{totalPriceBeforeCutOff}</span></li>
                    {
                        cutOffApplyState.indexOf("IN_AUDIT") != -1 || cutOffApplyState.indexOf("AUDIT_AGREE") != -1 ? <li>业务员优惠：<span className="fr blue">{cutOffApplyStateInfo}</span></li> : ""
                    }
                    {
                        hdCutOff != defaultPrice ? <li>活动优惠：<span className="fr blue">-¥{hdCutOff}</span></li> : ""
                    }
                    {
                        onlinePayCutOff !=defaultPrice ? <li>在线支付优惠：<span className="fr blue">-¥{onlinePayCutOff}</span></li> : ""
                    }
                    {
                        couponCutOff != defaultPrice ? <li>优惠券：<span className="fr blue">-¥{couponCutOff}</span></li> : ""
                    }
                    {
                        walletPayMoney != defaultPrice ? <li>钱包支付：<span className="fr blue">-¥{walletPayMoney}</span></li> : ""
                    }
                    <li>实付总额：<span className="fr highlight">¥{needPayMoney}</span></li>
                </ul>
            </div>
        )
    }
}
