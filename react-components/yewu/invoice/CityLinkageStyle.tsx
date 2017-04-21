import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Router,browserHistory } from 'react-router'
import * as api from "../../api";

export default class CityLinkageStyle extends Component<any, any> {

    constructor(props) {
        super(props)
        this.state={
            province: "广东省",
            city:"广州市",
            area:"海珠区",
            curIndex:  this.props.curIndex ? this.props.curIndex : 0,
            allpca:this.props.allpca
        }

    }
    handleCurrent(){
        //alert(this.props.allpca.areaName)
    }
    handleAreaActiveLi(){
        //this.props.handleAreaActive
        //alert(this.props.allpca)
        this.setState({
            handleAreaActive:true
        })
    }




    render() {
        log(this)
        let { allpca } = this.props || [];
        return (

            <div className={this.props.handleAreaShow?"mod-pop-box pop-bottom":"mod-pop-box pop-bottom hidden"}>
                <div className="pop-inner fadeInUp">
                    <div className="pop-hd address-tab">
                        <ul>
                            <li className={this.props.curCityNum==0?"current":""}>
                                <a href="javascript:;">省份地址</a>
                            </li>
                            <li className={this.props.curCityNum==1?"current":""}>
                                <a href="javascript:;">市区名称</a>
                            </li>
                            <li className={this.props.curCityNum==2?"current":""}>
                                <a href="javascript:;">县市名称</a>
                            </li>
                        </ul>
                    </div>
                    <div className="pop-bd">
                        <ul className="mod-link-list address-list">
                            {
                                allpca.map((item,key)=>{
                                    return (
                                        <li key={key} className={this.state.curIndex == key + 1?"current":""} onClick={this.props.clickLiPay.bind(this, key + 1)} >

                                                {item.areaName}
                                                <i className="iconfont icon-check fr"></i>

                                        </li>
                                    )
                                })
                            }

                        </ul>
                    </div>
                </div>
            </div>
        )
    }

}
