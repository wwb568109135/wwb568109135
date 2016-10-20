import {Component} from "react";
import TopBar from "../../components/TopBar";
import * as api from "../../api";
import {browserHistory} from "react-router";
import toast from '../../components/common/Toast'


export default class AddAddr extends Common.Warp<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            complete: false,
            newName: '',
            newAddress: '',
            newTel: '',
            submitData: ''
        }
    }

    loadData(){
        return api.shop.info.shop_addr_info({});
    }

    addAddress(){
        let refs = this.refs;
        let name = util.trim(refs.name.value);
        let tel = util.trim(refs.tel.value);
        let county = util.trim(refs.county.value);
        let address = util.trim(refs.address.value);

        if(!name || !tel || !address) return toast('请填写完整信息');
        if(!util.mobileReg(tel)) return toast('请输入正确的手机号码');

        let item = {
            contactName: name,
            contactPhone: tel,
            province: this.state.provinceName,
            city: this.state.cityName,
            district: county,
            address: address
        }
        let contact = item.province + item.city + item.district + item.address;

        this.setState({complete: true,submitData: item,newName: name,newAddress: contact,newTel: tel})
    }

    modify(){
        this.setState({complete: false});
    }

    submit(){
        let item = this.state.submitData;
        let source = this.props.location.query.source;
        let url = '/accounts/address';
        
        if(source == 'order') url = '/order';

        api.shop.manage.add_recv_address(item).then(res => {
            if(res.errorId) return toast(res.errorDesc);

            toast('添加成功！');
            util.gotoUrl(url);
        })
    }

    componentDidUpdate(){
        let item = this.state.submitData;
        $(this.refs.name).val(item.contactName);
        $(this.refs.tel).val(item.contactPhone);
        $(this.refs.county).val(item.district);
        $(this.refs.address).val(item.address);
    }

    render() {
        let countyList = this.state.countyList || [];
        let Top = this.state.complete?<TopBar title='请确认' backHandler={this.modify.bind(this)} />:<TopBar title='新增地址' backUrl='/accounts/address' />;

        let addTemp = <div className="app-content fx-hd bg-white">
            <form className="mod-form" acceptCharset="utf-8">
                <ul className="mod-link-list">
                    <li><label className="light">收货人：</label><input ref="name" type="text"/></li>
                    <li><label className="light">电话：</label><input ref="tel" type="text"/></li>
                    <li>
                        <label className="light">地址：</label>
                        {this.state.provinceName} - {this.state.cityName} -
                        <select ref="county">
                            {
                                countyList.map((item,index) => {
                                    return (
                                        <option key={item.id} value={item.name}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                        <i className="iconfont icon-arrowright fr"/>
                    </li>
                    <li><label className="light">详细地址：</label><input ref="address" type="text"/></li>
                </ul>
                <div className="mtl">
                    <a href="javascript:;" onClick={this.addAddress.bind(this)} className="mod-btn primary block">完成</a>
                </div>
            </form>
        </div>

        let compTemp = <div className="app-content fx-hd">
            <div className="mod-blankslate order-status">
                <div className="bg"/>
                <p className="center fsl">您的联系信息填写完毕！</p>
                <p className="center fsl">请您再次核实您所提供的联系信息</p>
                <div className="mod-art-list mhs mtm">
                    <ul>
                        <li>
                            <h4><span>{this.state.newName} </span>{this.state.newTel}</h4>
                            <p className="light">{this.state.newAddress}</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="mod-btns ptm phm">
                <a href="javascript:;" className="mod-btn default" onClick={this.modify.bind(this)} >返回修改</a>
                <a href="javascript:;" className="mod-btn primary" onClick={this.submit.bind(this)} >确认</a>
            </div>
        </div>

        let template = this.state.complete?compTemp:addTemp

        return (
            <div>
                {Top}
                {template}
            </div>
        )
    }
}
