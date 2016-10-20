/**
 * Created by roger on 16/6/27.
 */
import { Component } from "react";
import * as api from "../../api";
import * as promise from "promise";

const SUPPLY_MSG = "supply_msg";
export default class QuickNavList extends Component<{hasPromotion: boolean}, {showSupply: boolean}> {
    constructor(props) {
        super(props);
        const showSupplyMsg = JSON.parse(localStorage.getItem(SUPPLY_MSG) || "{}");

        this.state = {
            showSupply: showSupplyMsg.showSupply
        };
    }

    componentWillMount() {
        return api.exclusive.overview().then((res) => {
            if (!res.errorId && res.itemList && res.itemList.length > 0) {
                localStorage.setItem(SUPPLY_MSG, JSON.stringify({showSupply:true, t: +new Date()}));
                if (!this.state.showSupply) {
                    this.setState({showSupply: true});
                }
                return;
            }

            localStorage.setItem(SUPPLY_MSG, JSON.stringify({showSupply:false, t: +new Date()}));
            if (this.state.showSupply) {
                this.setState({showSupply: false});
            }
        });
    }

    render() {
        return (
            <div className="quick-nav">
                <ul>
                    <li>
                        <Link to="/cart">
                            <i className="icon icon-cart"/>
                            购物车
                        </Link>
                    </li>
                    <li>
                        <Link to="/purchase/orderList">
                            <i className="icon icon-order"/>
                            采购订单
                        </Link>
                    </li>
                    <li>
                        <Link to="/invoice">
                            <i className="icon icon-seckill"/>
                            发票
                        </Link>
                    </li>
                    {/*
                        this.props.hasPromotion ?
                            <li>
                                <Link to="/promotion">
                                    <i className="icon icon-seckill"></i>
                                    秒杀专区
                                </Link>
                            </li> : ""
                    */}
                    {
                        this.state.showSupply ?
                            <li>
                            <Link to="/product/supply">
                                <i className="icon icon-bill"></i>
                                专属供应
                            </Link></li> : ""
                    }
                    <li>
                        <Link to="/coupon">
                            <i className="icon icon-coupon"/>
                            优惠券
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }
}
