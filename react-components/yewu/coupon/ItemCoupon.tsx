import {Component} from "react";
import * as api from "../../api";
import {Alert} from "../common/Modal";
import Toast from "../common/Toast";
interface Props {
    data:serverApi.shop.coupon.coupon_item,
    isShowPickUp?:boolean　//是否显示按钮　默认不显示　因为领劵中心的是没有按钮的
}
export default class ItemCoupon extends Component<Props,any> {

    constructor(props) {
        super(props);
        this.state = {couponState:this.props.data.couponState||"UNPICKED",couponUseState:this.props.data.couponUseState||"UNUSED"};
    }

    static defaultProps = {
        data:{},
        isShowPickUp:true,
        isShowCheck:true,
    }
    static stateMap = {
      UNUSED:"未使用",
      USED:"已使用",
      EXPIRED:"已过期"
    }
    pickUp() {
        let item = this.props.data;
        Alert({
            content:
            <div className="mod-coupon get-coupon">
            <ul>
                <ItemCoupon data={item} isShowPickUp = {false}/>
            </ul>
        </div>,
            btnText: "点击领取",
            onOk: ()=> {
              var couponDefineId = item.couponDefineId;
              api.shop.coupon.pick_up(
                {couponDefineId:item.couponDefineId,
                  couponItemId:item.couponItemId}).then(
                res=>{
                    if(res.apiState.status||res.errorId){
                      Alert({title:res.errorDesc||res.apiState.status + "\n" + res.json.message});
                    }else{
                      this.setState({couponState:"PICKED",couponUseState:"UNUSED"});
                      Toast("领券成功");
                    }
                  }
              );
            }
        });
    }
    onClick(e){
      e.preventDefault();
      this.pickUp();
    }

    getUseUrl(){
      // let url = "/product/list?type=tyre";
      let url:string = "/purchase";
      let ruleMap = this.props.data.ruleMap;
      if(ruleMap.hdType=="seckill"){
        url = "/seckill";
      }else if(ruleMap.productType){
        url = "/product/list?type="+ruleMap.productType;
        if(ruleMap.productBrandId){
          url +="&brandId="+ruleMap.productBrandId;
        }
      }
      return url;
    }

    getTag(){
      var tag = undefined;
      var couponState = this.state.couponState;
      var clxName = "";
      if(!this.props.isShowPickUp){
        tag = undefined;
      }else if(couponState=="LACK"){
        clxName = "off";
        tag =
        <div className="tag">
            <i className="iconfont icon-cry"></i><br/>
            <em>已经抢完</em>
        </div>
      }else if(couponState=="UNPICKED"){
        tag =
        <div className="tag" onClick={this.onClick.bind(this)}>
            <a>立即领取</a>
        </div>
      }else if(couponState=="PICKED"){
        var couponUseState = this.state.couponUseState;
        if(couponUseState=="UNUSED"){
            clxName = "get";
            tag =
            <div className="tag">
                <i className="iconfont icon-check2"></i><br/>
                <Link to={this.getUseUrl()}>立即使用</Link>
            </div>
        }else{
          clxName = "off";
          tag =
          <div className="tag">
              <i className="iconfont icon-cry"></i><br/>
              <em>已经使用</em>
          </div>
        }
      }else if(couponState=="UNUSED"){
          clxName = "unused";
          tag =
          <div className="tag">
              <Link to={this.getUseUrl()}>立即使用</Link>
          </div>
      }else{
        tag =
        <div className="tag">
            <a>{ItemCoupon.stateMap[couponState]||"未知"}</a>
        </div>
      }
      return{clxName,tag}
    }

    render() {
        var data = this.props.data;
        var desc = data.ruleMap;
        var tag = this.getTag();
        return (
                <li className={tag.clxName}>
                  <div className="coupon-box">
                      <div className="price">
                          <p>¥<strong>{data.couponAmount/100}</strong></p>
                          <p>{desc.couponRuleShortDesc}</p>
                      </div>
                      <div className="info">
                       <p>{desc.couponRuleDescList[0]}</p>
                       <p>{desc.couponRuleDescList.slice(1).join(" ")}</p>
                        {(() => {
                          if(data.expireTimeStamp>0){
                            var date = new Date(data.expireTimeStamp);
                            var expireTime = date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate()+"到期";
                            return <p>{expireTime}</p>;
                          }
                        })()}
                      </div>
                      {tag.tag}
                  </div>
                </li>
              )
    }
}
