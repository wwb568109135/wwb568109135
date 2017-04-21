import { Component} from 'react'
import {render} from "react-dom";

interface Props{
	visible?:boolean,
	timeout:number,//显示时长
	text?:string|JSX.Element // 提示文案
}

interface states {
	text?:string | JSX.Element,
    visible:boolean
}

export class ToastClass extends Component<Props, states> {
    constructor(props) {
        super(props);
		this.state = {
			text:this.props.text || "",
			visible:this.props.visible
		}
    }

	componentWillReceiveProps(nextProps){
		if(this.state.visible){
			return;
		}
		this.setState({
			text:nextProps.text || "",
			visible:nextProps.visible
		});
		this.timeoutHide();
	}

	componentDidMount(){
		this.timeoutHide();
	}

	timeoutHide(){
		let timeout = this.props.timeout - 1000;
		setTimeout(() => {
			$(".b2b-toast").css({
				opacity:0
			});
			setTimeout(() => {
				this.setState({
					visible:false
				});
			},200);
		},timeout);
	}

    render() {

		if(!this.state.visible){
			return <span/>
		}
        return (
			<div className="b2b-toast">{this.state.text}</div>
        )

    }

}

export default function Toast(text,timeout?) {
	let t = timeout || 3000;
    let toastBox = document.getElementById('_toastBox_');
    if (!toastBox) {
        toastBox = document.createElement("span");
        toastBox.id = "_toastBox_";
        document.body.appendChild(toastBox);
    }
    render(
        <ToastClass
            text={text}
			timeout={t}
            visible={true}
        />, toastBox);
}
