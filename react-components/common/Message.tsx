/**
 * Created by bear on 2016/7/05.
 */

import { Component } from "react";


interface Props{
    content?: string | JSX.Element,
    className?: string,
    position?: string,
    closeNode?: string | JSX.Element,
    style?: string,
    onClose?: Function,
    delay?: number
}

export default class Message extends Component<Props, any> {
    constructor(props){
        super(props);
        this.state = {
            delay: 5000,
            className: '',
            position: 'center',
            closeNode: <i>x</i>
        }
    }

    delayJob = null

    handleClose(){
        const {onClose} = this.props;

        onClose();
        clearTimeout(this.delayJob);

        this.setState({display: false});
    }

    handleDisplay(){
        const {display} = this.state;
        const {delay} = this.props;
        this.setState({display: !display});

        if(!display){
            this.delayJob = setTimeout(() => this.setState({ display: false}), delay);
        }else{
            clearTimeout(this.delayJob);
        }
    }

    render(){
        let {children, content, className, position, closeNode, style, onClose} = this.props;
        const {display} = this.state;
        className += ` _${position}`;
        if (display) className += ' _active';

        let msgNode = <div className="_message">
                        {content}
                    </div>

        if(onClose){
            msgNode = <div className="_message">
                        <div className="_wrap">
                            {content}
                        </div>
                        <div className="_close" onClick={this.handleClose.bind(this)}>
                            {closeNode}
                        </div>
                    </div>;
        }

        return (
            <div className={`ui message ${className}`} style={style}>
                <div className="_trigger" onClick={this.handleDisplay.bind(this)}>
                    {children}
                </div>
                {msgNode}
            </div>
        )
    }
}
