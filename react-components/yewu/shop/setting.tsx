import {Component} from "react";
import TopBar from "../../components/TopBar";
import * as api from "../../api";
import { LogOutState } from '../../actions/index'


export default class Setting extends Common.Warp<any, any> {
    constructor(props) {
        super(props)
    }

    needLogin = true

    static mapStateToProps(state, ownProps) {
        return {
            login: state.loginState.login
        }
    }

    LogOutAction = Common.proxyAction(this, LogOutState, 'LogOutState')

    static mapDispatchToProps = {
        LogOutState: LogOutState
    }

    logOut(){
        api.shop.account.logout({}).then(res => {
            this.LogOutAction()
        })
    }

    content() {
        return (
            <div>
                <TopBar title="设置" backUrl="/accounts"/>
                <div className="app-content fx-hd bg-white">
                    <div className="mod-link-list">
                        <ul>
                            <li><Link to="/accounts/editpassword">修改密码</Link></li>
                            <li><a href="javascript:;" className="highlight" onClick={ this.logOut.bind(this) }>退出登录</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
