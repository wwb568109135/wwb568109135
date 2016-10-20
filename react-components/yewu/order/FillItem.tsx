import {Component} from "react";
import {Alert} from "../common/Modal";

interface Props {
  title?:string,
  text?:string,
  showEvent?:string
}

export default class FillItem extends Component<Props, any> {
    constructor(props) {
        super(props);
    }
    handleClick(e){
        if(this.props.showEvent){
            e.preventDefault();
            Common.Event.publish(this.props.showEvent,{isShow: true});
        }
    }
    render() {
        return (
            <div>
                <div className="mod-link-list separation">
                    <ul onClick={this.handleClick.bind(this)}>
                        <li>
                            <a href="javascript:void(0)">
                                {this.props.title}
                                <span className="fr">
                                    {this.props.text ||""}
                                    <i className="iconfont icon-arrowright"/>
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
                {this.props.children}
            </div>
        )
    }
}
