import {Component} from "react";
import {Alert} from "../common/Modal";

interface Props {
    data:{
        type?:number,
        name?:string,
        text?:string
    },
    onShowPopPayFn:()=>void,
    isWxShow?: boolean,

    subUrl?:string
}
export default class PayWayOrder extends Component<Props, any> {
    constructor(props) {
        super(props);
        // this.initState({
        // 	productStar:0
        // });
    }

    // static defaultProps = {
    //     isShow: false
    // }

    clickShow(data) {
        // Alert("clickShow")
        log("clickShow-data")
        log(data)
        // if(!this.props.isWxShow){
            this.props.onShowPopPayFn()
        // }else{
        //     log("微信环境下，不弹出POP")
        // }
    }

    render() {
        return (
            <div>
                <div className="mod-link-list separation">
                    <ul onClick={this.clickShow.bind(this,this.props.data)}>
                        <li>
                            <a href="javascript:void(0)">
                                支付方式
                                <span className="fr">
                                    {this.props.data.text ? this.props.data.text :"请选择支付方式"}
                                    <i className="iconfont icon-arrowright"/>
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
                {this.props.children}
            </div>
        )
    }
}
