import * as api from "../../api";
import Toast from "./../common/Toast";

const dayTimeStamp = 24 * 60 * 60 * 1000;

export default class SignPop extends Common.Warp<any,
    serverApi.shop.jifen.get_signIn_info.Response &
    {
        display: string,
        showContent: number,
        signIn: serverApi.shop.jifen.signIn.Response
    }
    > {
    constructor(props) {
        super(props);

        this.initState({
            hasSignTimeMap: {},
            signIn: {},
            display: 'none',
            showContent: 1
        });
    }
    componentDidMount() {
        Common.Event.subscribe("integral.signPop.show", (data) => {
            if (data.isShow) {
                this.show();
            } else {
                this.hide();
            }
        });
    }
    componentWillUnmount() {
        Common.Event.unsubscribe("integral.signPop.show")
    }
    show() {
        api.shop.integral.get_signIn_info({})
            .then(res=>{
                if (!res.errorId) {
                    let nowTimeStamp = new Date().getTime();
                    let date  = util.date(nowTimeStamp, 'yyyy-MM-dd');
                    let result = '';
                    if(res.hasSignTimeMap[date]){
                        result = 'ALREADY_SIGN_IN'
                    }

                    this.setState({
                        hasSignTimeMap: res.hasSignTimeMap,
                        display: 'block',
                        signIn: {
                            result: result
                        }
                    })
                }else {
                    Toast(<span>{res.errorDesc || "签到失败"}</span>, 2000)
                }
            })
    }
    hide(e?) {
        e.preventDefault();
        this.setState({
            display: 'none',
            showContent: 1
        })
    }
    signIn(e) {
        e.preventDefault();
        api.shop.integral.signIn({})
            .then((res) => {
                if (!res.errorId) {
                    this.setState({
                        showContent: 2,
                        signIn: res
                    })
                }else {
                    Toast(<span>{res.errorDesc || "签到失败"}</span>, 2000)
                }

            });

    }
    stopPropagation(e) {
        e.stopPropagation();
    }
    calendarCon() {
        let now = new Date();
        let date = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日'
        let todayTimeStamp = now.getTime();
        let calendarDates = [];
        let firstDay;


        calendarDates.push({
            date: new Date(todayTimeStamp).getDate(),
            dateTime: util.date(todayTimeStamp, 'yyyy-MM-dd')
        })



        for (let index = 1; index <= 15; index++) {
            let time = todayTimeStamp - index * dayTimeStamp;
            let date = new Date(time);
            calendarDates.unshift({
                date: date.getDate(),
                dateTime: util.date(time, 'yyyy-MM-dd')
            });
            if (index == 15) {
                firstDay = date.getDay();

            }
        }

        for (let index = 1; index <= 15; index++) {
            let time = todayTimeStamp + index * dayTimeStamp;
            let date = new Date(time);
            calendarDates.push({
                date: date.getDate(),
                dateTime: util.date(time, 'yyyy-MM-dd')
            });
        }

        return (

            <div className="pop-inner pop-sign" onClick={this.stopPropagation}>
                <div className="head">
                    <h4>签到领t豆</h4>
                    <p>{date}</p>
                </div>
                <div className="calendar">
                    <table>
                        <thead>
                            <tr>
                                <th>日</th>
                                <th>一</th>
                                <th>二</th>
                                <th>三</th>
                                <th>四</th>
                                <th>五</th>
                                <th>六</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                (() => {
                                    let tds: any = [];
                                    let trs: any = [];
                                    for (let j = 0; j < Math.ceil((calendarDates.length + firstDay) / 7); j++) {

                                        for (let i = j * 7; i < (j + 1) * 7; i++) {

                                            if (i < firstDay || !calendarDates[i - firstDay]) {
                                                tds.push(<td></td>);
                                            } else {
                                                tds.push(<td className={ this.state.hasSignTimeMap[calendarDates[i - firstDay].dateTime]==true?'active':'' }>{calendarDates[i - firstDay].date}</td>);
                                            }

                                        }
                                        trs.push(React.createElement('tr', {}, tds));
                                        tds = [];

                                    }

                                    return trs;

                                })()
                            }


                        </tbody>
                    </table>
                </div>
                <div className="center">
                    {
                        this.state.signIn.result == 'ALREADY_SIGN_IN' ?
                            <a href="#" ref='signIn'  className="mod-btn disabled" onClick={this.hide.bind(this) }>已经签到</a>:
                            <a href="#" ref='signIn'  onClick={this.signIn.bind(this) } className="mod-btn highlight">点击签到</a>
                    }
                </div>
            </div>

        )
    }
    signedCon() {
        return (
            <div className="pop-inner pop-signed" onClick={this.stopPropagation}>
                {
                    this.state.signIn.result == 'SUCCESS' ?
                        <div>
                            <h4 className="title">
                                <div className="mod-amount">
                                    <span className="num">
                                        <i className="iconfont icon-check" />
                                    </span>
                                </div>
                                完成签到！
                            </h4>
                            <p>恭喜您，本次签到获得<span className="highlight mhs">{this.state.signIn.jifen}</span>个t豆！<br />太棒了！您已经连续签到{this.state.continueSignCount+1}天，可用t豆<span className="highlight mhs">{this.state.signIn.currentJifen}</span>个。<br />赶紧去商城兑换吧！更多立减优惠等着你~</p>

                        </div> : null
                }
                {
                    this.state.signIn.result == 'ALREADY_SIGN_IN' ?
                         <h4 className="title">
                            <div className="mod-amount">
                                <span className="num">
                                    <i className="iconfont icon-check" />
                                </span>
                            </div>
                            今天已经签到过了
                        </h4>
                        :null
                }

                <div className="pop-ft btns">
                    <Link to="/integral/record">去查看</Link>
                    <a href="#"  onClick={this.hide.bind(this) }>知道了</a>
                </div>
            </div>
        )
    }
    content() {

        return (
            <div className="mod-pop-box" style={{ display: this.state.display }}  onClick={this.hide.bind(this) }>
                {
                    this.state.showContent == 1 ?
                        this.calendarCon() :
                        this.signedCon()
                }
            </div>
        )
    }

}
