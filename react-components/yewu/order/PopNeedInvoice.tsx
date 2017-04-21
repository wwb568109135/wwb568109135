import {Component} from "react";
import * as api from "./../../api";
import {Alert} from "../common/Modal";

interface state {
    display: boolean
}

interface Props {
    needInvoice: boolean,
    onSetNeedInvoice:(needInvoice:boolean) => void,
}

export default class PopNeedInvoice extends Component<Props, any> {
    constructor(props) {
        super(props);
        this.state = {
            display: false
        };
    }
    static defaultProps = {
        needInvoice: false
    }
    show() {
        this.setState({
            display: true
        })
    }
    hide() {
        this.setState({
            display: false
        })
    }
    componentDidMount() {
        Common.Event.subscribe("showNeedInvoice", (data) => {
            if (data.isShow) {
                this.show();
            } else {
                this.hide();
            }
        })
    }
    componentWillUnmount() {
        Common.Event.unsubscribe("showNeedInvoice")
    }

    setNeedInvoice(needInvoice) {
      if(needInvoice!=this.props.needInvoice&&this.props.onSetNeedInvoice){
        this.props.onSetNeedInvoice(needInvoice);
      }
      this.hide();
    }

    render() {
        return (
            <div className={this.state.display ? "mod-pop-box pop-bottom" : "mod-pop-box pop-bottom hide"}>
                <div className="pop-inner">
                    <div className="pop-hd">
                        <a href="javascript:void(0)" onClick={this.hide.bind(this) }
                            className="iconfont icon-close fl"/>
                        <h3>发票信息</h3>
                    </div>
                    <div className="pop-bd">
                        <div className="mod-link-list">
                            <ul>
                                <li  onClick={this.setNeedInvoice.bind(this, false) }>
                                    <a href="javascript:void(0)">
                                        不开具发票
                                        <i className={this.props.needInvoice? "":"iconfont icon-check"} />
                                    </a>
                                </li>
                                <li  onClick={this.setNeedInvoice.bind(this, true) }>
                                    <a href="javascript:void(0)">
                                        开发票
                                        <i className={this.props.needInvoice? "iconfont icon-check" : ""} />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
