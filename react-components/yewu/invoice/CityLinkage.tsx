import {Component} from "react";


export default class CityLinkage extends Component<any, any> {

    constructor(props) {
        super(props)
        this.state={
            province: "广东省",
            city:"广州市",
            area:"海珠区"
        }
    }
    getDragonKillingSword(){
        //log(this.state.province,this.state.city,this.state.area)\
        let getDragonKillingSwordJson = {
            province:this.state.province,
            city:this.state.city,
            area:this.state.area
        }
        return getDragonKillingSwordJson
    }


    getProvince(name){
       for(var i =0;i<this.props.allpca.length;i++){
           if(this.props.allpca[i].name==name){
               return this.props.allpca[i];
           }
       }
     }
     getCity(province,cityname){
       for(var i =0;i<province.sub.length;i++){
           if(province.sub[i].name==cityname){
               return province.sub[i];
           }
       }
     }
     getSel(event){
        var targetname= event.target.getAttribute("name");
        if(targetname=="province"){
            var province=this.getProvince(event.target.value);
            // this.setState(function(state) {
            //     state.province=event.target.value;
            //     state.city=province.sub[0].name;
            //     state.area=province.sub[0].sub[0].name;
            //     return state;
            // })
            this.setState({
                province:event.target.value,
                city:province.sub[0].name,
                area:province.sub[0].sub[0].name
            })
        }
        else if(targetname=="city"){
            var province=this.getProvince(this.state.province);
            var city=this.getCity(province,event.target.value);
            // this.setState(function(state) {
            //     state.city=event.target.value;
            //     state.area=city.sub[0].name;
            //     return state;
            // })
            this.setState({
                city:event.target.value,
                area:city.sub[0].name
            })
        }else if(targetname=="area"){
            this.setState({
                area:event.target.value
            })
        }
    }

    render() {
        log(this)
        return (
            <div onChange={this.getSel.bind(this)}>
                <Province pname={this.state.province}  {...this.props}  />
                <City pname={this.state.province} cname={this.state.city} {...this.props} />
                <Area pname={this.state.province} cname={this.state.city} aname={this.state.area} {...this.props}/>
            </div>
        );
    }

}
class Province extends Component<any, any> {

    constructor(props) {
        super(props)
    }

    render () {
     var self=this;
     log(this)
      return (
          <select name="province" defaultValue={this.props.pname}>{
                this.props.allpca.map(function(pca){
                    return <option key={pca.name}  value={pca.name}>{pca.name}</option>;
                })
          }
          </select>
      );
    }

}

class City extends Component<any, any> {

    constructor(props) {
        super(props)
    }
    getProvince(name){
       for(var i =0;i<this.props.allpca.length;i++){
           if(this.props.allpca[i].name==name){
               return this.props.allpca[i];
           }
       }
     }
    getCity(province,cityname){
        for(var i =0;i<province.sub.length;i++){
            if(province.sub[i].name==cityname){
                return province.sub[i];
            }
        }
    }

    render () {
        let province=this.getProvince(this.props.pname);
        return (
            <select name="city" defaultValue={this.props.cname}>{
                province.sub.map(function(city){
                    return <option key={city.name}  value={city.name}>{city.name}</option>;
                })
            }
            </select>
        );
    }

}
class Area extends Component<any, any> {

    constructor(props) {
        super(props)
    }
    getProvince(name){
       for(var i =0;i<this.props.allpca.length;i++){
           if(this.props.allpca[i].name==name){
               return this.props.allpca[i];
           }
       }
     }
    getCity(province,cityname){
        for(var i =0;i<province.sub.length;i++){
            if(province.sub[i].name==cityname){
                return province.sub[i];
            }
        }
    }
    render () {
        var province=this.getProvince(this.props.pname);
        var city=this.getCity(province,this.props.cname);

        log("this.props.pname=>")
        log(this.props.pname)

        log("this.props.cname=>")
        log(this.props.cname)
        return (
            <select name="area" defaultValue={this.props.aname}>{
                city.sub.map(function(area){
                    return <option key={area.name}  value={area.name}>{area.name}</option>;
                })
            }
            </select>
        );
    }

}
