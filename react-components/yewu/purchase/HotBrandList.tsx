/**
 * Created by roger on 16/6/27.
 */
import list_stands_by_id = serverApi.stand.list_stands_by_id;
import * as api from "../../api";


export default class HotBrandList extends Common.Warp<{}, list_stands_by_id.Response> {
    needLoading = false;
    constructor(props) {
        super(props);
        this.initState({
            standList: []
        });
    }

    loadData() {
        return api.stand.list_stands_by_id({id: "hot_brand_list"});
    }

    content() {
        return (
            <div className="mod-index hot-brand">
                <div className="mod-hd">
                    <i className="icon icon-hollow" />
                    <i className="icon icon-solid" />
                    <h3>热门品牌</h3>
                    <i className="icon icon-solid" />
                    <i className="icon icon-hollow" />
                </div>
                <div className="mod-bd">
                    <ul>
                        {this.state.standList.map((stand, i) =>
                            <li key={i}>
                                <Link to={stand.href}>
                                    <img src={util.getImgSrc(stand.imgSrc)} alt={stand.desc} />
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

        );
    }
}
