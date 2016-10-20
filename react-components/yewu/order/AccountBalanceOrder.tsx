import {Component} from "react";
import {Alert} from "../common/Modal";
import * as api from "./../../api";

interface data {
    jinge?:number,
    isCur:boolean
}

interface Props {
    data:data,
    isShow:boolean,
    onCurAccountBalanceFn:(data)=>void,
    sub?:string,
    current?:string,
    subUrl?:string
}
export default class AccountBalanceOrder extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        isShow: false
    }

    clickAccountBalanceBtn(clickdata) {
        log("组件：clickAccountBalanceBtn");
        api.common.setFillOrderSession({
            key:"useWallet",
            val: clickdata.isCur
        }).then(rv=>{
            if(rv.success){
                this.props.onCurAccountBalanceFn(clickdata)
            }else{
                Alert("保存余额选择信息，服务异常，请稍后再试！")
            }
        })
    }

    render() {
        // debugger
        let checkClassName = this.props.data.isCur ? "blue iconfont icon-check" : "";
        let clickdata = {
            jinge: this.props.data.jinge,
            isCur: this.props.data.isCur
        }
        if (!this.props.isShow) {
            return <li title="使用账户余额抵扣" style={{ display: "none" }}></li>
        }
        let yuan = (this.props.data.jinge/100).toFixed(2);

        return (
            <li onClick={this.clickAccountBalanceBtn.bind(this,{
                jinge: this.props.data.jinge,
                isCur: !this.props.data.isCur
            })}>
                使用账户余额抵扣（¥{yuan}）
                <span className="fr">
                    <i className={checkClassName}/>
                </span>
            </li>
        )
    }
}
