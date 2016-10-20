import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Router } from 'react-router'
import * as api from '../../api'

interface states {
    src?: string
}

export default class ImageVerify extends Component<{style?:any}, states> {
    constructor(props) {
        super(props);
        this.state = {
            src: ""
        }
    }
    componentDidMount() {
        this.loadData();
    }
    loadData(){
        api.shop.account.getImageCode().then(res => {
            this.setState({
                src:"data:image/jpg;base64,"+res.imgCode
            });
        });
    }
    render() {
		let style = this.props.style || {};
        return (
            <span style={style} className={this.state.src ? "" : "hidden"}>
                <img className="verify-img" src={this.state.src} onClick={this.loadData.bind(this) } />
                <a onClick={this.loadData.bind(this) }> 刷新</a>
            </span>
        )
    }
}
