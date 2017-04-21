import {Component} from "react";
import { clearCart } from '../../actions/cart';
import ProductCounter from './ProductCounter';
import { Confirm } from '../common/Modal';

interface props {
    itemList: {
        priceId: string;
        productId: string;
        productName: string;
        logo: string;
        remainCount: number;
        buyCount: number;
        price: number;
    }[]
}

interface state {
    display: string
}


export default class PopCartList extends Component<props, any> {
    constructor(props) {
        super(props);
    }

    state = {
        display: 'none'
    }

    static defaultProps = {
        itemList: []
    }
    show() {
        this.setState({
            display: 'block'
        })
    }
    hide() {
        this.setState({
            display: 'none'
        })
    }
    clearCartAction = Common.proxyAction(this, clearCart, 'clearCart')
    static mapDispatchToProps = {
        clearCart: clearCart
    }
    clearCart() {
        Confirm({
            title:"提示",
            content:"你确定要清空购物车吗？",
            btnText:["取消","确定"],
            onOk:() => {
                this.clearCartAction();
            }
        });
    }
    componentDidMount() {
        Common.Event.subscribe("showPopCartList", (data) => {
            if (data.isShow) {
                this.show();
            } else {
                this.hide();
            }
        })
    }
    componentWillUnmount() {
        Common.Event.unsubscribe("showPopCartList")
    }
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.itemList.length == 0) {
    //         this.hide();
    //     }
    // }
    itemList(item, index) {
        return (
            <li key={index}>
                <div className="cont">
                    <h3 className="title">
                        <a>
                            {item.productName}
                        </a>
                    </h3>
                    <div className="amount-box">
                        <ProductCounter product={item} count={item.buyCount}/>
                        <div className="now-price">￥{item.price}</div>
                    </div>
                </div>
            </li>
        )
    }
    lockWin(e){
        if(this.props.itemList.length > 3){
            return
        }
		e.preventDefault();
		e.stopPropagation();
	}

    render() {

        return (
            <div className="mod-pop-box pop-bottom pop-cart" style={{ display: this.state.display }} onTouchMove={this.lockWin.bind(this)}>
                <div className="pop-inner">
                    <div className="pop-hd">
                        <a onClick={this.hide.bind(this) } className="iconfont icon-close fl" />
                        {
                            this.props.itemList.length > 0 ?
                            <a onClick={this.clearCart.bind(this) } className="fr">
                                <i className="iconfont icon-delete" />
                                清空购物车
                            </a>: ''
                        }
                    </div>
                    {
                        this.props.itemList.length > 0 ?
                            <div className="pop-bd">
                                <div className="mod-pic-list">
                                    <ul>
                                        {
                                            this.props.itemList.map((item, index) => (
                                                this.itemList(item, index)
                                            ))
                                        }
                                    </ul>

                                </div>
                            </div> :
                            <div className="pop-bd">
                                <div className="no-coupon-bg"></div>
                                <p className="center fsxl mbl">购物车为空</p>
                            </div>
                    }

                </div>
            </div>


        )
    }
}
