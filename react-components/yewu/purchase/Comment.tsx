import {Component} from "react";

interface Props {
    // 评论
    comment:string
}

export default class Comment extends Component<Props, any> {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        comment: ""
    }

    render() {
        let comment = this.props.comment;

        return (
            <li>
                <h4>用户留言：<span className="light">{comment}</span></h4>
            </li>
        )
    }
}
