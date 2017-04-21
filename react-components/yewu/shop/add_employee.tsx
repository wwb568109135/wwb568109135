import {Component} from "react";
import TopBar from "../../components/TopBar";
import * as api from "../../api";
import {browserHistory} from "react-router";
import toast from '../../components/common/Toast'


interface Props {
    account: string,
    password: string,
    confirmPwd: string
}

export default class AddEmployee extends Common.Warp<Props, any> {
    constructor(props) {
        super(props)
    }

    submit(){
        let refs = this.refs;
        let name = util.trim(refs.loginName.value);
        let pwd1 = util.trim(refs.pwd1.value);
        let pwd2 = util.trim(refs.pwd2.value);
        let mobile = util.trim(refs.mobile.value);

        if(!name || !pwd1 || !pwd2 || !mobile) return toast('请填写完整信息');
        if(pwd1 !== pwd2) return toast('两次输入的密码不一致！');

        api.shop.manage.add_account({
            account: name,
            password: pwd1,
            confirmPwd: pwd2,
            mobile: mobile,
        }).then(res => {
            if(res.errorId){
                this.refs.loginName.value = "";
                this.refs.pwd1.value = "";
                this.refs.pwd2.value = "";
                this.refs.mobile.value = "";
                return toast(res.errorDesc+",请重填!");
            }
            if(!res.errorId){
                toast('添加成功！');
                browserHistory.push('/accounts/employees')
            };
        });
    }

    content() {
        return (
            <div>
                <TopBar title="新增员工" backUrl="/accounts/employees"/>
                <div className="app-content fx-hd">
                    <div className="mod-form-login">
                        <div className="input mbs">
                            <input ref="loginName" type="text" placeholder="请设定新员工登录名" />
                            <input ref="mobile" type="text" placeholder="请填写新员工手机号" />
                        </div>
                        <div className="input mbs">
                            <input ref="pwd1" type="password" placeholder="请设定初始密码" />
                            <input ref="pwd2" type="password" placeholder="再次输入密码" />
                        </div>
                        <div className="mtl">
                            <a onClick={this.submit.bind(this)} className="mod-btn primary block">提 交</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
