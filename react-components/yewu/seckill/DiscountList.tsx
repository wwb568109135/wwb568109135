import {Component} from "react";
import * as api from "../../api";
import Toast from "../common/Toast";
import RemindBtn from "./RemindBtn";
import {isEqual} from "lodash";

interface States {
    itemList?: Array<serverApi.promotion.PromotionInfo>,
    stateChangeTrigger?: boolean
}

export default class DiscountList extends Component<any, States> {
    constructor(props) {
        super(props);
        this.state = {
            itemList: [],
            stateChangeTrigger: true
        }
    }

    onItemListChanged(index:number, reservationId:string) {
        this.state.itemList[index]["reservationId"] = reservationId;
        this.setState({
            stateChangeTrigger: !this.state.stateChangeTrigger
        });
    }

    // 子节点事件中的e.stopPropagation()对父节点的href不起作用，因此通过onClick方法来进行跳转
    goToProductDetail(href:string) {
        util.gotoUrl(href);
    }

    componentWillReceiveProps(nextProps) {
        // log("%clog", "background: red", this.props);
        // log("%clog", "background: green", nextProps);
        if(!isEqual(nextProps.itemList, this.props.itemList)) {
            this.setState({
                itemList: nextProps.itemList
            })
        }
    }

    render() {
        let temp;
        if(this.state.itemList.length > 0) {
            temp = this.state.itemList.map((item, index) => {

                if(!util.getParam("time")) {
                    return <li key={"item" + index}>
                        <a href="javascript:;" onClick={this.goToProductDetail.bind(this, "/product/detail?priceId="+item.priceId)}>
                            <div className="pic">
                                <img src={util.getImgSrc(item.photoIdList[0], "600x600")} alt />
                            </div>
                            <div className="details">
                                <h3 className="title">{item.productName}</h3>
                                <div className="goods-price">
                                    {
                                        item.promotionRemainCount > 0 ? <span className="mod-btn highlight small fr">抢购</span> : <span className="mod-btn disabled small fr">抢光</span>
                                    }
                                    <p className="now">￥{item.price - item.subsidy}
                                        {
                                            item.extraInfo && item.extraInfo.bottles ? <span className="count">（¥{(item.price - item.subsidy) / item.extraInfo.bottles}×{item.extraInfo.bottles}）</span> : null
                                        }
                                    </p>
                                    <del>￥{item.priceMart}</del>
                                </div> 
                            </div>
                        </a>
                    </li>
                } else {
                    return <li key={"item" + index} className="no-active" style={{"minHeight": "auto"}}>
                        <div className="pic">
                            <img src={util.getImgSrc(item.photoIdList[0], "600x600")} alt />
                        </div>
                        <div className="details">
                            <h3 className="title">{item.productName}</h3>
                        </div>
                    </li>
                }
            })
        } else {
            temp = <li style={{"width": "98%", "minHeight": "auto"}}>
                <div className="mod-end">
                    <p>该品牌下暂无商品</p>
                </div>
            </li>
        }

        return (
            <div className="mod-pic-box">
                {(() => {
                    let container;
                    if(this.props.hasBrands) {
                        this.props.isLoading ? container = <div className="mod-end" style={{"margin": "0", "padding": ".6rem 0"}}>
                            <p>加载中...</p>
                        </div> : container = <ul className="pic-list">{temp}</ul>;
                        return container;
                    } else {
                        return null;
                    }
                })()}
            </div>
        )
    }
}
