/**
 * Created by roger on 16/6/23.
 */
import { Component } from "react";
import Timer from "../common/Timer";

interface Props {
    leftMs: number;
    startMs: number;
}
interface States {
    interval: "beforeStart" | "inPromotion" | "afterEnd";
    ms: number;
}

const MSG = {
    beforeStart: "离开始",
    inPromotion: "距结束",
    afterEnd: "已结束",
};

export default class MyTimer extends Component<Props, States> {
    interval: NodeJS.Timer | number;
    id = +new Date();
    constructor(props) {
        super(props);
        this.state = this.getInitState(props);
    }

    getInitState(props) {
        const { startMs, leftMs } = props;
        let interval, ms;
        if (startMs < 0) {
            interval = "beforeStart";
            ms = - startMs;
        } else if (leftMs > 0) {
            interval = "inPromotion";
            ms = leftMs;
        } else {
            interval = "afterEnd";
            ms = -1;
        }

        return {interval, ms};
    }


    onEnd() {
        if (this.state.interval === "beforeStart") {
            const leftMs = this.props.leftMs + this.props.startMs;
            this.setState({
                interval: "inPromotion",
                ms: leftMs,
            });
            Common.Event.publish("resetTimer", {id: this.id, leftMs: leftMs});
        } else if (this.state.interval === "inPromotion") {
            this.setState({
                interval: "afterEnd",
                ms: -1
            });
        }

    }

    render() {
        return (<div className="seckill-box">
            <span>{MSG[this.state.interval]}</span>
            {this.state.interval !== "afterEnd" ?
                <Timer leftMs={this.state.ms} onEnd={this.onEnd.bind(this)} id={this.id}>
                    <span className="num" layout="HH" />:
                    <span className="num" layout="mm" />:
                    <span className="num" layout="ss" />
                </Timer> : ""}
        </div>);
    }
}
