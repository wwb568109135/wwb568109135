import {Component} from "react";
import {Alert} from "./Modal";
import {browserHistory} from "react-router";
import {setLoginState} from "../../actions/index";
import * as api from "../../api";
import Toast from "./../common/Toast";



let ERROR_ID_MAP = {
    "wrong.empty.args": "参数不能为空",
    "wrong.verify.code": "验证码不正确或已失效",
    "wrong.mobile.has.applied": "此手机已有申请开店记录"
}

//从该数组的路由登录后直接跳到首页
let nonRoutes = [
    '/accounts/setting'
];

export default class PhoneLogin extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            tick: 0
        };
    }
    static mapStateToProps(state, ownProps) {
        return state.loginState
    }
    static mapDispatchToProps = {
        loginAction: setLoginState
    }
    submit() {
        let that = this;
        let refs:any = this.refs;
        let mobile = util.trim(refs.mobile.value);
        let verifyCode = util.trim(refs.verifyCode.value);

        if( !this.checkMobile( mobile ) )
            return Toast(<span>请输入正确的手机号码</span>, 2000);
        if( !verifyCode )
            return Toast(<span>验证码不能为空</span>, 2000);

        let loginAction = Common.proxyAction(this, setLoginState, "loginAction")
        api.shop.account.login_by_sms({
            mobile: mobile,
            verifyCode: verifyCode
        }).then((rv)=>{
            if( !rv.isLogin || rv.errorId ){
                Toast(<span>{rv.errorDesc || "登陆失败。未知错误"}</span>, 2000)
            }else{
                loginAction({
                    login: rv.isLogin,
                    userName: rv.userName,
                    shopId: rv.shopId,
                    msg: "login success"
                });
                if(nonRoutes.indexOf(location.pathname) > -1){
                    util.gotoUrl("/");
                }
            }
        },err=>{
            Toast(<span>网络异常</span>, 2000);
        });
    }
    checkMobile( mobile: string ){
        return /^1\d{10}$/.test(mobile);
    }
    getverifyCode() {
        let that = this;
        let refs:any = this.refs;
        let mobile:string = util.trim(refs.mobile.value);
        if( !this.checkMobile( mobile ) ){
            Toast(<span>请输入正确的手机号码</span>, 2000);
            return ;
        }
        if( this.state.tick > 0 )
            return ;

        this.runTicker( 60 );
        api.shop.account.send_verify_code({
            mobile: mobile,
            from: "SMS_LOGIN"
        }).then((rv)=>{
            if( rv.errorId ){
                that.stopTicker();
                Toast(<span>{rv.errorDesc || "请求失败。未知错误"}</span>, 2000);
            }else{
                Toast(<span>验证码已发送，请注意查收</span>, 2000);
            }
        },err=>{
            Toast(<span>网络异常</span>, 2000);
        });
    }

    _intervalId: any;

    runTicker( t ){
        let that = this;
        that.stopTicker();
        that.state.tick = t;
        that.setState({tick: t});
        that._intervalId = setInterval(() => {
            if( that.state.tick >= 1 )
                that.setState({tick: that.state.tick-1});
            else that.stopTicker();
        }, 1000);
    }
    stopTicker(){
        clearInterval(this._intervalId);
        this.setState({
          tick: 0
        });
    }
    goBack(){
        browserHistory.goBack();
    }
    render() {
        return (
            <div>
                <header className="app-header">
                    <a className="iconfont icon-return fl" onClick={this.goBack}></a>
                    <h1>手机登陆</h1>
                </header>
                <div className="app-content fx-hd">
                    <form className={this.state.finished ? "hidden":"mod-form-login"}>
                        <div className="input">
                            <input ref="mobile" type="text" placeholder="输入你的手机号码"/>
                        </div>
                        <div className="input">
                            <input ref="verifyCode" type="text" placeholder="验证码"/>
                            <a className="btn-codes" href="javascript:;">
                                <span onClick={this.getverifyCode.bind(this)}>获取验证码<i className="sec">{this.state.tick ? (this.state.tick+"s") : "  "}</i></span>
                            </a>
                        </div>
                        <div className="mtl">
                            <a onClick={this.submit.bind(this)} className="mod-btn primary block">提 交</a>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
