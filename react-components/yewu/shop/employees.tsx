import {Component} from "react";
import {browserHistory} from "react-router";
import * as api from "../../api";
import TopBar from "../../components/TopBar";
import {difference,filter,includes} from 'lodash';
import toast from '../../components/common/Toast'
import {Confirm} from '../../components/common/Modal'

let ids = [];
let factoryUsers = [];

export default class Employees extends Common.Warp<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            editUsers: false,
            isSelect: false,
            selected: false,
        }
    }

    needLogin = true

    static mapStateToProps(state, ownProps) {
        return {
            login: state.loginState.login
        }
    }

    loadData() {
        let req = api.shop.manage.list_account({});
        req.then(res => {factoryUsers = res.factoryUsers});
        return req;
    }

    switchEdit(){
        let bool = this.state.editUsers?false:true;
        this.setState({editUsers: bool})
    }

    switchSelect(){
        if(ids.length == 0) this.setState({isSelect: false})
        if(ids.length == factoryUsers.length-1) this.setState({isSelect: true})
    }

    chooseAll(){
        let bool = this.state.isSelect?false:true;
        this.setState({isSelect: bool});

        if(bool){
            let users = this.state.factoryUsers.filter((item, index) => {
                if (index) return ids.push(item.id);
            });
        }else{
            ids = []
        }
    }

    deleteAccount(){
        if(!ids.length) return toast('请先选中要删除的员工！');

        api.shop.manage.delete_account({
            deleteUserIds: ids
        }).then(res => {
            if(res.errorId) return toast(res.errorDesc);

            toast('删除成功！');
            factoryUsers = _.filter(factoryUsers,item => {
                return !_.includes(ids, item.id);
            })

            this.setState({factoryUsers: factoryUsers});

            ids = [];
        })
    }

    content() {
        let accountData = this.state.factoryUsers || [];
        let admin = accountData[0];
        let users = accountData.filter((item, index) => {
            if (index) return item;
        });
        let icon1 = this.state.editUsers?'icon-check':'icon-set'
        let icon2 = this.state.isSelect?'iconfont icon-selected':'iconfont icon-select'

        return (
            <div>
                <TopBar title="员工管理" backUrl="/accounts/shop" >
                    <a className={'iconfont fr '+icon1} onClick={this.switchEdit.bind(this)} ></a>
                </TopBar>
                <div className="app-content fx-hd bg-white">
                    <div className="mod-link-list">
                        <ul>
                            <li>管理员：{admin ? admin.account : ""}</li>
                            {
                                users.map((item, index) => {
                                    return <User key={index} user={item} isSelect={this.state.isSelect}
                                        switchSelect={this.switchSelect.bind(this)}
                                        status={this.state.editUsers} />
                                })
                            }
                        </ul>
                        {(() => {
                            if(this.state.editUsers) return (
                                <div className="mtl">
                                    <Link to="/accounts/add_employee" className="mod-btn primary block">新增员工</Link>
                                </div>
                            )
                        })()}
                    </div>
                </div>
                {(() => {
                    if(this.state.editUsers) return (
                        <div className="app-footer">
                            <a href="javascript:;" className="btn-fr" onClick={this.deleteAccount.bind(this)}>删除</a>
                            <span className="mod-select mrs" onClick={this.chooseAll.bind(this)}><i className={icon2} /></span>全选
                        </div>
                    )
                })()}
            </div>
        )
    }
}

class User extends Component<any, any> {
    static defaultProps = {
        key: '',
        user: '',
        status: '',
        isSelect: '',
        switchSelect: ''
    }

    constructor(props) {
        super(props)
        this.state = {
            index: props.key,
            user: props.user,
            isSelect: props.isSelect
        }
    }

    componentWillReceiveProps(nextProps){
		this.setState({
			isSelect: nextProps.isSelect
		});
	}

    disable(item) {
        let result = '确定禁用该员工吗？';
        let rv = {
            id: item.id,
            account: item.account,
            status: 2
        }

        Confirm({
            title: "提示",
            content: result,
            btnText: ["取消","确定"],
            onOk:() => {
                api.shop.manage.disable_account({disableUserId: item.id}).then(res => {
                    if (!res.errorId) this.setState({user: rv});
                })
            },
            onCancel:() => {
                return;
            }
        });
    }

    enable(item) {
        let rv = {
            id: item.id,
            account: item.account,
            status: 1
        }
        api.shop.manage.enable_account({enableUserId: item.id}).then(res => {
            if (!res.errorId) this.setState({user: rv});
        })
    }

    switchSelect(item){
        let bool = this.state.isSelect?false:true;
        this.setState({isSelect: bool})

        if(bool){
            ids.push(item.id)
        }else{
            ids = _.difference(ids,[item.id])
        }

        this.props.switchSelect()
    }

    queryItem(item) {
        let items = {
            1: <a href="javascript:;" onClick={this.disable.bind(this,item)} className="mod-checkbox open fr">
                <input type="checkbox"/>
                <label />
            </a>,
            2: <a href="javascript:;" onClick={this.enable.bind(this,item)} className="mod-checkbox fr">
                <input type="checkbox"/>
                <label />
            </a>
        };

        let icon = this.state.isSelect?'iconfont icon-selected':'iconfont icon-select'

        if(this.props.status){
            return <span className="mod-select mrm" onClick={this.switchSelect.bind(this,item)}><i className={icon}></i></span>;
        }else{
            return items[item.status];
        }

    }

    render() {
        return (
            <li key={this.state.index}>
                {this.queryItem(this.state.user)}
                {this.state.user.account}
            </li>
        )
    }
}
