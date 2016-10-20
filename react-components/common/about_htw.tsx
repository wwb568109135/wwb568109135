import {Component} from "react";
import TopBar from "./TopBar";

export default class Htw extends Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <TopBar title="关于"/>
                <div className="app-content fx-hd">
                    <div className="mod-blankslate about-us">
                        <Link to="/" className="logo"/>
                        <p className="light center mas">Web 2.3001</p>
                        <img className="wxcode" src="/img/wxcode.png" alt/>
                        <p className="center">扫描二维码</p>
                        <p className="center">让朋友也加入HTW店家</p>
                        <div className="icp">
                            <p className="light center">Copyright© 2002-2016</p>
                            <p className="light center">HTW公司版权所有</p>
                            <p className="light center">粤ICP备14101245号</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
