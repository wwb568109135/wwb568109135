import {Component} from "react";
import * as api from "../../api";
import Toast from "../common/Toast";
import RemindBtn from "./RemindBtn";

interface States {
    itemList?: Array<serverApi.promotion.PromotionInfo>,
    stateChangeTrigger?: boolean
}

export default class List extends Component<serverApi.promotion.list_seckill_promotions.Response, States> {
    constructor(props) {
        super(props);
        this.state = {
            itemList: this.props.itemList,
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

    render() {
        return (
            <div className="mod-pic-list">
                <ul>
                    {
                        this.state.itemList.map((item, index) => {
                            let canBuyCnt = Math.min(item.promotionRemainCount, item.virtualRemainCount);
                            canBuyCnt = canBuyCnt < 0 ? 0 : canBuyCnt;

                            if(!util.getParam("time")) {
                                if(canBuyCnt > 0) {
                                    return <li key={"item" + index}>
                                        <a href="javascript:;" onClick={this.goToProductDetail.bind(this, "/product/detail?priceId="+item.priceId)}>
                                            <div className="pic">
                                                <img src={util.getImgSrc(item.photoIdList[0], "600x600")} alt />
                                                {(() => {
                                                    if(item.weight >= 19000 && item.weight <= 20000) {
                                                        return <i className="icon-prize"></i>
                                                    } else if(item.weight >= 18000 && item.weight < 19000) {
                                                        return <i className="icon-prize silver"></i>
                                                    } else if(item.weight >= 17000 && item.weight < 18000) {
                                                        return <i className="icon-prize silver copper"></i>
                                                    }
                                                })()}
                                            </div>
                                            <div className="cont">
                                                <h3 className="title">{item.productName}</h3>
                                                <div className="now-price ellipsis">￥{(item.price - item.subsidy).toFixed(2)}
                                                    {
                                                        item.extraInfo && item.extraInfo.bottles ? <span className="count">（¥{(item.price - item.subsidy) / item.extraInfo.bottles}×{item.extraInfo.bottles}）</span> : null
                                                    }
                                                </div>
                                                <div className="light">{(() => {
                                                    let discount = Math.round((item.price - item.subsidy) / item.priceMart * 100) / 10;
                                                    if(discount > 9.9) {
                                                        discount = 9.9
                                                    }
                                                    return <span className="label">{discount}折</span>
                                                })()}<del>￥{item.priceMart.toFixed(2)}</del></div>
                                                <div className="progress-bar">
                                                    <progress value={canBuyCnt} max={item.promotionCount} />
                                                    <span className="lightgray fss">剩余{canBuyCnt}件</span>
                                                </div>
                                                <span className="mod-btn highlight small">抢购</span>
                                            </div>
                                        </a>
                                    </li>
                                } else {
                                    return <li key={"item" + index} className="no-active">
                                        <div className="pic">
                                            <img src={util.getImgSrc(item.photoIdList[0], "600x600")} alt />
                                            {(() => {
                                                if(item.weight >= 19000 && item.weight <= 20000) {
                                                    return <i className="icon-prize"></i>
                                                } else if(item.weight >= 18000 && item.weight < 19000) {
                                                    return <i className="icon-prize silver"></i>
                                                } else if(item.weight >= 17000 && item.weight < 18000) {
                                                    return <i className="icon-prize silver copper"></i>
                                                }
                                            })()}
                                        </div>
                                        <div className="cont">
                                            <h3 className="title">{item.productName}</h3>
                                            <div className="now-price ellipsis">￥{(item.price - item.subsidy).toFixed(2)}
                                                {
                                                    item.extraInfo && item.extraInfo.bottles ? <span className="count">（¥{(item.price - item.subsidy) / item.extraInfo.bottles}×{item.extraInfo.bottles}）</span> : null
                                                }
                                            </div>
                                            <div className="light">{(() => {
                                                let discount = Math.round((item.price - item.subsidy) / item.priceMart * 100) / 10;
                                                if(discount > 9.9) {
                                                    discount = 9.9
                                                }
                                                return <span className="label">{discount}折</span>
                                            })()}<del>￥{item.priceMart.toFixed(2)}</del></div>
                                            <div className="progress-bar">
                                                <progress value={canBuyCnt} max={item.promotionCount} />
                                                <span className="lightgray fss">剩余{canBuyCnt}件</span>
                                            </div>
                                            <span className="mod-btn disabled small">抢光</span>
                                        </div>
                                    </li>
                                }
                            } else {
                                return <li key={"item" + index} className="no-active">
                                    <div className="pic">
                                        <img src={util.getImgSrc(item.photoIdList[0], "600x600")} alt />
                                    </div>
                                    <div className="cont">
                                        <h3 className="title">{item.productName}</h3>
                                        <div className="light no-started">未开始</div>
                                        <RemindBtn item={item} callbackParent={this.onItemListChanged.bind(this, index)}/>
                                    </div>
                                </li>
                            }
                        })
                    }
                </ul>
            </div>
        )
    }
}
