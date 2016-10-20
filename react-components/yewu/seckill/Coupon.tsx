import {Component} from "react";
import * as api from "../../api";
import Toast from "../common/Toast";
import {render} from "react-dom";

interface States {
    isCouponListShow?: boolean,
    couponList?: Array<serverApi.shop.coupon.coupon_item>,
    stateChangeTrigger?: boolean
}

export default class Coupon extends Component<serverApi.shop.coupon.list_coupon_by_promotion.Response, States> {
    constructor(props) {
        super(props);
        this.state = {
            isCouponListShow: false,
            couponList: this.props.couponList,
            stateChangeTrigger: true
        }
    }

    onCouponListShow() {
        this.setState({
            isCouponListShow: true
        })
    }
    onCouponListHide() {
        this.setState({
            isCouponListShow: false
        });
    }
    handleCouponList(e) {
        if(e.target.id == "couponList") {
            this.onCouponListHide();
        }
    }

    getCoupon(item:serverApi.shop.coupon.coupon_item, index:number) {
        api.shop.coupon.pick_up({
            /**优惠券类型Id*/
            "couponDefineId": item.couponDefineId,
            /**优惠券ID*/
            "couponItemId": item.couponItemId
        }).then(res => {
            if (!res.errorId) {
                item.couponState = "PICKED";
                this.state.couponList[index] = item;
                this.setState({
                    stateChangeTrigger: ! this.state.stateChangeTrigger
                });

                Toast("领取成功", 2000)
            } else {
                Toast(<span>{res.errorDesc}</span>, 2000)
            }
        })
    }

    getCouponList() {
        let dialogBox = document.getElementById('_dialogBox_');
        if (!dialogBox) {
            dialogBox = document.createElement("span");
            dialogBox.id = "_dialogBox_";
            document.getElementById("root").firstChild.appendChild(dialogBox);
        }
        let couponListClsName:string = "mod-pop-box pop-bottom hide";
        if(this.state.isCouponListShow) {
            couponListClsName = "mod-pop-box pop-bottom"
        }

        render(<div id="couponList" className={couponListClsName} onClick={this.handleCouponList.bind(this)}>
            <div className="pop-inner fadeInUp">
                <div className="pop-hd">
                    <a href="javascript:;" className="iconfont icon-close fl" onClick={this.onCouponListHide.bind(this)} />
                    <h3>领券</h3>
                </div>
                <div className="pop-bd">
                    <div className="mod-coupon coupon-center">
                        <ul>
                            {
                                this.state.couponList.map((item, index) => {
                                    {/*
                                        优惠券领取状态 PICKED: 已领取 | UNPICKED: 未领取 | LACK: 已派发完毕(抢完)
                                        */}
                                    let couponStateClsName:string = "";
                                    if (item.couponState == "LACK") {
                                        couponStateClsName = "off"
                                    } else if (item.couponState == "PICKED") {
                                        couponStateClsName = "get"
                                    }

                                    return <li key={"item" + index} className={couponStateClsName}>
                                        <div className="coupon-box">
                                            <div className="price">
                                                <p>¥<strong>{util.cents(item.couponAmount)}</strong></p>
                                                <p>{item.ruleMap.couponRuleShortDesc ? item.ruleMap.couponRuleShortDesc : null}</p>
                                            </div>
                                            <div className="info">
                                                {
                                                    item.ruleMap.couponRuleDescList.map((itemDesc, indexDesc) => {
                                                        return <p key={"itemDesc" + indexDesc}>{itemDesc}</p>
                                                    })
                                                }
                                                <p>{util.date(item.expireTimeStamp, "yyyy.MM.dd")} 到期</p>
                                            </div>
                                            {/*
                                                优惠券领取状态 PICKED: 已领取 | UNPICKED: 未领取 | LACK: 已派发完毕(抢完)
                                                */}
                                            {(() => {
                                                if (item.couponState == "UNPICKED") {
                                                    return (
                                                        <div className="tag"><a href="javascript:;" onClick={this.getCoupon.bind(this, item, index)}>点击领取</a></div>
                                                    )
                                                } else if (item.couponState == "PICKED") {
                                                    return (
                                                        <div className="tag">
                                                            <i className="iconfont icon-check2" /><br />
                                                            <em>已经领取</em>
                                                        </div>
                                                    )
                                                } else if (item.couponState == "LACK") {
                                                    return (
                                                        <div className="tag">
                                                            <i className="iconfont icon-cry" /><br />
                                                            <em>已派抢完</em>
                                                        </div>
                                                    )
                                                }
                                            })()}
                                        </div>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        , dialogBox);
    }

    componentDidUpdate() {
        this.getCouponList();
    }

    render() {
        let wrapClsName:string = "box-hd goods-coupon";
        if(this.state.couponList.length <= 0) {
            wrapClsName = "box-hd goods-coupon hide"
        }

        return (
            <div className={wrapClsName} onClick={this.onCouponListShow.bind(this)}>
                <a href="javascript:;">
                    <i className="iconfont icon-arrowright fr" />
                    <label className="mrl">领券</label>
                    {
                        this.state.couponList.map((item, index) => {
                            if(index < 2) {
                                let text:string;
                                if(item.ruleMap.reachAmount) {
                                    text = "满" + util.cents(item.ruleMap.reachAmount) + "减" + util.cents(item.couponAmount)
                                } else {
                                    text = "减" + util.cents(item.couponAmount)
                                }
                                return <span className="card" key={"item" + index}>{text}</span>
                            } else {
                                return null;
                            }
                        })
                    }
                </a>
            </div>
        )
    }
}
