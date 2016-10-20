import {Component} from "react";
import * as api from "../../api";
import DiscountList from "./DiscountList";

interface States {
    currTypeIndex?: number, // 选中的商品类型
    currItemIndex?: number, // 选中的商品项
    isLoading?: boolean,
    hasBrands?: boolean,
    itemList?: Array<serverApi.promotion.list_brands.Response>,
    list_normal_promotions?: serverApi.promotion.list_normal_promotions.Response
}

const productType = [
    {
        "typeName": "轮胎",
        "typeValue": "tyre"
    },
    {
        "typeName": "机油",
        "typeValue": "motor_oil"
    },
    // {
    //     "typeName": "蓄电池",
    //     "typeValue": "battery"
    // }
]

export default class DiscountTypeList extends Component<serverApi.promotion.list_brands.Response, any> {
    constructor(props) {
        super(props);
        this.state = {
            currTypeIndex: 0,
            currItemIndex: 0,
            isLoading: true,
            hasBrands: true,
            itemList: this.props.itemList,
            list_normal_promotions: {}
        }
        
    }

    componentDidMount() {
        // 有特惠商品
        if(this.state.itemList.length > 0) {
            api.promotion.list_normal_promotions(this.getNormalPromotionsRequest("tyre", this.state.itemList[0].productBrandId)).then(res => {
                if(!res.errorId) {
                    this.hideLoading();
                    this.setState({
                        list_normal_promotions: res
                    });
                } else {
                    alert(res.errorDesc);
                }
            })
        } else {
            this.hideLoading();
            this.state.itemList = [];
            this.setState({
                hasBrands: false
            });
        }
    }

    getNormalPromotionsRequest(productCateId:string, productBrandId:string) {
        let request:serverApi.promotion.list_normal_promotions.Request = {
            productCateId: productCateId,
            productBrandId: productBrandId
        };
        if(util.getParam("time")) {
            request["offsetMilliseconds"] = parseInt(util.getParam("time"));
        }
        return request;
    }

    onProductTypeChange(item:any, index:number) {
        this.state.currTypeIndex = index;
        this.state.currItemIndex = 0;
        this.showLoading();

        api.promotion.list_brands({
            productCateId: item.typeValue, // 商品类别Id, tyre/motor_oil/battery/big_tyre
            offsetMilliseconds: parseInt(util.getParam("time"))
        }).then(res => {
            if(!res.errorId) {
                if(res.itemList && res.itemList.length > 0) {
                    this.setState({
                        hasBrands: true,
                        itemList: res.itemList
                    });
                    api.promotion.list_normal_promotions(this.getNormalPromotionsRequest(productType[this.state.currTypeIndex].typeValue, this.state.itemList[this.state.currItemIndex].productBrandId)).then(res => {
                        if(!res.errorId) {
                            this.hideLoading();
                            this.setState({
                                list_normal_promotions: res
                            });
                        } else {
                            alert(res.errorDesc);
                        }
                    })
                } else {
                    this.hideLoading();
                    this.state.itemList = [];
                    this.setState({
                        hasBrands: false
                    });
                }
                
            } else {
                alert(res.errorDesc);
            }
        });
    }
    setTypeClassName(index:number) {
        return index === this.state.currTypeIndex ? "current" : null
    }

    onProductItemChange(item:any, index:number) {
        this.state.currItemIndex = index;
        this.showLoading();
        
        api.promotion.list_normal_promotions(this.getNormalPromotionsRequest(productType[this.state.currTypeIndex].typeValue, item.productBrandId)).then(res => {
            if(!res.errorId) {
                this.hideLoading();
                this.setState({
                    list_normal_promotions: res
                });
            } else {
                alert(res.errorDesc);
            }
        })
    }
    setItemClassName(index:number) {
        return index === this.state.currItemIndex ? "current" : null
    }

    showLoading() {
        this.state.isLoading = true;
    }
    hideLoading() {
        this.state.isLoading = false;
    }

    render() {
        return (
            <div className="mod-box-list">
                <div className="box-hd">
                    <h3 className="darkgray">特惠商品</h3>
                </div>
                <div className="mod-nav-pills">
                    <ul>
                        {
                            productType.map((item, index) => {
                                return <li key={"item" + index} className={this.setTypeClassName(index)} onClick={this.onProductTypeChange.bind(this, item, index)}>{item.typeName}</li>
                            })
                        }
                    </ul>
                </div>
                <nav className="brand-list">
                    {(() => {
                        if(this.state.hasBrands) {
                            return <ul>
                                {
                                    this.state.itemList.map((item, index) => {
                                        return <li key={"item" + index} className={this.setItemClassName(index)} onClick={this.onProductItemChange.bind(this, item, index)}><a href="javascript:;">{item.productBrandName}</a></li>
                                    })
                                }
                            </ul>
                        } else {
                            return <div className="mod-end">
                                <p>暂无“{productType[this.state.currTypeIndex].typeName}”的特惠品牌</p>
                            </div>
                        }
                    })()}
                </nav>
                <DiscountList {...this.state.list_normal_promotions} isLoading={this.state.isLoading} hasBrands={this.state.hasBrands}/>
            </div>
        )
    }
}
