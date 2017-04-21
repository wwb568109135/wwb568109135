import {Component} from "react";

interface Props {
    data:number
    submitFn?:()=>void
    subUrl?:string
}
export default class SubmitInfoOrder extends Component<Props,any> {
    constructor(props) {
        super(props);
        // this.initState({
        // 	productStar:0
        // });
    }

    render() {
        return (
            <div className="app-footer">
                <a href="javascript:void(0)" className="btn-fr" onClick={this.props.submitFn.bind(this)}>提交订单</a>
                共计￥{this.props.data}
            </div>
        )
    }
}
