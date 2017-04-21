import {Component} from "react";


export default class Nav extends Component<any, any> {
    static defaultProps = {
        location: 0
    }

    constructor(props) {
        super(props)
    }

    render() {
        let map = [
            '/manage',
            '/purchase',
            '/accounts'
        ];
        let locat = map.indexOf(location.pathname);

        return (
            <div className="app-nav">
                <Link to="/manage" className={locat==0?'current':''}><i className="iconfont icon-menu"/>管家</Link>
                <Link to="/purchase" className={locat==1?'current':''}><i className="iconfont icon-car"/>采购</Link>
                <Link to="/accounts" className={locat==2?'current':''}><i className="iconfont icon-user"/>个人</Link>
            </div>
        )
    }

}
