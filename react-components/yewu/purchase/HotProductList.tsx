/**
 * Created by roger on 16/6/27.
 */
import * as api from "../../api";
import HotProductItem from "./HotProductItem";
import sales = serverApi.sales;
import LinkedStateMixin = __React.LinkedStateMixin;

export default class HotProductList extends Common.Warp<{onEnd: Function}, sales.list_hot_product.Response> {
    needLoading = false;
    private getCount: number = 0;
    private limit:number = 10;

    constructor(props) {
        super(props);
        this.initState({
            itemList: [],
            totalCount: 0,
        });
    }

    loadData() {
        return api.sales.list_hot_product({ offset: this.getCount, limit: this.limit }).then(res => {
            if (res.errorId) {
                this.props.onEnd();
                return res;
            }
            this.getCount = res.itemList.length;
            if (this.getCount >= res.totalCount) {
                this.props.onEnd();
            }
            return res;
        });
    }

    onBottom() {
        if (this.getCount >= this.state.totalCount) {
            return;
        }

        api.sales.list_hot_product({ offset: this.getCount, limit: this.limit }).then(res => {
            if (res.errorId) return;

            this.setState({itemList: this.state.itemList.concat(res.itemList), totalCount: res.totalCount});
            this.getCount += res.itemList.length;
            if (this.getCount >= this.state.totalCount) {
                this.props.onEnd();
            }
        });
    }


    componentDidMount() {
        Common.Event.subscribe("loadData", (e) => {
            this.onBottom();
        });
    }

    componentWillUnmount() {
        Common.Event.unsubscribe("loadData");
    }

    content() {
        return (
            <div className="mod-index hot-goods">
                <div className="mod-hd">
                    <i className="icon icon-hollow"/>
                    <i className="icon icon-solid"/>
                    <h3>畅销商品</h3>
                    <i className="icon icon-solid"/>
                    <i className="icon icon-hollow"/>
                </div>
                <div className="mod-bd">
                    {/* 图片列表{ */}
                    <div className="mod-pic-list">
                        <ul>
                            {
                            this.state.itemList.map((item, i) => {
                                return <HotProductItem key={item.priceId} {...item} />
                            })
                            }
                        </ul>
                    </div>
                    {/* }图片列表 */}
                </div>
            </div>
        );
    }
}
