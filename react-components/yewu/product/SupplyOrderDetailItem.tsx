import {Component} from "react";

interface Props {
    // 商品名称
    productName: string,
    // 商品图片
    logo: string,
    // 购买数量
    buyCount: number,
    // 剩余数量
    remainCount?: number,
    // 报价
    quotePrice?: number
}

export default class SupplyOrderListItem extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        productName: "",
        logo: "",
        buyCount: 0,
        remainCount: 0,
        quotePrice: 0,
    }

    render() {
        let productName = this.props.productName;
        let logo = this.props.logo;
        let buyCount = this.props.buyCount;
        let remainCount = this.props.remainCount;
        let quotePrice = this.props.quotePrice;

        return (
            <li>
                <div className="pic"><img src={logo} alt /></div>
                <div className="cont">
                    <h3 className="title">
                        {
                            remainCount < buyCount ? <span className="highlight"> (缺货中)</span> : ""
                        }{productName}
                    </h3>
                    {
                        quotePrice ? <div className="now-price">￥{util.price(quotePrice/100)}</div> : <div className="now-price">￥？</div>
                    }
                    <div className="light">x{buyCount}</div>
                </div>
            </li>
        )
    }
}
