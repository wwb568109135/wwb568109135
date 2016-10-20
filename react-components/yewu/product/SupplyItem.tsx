import {Component} from "react";

interface Props {
    // 专属供应列表项
    typeItem?: any
}

export default class SupplyListItem extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        typeItem: []
    }

    render() {
        let typeItem = this.props.typeItem;

        return (
            <div>
                {
                    typeItem.length > 0 ? typeItem.map((item1, index1) => {
                        return <div key={'item1-' + index1} className="mod-box-list">
                            <h3 className="box-hd">{item1.productName}</h3>
                            <ul className="mod-art-list">
                                {
                                    item1.items.map((item2, index2) => {
                                        return <Link to={`/product/supplyList?type=${item1.productType}&supplyId=${item2.supplyId}`}><li key={'item2-' + index2}>
                                            <h4>{item2.supplyName}</h4>
                                            {
                                                item2.product.map((item3, index3) => {
                                                    return <p key={'item3-' + index3} className="light">【销量】{item3.productName} 卖出{item3.salesCount}个</p>
                                                })
                                            }
                                        </li></Link>
                                    })
                                }
                            </ul>
                        </div>
                    }) : "暂无专属供应"
                }
            </div>
        )
    }
}
