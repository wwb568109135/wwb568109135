import {Component} from "react";
import { addToCart } from '../../actions/cart'
import { addToExclusiveCart } from '../../actions/exclusiveCart'
import toast from '../../components/common/Toast'
import AddCarEffect from '../../components/common/AddCarEffect'

interface Props {
    product:any,
    onChange?:(any)=>any,
    count?:number,
    useCart?:boolean,//是否加入购物车
    isExclusive?:boolean,//是否专属供应
    supplyId?:string//供应商id
}

export default class ProductCounter extends Common.Warp<Props, any> {
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
    onTouchStart(e){
        let touch = e.touches[0];
        this.state.pageX = touch.pageX;
        this.state.pageY = touch.pageY;
        this.state.shouldUpdateCount = true;
    }

    getMaxCount() {
        const product = this.props.product;
        let maxCount = product.remainCount;
        if (product.maxCountPerUser) {
            const remainUserLimit = product.maxCountPerUser - (product.alreadyBuyCount || 0);
            if (remainUserLimit < maxCount) maxCount = remainUserLimit;
        }
        return maxCount >= 0 ? maxCount : 0;

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
        let $this = $(this.refs.fly);

        let cb = this.props.onChange;
        let count = this.state.count;
        let refs:any = this.refs;
        let product = this.props.product;
        let useCart = this.props.useCart === false?this.props.useCart:true;
        let isExclusive = this.props.isExclusive;
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
		if(count < 0){
			return;
		}
        if(count > product.remainCount){
            toast("库存不足");
        } else if (product.maxCountPerUser && count > (product.maxCountPerUser - (product.alreadyBuyCount || 0))) { // macCountPerUser为undefined永远为false
            toast("已达秒杀上限");
        }
        
        const maxCount = this.getMaxCount()
        count = Number(count);
        if(count >= maxCount){
            count = maxCount;
            this.state.overSize = true;
        } else{
            maxCount && (this.state.overSize = false);
        }

        if(type == 'plus' && count > this.state.count && location.pathname != '/cart'){
            AddCarEffect({
                left: $this.offset().left,
                top: $this.offset().top
            });
        }

        log("数量:", count);
        if (count !== this.state.count) {
            clearTimeout(this.timmer);
            this.addTocart(product,count);
            this.setState({
                count: count
            });
            cb && cb({product:product,count:count});
        }
    }
    addTocart(product,count){
        if(count === ""){return}
        let useCart = this.props.useCart === false?this.props.useCart:true;
        let isExclusive = this.props.isExclusive;
        this.timmer = setTimeout(() => {
            if(isExclusive){
                useCart && this.addToExcCartAction({
                    product: {
                        priceId: product.priceId,
                        productId: product.productId,
                        productName: product.productName,
                        logo:product.logo || product.logos[0],
                        remainCount: product.remainCount,//商品剩余数
                        buyCount: count,//当前商品购买数
                        price: product.price
                    },
                    supplyId:this.props.supplyId || util.getParam("supplyId") || ""
                })
            }else{
                useCart && this.addToCartAction({
                    product: {
                        priceId: product.priceId,
                        productId: product.productId,
                        productName: product.productName,
                        logo:product.logo || product.logos[0],
                        remainCount: product.remainCount,//商品剩余数
                        buyCount: count,//当前商品购买数
                        maxCountPerUser: product.maxCountPerUser,
                        alreadyBuyCount: product.alreadyBuyCount,
                        price: product.price
                    }
                });
            }
        },300);
    }
    onBlur(){
        let refs:any = this.refs;
        let count = refs.count.value;
        let item = this.props.product;

        this.addTocart(item,Number(count));
        this.setState({
            count: count
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            count: nextProps.count,
            overSize: nextProps.count >= this.getMaxCount(),
        });
    }
    render() {
        let count = this.state.count;
        return (
            <div className="mod-amount">
				<a className={"num"+(this.state.count <= 0?" gray":"")}
                onTouchMove={this.onTouchMove.bind(this)}
                onTouchStart={this.onTouchStart.bind(this)}
                onTouchEnd={this.changeHandler.bind(this,"minus")}><i className="iconfont icon-minus"/></a>
				<input ref="count" type="number" value={count} onChange={this.changeHandler.bind(this,"change")} onBlur={this.onBlur.bind(this)}/>

                <a className={"num"+(this.state.overSize?" gray":"")}
                ref="fly"
                onTouchMove={this.onTouchMove.bind(this)}
                onTouchStart={this.onTouchStart.bind(this)}
                onTouchEnd={this.changeHandler.bind(this,"plus")}><i className="iconfont icon-plus"/></a>

            </div>
        )
    }
}
