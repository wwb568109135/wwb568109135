/**
 * Created by roger on 16/6/23.
 */
import { Component } from "react";
import PromotionInfo = serverApi.promotion.PromotionInfo;

interface Props extends PromotionInfo {
    isInPromotionTime: boolean;
}

export default class ProductItem extends Component<Props, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            productName, productBrandId, photoIdList, priceId, price, priceMart,
            virtualRemainCount, maxCountPerUser, isInPromotionTime } = this.props;
        const count = Math.min(2, maxCountPerUser, virtualRemainCount);
        const canBuy = (count > 0 && isInPromotionTime);
        const isSecKill = true;

        const picNode =
            <div className="pic">
                <img src={util.getImgSrc(photoIdList[0] || productBrandId, "272x272")} alt={productName}/>
                {count <= 0 ? <span className="icon-sold"><i>已售罄</i></span> : ""}
            </div>;
        const detailNode =
            <div className="details">
                <h3 className="title">{productName}</h3>
                <div className="goods-price">
                    <span className="now">￥{price}</span>
                    <del>￥{priceMart}</del>
                </div>
                <span
                    className={canBuy ? "icon-grab" : "icon-grab disabled"}>抢!</span>
            </div>;
        const iconNode = isSecKill ? <div className="icon-seckill"><i>秒杀商品</i></div> : "";

        return (<li>
            {
                canBuy ?
                    <Link to={`/product/detail?priceId=${priceId}`}>
                        {picNode}
                        {detailNode}
                        {iconNode}
                    </Link> : <a>{picNode}{detailNode}{iconNode}</a>
            }
        </li>);

    }
}
