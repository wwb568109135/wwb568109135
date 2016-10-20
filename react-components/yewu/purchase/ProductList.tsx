import {Component} from "react";

interface Props {
    // 商品清单
    itemList:any
    // 是否自营
    canOfferInvoice:boolean
}

export default class ProductList extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        itemList: [],
        canOfferInvoice: false
    };

    render() {
        let itemList = this.props.itemList;
        let tagsMap = {
            "selfrun":"自营",
            "tyreinsurance":"轮胎保"
        }

        return (
            <div className="mod-box-list">
                <h3 className="details-hd blue">商品清单</h3>
                <div className="mod-pic-list">
                    <ul>
                        {
                            itemList.map((item, index) => {
                                let priceId = item.priceId || "";
                                //let photo = item.photoIdList[0] || "";
                                let productName = item.productName || "";
                                let pricePerUnit = util.price(item.pricePerUnit/100) || 0;
                                let count = item.count || 0;
                                let tags = item.tags || [];

                                return (
                                    <li key={'productItem-' + index}>
                                        <Link to={`/product/detail?priceId=${priceId}`}>
                                            <div className="pic"><img src={`${util.getImgSrc(item.photoIdList,'272x272')}`} alt="" /></div>
                                            <div className="cont">
                                                <h3 className="title">{productName}</h3>
                                                <div className="now-price">￥{pricePerUnit}</div>
                                                {(() => {
                                                    if(tags.length > 0) {
                                                        return <div>{
                                                            tags.map((tag, i) => {
                                                                return <span key={tag} className="label">{tagsMap[tag]}</span>
                                                            })
                                                        }</div>
                                                    }
                                                })()}
                                                <div className="light">x{count}</div>
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
