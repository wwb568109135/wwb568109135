import {Component} from "react";

interface Props {
    data:{
        receiverName?:string,
        contactPhone?: string,
        address?: string,
        recvAddressId?: string
    }
    chooseAddressUrlParam:string
}
export default class AddressOrder extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    goChooseAddress() {
        if(this.props.chooseAddressUrlParam == ""){
            util.gotoUrl("/order/chooseAddress")
        }else{
            util.gotoUrl("/order/chooseAddress?"+this.props.chooseAddressUrlParam)
        }
    }

    render() {
        log(this.props)
        return (
            <div>
                <div className="mod-box-list bd-img">
                    <h3 className="details-hd blue">收货地址：</h3>
                    <div className="mod-address" onClick={this.goChooseAddress.bind(this)}>
                        <h3>{this.props.data.receiverName}  {this.props.data.contactPhone}  <i className="fr iconfont icon-arrowright" /></h3>
                        <p>{this.props.data.address} </p>
                    </div>
                </div>
                {this.props.children}
            </div>
        )
    }
}
