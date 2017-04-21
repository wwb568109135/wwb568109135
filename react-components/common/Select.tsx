import { Component} from 'react'

interface Props{
	visible?:boolean,
	defaultValue?:string|number|boolean,
	onChange?:(any)=>boolean|void,
	items?:Array<any>,
	onClose?:()=>void
}

interface states {
    visible:boolean
}

export default class Select extends Component<Props, states> {
    constructor(props) {
        super(props);
		this.state = {
			visible:this.props.visible || false
		}
    }
	componentWillReceiveProps(nextProps){
		this.setState({
			visible:nextProps.visible
		});
	}
	close(e?){
		e && e.stopPropagation();
		this.setState({
			visible:false
		});
		this.props.onClose && this.props.onClose();
	}
	onSelect(item,e){
		e.stopPropagation();
		let cb = this.props.onChange;
		cb && cb(item);
		this.close();
	}
    render() {

		let visible = this.state.visible;
		if(!visible){
			return <span />
		}
		let items = this.props.items || [];
		let defaultValue = this.props.defaultValue;
		if(!defaultValue && defaultValue !== false){
			defaultValue = ""
		}
        return (
			<div className="dropdown show" onClick={this.close.bind(this)}>
                <ul className="nav-list">
                    <li onClick={this.onSelect.bind(this,{text:"全部",value:""})} className={defaultValue === ""?"current":""} data-value="">
						<a>
							{defaultValue === ""?<i className="iconfont icon-check" />:""}
							全部
						</a>
					</li>
					{(() => {
						return items.map((item,i) => {
							let text = item.text;
							let value = item.value;
							log(6666666,defaultValue);
							log(8888888,value);
							return (
								<li key={value} onClick={this.onSelect.bind(this,item)} className={defaultValue === value?"current":""} data-value={value}>
									<a>{defaultValue === value?<i className="iconfont icon-check" />:""}{text}</a>
								</li>
							)
						});
					})()}
                </ul>
                <a className="iconfont icon-closebk" onClick={this.close.bind(this)} />
            </div>
        )

    }
}
