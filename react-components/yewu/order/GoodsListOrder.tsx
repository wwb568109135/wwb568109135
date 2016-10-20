
import { Component} from 'react'




interface Props {
    // sub?: string,
    isUpdateGood: boolean,
    data: any

}
export default class GoodsListOrder extends Component<Props, any> {
    constructor(props) {
        super(props);
        // this.initState({
        // 	productStar:0
        // });
    }
    godetail(id){
        // util.gotoUrl("/product/detail?id="+id)
    }
    render() {
        // if (!this.props.islogin ) {
        //     util.gotoUrl("/login")
        //     return
        // }
        let good = this.props.data ? this.props.data : [];
        return (
            <div>
                <div style={{display:good.length == 0 ? "none":"block"}} className="mod-box-list">
                    <h3 className="details-hd blue">
                        商品清单
                        <a href="/cart" style={{
                            display: this.props.isUpdateGood ? "inline":"none",
                            paddingLeft:"20px"
                        }}>
                            修改
                        </a>
                    </h3>
                    <div className="mod-pic-list">
                        <ul>
                            {
                                good.map((data,index) => {
                                    return (
                                        <li key={index} onClick={this.godetail.bind(this,data.commonInfo.productId)}>
                                            <a href="javascript:void(0)" className="pic">
                                                <img src={util.getImgSrc(data.commonInfo.photoIdList[0] ,"272x272")} />
                                            </a>
                                            <div className="cont">
                                                <h3 className="title">
                                                    <a href="javascript:void(0)">{data.commonInfo.productName}</a>
                                                </h3>
                                                {(()=>{
                                                    if(util.getParam("consultPriceId") == "" ){
                                                        return (
                                                            <div className="now-price">￥{data.priceInfo2B.price}</div>
                                                        )
                                                    }else{
                                                        return (
                                                            <div className="now-price">￥{data.quotePrice}</div>
                                                        )
                                                    }
                                                })()}
                                                <div className="light">x{data.count}</div>
                                            </div>
                                        </li>
                                    )
                                })
                            }

                        </ul>
                    </div>
                </div>
                {this.props.children}
            </div>
        )
    }
}
