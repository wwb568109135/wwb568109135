import {Component} from "react";
import * as api from "../../api";
import Toast from "./../../components/common/Toast";

interface Props {
    item: serverApi.promotion.PromotionInfo,
    callbackParent: (string)=>void
}

export default class DiscountList extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    setRemind(item:serverApi.promotion.PromotionInfo, e) {
        e.stopPropagation();
        api.promotion.remind_me_later({
            promotionId: item.promotionId
        }).then(res => {
            if(!res.errorId) {
                this.props.callbackParent(res.reservationId);
                Toast(<div>设置成功<p style={{"marginTop": "5px", "fontSize": "12px"}}>秒杀前五分钟提醒您</p></div>, 2500);
            } else {
                Toast(<span>{res.errorDesc}</span>, 2500)
            }
        })
    }
    
    cancelRemind(item:serverApi.promotion.PromotionInfo, e) {
        e.stopPropagation();
        api.promotion.cancel_remind_me({
            promotionId: item.promotionId,
            reservationId: item.reservationId
        }).then(res => {
            if(!res.errorId) {
                this.props.callbackParent("");
                Toast(<div>已取消<p style={{"marginTop": "5px", "fontSize": "12px"}}>您可能抢购不到商品哦</p></div>, 2500);
            } else {
                Toast(<span>{res.errorDesc}</span>, 2500)
            }
        })
    }

    render() {
        if(!this.props.item.reservationId) {
            return <span id="remindBtn" className="mod-btn tips small" onClick={this.setRemind.bind(this, this.props.item)}>提醒</span>
        } else {
            return <span id="remindBtn" className="mod-btn tips-ghost small" onClick={this.cancelRemind.bind(this, this.props.item)}>取消提醒</span>
        }
    }
}
