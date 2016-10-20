/**
 * Created by bear on 2016/7/12.
 */
import {Component} from "react";


interface Props {
    autoPlay?: boolean,
    delay?: number,
    showArrow: boolean,
    showDot: boolean,
    prev: string|JSX.Element,
    next: string|JSX.Element,
    children?: React.ReactNode
}

export default class Carousel extends Component<Props, any> {
    constructor(props) {
        super(props)
        this.state = {
            index: 0,
            count: 0,
            baseWidth: 0
        }
    }

    resetAutoplay(){
        const {autoPlay, delay} = this.props;
    }

    makeCarouselItem(children){
        const {baseWidth, index} = this.state;
        let itemNodes = [];

        let _len = React.Children.count(children);

        for(let i = -1; i <= _len; i++){
            let _index = i;
            let active = index === i ? '_active': '';
            if (_index === -1) _index = _len - 1;
            if (_index === _len) _index = 0;

            itemNodes.push(<div key={`carousel-item-${i}`}
                                style={{'width': baseWidth}}
                                className={`_item ${active}`}>
                                    {children[_index]}
                            </div>);
        }
        return itemNodes;
    }

    addTransition(callback){
        let contentDOM  = ReactDOM.findDOMNode(this.refs.contentDOM);
        contentDOM.className += ' _slide';
        setTimeout(() => {
            contentDOM.className = '_content';
            if (callback) callback.call(this, null);
        }, 500);
    }

    resetPosition(){
        const {index, count} = this.state;
        if (index === -1) this.setState({ index: count - 1 });

        if (index === count)  this.setState({ index: 0 });
    }

    handlePrev(){
        this.resetAutoplay();
        const {index, count} = this.state;
        if (index < count) {
            this.setState({
                index: index + 1
            }, () => this.addTransition(this.resetPosition) );
        }
    }

    handleNext(){
        this.resetAutoplay();
        const {index} = this.state;
        if (index >= 0) {
            this.setState({
                index: index - 1
            }, () => this.addTransition(this.resetPosition) );
        }
    }

    handleSlide(index){
        this.resetAutoplay();
        this.setState({
            index: parseInt(index)
        }, () => this.addTransition('') );
    }

    componentDidMount() {
        const base = ReactDOM.findDOMNode(this);
        this.setState({
            baseWidth: $(base).width()
        });
        this.resetAutoplay();
    }

    componentWillMount() {
        const {children} = this.props;
        if(children){
            this.setState({
                count: React.Children.count(children)
            });
        }
    }

    render() {
        const {prev, next, showArrow, showDot, children} = this.props;
        const {baseWidth, count, index} = this.state;

        let arrowNode = null;

        if (showArrow) {
            arrowNode = <div className="_arrow">
                            <div className="_prev" onClick={this.handlePrev}>
                                {prev}
                            </div>
                            <div className="_next" onClick={this.handleNext}>
                                {next}
                            </div>
                        </div>;
        }

        const contentNodes = this.makeCarouselItem(children);
        let dotNodes:any;

        if(showDot){
            for(let i = 0; i < count; i++){
                dotNodes.push(<a href="javascript:;" key={i}
                                className={index == i ? '_active _item' : '_item'}
                                onClick={() => this.handleSlide(i)}>
                                    &middot;
                            </a>);
            }
            dotNodes = <div className="_dot">
                            {dotNodes}
                        </div>;
        }

        const contentCss = {
            width: baseWidth * (count + 2),
            transform: `translate(-${baseWidth * (index + 1)}px, 0)`,
        }

        return (
            <div className='_carousel'>
                <div className="_content" ref='contentDOM' style={contentCss}>{contentNodes}</div>
                {dotNodes}
                {arrowNode}
            </div>
        );
    }
}
