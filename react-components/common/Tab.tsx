import {Component} from "react";

interface props {
    links: {
        type: string,
        text: string,
        search?: string
    }[],
    location: any
}

export default class Tab extends Component<props, any> {
    constructor(props) {
        super(props);

        let location = this.props.location ? this.props.location : '';
        let type = location.query.type || 'all';
        let search = "";

        for( let key in location.query ){
            if(key!='type'){
                search += '&' + key + '=' + encodeURIComponent(location.query[key]);
            }
        }

        this.props.links.map((item)=>{
            item.search = 'type=' + item.type + search;
        })
    }
    static defaultProps = {
        location: '',
        links: []
    }
    render() {
        let location = this.props.location ? this.props.location : '';
        let type = location.query.type || 'all';

        return (
            <div className="app-tab">
                <ul>
                    {
                        this.props.links.map((item, index) => {
                            return (
                                <li key={index} className={
                                    type == item.type? 'current': ''
                                }>
                                    <Link to={`${location.pathname}?${item.search}`}>{item.text}</Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>

        )
    }
}
