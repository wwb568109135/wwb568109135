import {Component} from "react";
import * as api from "../../api";
import Toast from "./../common/Toast";


interface Props {
    totalPrice?: number,
    isExclusive?: boolean,
    totalCount?: number,
    gotoUrl? : string,
    btnTxt?: string,
    supplyId? : string,
    submit?: boolean,
    showCount? : boolean
}

export default class ProductFooter extends Component<Props, {}> {
    constructor(props) {
        super(props);
    }
    static mapStateToProps(state) {
        return {
            cart: state.cartState
        }
    }
    static defaultProps = {
        totalPrice: 0,
        isExclusive: false,
        totalCount: 0,
        btnTxt: '购买',
        gotoUrl: '/order',
        submit: false,
        supplyId: '',
        showCount: false
    }
    gotoUrl(e){
        e.preventDefault();
        if(this.props.totalCount>0){
            util.gotoUrl(this.props.gotoUrl);
        }else {
            Toast('购物车为空，请添加商品', 2000)
        }
    }
    submit(e){
        e.preventDefault();
        if(this.props.totalCount>0){
            util.gotoUrl(this.props.gotoUrl);
        }else {
            Toast('购物车为空，请添加商品', 2000)
        }
    }
    exclusiveSubmit (e, supplyId){
        e.preventDefault();

        if(this.props.totalCount>0){
            api.exclusive.commitCart({
                supplyId: this.props.supplyId
            }).then(rep => {
                util.gotoUrl(this.props.gotoUrl);
            }).catch(function(error){
                Toast(error, 2000)
            });
        }else {
            Toast('购物车为空，请添加商品', 2000)
        }

    }
    render() {

        return (
            this.props.isExclusive ? 
                <div className="app-footer">
                    {this.props.submit?
                        <a onClick={this.exclusiveSubmit.bind(this)} className="btn-fr bg-red" herf="#">{this.props.btnTxt}</a> :
                        <a onClick={this.gotoUrl.bind(this)} className="btn-fr bg-red" herf="#">{this.props.btnTxt}</a>
                    }
                    <span>询价单：共{this.props.totalCount}件商品</span>
                </div> : 
                <div className="app-footer">
                     {this.props.submit?
                        <a onClick={this.submit.bind(this)} className="btn-fr bg-red" herf="#">{this.props.btnTxt}</a> :
                        <Link  className="btn-fr bg-red" to={this.props.gotoUrl}>{this.props.btnTxt}</Link>
                    }
                    <i className="iconfont icon-checkbg"></i>
                    {this.props.showCount?
                        <span class="fsxl white">{this.props.totalCount}件</span>:''
                    }
                    <span className="amount">共计¥{util.price(this.props.totalPrice)}</span>
                </div>
        )
    }
}
