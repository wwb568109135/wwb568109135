import {Component} from "react";
import Timer from "../common/Timer";

export default class CountDown extends Component<serverApi.promotion.list_seckill_promotions.Response, any> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="countdown">
                <p className="light fss">距结束</p>
                <div className="countdown-inner">
                    <span className="num"><Timer leftMs={this.props.leftMs} layout="HH"/></span>:
                    <span className="num"><Timer leftMs={this.props.leftMs} layout="mm"/></span>:
                    <span className="num"><Timer leftMs={this.props.leftMs} layout="ss"/></span>
                </div>
            </div>
        )
    }
}
