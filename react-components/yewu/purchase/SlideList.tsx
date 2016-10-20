/**
 * Created by roger on 16/6/30.
 */
import list_stands_by_id = serverApi.stand.list_stands_by_id;
import * as api from "../../api";
import {Component} from "react";
const ReactSwipe = require('react-swipe');

export default class SlideList extends Component<list_stands_by_id.Response, {curSlide: number}> {
    static defaultProps = {
        standList: [],
    };
    swipeOptions = {
        continuous: true,
        auto: 5000,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ReactSwipe swipeOptions={this.swipeOptions}>
                {
                    this.props.standList.map((stand, i) => {
                            if (stand.href) {
                                return <Link key={i} to={stand.href}><img src={util.getImgSrc(stand.imgSrc)} alt={stand.desc}/></Link>;

                            } else {
                                return <a key={i}><img src={util.getImgSrc(stand.imgSrc)} alt={stand.desc}/></a>;
                            }
                        }
                    )
                }
            </ReactSwipe>
        );
    }
}
