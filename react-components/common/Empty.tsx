import {Component} from "react";


interface Props {
    // 描述内容
    content?: string
}

export default class Empty extends Component<Props, any> {
    constructor(props) {
        super(props)
    }

    render() {
        const content = this.props.content?this.props.content:'暂无内容';

        return (
            <div className="app-content fx-tab">
                <div className="no-coupon-bg"></div>
                <p className="center fsxl mvm">{content}</p>
            </div>
        );
    }
}
