import {Component} from "react";
import {render} from "react-dom";

interface Props {
    title?:string|JSX.Element,
    content?:string|JSX.Element
    visible?:boolean,
    btnText?:string|JSX.Element|Array<string>,
    onOk?:()=>boolean|void,
    onCancel?:()=>void,
    useBtn?:boolean,
    innerClsName?:string,
    type?:string
}

interface States {
    visible:boolean
}

export class Modal extends Component<Props, States> {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible === false ? false : true
        }
    }

    onOk() {
        let onOk = this.props.onOk;
        if (typeof onOk == "function" && onOk() === false) {
            return;
        }
        this.close();
    }
    onCancel(){
        this.close();
        this.props.onCancel && this.props.onCancel();
    }
    close(){
        this.setState({
            visible: false
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        });
    }
    stopPropagation(e){
        e.stopPropagation();
    }
    render() {

        let title = this.props.title || "";
        let content = this.props.content || "";
        let visible = this.state.visible === false ? false : true;
        let children = this.props.children || "";
        let btnText = this.props.btnText;
        let useBtn = this.props.useBtn === false ? false : true;
        let innerClsName = this.props.innerClsName?this.props.innerClsName:"pop-inner";
        let type = this.props.type || "alert";

        if (!this.state.visible) {
            return <span />
        }

        return (
            <div ref="popBox" className="mod-pop-box" onClick={this.onCancel.bind(this)}>
                <div className={innerClsName} onClick={this.stopPropagation}>
                    {(() => {
                        if (title) {
                            return (
                                <div className="pop-hd">
                                    <h3>{title}</h3>
                                </div>
                            )
                        }
                    })()}
                    <div className="pop-bd">
                        {content}
                    </div>
                    {children}
                    {(() => {
                        if (useBtn) {
                            return (
                                <div className={"pop-ft "+(type == "confirm"?"btns":"")}>
                                    {(() => {
                                        if(type == "confirm"){
                                            btnText = btnText || ["否","是"];
                                            return (
                                                <div>
                                                    <a onClick={this.onCancel.bind(this)}>{btnText[0]}</a>
                                                    <a onClick={this.onOk.bind(this)}>{btnText[1]}</a>
                                                </div>
                                            )
                                        }else{
                                            return <a onClick={this.onOk.bind(this)}>{btnText || "确定"}</a>
                                        }
                                    })()}

                                </div>
                            )
                        }
                    })()}
                </div>
            </div>
        )

    }
}

export function Alert(Props) {
    if (typeof Props === "string") {
        Props = {
            title: Props
        };
    }
    let dialogBox = document.getElementById('_dialogBox_');
    if (!dialogBox) {
        dialogBox = document.createElement("span");
        dialogBox.id = "_dialogBox_";
        document.getElementById("root").firstChild.appendChild(dialogBox);
    }
    render(
        <Modal
            title={Props.title}
            visible={true}
            content={Props.content}
            btnText={Props.btnText}
            onOk={Props.onOk}
            onCancel={Props.onCancel}
            useBtn={Props.useBtn}
            innerClsName={Props.innerClsName}
        />, dialogBox);
}

export function Confirm(Props) {
    if (typeof Props === "string") {
        Props = {
            title: Props
        };
    }
    let dialogBox = document.getElementById('_dialogBox_');
    if (!dialogBox) {
        dialogBox = document.createElement("span");
        dialogBox.id = "_dialogBox_";
        document.getElementById("root").firstChild.appendChild(dialogBox);
    }

    render(
        <Modal
            title={Props.title}
            visible={true}
            content={Props.content}
            btnText={Props.btnText}
            onOk={Props.onOk}
            onCancel={Props.onCancel}
            useBtn={true}
            innerClsName={Props.innerClsName}
            type="confirm"
        />, dialogBox);
}
