import {Component} from "react";

export default class AppTab extends Component<any, any> {
    constructor(props) {
        super(props);
    }
    static defaultProps = {
        locationSearch: ''
    }
    render() {
        let search = this.props.locationSearch ? this.props.locationSearch : '';

        return (
            <div className="app-tab">
                <ul>
                    <li className={!search?'current':'' }>
                        <Link to="/purchase/orderList">全部</Link>
                    </li>
                    <li className={(search=="?state=unpaid") ? "current":""} >
                        <Link to="/purchase/orderList?state=unpaid">待支付</Link>
                    </li>
                    <li className={search=='?state=delivery' ?'current':''} >
                        <Link to="/purchase/orderList?state=delivery">待收货</Link>
                    </li>
                    <li className={search=='?state=complete' ?'current':''}>
                        <Link to="/purchase/orderList?state=complete">待评价</Link>
                    </li>
                    <li className={search=='?state=cancel' ?'current':''}>
                        <Link to="/purchase/orderList?state=cancel">退款</Link>
                    </li>
                </ul>
            </div>

        )
    }
}
