import {Component} from "react";
import {Alert} from "./Modal";
import {browserHistory} from "react-router";
import {setLoginState} from "../../actions/index";
import * as api from "../../api";

interface state {
    msg?:string,
    fromWeixin?: boolean
}

//从该数组的路由登录后直接跳到首页
let nonRoutes = [
    '/accounts/setting'
];

export default class Login extends Component<{}, state> {
    constructor(props) {
        super(props);
        let ua = window.navigator.userAgent;
        this.state = {
            msg: "",
            fromWeixin: /micromessenger/i.test(ua)
        }
    }

    static mapStateToProps(state, ownProps) {
        return state.loginState
    }

    static mapDispatchToProps = {
        loginAction: setLoginState
    }

    submit() {
        let refs:any = this.refs;
        let user = util.trim(refs.user.value);
        let pwd = util.trim(refs.pwd.value);
        if (!user) {
            this.showMsg("请输入帐号");
            return;
        }
        if (!pwd) {
            this.showMsg("请输入密码");
            return;
        }
        this.showMsg("");
        let loginAction = Common.proxyAction(this, setLoginState, "loginAction")
        let rv = api.shop.account.login({
            userName: user,
            userPassword: pwd
        });
        rv.then((res:any) => {
            log("then", res)
            if (!res.isLogin) {
                this.showMsg(res.errorDesc);
            } else {
                loginAction({
                    login: res.isLogin,
                    userName: res.userName,
                    shopId:res.shopId,
                    msg: "login success"
                });
                if(nonRoutes.indexOf(location.pathname) > -1){
                    util.gotoUrl("/");
                }
            }
        });
    }

    goBack() {
        browserHistory.goBack();
    }

    forgetPwd() {
        Alert({
            title: "忘记密码？",
            content: <div>
                请致电
                <a className="light" href="tel://4001191159">400-119-1159</a>
                为您重置密码
            </div>
        });
    }

    showMsg(msg) {
        this.setState({
            msg: msg
        });
    }

    render() {

        return (
            <div>
                <header className="app-header">
                    <a className="iconfont icon-close fl" onClick={this.goBack}></a>
                    <h1>HTW 管家</h1>
                </header>
                <div className="app-content fx-hd">
                    <form className="mod-form-login" acceptCharset="utf-8">
                        <div className="input">
                            <input ref="user" type="text" placeholder="请输入登录帐号" autoComplete="off"/>
                            <input ref="pwd" type="password" placeholder="请输入登录密码" autoComplete="off"/>
                        </div>
                        {(() => {
                            if (this.state.msg) {
                                return <div className="red-warning">{this.state.msg}</div>
                            }
                        })() }
                        <div className="mtl">
                            <a onClick={this.submit.bind(this)} className="mod-btn primary block">登 录</a>
                            <Link className="mod-btn default block" to="/PhoneLogin">使用手机号码登陆</Link>
                        </div>
                        <div className="pam">
                            {(() => {
                                if( this.state.fromWeixin ){
                                    return <Link className="fl" to="/ApplyAccount">申请帐号</Link>
                                }
                            })()}
                            <a className="fr" onClick={this.forgetPwd}>找回密码</a>
                        </div>
                        <div className="mtl center light">
                            <p className="mbs">创建自己的网上店铺，注册热线</p>
                            <p className="fsxl"><a className="light" href="tel://4001191159">400-119-1159</a></p>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
