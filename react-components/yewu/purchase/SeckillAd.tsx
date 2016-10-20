/**
 * Created by roger on 16/7/5.
 * Modified by Cc on 16/7/27.
 */
import * as api from "../../api";
import {Component} from "react";
import Timer from "../common/Timer";
import list_seckill_promotions = serverApi.promotion.list_seckill_promotions;
import Message from "../common/Message";

export default class SeckillAd extends Component<list_seckill_promotions.Response, {}> {

    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.errorId) return (<Message content={this.props.errorDesc}/>);
        if(this.props.totalCount == 0) {
            return (
                <div className="index-seckill">
                    {
                        this.props.imgSrc ? <Link to={this.props.href}><img src={this.props.imgSrc} alt /></Link> : null
                    }
                </div>
            );
        } else {
            return <div className="index-seckill-goods">
                <div className="seckill-hd">
                    <i className="system-title icon-seckill" />
                    <div className="seckill-clock">
                        <span className="num"><Timer leftMs={this.props.leftMs} layout="HH"/></span><span style={{"color": "#333"}}>:</span>
                        <span className="num"><Timer leftMs={this.props.leftMs} layout="mm"/></span><span style={{"color": "#333"}}>:</span>
                        <span className="num"><Timer leftMs={this.props.leftMs} layout="ss"/></span>
                    </div>
                    <Link className="highlight fr fss" to="/seckill">更多特价<i className=" iconfont icon-arrowright" /></Link>
                </div>
                <div className="seckill-bd">
                    <div className="scroll-x">
                        <ul className="mod-pic-list-s2" style={{"width": (this.props.itemList.length * 100) + "%"}}>
                            {
                                this.props.itemList.map((item, index) => {
                                    return <li key={"item" + index}>
                                        <Link to={"/product/detail?priceId=" + item.priceId}>
                                            <div className="pic">
                                                <img src={util.getImgSrc(item.photoIdList[0], "600x600")} alt />
                                                <i className="brand">{item.productBrandName}</i>
                                            </div>
                                            <h3 className="light">{item.productName}</h3>
                                            <div className="now-price">￥{(item.price - item.subsidy).toFixed(2)}</div>
                                        </Link>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        }
    }
}
