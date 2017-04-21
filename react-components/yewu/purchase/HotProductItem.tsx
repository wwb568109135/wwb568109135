/**
 * Created by roger on 16/6/27.
 */
import { Component } from "react";
import sales = serverApi.sales;

export default class HotProductItem extends Component<sales.list_hot_product.Item, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li>
                <Link to={`/product/detail?priceId=${this.props.priceId}`}>
                    <div className="pic">
                        <img src={util.getImgSrc(this.props.photoIdList[0], "272x272")} alt={this.props.productName} />
                    </div>
                    <div className="cont">
                        <h3 className="title">{this.props.productName}</h3>
                        <div className="now-price">￥{util.price(this.props.price)}
                            <del>￥{util.price(this.props.priceMart)}</del>
                        </div>
                        <div>
                            {
                                this.props.canOfferInvoice ? <span className="label">自营</span> : ""
                            }
                            {
                                this.props.hasTyreInsurance ? <span className="label">轮胎保</span> : ""
                            }
                        </div>
                        <div className="light">库存：{this.props.virtualRemainCount > 0 ? `${this.props.virtualRemainCount}个` : "缺货"}</div>
                    </div>
                </Link>
            </li>
        );
    }
}
