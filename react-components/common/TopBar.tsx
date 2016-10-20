import {Component} from "react";
import { render } from 'react-dom';
import {browserHistory} from "react-router";

interface Props {
    // 标题
    title:string,
    // 头部整体样式名
    headerClsName?: string,
    // 标题样式名
    titleClsName?: string,
    // 返回链接
    backUrl?:string,
    // 返回事件
    backHandler?: () => void,
    // 是否显示返回按钮
    isHideBackIcon?:string
    // 内容
    content?: string
    //右边按键
    right?:string
    //右边按键
    rightClick?:()=>void
}
let historyLength = 1;
browserHistory.listen(e=>{
    switch(e.action){
        case "POP":
            historyLength--;
            break;
        case 'PUSH':
            historyLength++;
            break;
        case "REPLACE":
            //不用处理
    }
    log("historyLength",historyLength)
})

export default class TopBar extends Component<Props, {}> {
    static defaultProps = {
        backUrl: "",
        right:""
    }

    constructor(props) {
        super(props)
    }

    gotoUrl() {
        let backUrl = this.props.backUrl;

        if (!backUrl){
            if(historyLength ==0 ){
                browserHistory.push("/")
            } else {
                browserHistory.goBack();
            }
        }
    }

    render() {
        let hideBackIconStyle = {};
        if (this.props.isHideBackIcon) hideBackIconStyle = {display: 'none'};

        let temp = <a className="iconfont icon-return fl" onClick={this.gotoUrl.bind(this)} style={hideBackIconStyle}/>;
        if (this.props.backUrl) {
            temp = <Link className="iconfont icon-return fl" to={this.props.backUrl} style={hideBackIconStyle}/>
        } else if(this.props.backHandler) {
            temp = <a className="iconfont icon-return fl" onClick={this.props.backHandler} style={hideBackIconStyle}/>;
        }

        let headerClsName = "app-header";
        if(this.props.headerClsName) {
            headerClsName = headerClsName + ' ' + this.props.headerClsName;
        }

        return (
            <header className={headerClsName}>
                {temp}
                {
                    this.props.titleClsName ? <h1 className={this.props.titleClsName || ""}>{this.props.title}</h1> : <h1>{this.props.title}</h1>
                }
                {(() => {
                  if(this.props.right){
                      return <a className="fr" onClick={this.props.rightClick?this.props.rightClick.bind(this):null}>{this.props.right}</a>;
                  }
                })()}
                {this.props.content}
                {this.props.children}
            </header>
        );
    }

}
