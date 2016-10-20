import { Component} from 'react'
import * as api from '../../api'

interface Props{
	visible?:boolean,
	defaultValue?:{
		width:string,
		aspectRatio:string,
		size:string
	},
	onOk?:(any)=>void,
	widths?:Array<any>,
	aspectRatios?:Array<any>,
	sizes?:Array<any>,
	type?:string,
	subs?:Array<any>,
	onClose?:()=>void
}

export default class SizeSelect extends Component<Props, any> {
    constructor(props) {
        super(props);
		this.state = {
			visible:this.props.visible || false,
			pageY:0,
			width:this.props.defaultValue.width || "",
			aspectRatio:this.props.defaultValue.aspectRatio ||"",
			size:this.props.defaultValue.size ||"",
			itemHeight:26,
			type:this.props.type || "tyre"
		}
    }
	componentWillReceiveProps(nextProps){
		this.setState({
			visible:nextProps.visible
		});
		this.state.type = nextProps.type;
		this.state.width = nextProps.defaultValue.width;
		this.state.aspectRatio = nextProps.defaultValue.aspectRatio;
		this.state.size = nextProps.defaultValue.size;
	}
	close(e?){
		e && e.stopPropagation();
		this.setState({
			visible:false
		});
		this.props.onClose && this.props.onClose();
	}
	touchStart(cls,e){
		this.state.itemHeight = $("."+cls).find('p:not(".current")').height();
		let touch = e.touches[0] || e.targetTouches[0];
		this.state.pageY = touch.pageY;
	}

	widthTouchMove(e){
		let target = $(".widthPanel");
		let value = this.calc(e,target);
		this.state.width = value;
	}
	ratioTouchMove(e){
		let target = $(".ratioPanel");
		let value = this.calc(e,target);
		this.state.aspectRatio = value;
	}
	sizeTouchMove(e){
		let target = $(".sizePanel");
		let value = this.calc(e,target);
		this.state.size = value;
	}
	touchEnd(cls,e){
		let target = $("."+cls);
		let idx = target.find(".current").index();
		let itemHeight = this.state.itemHeight;
		target.css({
			"transition": "all 300ms ease-in-out",
			"-webkit-transform":"translate(0px,"+(-itemHeight*idx)+"px)",
			"transform":"translate(0px,"+(-itemHeight*idx)+"px)"
		});
		this.doInfluence(cls);
	}
	doInfluence(cls){
		let index = cls == "widthPanel"?0:cls == "ratioPanel"?1:2;
		let sub = this.props.subs[index];
		let IFindex = 0;
		this.props.subs.map((item,i)=>{
			if(item.key == sub.influence){
				IFindex = i;
			}
		});
		if(sub.influence){
			api.product.filterInfo({
                "type": this.state.type,
                "attrKey":sub.influence,
                "depend": [
                    {
                        "key": sub.key,
                        "value":this.state[sub.key]
                    }
                ]
            }).then(res => {
                log("select change",res);
				for(let i = 0; i < res.itemList.length; i++ ){
					if(res.itemList[i].type == this.state.type){
						this.state[sub.influence+"s"] = res.itemList[i].filters[0].option;
					}
				}
                this.state[sub.influence] = "";
                this.forceUpdate();
				let $target = $(".scroll-panel").eq(IFindex);
				$target.css({
					"-webkit-transform":"translate(0px,0px)",
					"transform":"translate(0px,0px)"
				});
				this.setTintClass($target,0);
            });
		}
	}

	calc(e,target){
		e.preventDefault();
		e.stopPropagation();
		let touch = e.touches[0] || e.targetTouches[0];
		let dtY = touch.pageY - this.state.pageY;
		let oldY = this.getComputeTranslateY(target);
		let calcY = oldY+dtY;
		let $items = target.find("p");
		this.state.pageY = touch.pageY;
		let itemHeight = this.state.itemHeight;
		let idx = -Number((calcY/itemHeight).toFixed(0));
		if(idx < 0){
			idx = 0;
		}
		if(idx > ($items.length -1)){
			idx = $items.length -1;
		}
		$items.eq(idx).addClass("current").siblings().removeClass("current");
		// log("target:",target);
		target.css({
			"transition": "all 0s linear",
			"-webkit-transform":"translate(0px,"+calcY+"px)",
			"transform":"translate(0px,"+calcY+"px)"
		});
		this.setTintClass(target,idx);

		return target.find(".current").attr("data-value");

	}
	setTintClass(targetPanel,idx){
		// let current = targetPanel.find(".current");
		let items = targetPanel.find(".s-item");
		items.addClass("tint");
		items.eq(idx).addClass("current").siblings().removeClass("current");
		items.eq(idx-1).removeClass("tint");
		items.eq(idx+1).removeClass("tint");
	}
	getComputeTranslateY(obj){
		let ret=0,style=obj.attr('style')||'';
		style=style.toLowerCase();
		try{
			if(style.indexOf('translate') != -1){
				ret=Number(style.split('translate(0px,')[1].split('px')[0]);
			}
			return ret;
		}catch(e){
			return Number(style.split('translate(0,')[1].split('px')[0]);
		}
	}

	lockWin(e){
		e.preventDefault();
		e.stopPropagation();
	}

	confirm(e){
		e.stopPropagation();
		e.preventDefault();
		let data = {
			"0":this.state.width || $(".widthPanel").find(".current").attr("data-value"),
			"1":this.state.ratio || $(".ratioPanel").find(".current").attr("data-value"),
			"2":this.state.size || $(".sizePanel").find(".current").attr("data-value")
		}
		let cb = this.props.onOk;
		cb && cb(data);
		this.setState({
			visible:false
		});
	}

	getDefault(widths,aspectRatios,sizes){
		let rst = [{text:"",index:0},{text:"",index:0},{text:"",index:0}];
		for(let i = 0; i < widths.length; i++){
			if(this.state.width !== "" && widths[i].text == this.state.width){
				rst[0] = {
					text:widths[i].text,
					index:i
				};
				break;
			}
		}
		for(let i = 0; i < aspectRatios.length; i++){
			if(this.state.aspectRatio !== "" && aspectRatios[i].text == this.state.aspectRatio){
				rst[1] = {
					text:aspectRatios[i].text,
					index:i
				};
				break;
			}
		}
		for(let i = 0; i < sizes.length; i++){
			if(this.state.size !== "" && sizes[i].text == this.state.size){
				rst[2] = {
					text:sizes[i].text,
					index:i
				};
				break;
			}
		}
		return rst;
	}
	preFilter(arr){
		let ret = arr;
		if(ret.length){
			if(arr[0].text != "全部"){
				ret.unshift({text:"全部",value:""});
			}
		}else{
			ret.unshift({text:"全部",value:""});
		}
		return ret;
	}
    render() {
		log("SizeSelect props:",this.props);
		let visible = this.state.visible;
		if(!visible){
			return <span />
		}

		let itemHeight = this.state.itemHeight;
		let widths = this.preFilter(this.state.widths || this.props.widths || []);
		let sizes = this.preFilter(this.state.sizes || this.props.sizes || []);
		let aspectRatios = this.preFilter(this.state.aspectRatios || this.props.aspectRatios || []);
		let df = this.getDefault(widths,aspectRatios,sizes);

        return (
			<div className="dropdown show" onClick={this.close.bind(this)} onTouchMove={this.lockWin.bind(this)}>
                <ul className="nav-drum" onClick={this.lockWin.bind(this)}>
					{(() => {
						if(widths){
							let dty = -df[0].index*itemHeight;
							return (
								<li>
									<div
									style={{"-webkit-transform":"translate(0px,"+dty+"px)","transform":"translate(0px,"+dty+"px)"}}
									className="widthPanel scroll-panel"
									onTouchMove={this.widthTouchMove.bind(this)}
									onTouchStart={this.touchStart.bind(this,"widthPanel")}
									onTouchEnd={this.touchEnd.bind(this,"widthPanel")}
									>

									{(() => {
										return widths.map((item,i) => {
											return <p className={"s-item "+(df[0].index == i?"current ":" ")+(Math.abs(df[0].index - i) > 1?"tint":"")} key={i} data-value={item.value}>{item.text === ""?"-":item.text}</p>
										});
									})()}

									</div>
			                    </li>
							)
						}
					})()}

					{(() => {

						if(aspectRatios){
							let dty = -df[1].index*itemHeight;
							return (
								<li>
									<div
									style={{"-webkit-transform":"translate(0px,"+dty+"px)","transform":"translate(0px,"+dty+"px)"}}
									className="ratioPanel scroll-panel"
									onTouchMove={this.ratioTouchMove.bind(this)}
									onTouchStart={this.touchStart.bind(this,"ratioPanel")}
									onTouchEnd={this.touchEnd.bind(this,"ratioPanel")}
									>

									{(() => {
										return aspectRatios.map((item,i) => {
											return <p className={"s-item "+(df[1].index == i?"current ":" ")+(Math.abs(df[1].index - i) > 1?"tint":"")} key={i} data-value={item.value}>{item.text === ""?"-":item.text}</p>
										});
									})()}
									</div>
			                    </li>
							)
						}

					})()}

					{(() => {
						if(sizes){
							let dty = -df[2].index*itemHeight;
							return (
								<li>
									<div
									style={{"-webkit-transform":"translate(0px,"+dty+"px)","transform":"translate(0px,"+dty+"px)"}}
									className="sizePanel scroll-panel"
									onTouchMove={this.sizeTouchMove.bind(this)}
									onTouchStart={this.touchStart.bind(this,"sizePanel")}
									onTouchEnd={this.touchEnd.bind(this,"sizePanel")}
									>

									{(() => {
										return sizes.map((item,i) => {
											return <p className={"s-item "+(df[2].index == i?"current ":" ")+(Math.abs(df[2].index - i) > 1?"tint":"")} key={item.text+i} data-value={item.value}>{item.text === ""?"-":item.text}</p>
										});
									})()}
									</div>
			                    </li>
							)
						}
					})()}

                </ul>
                <ul className="nav-type" onClick={this.lockWin.bind(this)}>
					{(() => {
						let subs = this.props.subs;
						return subs.map((item,i) => {
							return <li key={item.key+i}>{item.text}</li>
						});
					})()}
                </ul>
                <a className="icon-clear" onClick={this.confirm.bind(this)}>确定</a>
                <a className="iconfont icon-closebk" onClick={this.close.bind(this)} />
            </div>

        )

    }
}
