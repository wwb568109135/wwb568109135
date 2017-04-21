/**
 * Created by bear on 2016/7/12.
 */
import {Component} from "react";
import {render} from "react-dom";
let ReactSwipe = require('react-swipe');


interface Props {
    photoIds: Array<string>,
    visible: boolean
}


export class Gallery extends Component<Props, any> {
    constructor(props) {
        super(props);
        this.state = {
            total: this.props.photoIds.length,
            count: 1,
            reactSwipeIndex: 0,
            visible: this.props.visible === false ? false : true
        }
    }

    close(){
        this.setState({
            visible: false
        });
    }

    stopPropagation(e){
        e.stopPropagation();
    }

    swipeOptions = {
        continuous: true,
        auto: 5000,
        callback: (i) => {
            this.setState({
                reactSwipeIndex: i,
                count: i+1
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        });
    }

    render() {
        let logos = this.props.photoIds || [];
        let visible = this.state.visible === false ? false : true;

        if (!this.state.visible) {
            return <span />
        }

        return (
            <div ref="popBox" className="mod-pop-box" onClick={this.close.bind(this)}>
                <div onClick={this.stopPropagation}>
                    <div className="gallery-box image-gallery-content">
                        <div className="image-gallery-slides">
                            <ReactSwipe swipeOptions={this.swipeOptions} >
                                {
                                    logos.map((item, index) => (
                                        <div className="slide-item"><img key={index} src={item}/></div>
                                    ))
                                }
                            </ReactSwipe>
                        </div>
                        <div className="image-gallery-bullets">
                            <ul className="image-gallery-bullets-container">
                            {
                                logos.map((item, index) => (
                                    <li key={index} className={this.state.reactSwipeIndex == index ? 'image-gallery-bullet active' : 'image-gallery-bullet'}></li>
                                ))
                            }
                            </ul>
                        </div>
                    </div>
                    <div className="gallery-fraction">{this.state.count} / {this.state.total}</div>
                </div>
            </div>
        )

    }
}

export function PopUp(Props) {
    if (typeof Props === "string") {
        Props = {
            photoIds: Props
        };
    }
    let galleryBox = document.getElementById('_galleryBox_');
    if (!galleryBox) {
        galleryBox = document.createElement("div");
        galleryBox.id = "_galleryBox_";
        document.getElementById("root").firstChild.appendChild(galleryBox);
    }
    render(
        <Gallery
            photoIds={Props.photoIds}
            visible={true}
        />, galleryBox);
}
