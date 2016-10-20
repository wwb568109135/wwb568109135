import { Component } from "react";
import * as api from "../../api";
import TopBar from "../../components/TopBar";
import Empty from "../../components/common/Empty";
import ListView from "../../components/common/ListView";
import { Confirm } from "../../components/common/Modal";

const imgHost = Common.imageHost;

export default class Service extends Common.Warp<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            isLastPage: false,
            useLoading: true,
            items: [],
        }
    }

    needLogin = true

    page = 0

    static mapStateToProps(state, ownProps) {
        return {
            login: state.loginState.login
        }
    }

    loadData() {
        let req = api.shop.manage.list_o2o_service({ 'pn': 0 });
        req.then(res => {
            if (res.items.length < 10) this.setState({ isLastPage: true, useLoading: false })
        });

        return req;
    }

    onBottom() {
        if (this.state.isLastPage) return;

        this.page++;

        api.shop.manage.list_o2o_service({ 'pn': this.page }).then(res => {
            const items = this.state.items.concat(res.items);
            let isLastPage = this.state.isLastPage;
            if (items.length >= res.totalCount)  isLastPage = false;

            this.setState({ items, isLastPage });

        });
    }

    content() {
        let serviceList = this.state.items;

        let temp = <ListView className="app-content fx-hd bg-white" onBottom={this.onBottom.bind(this)}
                             useLoading={this.state.useLoading}>
            <div className="mod-pic-list">
                <ul>
                    {
                        serviceList.map((item, index) => {
                            return <ShopService key={index} service={item}/>
                        })
                    }
                </ul>
            </div>
            <div className={this.state.isLastPage?"mod-end":"mod-end hidden"}>
                <p><i className="iconfont icon-end"/></p>
                <p>已经到底了</p>
            </div>
        </ListView>

        if (serviceList.length === 0) {
            temp = <Empty content="暂无商品"/>
        }

        return (
            <div>
                <TopBar title="商品列表"/>
                {temp}
            </div>
        )
    }
}

class ShopService extends Component<any, any> {
    static defaultProps = {
        key: '',
        service: ''
    }

    constructor(props) {
        super(props)
        this.state = {
            key: props.key,
            item: props.service
        }
    }

    showMsg(status, item) {
        let result = status ? "申请上架" : "确定下架";
        Confirm({
            title: "提示",
            content: result + "该商品吗？",
            btnText: [ "取消", "确定" ],
            onOk: () => {
                if (status) return this.applyService(item);
                this.unApplyService(item);
            },
            onCancel: () => {
                return;
            }
        });
    }

    applyService(item) {
        let rv = {
            id: item.id,
            name: item.name,
            photoIds: item.photoIds,
            price: item.price,
            salesCount: item.salesCount,
            status: 3
        }

        api.shop.manage.enable_o2o_service({ "productId": item.id }).then(res => {
            if (!res.errorId) this.setState({ item: rv });
        })
    }

    unApplyService(item) {
        let rv = {
            id: item.id,
            name: item.name,
            photoIds: item.photoIds,
            price: item.price,
            salesCount: item.salesCount,
            status: 4
        }

        api.shop.manage.disable_o2o_service({ "productId": item.id }).then(res => {
            if (!res.errorId) this.setState({ item: rv });
        })
    }

    queryItem(item) {
        let items = {
            0: <span className="mod-btn">无效</span>,
            1: <a href="javascript:;" onClick={this.showMsg.bind(this,0,item)} className="mod-btn primary small">下架</a>,
            2: <span className="mod-btn">草稿</span>,
            3: <span className="mod-btn">待审核</span>,
            4: <a href="javascript:;" onClick={this.showMsg.bind(this,1,item)}
                  className="mod-btn primary small">申请上架</a>
        };
        return items[ item.status ];
    }

    render(){
        const photoIds = this.state.item.photoIds || '';
        return (
            <li key={this.state.index}>
                <a className="pic">
                    <img src={`http://www.91htw.com/img-${photoIds.split(",")[0]}_160x160.do`}/>
                </a>
                <div className="cont">
                    <h3 className="title">
                        <a href="javascript:;">{this.state.item.name}</a>
                    </h3>
                    <div className="now-price">￥{this.state.item.price}</div>
                    <div className="light">销量：{this.state.item.salesCount}</div>
                    {this.queryItem(this.state.item)}
                </div>
            </li>
        )
    }

}
