import { Component} from 'react'
import * as api from '../../api'
import {Modal,Alert} from '../common/Modal'
import Select from '../common/Select'
import SizeSelect from './SizeSelect'
import {config} from './FilterConf'

export default class ProductFilter extends Common.Warp<any, any> {
    constructor(props) {
        super(props);
        this.initState({
            type:this.props.type || "tyre",
            supplyId:this.props.supplyId || ""
        });
    }

    selectChangeHandler(select,item){
        if(select.type == "swipe"){
            let subs = select.subs;
            for(let i = 0; i < subs.length; i++){
                this.state[subs[i].key] = item[i];
            }
            this.state["show"+select.subs[0].key] = false;
        }else{
            this.state["show"+select.key] = false;
            this.state[select.key] = item.value;
        }

        if(select.influence){
            log("influence",select.influence);
            api.product.filterInfo({
                "supplyId":this.state.supplyId,
                "type": this.state.type,
                "attrKey":select.influence,
                "depend": [
                    {
                        "key": select.key,
                        "value":item.value
                    }
                ]
            }).then(res => {
                log("select change",res);
                for(let i = 0; i < res.itemList.length; i++ ){
					if(res.itemList[i].type == this.state.type){
						this.state[select.influence+"s"] = res.itemList[0].filters[0].option;
					}
				}
                this.state[select.influence] = "";
                this.forceUpdate();
                this.onChange();
            });
        }else{
            this.onChange();
            this.forceUpdate();
        }

    }

    showHandler(key,e){
        $(".purchase-list-top").attr("style","");
        for(let i in this.state){
            if(i.indexOf("show") > -1 && i.indexOf("_") == -1){
                this.state[i] = false;
            }
        }
        this.state["show"+key] = true;
        this.forceUpdate();
    }

    componentWillMount(){
        let type = this.state.type;

        log("config",config[type]);
        api.product.filterInfo({
            "supplyId":this.state.supplyId,
            "type":type
        }).then(res => {
            log("res:",res);
            let filter = res.itemList[0].filters;
            for(let i = 0; i < filter.length; i++){
                this.state[filter[i].key+"s"] = filter[i].option || [];
                this.state["show"+filter[i].key] = false;
            }
            this.setDefaultValue();
            this.setState({
                filter:filter
            });
        });
    }
    setDefaultValue(){
        let searchs = location.search.replace(/^\?/,"").split("&");
        searchs.map((search,i) => {
            let arr = search.split("=");
            let value:any = arr[1];
            if(value === "true"){
                value = true;
            }else if(value === "false"){
                value = false;
            }
            this.state[arr[0]] = value;
        });
        // let brandId = util.getParam("brandId");
        // brandId && (this.state.brandId = brandId);
    }
    onChange(){
        let cb = this.props.onChange;
        let arr = [];
        let selects = config[this.state.type].selects;
        let swipes = config[this.state.type].swipes?config[this.state.type].swipes:[];
        let searchs = [];

        for(let i = 0; i < selects.length; i++){
            const key = selects[i].key;
            const value = this.state[key];
            if(value || value === false){
                arr.push({"key":key,"value":value});
                searchs.push(key+"="+value);
            }
        }

        for(let i = 0; i < swipes.length; i++){
            let subs = swipes[i].subs || [];
            for(let j = 0; j < subs.length; j++){
                const key = subs[j].key;
                const value = this.state[key];
                if(value || value === false){
                    arr.push({"key":key,"value":value});
                    searchs.push(key+"="+value);
                }
            }
        }
        this.setUrlSearch(searchs);
        cb && cb(arr);

    }

    setUrlSearch(searchs){
        let search = "?type="+this.state.type+"&"+"supplyId="+util.getParam("supplyId")+"&"+searchs.join("&");
        util.gotoUrl(location.pathname + search);
    }

    closeSelects(key){
        this.state["show"+key] = false;
    }

    content() {
        log("state:",this.state);
        log("props:",this.props);
        let type = this.state.type;
        let selects = config[type].selects;
        let swipes = config[type].swipes || [];

        return (
            <div className="app-select">
                <ul>
                    {(() =>{
                        let types = [];

                        for(let pdType in config[type]){
                            types.push(pdType);
                        }

                        return types.map((pdType) => {
                            if(pdType == "selects"){
                                return selects.map((select,i) => {
                                    return (
                                        <li key={select.key + i} className={this.state[select.key] || this.state[select.key] === false?"current":""} onClick={this.showHandler.bind(this,select.key)}>
                                            {select.text}<i className="iconfont icon-arrow" />
                                            <Select
                                            visible={this.state["show"+select.key]}
                                            items={this.state[select.key+"s"]}
                                            defaultValue={this.state[select.key]}
                                            onChange={this.selectChangeHandler.bind(this,select)}
                                            onClose={this.closeSelects.bind(this,select.key)}
                                            />
                                        </li>
                                    )
                                });
                            }else if(pdType == "swipes"){
                                return swipes.map((swipe,i) => {
                                    let subs = swipe.subs;
                                    let select = subs[0];
                                    return (
                                        <li key={select.key + i} className={this.state[select.key]?"current":""} onClick={this.showHandler.bind(this,select.key)}>
                                            {swipe.text}<i className="iconfont icon-arrow" />
                                            <SizeSelect
                                            visible={this.state["show"+select.key]}
                                            onOk={this.selectChangeHandler.bind(this,swipe)}
                                            widths={subs[0]?this.state[subs[0].key+"s"]:[]}
                                            aspectRatios={subs[1]?this.state[subs[1].key+"s"]:[]}
                                            sizes={subs[2]?this.state[subs[2].key+"s"]:[]}
                                            defaultValue={{
                                                width:subs[0]?this.state[subs[0].key]:"0",
                                                aspectRatio:subs[1]?this.state[subs[1].key]:"0",
                                                size:subs[2]?this.state[subs[2].key]:"0"
                                            }}
                                            type={this.state.type}
                                            subs={subs}
                                            onClose={this.closeSelects.bind(this,select.key)}
                                            />
                                        </li>
                                    );
                                });
                            }
                        });
                    })()}

                </ul>
            </div>
        )

    }
}
