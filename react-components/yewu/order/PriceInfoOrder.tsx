import {Component} from "react";

interface Props {
    data: {
        shangpinJine?:number,
        // zitiYouhui?:number,
        youhuiJuan?:number,
        isYouhuiJuan?:boolean,
        // zhifuYouhui?:number,
        // isZhifuYouhui?:boolean,
        zhanghuJine?:number,
        isZhanghuJine?:boolean
    },
    sub?:string,
    current?:string,
    subUrl?:string
}
export default class PriceInfoOrder extends Component<Props, any> {
    constructor(props) {
        super(props);
        // this.initState({
        // 	productStar:0
        // });
    }

    // <li style={{ display: this.props.data.isZhifuYouhui ? "block":"none" }}>支付优惠：<span
    //     className="fr blue">-¥{this.props.data.zhifuYouhui}</span></li>

    // <li style={{ display: "none" }}>自提优惠：<span
    // className="fr blue">-¥{this.props.data.zitiYouhui}</span></li>
    render() {

        let zhanghuJine:any;
        let youhuiJuan:any;
        let shangpinJine = this.props.data.shangpinJine*100; //分　

        if( this.props.data.isYouhuiJuan ){
            if( this.props.data.youhuiJuan  >=  shangpinJine  ){
                youhuiJuan = shangpinJine;
            }else{
                youhuiJuan = this.props.data.youhuiJuan　
            }
        }else{
            youhuiJuan = 0;
        }

        if( this.props.data.isZhanghuJine ){
            if( youhuiJuan  >=  shangpinJine  ){
                youhuiJuan = shangpinJine;
                zhanghuJine = 0;
            }else{

                if( this.props.data.zhanghuJine + youhuiJuan >= shangpinJine ){
                    zhanghuJine = shangpinJine - youhuiJuan;
                }else{
                    zhanghuJine = this.props.data.zhanghuJine;
                }
            }
        }

        if(youhuiJuan == 0){
            youhuiJuan = "0.00"
        }else{
            youhuiJuan = (this.props.data.youhuiJuan /100).toFixed(2);
        }

        if(zhanghuJine == 0){
            zhanghuJine = "0.00"
        }else{
            zhanghuJine = (zhanghuJine /100).toFixed(2);
        }

        shangpinJine = this.props.data.shangpinJine;
        
        return (
            <div>
                <div className="mod-checklist">
                    <ul>
                        <li>商品金额：<span className="fr highlight">¥{shangpinJine}</span></li>
                        <li style={{ display: this.props.data.isYouhuiJuan ? "block":"none" }}>优惠券：<span
                            className="fr blue">-¥{youhuiJuan}</span></li>
                        <li style={{ display: this.props.data.isZhanghuJine ? "block":"none" }}>账户金额：<span
                            className="fr highlight">-¥{zhanghuJine}</span></li>
                    </ul>
                </div>
                {this.props.children}
            </div>
        )
    }
}
