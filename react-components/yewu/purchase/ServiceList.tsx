/**
 * Created by roger on 16/6/27.
 */
import list_stands_by_id = serverApi.stand.list_stands_by_id;
import * as api from "../../api";
import {Alert} from "../common/Modal"

export default class ServiceList extends Common.Warp<{}, list_stands_by_id.Response> {
    constructor(props) {
        super(props);
        this.initState({
            standList: []
        });
    }

    loadData() {
        return api.stand.list_stands_by_id({ id: "service_list" });
    }

    content() {
        return (
            <div className="index-service">
                <ul>
                    {
                        this.state.standList.map((stand, i) =>
                            <li key={stand.desc}>
                                {(() => {
                                    if(stand.href){
                                        return (
                                            <Link to={stand.href}>
                                                <img src={util.getImgSrc(stand.imgSrc) } title={stand.desc} alt={stand.desc}/>
                                            </Link>
                                        )
                                    }else{
                                        return (
                                            <a onClick={()=>{Alert("敬请期待")}}>
                                                <img src={util.getImgSrc(stand.imgSrc) } title={stand.desc} alt={stand.desc}/>
                                            </a>
                                        )
                                    }
                                })()}

                            </li>
                        )
                    }
                </ul>
            </div>
        );
    }
}
