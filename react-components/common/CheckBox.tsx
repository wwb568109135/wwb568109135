/**
 * Created by bear on 2016/7/05.
 */

import { Component } from "react";


interface Props{
    onChange?: Function,
    className?: string,
    style?: string,
    value?: string,

    disabled?: boolean,
    checked?: boolean
}

export class CheckBox extends Component<Props, any> {
    constructor(props){
        super(props);
        this.state = {
            checked: this.props.checked
        }
    }

    checkedChange(e){
        const {onChange, value} = this.props;

        this.setState({
            checked: e.target.checked
        });

        if(onChange) onChange(e, value);
    }

    render(){
        let {disabled, style, className, children} = this.props;
        const {checked} = this.state;

        return (
            <label style={style} className={className}>
                <input type="checkbox" disabled={disabled}
                    checked={checked} onChange={this.checkedChange.bind(this)} />
                {children}
            </label>
        )
    }
}
