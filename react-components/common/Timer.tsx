/**
 * Created by roger on 16/6/29.
 */
import { Component } from "react";
import { format } from "../../utilFn/date";

interface Props {
    id?: number;
    leftMs: number;
    layout?: string;
    interval?: number;
    onEnd?: Function;
}

interface States {
    leftMs: number;
}

export default class Timer extends Component<Props, States> {
    timer: NodeJS.Timer | number;
    static defaultProps = {
        id: +new Date(),
        interval: 1000,
        layout: "yy年M月d天 H小时m分s秒",
    };

    constructor(props) {
        super(props);
        this.state = {
            leftMs: props.leftMs
        };
    }

    tick() {
        const nextLeftMs = this.state.leftMs - this.props.interval;
        if (nextLeftMs < 0) {
            clearInterval(this.timer as number);
            if (this.props.onEnd) {
                this.props.onEnd();
            }
            return;
        }
        this.setState({ leftMs: nextLeftMs });
    }

    componentWillMount() {
        this.timer = setInterval(this.tick.bind(this), this.props.interval);
    }


    componentDidMount() {
        Common.Event.subscribe("resetTimer", (e) => {
            if (e.id === this.props.id) {
                clearInterval(this.timer as number);
                this.setState({leftMs: e.leftMs});
                this.timer = setInterval(this.tick.bind(this), this.props.interval);
            }
        });
    }

    componentWillUnmount() {
        clearInterval(this.timer as number);
        Common.Event.unsubscribe("resetTimer");
    }

    render() {
        const { leftMs } = this.state;

        if (React.Children.count(this.props.children) == 0) {
            return (<span>{format(leftMs, this.props.layout) }</span>);
        }

        const children = React.Children.map(this.props.children, (child): React.ReactNode => {
            if (typeof child === "string" || typeof child === "number") {
                return child;
            }

            let oldChild = child as React.ReactElement<any>;
            return React.cloneElement(oldChild, {}, [format(leftMs, oldChild.props.layout)]);
        });

        return (<span>
            {children}
        </span>);
    }
}
