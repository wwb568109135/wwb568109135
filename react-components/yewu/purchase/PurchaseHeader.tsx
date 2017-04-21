/**
 * Created by roger on 16/7/8.
 * Modified by Cc on 16/7/27.
 */

import SlideList from "./SlideList";
import QuickNavList from "./QuickNavList";
import SeckillAd from "./SeckillAd";
import IntegralSign from "../../components/integral/Sign";
import * as promise from "promise";
import * as api from "../../api";
import has_promotion = serverApi.promotion.has_promotion;
import get_stand_by_id = serverApi.stand.get_stand_by_id;
import list_stands_by_id = serverApi.stand.list_stands_by_id;
import list_seckill_promotions = serverApi.promotion.list_seckill_promotions;

interface States {
    hasPromotion: boolean;
    secKillAd: get_stand_by_id.Response;
    slideListAds: list_stands_by_id.Response;
    list_seckill_promotions: list_seckill_promotions.Response;
}

export default class PurchaseHeader extends Common.Warp<{}, States> {
    needLoading = false;

    constructor(props) {
        super(props);
    }

    loadData() {
        return api.promotion.has_promotion({}).then((res) => {
            let standReqs;

            if (!res.hasPromotion) {
                standReqs = [ api.stand.get_stand_by_id({ id: "seckill_no_seckill" }),
                    api.stand.list_stands_by_id({ id: "slide_list" }),
                    api.promotion.list_seckill_promotions({
                        showPic: true // 采购首页返回带图片的数据
                    })
                ];
            } else {
                standReqs = [ api.stand.get_stand_by_id({ id: "seckill" }),
                    api.stand.list_stands_by_id({ id: "slide_list" }),
                    api.promotion.list_seckill_promotions({
                        showPic: true // 采购首页返回带图片的数据
                    })
                ];
            }

            return promise.all(standReqs as any).then((resps) => {
                let slideListAds: list_stands_by_id.Response = resps[1] as list_stands_by_id.Response;
                if (slideListAds.standList && slideListAds.standList.length > 0) {
                    if(slideListAds.standList.length==2){
                         slideListAds.standList.push(slideListAds.standList[0]);
                         slideListAds.standList.push(slideListAds.standList[1]);
                    }
                }

                return {
                    hasPromotion: res.hasPromotion,
                    secKillAd: resps[ 0 ],
                    slideListAds,
                    list_seckill_promotions: resps[2]
                };
            });
        });
    }

    content() {
        return (
            <div>
                <div className="header-index">
                    <h1 className="system-title">HTW⋅管家</h1>
                    <IntegralSign/>
                </div>
                <div className="mod-slide slide-index"><SlideList {...this.state.slideListAds}/></div>
                <div className="mas">
                    <QuickNavList hasPromotion={this.state.hasPromotion}/>
                    <SeckillAd {...this.state.list_seckill_promotions}/>
                </div>
            </div>
        );

    }
}
