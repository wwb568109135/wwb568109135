import {Component} from "react";
import { render } from 'react-dom';
import {browserHistory} from "react-router";

// interface Props {
//     // 标题
//     title:string
//     // 返回链接
//     backUrl?:string,
//     // 返回事件
//     backHandler?: () => void,
//     // 是否显示返回按钮
//     isHideBackIcon?:string
//     // 内容
//     content?: string
//     //右边按键
//     right?:string
//     //右边按键
//     rightClick?:()=>void
// }
interface Props {
    // 标题
    DateNotFoundContent:string
}
interface States {
    // 标题
    DateNotFoundContentStates?:string
}
export default class DateNotFound extends Component<Props, States> {
    // static defaultProps = {
    //     DateNotFoundContent: ""
    // }

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <div className="app-content fx-tab">
                <div className="no-coupon-bg"></div>
                <p className="center fsxl mvm">{this.props.DateNotFoundContent}</p>
            </div>
        );
    }

}
