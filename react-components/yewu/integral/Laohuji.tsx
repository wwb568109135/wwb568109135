import * as api from "../../api";
import Toast from './../../components/common/Toast'

interface props {
    prizeId:string
    showdom: boolean
    isShowLaohuji: boolean
    isFisrtBind: boolean
    laohuji_callback:(status:string,recordId:string)=> void
}
export default class Laohuji extends Common.Warp<props, any> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let that = this;
        if (!this.props.isFisrtBind && !this.props.isShowLaohuji) {
            console.log("组件绑定逻辑处理")
            var oli: any = $(".li_box"),
                reset: any = $(".reset"),
                btn: any = $("#slotMachineButton"),
                odl: any = $(".dl_box"),
                Let = 10,
                timer = null,
                str = "";

            //构造 dl 下的结构
            for (var i = 0; i < odl.length; i++) {
                var html = $(odl[i]).html();
                $(odl[i]).html("");
                $(odl[i]).html(stradd(html, 2));
            };
            function stradd(str, size) {
                if (Object.prototype.toString.call(str) == "[object String]") {
                    for (var i = 0; i < size; i++) {
                        str += str;
                    };
                } else {
                    return "数据类型错误";
                }
                return str;
            }
            //构造 dl 下的结构 介绍

            function getStyle(obj, name) {
                let _window: any = window;
                return obj.currentStyle ? obj.currentStyle[name] : _window.getComputedStyle(obj, false)[name];
            }

            function starmove(obj, json, funEnd) {
                clearInterval(obj.timer);
                var Bstop = true;
                obj.timer = setInterval(function() {
                    for (var attr in json) {
                        var speed = 0;
                        if (attr == "opacity") {
                            let __getStyle: any = getStyle(obj, attr) * 100;

                            var cur = Math.round(parseFloat(__getStyle));
                        } else {
                            var cur = parseInt(getStyle(obj, attr));
                        }
                        speed = (json[attr] - cur) / 20;
                        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                        if (cur != json[attr]) {
                            Bstop = false;
                        } else {
                            Bstop = true;
                        }

                        if (attr == "opacity") {
                            obj.style.opacity = (cur + speed) / 100;
                        } else {
                            obj.style[attr] = cur + speed + "px";
                        }
                    }

                    if (Bstop) {
                        clearInterval(obj.timer);
                        if (funEnd) funEnd();
                    }
                }, 30)
            }
            function run(iszhongjiang, zhongjiangStr,status,recordId) {
                for (var i = 0; i < oli.length; i++) {
                    // oli[i].value=Math.floor(Math.random()*10);
                    oli[i].value = zhongjiangStr.split("|")[i];

                    // debugger
                    var Num = parseInt(oli[i].value),
                        odl = oli[i].getElementsByTagName("dl")[0],
                        odd = odl.getElementsByTagName("dd"),
                        size = odd.length,
                        height = odl.offsetHeight,
                        tops = odd[Num + (size - Let)].offsetTop;
                    odl.style.top = 0;
                    str += Num;
                    starmove(odl, { "top": -(tops) }, function() {
                        var Result = parseInt(str);
                        console.log("Result[" + i + "]:" + Result);

                        setTimeout(()=>{
                            that.props.laohuji_callback(status,recordId)
                            let __islog = iszhongjiang ? ("恭喜获得了奖,编号是：" + zhongjiangStr) : "没有中奖了 编号是：" + zhongjiangStr;
                            log( __islog );
                            $("#slotMachineButton").show()
                        },500)
                        return;
                    });
                };
            }

            function getRandomArrayElements(arr, count) {
                var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
                while (i-- > min) {
                    index = Math.floor((i + 1) * Math.random());
                    temp = shuffled[index];
                    shuffled[index] = shuffled[i];
                    shuffled[i] = temp;
                }
                return shuffled.slice(min);
            }

            $("#slotMachineButton").on("click.slotMachineButton", () => {
                str = "";
                var __zhongjiangStr;
                api.shop.integralPrize.prize_draw({
                    prizeId: util.getParam("prizeId")
                }).then(rv => {
                    log("执行老虎机里面的抽奖接口调用")
                    log(rv)
                    let __status = rv.status
                    // debugger
                    if(rv.errorId){
                        log("服务器报错了，无法抽奖-1-提前返回")
                        // Toast("服务器异常，无法抽奖，请稍后再试！-1")
                        that.props.laohuji_callback(__status,"")
                        return;
                    }

                    var __iszhongjiang;
                    var __recordId="";
                    // debugger
                    if (rv.status == "HIT"){
                        let  __rv:any = rv;
                        let  recordId:any = __rv.recordId;
                        __recordId = recordId;
                        __iszhongjiang = true;
                    }else if (rv.status == "NOT_HIT"){
                        __iszhongjiang = false;
                    }else {
                        __iszhongjiang = "error"
                    }

                    // var __Arr = [0, 1, "error"];
                    // var __n = Math.floor(Math.random() * __Arr.length + 1) - 1;
                    // var __iszhongjiang = __Arr[__n];
                    // var __iszhongjiang = 1;

                    console.log("__iszhongjiang:", __iszhongjiang)
                    if (__iszhongjiang == "error") {
                        log("服务器报错了，无法抽奖-2-提前返回")
                        // Toast("服务器异常，无法抽奖，请稍后再试！");
                        that.props.laohuji_callback(__status,"")
                        return;
                    }
                    var items = ['0', '1', '2', '4', '5'];

                    if (__iszhongjiang) {
                        var num = Math.floor(Math.random() * 10);
                        __zhongjiangStr = num + "|" + num + "|" + num;
                    } else {
                        __zhongjiangStr = getRandomArrayElements(items, 3).join("|");
                    }

                    for (var i = 0; i < 5; i++) {
                        console.log('调试：getRandomArrayElements:', getRandomArrayElements(items, 3).join("|"))
                    }
                    console.log("__zhongjiangStr:", __zhongjiangStr)
                    $("#slotMachineButton").hide()
                    //滚动逻辑
                    run(__iszhongjiang, __zhongjiangStr,__status,__recordId);
                });
            })
        }
    }
    componentWillUnmount() {
        $("#slotMachineButton").off("click.slotMachineButton")
    }

    content() {
        if (!this.props.showdom) {
            return null
        }
        return (
            <div id="laohuji" className={"mod-pop-box"} style={{ display: this.props.isShowLaohuji ? "block" : "none" }}>
                <div className="pop-inner">
                    <div className="app-select">
                        <div className="draw-wrap" style={{ overflow: "hidden" }}>
                            <ul id="ul_box">
                                <li className="li_box">
                                    <dl className="dl_box">
                                        <dd className="slot bg_0" />
                                        <dd className="slot bg_1" />
                                        <dd className="slot bg_2" />
                                        <dd className="slot bg_3" />
                                        <dd className="slot bg_4" />
                                        <dd className="slot bg_5" />
                                    </dl>
                                </li>
                                <li className="li_box">
                                    <dl className="dl_box">
                                        <dd className="slot bg_0" />
                                        <dd className="slot bg_1" />
                                        <dd className="slot bg_2" />
                                        <dd className="slot bg_3" />
                                        <dd className="slot bg_4" />
                                        <dd className="slot bg_5" />
                                    </dl>
                                </li>
                                <li className="li_box">
                                    <dl className="dl_box">
                                        <dd className="slot bg_0" />
                                        <dd className="slot bg_1" />
                                        <dd className="slot bg_2" />
                                        <dd className="slot bg_3" />
                                        <dd className="slot bg_4" />
                                        <dd className="slot bg_5" />
                                    </dl>
                                </li>
                            </ul>

                        </div>
                    </div>
                    <div className="pop-ft">
                        <a href="javascript:;" id="slotMachineButton">开始抽奖</a>
                    </div>
                </div>
            </div>
        )
    }

}
