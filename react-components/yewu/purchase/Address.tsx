import {Component} from "react";

interface Props {
    // 收货人
    contactName?: string,
    // 收货地址
    address?: string,
    // 联系电话
    contactPhone?: string
}

export default class Address extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        contactName: "",
        address: "",
        contactPhone: "",
    }

    render() {
        let contactName = this.props.contactName;
        let address = this.props.address;
        let contactPhone = this.props.contactPhone;

        return (
            <div className="mod-address bd-img">
                <h2>{contactName}</h2>
                <p className="darkgray mvs">收货地址：{address}</p>
                <p className="darkgray">联系电话：{contactPhone}</p>
            </div>
        )
    }
}
