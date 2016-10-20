import {Component} from "react";

export default class Footer extends Component<{}, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        var map = [
            '/manage',
            '/purchase',
            '/userCenter'
        ];
        var idx = map.indexOf(location.pathname);
        return (
            <div>
                welcome~~ Footer
                <div><Link className={idx == 0 ? "on" : ""} to="/manage">首页</Link></div>
                <div><Link className={idx == 1 ? "on" : ""} to="/purchase">采购</Link></div>
                <div><Link className={idx == 2 ? "on" : ""} to="/userCenter">个人</Link></div>
            </div>
        )
    }
}
