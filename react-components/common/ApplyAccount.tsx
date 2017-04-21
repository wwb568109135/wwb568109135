import {Component} from "react";
import {Alert} from "./Modal";
import {browserHistory} from "react-router";
import {setLoginState} from "../../actions/index";
import * as api from "../../api";
import Toast from "./../common/Toast";
import ImageVerify from "./ImageVerify";

interface state {
    tick?: number
    finished: boolean
}

let ERROR_ID_MAP = {
    "wrong.empty.args": "参数不能为空",
    "wrong.verify.code": "验证码不正确或已失效",
    "wrong.mobile.has.applied": "此手机已有申请开店记录"
}

export default class Login extends Component<{}, state> {
    constructor(props) {
        super(props);
        this.state = {
            tick: 0,
            finished: false
        };
    }

    static mapStateToProps(state, ownProps) {
        return {}
    }

    static mapDispatchToProps = {}

    _intervalId: any;

    checkMobile( mobile: string ){
        return /^1\d{10}$/.test(mobile);
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

        api.shop.account.wx_apply_account({
            mobile: mobile,
            imageId: "",
            verifyCode: verifyCode
        }).then((rv)=>{
            if( rv.errorId ){
                if( rv.errorId == "wrong.mobile.has.applied" ){
                    Alert({
                        title: "提示",
                        content: <div>该手机号已申请，等待审核中<br/>如有疑问拨打客服热线 <a href="tel:400-119-1159">400-119-1159</a></div>,
                        onOk: function(){
                            that.setState({tick: 0, finished:true});
                        }
                    });

                }else {
                    Toast(<span>{rv.errorDesc || "请求失败。未知错误"}</span>, 2000)
                }
            }else{
                that.setState({tick: 0, finished:true});
            }
        });
    }

    getverifyCode() {
        let that = this;
        let refs:any = this.refs;
        let mobile:string = util.trim(refs.mobile.value);
        let imageCode = util.trim(refs.imageCode.value);
        if( !this.checkMobile( mobile ) ){
            Toast(<span>请输入正确的手机号码</span>, 2000);
            return ;
        }
        if(!imageCode){
            Toast(<span>请输入图片验证码</span>, 2000);
            return ;
        }
        if( this.state.tick > 0 )
            return ;

        this.runTicker( 60 );
        api.shop.account.send_verify_code({
            mobile: mobile,
            verifyCode:imageCode,
            from: "APPLY_ACCOUNT"
        }).then((rv)=>{
            if( rv.errorId ){
                that.stopTicker();
                if( rv.errorId == "wrong.mobile.has.applied" ){
                    Alert({
                        title: "提示",
                        content: <div>该手机号已申请，等待审核中<br/>如有疑问拨打客服热线 <a href="tel:400-119-1159">400-119-1159</a></div>
                    });
                }else {
                    Toast(<span>{rv.errorDesc || "请求失败。未知错误"}</span>, 2000)
                }
            }else{
                Toast(<span>验证码已发送，请注意查收</span>, 2000);
            }
        },err=>{
            Toast(<span>验证码发送失败，请重试</span>, 2000)
        });
    }
    runTicker( t ){
        let that = this;
        that.stopTicker();
        that.state.tick = t;
        that._intervalId = setInterval(() => {
            if( that.state.tick >= 1 ){
                that.setState({tick: that.state.tick-1, finished:false});
            }
            else
                that.stopTicker();
        }, 1000);
    }
    stopTicker(){
        this.state.tick = 0;
        clearInterval(this._intervalId);
    }
    goBack(){
        browserHistory.goBack();
    }
    close(){
        try{
            let w:any = window;
            w.WeixinJSBridge.call('closeWindow');
        }catch(e){}
        return false;
    }
    render() {
        return (
            <div>
                <header className="app-header">
                    <a className="iconfont icon-return fl" onClick={this.goBack}></a>
                    <h1>申请账号</h1>
                </header>
                <div className="app-content fx-hd">
                    <form className={this.state.finished ? "hidden":"mod-form-login"}>
                        <div className="input">
                            <input ref="mobile" type="text" placeholder="输入你的手机号码"/>
                        </div>
                        <div className="input">
                            <input ref="imageCode" type="text" placeholder="输入图片验证码"/>
                            <ImageVerify style={{position:"absolute",top:".36rem",right:".2rem"}}/>
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

                    <div className={this.state.finished ? "mod-blankslate order-status":"hidden"}>
                        <div className="bg"></div>
                        <h3>提交成功</h3>
                        <p className="light center fsl">1个工作日内将有专员与你联系，</p>
                        <p className="light center fsl">请耐心等候</p>
                        <a className="mod-btn primary block" onClick={this.close}>完成</a>
                    </div>
                </div>
            </div>
        )
    }
}
