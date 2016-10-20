import {Component} from "react";

interface Props {
    totalCount: number
}

export default class ShoppingCart extends Component<Props, {}> {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        totalCount: 0
    }
    handleClick(e){
        e.preventDefault();
        Common.Event.publish('showPopCartList',{isShow: true});
    }
    render() {
        
        return (
           <a className="shopping-box" onClick={this.handleClick.bind(this)}>
               <i className="iconfont icon-shoppingcar"/>
               {
                   (()=>{
                       if(this.props.totalCount>0 && this.props.totalCount<100){
                           return <i className="num">{this.props.totalCount}</i>
                       }

                       if(this.props.totalCount>99){
                           return <i className="num">99+</i>
                       }
                   })()
               }
           </a>
        )
    }
}
