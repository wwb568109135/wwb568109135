/**
 * Created by bear on 2016/7/06.
 */
import { Component } from "react";
import {render} from "react-dom";
require("../../otherJs/requestAnimationFrame");
require("../../otherJs/fly");


interface Props{
    pageX: string,
    pageY: string
}

export class CarEffect extends Component<Props, any> {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    effect(){
        let offset = $('.shopping-box').offset();
        let $this = $(this.refs.fly);

        $this['fly']({
            start: {
                left: this.props.pageX,
                top: this.props.pageY+20
            },
            end: {
                left: offset.left+10,
                top: offset.top+10,
                width: 0,
                height: 0
            },
            onEnd: (e)=>{
                $this.remove();
            }
        });
    }

    componentDidMount(){
        this.effect();
    }

    render(){
        return (
            <img ref="fly" className="fly-logo" src="/img/animation-car.png" />
        )
    }
}

export default function AddCarEffect(Props) {
    let effectBox = document.getElementById('_effectBox_');

    if($('.shopping-box').length == 0) return;

    if (!effectBox) {
        effectBox = document.createElement("div");
        effectBox.id = "_effectBox_";
        document.body.appendChild(effectBox);
    }

    render (<CarEffect pageX={Props.left} pageY={Props.top} />, effectBox);
}
