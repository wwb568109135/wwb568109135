import {Component} from "react";
import TopBar from "../../components/TopBar";


export default class Complete extends Component<any, any> {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <TopBar title="完成" backUrl="address"/>
                <div className="app-content fx-hd">
                    <div className="mod-blankslate order-status">
                        <div className="bg"/>
                        <p className="center fsl">您的联系信息填写完毕！</p>
                        <p className="center fsl">请您再次核实您所提供的联系信息</p>
                        <div className="mod-art-list mhs mtm">
                            <ul>
                                <li>
                                    <h4>姓名名<span>15687569324</span></h4>
                                    <p className="light">广东省广州市朝阳区XX路888号XXXXX大厦XX层1568室</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
