import {Component} from "react";
import {Alert} from "../common/Modal";

interface data {
    jinge?:number,
    name?:string,
    info?:string
}

interface Props {
    data:[data],
    onShowPopCouponFn:()=>void,
    isShow?:boolean,
    index?:number,

}

export default class CouponShowOrder extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    clickShow(data) {
        // Alert("clickShow")
        log("clickShow-data")
        log(data)
        this.props.onShowPopCouponFn()
    }
    render() {
        let couponData = this.props.data;

        if ( couponData.length == 0 ) {
            return <li title="使用优惠券抵扣" style={{ display: "none" }}></li>
        }
        let data:any = this.props.data;
        let index = this.props.index;
        let couponAmount;
        if(index == -1 ){
            couponAmount = "请选择优惠券," + couponData.length + "张可用"
        }else{
            couponAmount = "抵扣 ￥"+ (data[index].couponAmount /100).toFixed(2)
        }
        // {couponData != "" ? "已抵扣"+couponData.jinge+"元" :"" }
        return (
            <li style={{ display: this.props.isShow ? "block":"none" }}>
                <a href="javascript:void(0)" onClick={this.clickShow.bind(this,this.props.data)}>优惠券
                    <span className="fr">
                        { couponAmount}
                        <i className="iconfont icon-arrowright" />
                    </span>
                </a>
            </li>
        )
    }
}
