import {Component} from "react";
import { addToCart } from '../../actions/cart'
import { addToExclusiveCart } from '../../actions/exclusiveCart'
import toast from '../../components/common/Toast'
import AddCarEffect from '../../components/common/AddCarEffect'

interface Props {
    item:any,
    onChange?:any,
    count?:number,//数量
    useCart?:boolean,//是否加入购物车
    useProgress?:boolean,//是否显示销售百分比
    isExclusive?:boolean,//是否专属供应,
    supplyId?:string,//供应商id
    editable?:boolean
}

export default class ProductListItem extends Common.Warp<Props, any> {
    constructor(props) {
        super(props);
        const maxCount = this.getMaxCount();
        this.state = {
            count: props.count || 0,
            overSize: maxCount <= 0 || props.count >= maxCount,
            shouldUpdateCount:true
        }
    }
    timmer = null
    addToCartAction = Common.proxyAction(this, addToCart, 'addToCart')
    addToExcCartAction = Common.proxyAction(this, addToExclusiveCart, 'addToExclusiveCart')
    static mapDispatchToProps = {
        addToCart: addToCart,
        addToExclusiveCart: addToExclusiveCart
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            count: nextProps.count,
            overSize: nextProps.count >= this.getMaxCount(),
        });
    }

    getMaxCount() {
        const product = this.props.item;
        let maxCount = product.remainCount;
        if (product.maxCountPerUser) {
            const remainUserLimit = product.maxCountPerUser - (product.alreadyBuyCount || 0);
            if (remainUserLimit < maxCount) maxCount = remainUserLimit;
        }
        return maxCount >= 0 ? maxCount : 0;
    }

    onTouchStart(e){
        let touch = e.touches[0];
        this.state.pageX = touch.pageX;
        this.state.pageY = touch.pageY;
        this.state.shouldUpdateCount = true;
    }
    onTouchMove(e){
        let touch = e.touches[0];
        let dtx = Math.abs(touch.pageX - this.state.pageX);
        let dty = Math.abs(touch.pageY - this.state.pageY);
        if(dtx > 10 || dty >10){
            this.state.shouldUpdateCount = false;
        }else{
            this.state.shouldUpdateCount = true;
        }
    }
    changeHandler(type) {
        if(this.props.editable === false){
            return;
        }
        let $this = $(this.refs.fly);

        let cb = this.props.onChange;
        let count = this.state.count;
        let refs:any = this.refs;
        let item = this.props.item;

        if(!this.state.shouldUpdateCount){
            return;
        }
        //
        if (type == "minus") {
            count--;
        } else if (type == "plus") {
            count++;
        } else if (type == "change") {
            count = refs.count.value;
        }
        if(count === ""){//解决用户先删除再输入的问题
            this.setState({count:count});
            return;
        }
        count = Number(count);
        if(count > item.remainCount){
            toast("库存不足");
        } else if (item.maxCountPerUser && count > item.maxCountPerUser - (item.alreayBuyCount || 0)) { // macCountPerUser为undefined永远为false
            toast("已达秒杀上限");
        }

        const maxCount = this.getMaxCount();
        if(count >= maxCount){
            count = maxCount;
            this.state.overSize = true;
        } else{
            maxCount && (this.state.overSize = false);
        }

        if(type == 'plus'&& count > this.state.count){
            AddCarEffect({
                left: $this.offset().left,
                top: $this.offset().top
            });
        }

        log("数量:", count);
        if (count !== this.state.count) {
            clearTimeout(this.timmer);
            this.addTocart(item,count);
            //
            this.setState({
                count: count
            });
            cb && cb({item:item,count:count});
        }
    }
    addTocart(item,count){
        if(count === ""){return}
        let useCart = this.props.useCart === false?this.props.useCart:true;
        let isExclusive = this.props.isExclusive;
        this.timmer = setTimeout(() => {
            if(isExclusive){
                useCart && this.addToExcCartAction({
                    product: {
                        priceId: item.priceId,
                        productId: item.productId,
                        productName: item.productName,
                        logo:item.logo || item.logos[0],
                        remainCount: item.remainCount,//商品剩余数
                        buyCount: count,//当前商品购买数
                        price: item.price
                    },
                    supplyId:this.props.supplyId || util.getParam("supplyId") || ""
                })
            }else{
                useCart && this.addToCartAction({
                    product: {
                        priceId: item.priceId,
                        productId: item.productId,
                        productName: item.productName,
                        logo:item.logo || item.logos[0],
                        remainCount: item.remainCount,//商品剩余数
                        maxCountPerUser: item.maxCountPerUser,
                        alreadyBuyCount: item.alreadyBuyCount,
                        buyCount: count,//当前商品购买数
                        price: item.price
                    }
                });
            }
        },300);
    }
    onBlur(){
        let refs:any = this.refs;
        let count = refs.count.value;
        let item = this.props.item;

        this.addTocart(item,Number(count));
        this.setState({
            count: count
        });
    }
    render() {
        let item = this.props.item;
        let count = this.state.count;
        let isExclusive = this.props.isExclusive;
        let tagsMap = {
            "selfrun":"自营",
            "tyreinsurance":"轮胎保"
        }
        let editable = this.props.editable == false ? false:true;
        if(isExclusive){//专属供应
            let status = item.consultStatus;
            let quotePrice = status == "FINISHED" ? item.quotePrice:"?";
            let map = {
                "PENDING":"",
                "WAIT":"询价中，等待回复",
                "FINISHED":"已报价",
                "REFUSED":"",
                "ORDERED":"",
                "BACK_TIMEOUT":"",
                "ORDER_TIMEOUT":""
            }

            return (
                <li>
                    <a className="pic">
                        <img src={item.logo} alt/>
                    </a>
                    <div className="cont">
                        <h3 className="title">
                            <a>{item.productName}</a>
                        </h3>
                        <div className="now-price">￥{quotePrice}</div>
                        <div>
                            {(() => {
                                return item.tags && item.tags.map((tag,i) => {
                                    return <span key={tag+i} className="label">{tagsMap[tag]}</span>
                                });
                            })()}
                        </div>
                        <div className="light"><span className="fr highlight">{map[status]}</span>库存：{item.remainCount > 0?item.remainCount:"缺货"}</div>
                        {(() => {
                            if(this.props.useProgress){
                                return (
                                    <div className="progress-bar">
                                        <progress value={item.salesCount} max={item.salesCount+item.remainCount}></progress>
                                        <span className="lightgray fss">已售{util.percent(item.salesCount,item.salesCount+item.remainCount)}%</span>
                                    </div>
                                )
                            }
                        })()}
                        {(() => {
                            // 为空表示未询价，出现增加、减少按钮
                            if(map[status]=="" || status == ""){
                                return (
                                    <div className="mod-amount">
                                        {(() => {
                                            if (count > 0) {
                                                return (
                                                    <span>
                										<a className={"num "+(editable?"":"gray")}
                                                        onTouchMove={this.onTouchMove.bind(this)}
                                                        onTouchStart={this.onTouchStart.bind(this)}
                                                        onTouchEnd={this.changeHandler.bind(this,"minus")}><i className="iconfont icon-minus"/></a>
                										<input ref="count" type="text" value={count} onChange={this.changeHandler.bind(this,"change")} onBlur={this.onBlur.bind(this)}/>
                									</span>
                                                )
                                            } else {
                                                if (count === "") {
                                                    return (
                                                        <span>
                											<a className={"num "+(editable?"":"gray")}
                                                            onTouchStart={this.onTouchStart.bind(this)}
                                                            onTouchMove={this.onTouchMove.bind(this)}
                                                            onTouchEnd={this.changeHandler.bind(this,"minus")}><i className="iconfont icon-minus"/></a>
                											<input ref="count" type="number" value={count} onChange={this.changeHandler.bind(this,"change")} onBlur={this.onBlur.bind(this)}/>
                										</span>
                                                    )
                                                }
                                            }
                                        })()}

                                        <a className={"num"+(this.state.overSize || editable == false?" gray":"")}
                                        ref="fly"
                                        onTouchStart={this.onTouchStart.bind(this)}
                                        onTouchMove={this.onTouchMove.bind(this)}
                                        onTouchEnd={this.changeHandler.bind(this,"plus")}><i className="iconfont icon-plus"/></a>

                                    </div>
                                )
                            }
                        })()}

                    </div>
                </li>
            )
        }else{
            let bottlesPrice:any = 0;
            if(item.extraInfo.bottles){
                bottlesPrice = item.price/item.extraInfo.bottles;
                bottlesPrice = bottlesPrice%1?bottlesPrice.toFixed(2):bottlesPrice
            }
            return (
                <li>
                    <Link to={"/product/detail?priceId="+item.priceId} className="pic">
                        <img src={item.logo} alt/>
                    </Link>
                    <div className="cont">
                        <h3 className="title">
                            <Link to={"/product/detail?priceId="+item.priceId}>{item.productName}</Link>
                        </h3>
                        <div className={ count > 0 ? 'now-price ellipsis' : "now-price"}>￥{item.price}{ item.extraInfo.bottles?<i className="fsm mls">(￥{bottlesPrice}x{item.extraInfo.bottles})</i>:null }</div>
                        <div className="light">
                            {(() => {
                                return item.tags.map((tag,i) => {
                                    return <span key={tag+i} className="label">{tagsMap[tag]}</span>
                                });
                            })()}
                            库存：{item.remainCount > 0?item.remainCount:"缺货"}
                        </div>
                        {(() => {
                            if(this.props.useProgress){
                                return (
                                    <div className="progress-bar">
                                        <progress value={item.salesCount} max={item.salesCount+item.remainCount}></progress>
                                        <span className="lightgray fss">已售{util.percent(item.salesCount,item.salesCount+item.remainCount)}%</span>
                                    </div>
                                )
                            }
                        })()}
                    </div>
                    <div className="mod-amount">
                        {(() => {
                            if (count > 0) {
                                return (
                                    <span>
                                        <a className={"num "+(editable?"":"gray")}
                                        onTouchStart={this.onTouchStart.bind(this)}
                                        onTouchMove={this.onTouchMove.bind(this)}
                                        onTouchEnd={this.changeHandler.bind(this,"minus")}><i className="iconfont icon-minus"/></a>
                                        <input ref="count" type="number" value={count} onChange={this.changeHandler.bind(this,"change")} onBlur={this.onBlur.bind(this)}/>
                                    </span>
                                )
                            } else {
                                if (count === "") {
                                    return (
                                        <span>
                                            <a className={"num "+(editable?"":"gray")}
                                            onTouchStart={this.onTouchStart.bind(this)}
                                            onTouchMove={this.onTouchMove.bind(this)}
                                            onTouchEnd={this.changeHandler.bind(this,"minus")}><i className="iconfont icon-minus"/></a>
                                            <input ref="count" type="number" value={count} onChange={this.changeHandler.bind(this,"change")} onBlur={this.onBlur.bind(this)}/>
                                        </span>
                                    )
                                }
                            }
                        })()}
                        <a className={"num"+(this.state.overSize || editable == false?" gray":"")}
                        ref="fly"
                        onTouchStart={this.onTouchStart.bind(this)}
                        onTouchMove={this.onTouchMove.bind(this)}
                        onTouchEnd={this.changeHandler.bind(this,"plus")}><i className="iconfont icon-plus"/></a>
                    </div>
                </li>
            )
        }

    }
}
