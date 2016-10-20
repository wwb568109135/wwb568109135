import { Component } from "react";

interface Props {
    style?: {},//最外层容器的样式
    className?: string,//最外层容器的className
    onBottom?: (any?) => any,//滚动到底部回调
    threshold?: number,//触发底部回调的阀值
    useLoading?: boolean,//是否显示加载中文案
    loadingText?: string|JSX.Element,//加载中文案
    useEmptyTips?: boolean,// 是否显示列表为空提示文案,
    emptyTips?:string,//无数据提醒
    onDirection?:(direciton:string) => void
}

export default class ListView extends Component<Props, any> {
    constructor(props) {
        super(props);
        this.state = {
            style: this.props.style || {},
            lock: false,
            dtY:0
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            style: nextProps.style || {}
        });
    }

    scrollHandler(e) {
        let contentHeight = $(e.target).height();
        let scrollHeight = e.target.scrollTop;
        let viewHeight = $("#_list_wrap_").height();
        let dtY = viewHeight - contentHeight - scrollHeight;
        let onBottom = this.props.onBottom;
        let threshold = this.props.threshold || 300
        // log(dtY);
        if (dtY < threshold) {
            if (!this.state.lock && onBottom) {
                onBottom();
            }
            this.state.lock = true;
        } else {
            this.state.lock = false;
        }
    }

    onTouchStart(e){
        let touch = e.touches[0];
        this.state.pageY = touch.pageY;
    }

    onTouchMove(e){
        this.preventDefault(e);
        let touch = e.touches[0] || e.targetTouches[0];
        let dtY = touch.pageY - this.state.pageY;
        let onDirection = this.props.onDirection;
        onDirection && onDirection(dtY > 0 ?"down":"up");
    }

    preventDefault(e) {
        e.stopPropagation();
    }

    render() {
        let className = this.props.className != null ? this.props.className : "app-content fx-tab bg-white";
        let style = this.state.style;
        let useLoading = this.props.useLoading === false ? false : true;
        let loadingText = this.props.loadingText || "加载中...";
        let children: any = this.props.children;
        let useEmptyTips = this.props.useEmptyTips || false;
        return (
            <div
                className={className}
                style={style}
                onScroll={this.scrollHandler.bind(this)}
                onTouchMove={this.onTouchMove.bind(this)}
                onTouchStart={this.onTouchStart.bind(this)}
            >
                <div id="_list_wrap_">
                    {(() => {
                        if (useEmptyTips) {
                            return (
                                <div className="mod-end">
                                    <p>{this.props.emptyTips || "暂无数据"}</p>
                                </div>
                            )
                        } else {
                            return children
                        }
                    })()}

                    {(() => {
                        if (useLoading && children.length != 0) {
                            return (
                                <div className="mod-end">
                                    <p>{loadingText}</p>
                                </div>
                            )
                        }
                    })()}
                </div>
            </div>
        )

    }
}
