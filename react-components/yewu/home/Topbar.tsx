import { Component } from 'react'
import { connect } from 'react-redux'
import { Router } from 'react-router'
import * as api from '../../api'
import {Modal,Alert} from '../../components/common/Modal'

interface Props{
    isLogin?: boolean;
    unreadCount:number;
    weekRevenueAmount:string;
    dayOrderCount:string;
    allOrderCount:string;

}
interface States {
    showHelper:boolean,
    code:string,
    verifyCodeItems:{},
    success:boolean,
    htwTitle:boolean
}

export default class Topbar extends Common.Warp<Props,States> {
    private timer: NodeJS.Timer | number;

    constructor(props) {
        super(props)
        this.state = {
            showHelper: true,
            code:"",
            verifyCodeItems:{},
            success:false,
            htwTitle:true
        };
    }
    static mapStateToProps(state, ownProps) {
        return {
            isLogin: state.loginState.login,
        };
    }

    /**
     * 用于测试的方法，可控制url跳转和native方法调用
     */
    callNative(input) {
        let _window:any = window;
        let matchs = input.match(/^\:debug\:(url|method)\:(.*)/);

        switch(matchs[1]){
            case 'url':
                if( matchs[2].indexOf('http://') == 0 )
                    _window.location.href = matchs[2];
                else
                    _window.location.href = 'http://'+ matchs[2];
                break;
            case 'method':
                _window.htwNative[matchs[2]] && _window.htwNative[matchs[2]]();
                break;
        }
    }
    //点击验券的时候
    validationCheckVolume() {

        let Volume = util.trim(this.refs.Volume.value);
        let getVerifyCode = [];

        if( /^\:debug\:(?:url|method)\:.*/.test(Volume) ){
            this.callNative(Volume);
            return ;
        }

        if (Volume === "") {
            // Alert({
            //     title:"HTW提示",
            //     content:"不能为空",
            //     btnText:"知道了"
            // });
            return false;
        } else  {
            api.shop.pay.verify_code({
                code:Volume
            }).then(res => {
                if(!res.errorId){
                    //log(res)
                    let stringifyRes = JSON.stringify(res);
                    //log(stringifyRes)
                    //save 保存验卷码
                    Common.storage.setItem("Volume",stringifyRes);
                    util.gotoUrl('/CheckVolume?id='+Volume);
                }else{
                    Alert({
                        title:"HTW提示",
                        content:"该验券码错误，请重试",
                        btnText:"知道了"
                    });
                    return false;
                }
            })
        }

        $(".app-nav").show();
        //输入验券码
        this.setState({
            htwTitle:true
        })
        $(this.refs.VolumeClose).hide();
        $(".jsVolume").hide()
        $(".jsIndexOrder").slideDown();
        $(".system-meta").css({
            "visibility":"visible"
        });
    }
    //有焦点的时候
    handleFocus() {
        $(this.refs.VolumeClose).show();
        this.setState({
            htwTitle:false
        })
        $(".jsIndexOrder").slideUp(function(){
            $(".system-meta").css({
                "visibility": "hidden"
            });
            $(".jsVolume").show();
            $(".app-nav").hide();
        });
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            // $(".system-meta li p").slideUp(()=>{
            //     this.setState({showHelper: false});
            // })
            // $(".system-meta li p").css({
            //     "visibility": "hidden"
            // });
            $(".system-meta li p").animate({
                "opacity":0
            },()=>{
                $(".system-meta li p").animate({
                    "height":0,
                    "margin":0
                },()=>{
                    //$(".system-meta li p").remove()
                    //不删除就不抖动
                })
            })
        }, 3000);

    }

    componentWillUnmount() {
        clearTimeout(this.timer as number);
    }
    //关闭的时候
    handleClose(){
        $(this.refs.VolumeClose).hide()
        $(".jsVolume").hide()
        $(".jsIndexOrder").slideDown();
        $(".system-meta").css({
            "visibility":"visible"
        });
        this.setState({
            htwTitle:true
        })
        $(".app-nav").show();
    }
    //输入的时候
    handleKeyUp(){
        let Volume = util.trim(this.refs.Volume.value);
        if(Volume.length>0){
            $(".jsVolume a").removeClass("disabled").addClass("primary");
        }else{
            $(".jsVolume a").addClass("disabled").removeClass("primary");
        }
    }

    content() {
        return (
            <div>
                <div className="system-header">
                    <div className="top-bar">
                        <Link to="/Message">
                            <i className="iconfont icon-message">
                            <span>{ this.props.unreadCount>0 ? this.props.unreadCount : "" }</span>
                            </i>
                        </Link>
                        <i className="iconfont icon-close fl" ref="VolumeClose" style={{"display":"none"}} onClick={this.handleClose.bind(this)}></i>
                        {this.state.htwTitle?<h1 className="system-title">HTW&sdot;管家</h1>:<h1>验券</h1>}
                    </div>
                    <input className="input-code" ref="Volume" type="text" onKeyUp={this.handleKeyUp.bind(this)} onFocus={this.handleFocus.bind(this)} placeholder="输入验券码" />

                    <div className="system-meta">
                        <ul>
                            <li>
                                <p className="text">{this.state.showHelper ? "本周营收" : "" }</p>
                                {this.props.weekRevenueAmount}
                                <i className="iconfont icon-money"></i>
                            </li>
                            <li>
                                <p className="text">{this.state.showHelper ? "今日订单" : "" }</p>
                                {this.props.dayOrderCount}
                                <i className="iconfont icon-books"></i></li>
                            <li>
                                <p className="text">{this.state.showHelper ? "订单总数" : "" }</p>
                                {this.props.allOrderCount}
                                <i className="iconfont icon-books2"></i></li>
                        </ul>
                    </div>
                </div>

                <div className="mtl jsVolume" style={{"display":"none"}}>
                    <a className="mod-btn disabled  block"
                          onClick={this.validationCheckVolume.bind(this)}>验 证</a>
                </div>



















            </div>
        )
    }
}
