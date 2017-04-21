import {Component} from "react";

interface Props {
    data:string,
    onMessageFn:()=>void,
    sub?:string,
    current?:string,
    subUrl?:string
}
export default class MessageOrder extends Component<Props, any> {
    constructor(props) {
        super(props);
        // this.initState({
        // 	productStar:0
        // });
        // this.state = {
        //     value:this.props.data
        // }
    }

//     componentWillReceiveProps(nextProps) {
//         log(nextProps)
//         this.setState({
//             value:nextProps.data
//         })
//     }
    // onMessageFn(e){
    //     this.setState({
    //         value:e.target.value
    //     })
    //     this.props.onMessageFn(e.target.value);
    // }
    render() {
        // log(this.props)
        return (
            <div>
                <div className="mod-link-list no-m">
                    <ul>
                        <li>留言</li>
                        <li>
                <textarea placeholder="有什么特别的要求，请在这里告诉我们。" onChange={this.props.onMessageFn.bind(this)}
                          value={this.props.data}/>
                        </li>
                    </ul>
                </div>
                {this.props.children}
            </div>
        )
    }
}
