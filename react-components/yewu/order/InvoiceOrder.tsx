import {Component} from "react";

interface Props {
    data?: string
    // current?: string,
    // islogin?: boolean
}
export default class InvoiceOrder extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    render() {
        // if (!this.props.islogin ) {
        //     util.gotoUrl("/login")
        //     return
        // }
        return (
            <div>
                <div className="mod-link-list separation">
                    <ul>
                        <li>
                            发票信息
                                <span className="fr">开具发票请拨
                                    <a className="light" href="tel://4001191159" style={{display:"inline"}}>{this.props.data}</a>
                                    <i style={{display:"none"}} className="iconfont icon-arrowright" />
                                </span>
                                <span style={{display:"none"}} className="fr">不开具发票 <i
                                    className="iconfont icon-arrowright"/></span>

                        </li>
                    </ul>
                </div>
                {this.props.children}
            </div>
        )
    }
}
