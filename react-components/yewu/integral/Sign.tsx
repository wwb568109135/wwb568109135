import * as api from "../../api";

export default class Sign extends Common.Warp<any, any> {
    constructor(props) {
        super(props);
        
    }

    // static mapStateToProps(state) {
    //     return {
    //         location: state.routing.locationBeforeTransitions
    //     }
    // }
    showSignPop(){
        Common.Event.publish('integral.signPop.show',{isShow: true});
    }
    content() {
       
        return (
           <i className="icon-sign" onClick={this.showSignPop.bind(this)}>签到</i>
        )
    }

}
