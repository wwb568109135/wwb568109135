import {Component} from "react";
import TopBar from "../TopBar"

interface Props {
	title?:string,
	errorCode?:string,
	text?:string
}

export default class NotFoundPage extends Component<Props, {}> {
    constructor(props) {
        super(props)
    }
    render() {

		let title = this.props.title || "ERROR";
		let errorCode = this.props.errorCode || "404";
		let text = this.props.text || "抱歉，页面出错了~";

        return (
            <div>
                <TopBar title={title} />
                <div className="app-content fx-hd">
                    <div className="mod-blankslate page-error">
                        <div className="bg" />
                        <h3>{errorCode}</h3>
                        <p className="light center fsl">{text}</p>
                    </div>
                </div>
            </div>
        )
    }
}
