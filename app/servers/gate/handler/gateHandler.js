const ReqHandler = require('../../common/reqHandler');
const gateCmd = require('../../../cmd/gateCmd');

class GateHandler extends ReqHandler{
    constructor(){
        super(omelo.app.entry);
    }
}

module.exports = function () {
    let req = gateCmd.request;
    let checkMap = new Map();
    for(let k of Object.keys(req)){
        let route = req[k].route.split('.')[2];
        let protocol = req[k].msg;
        GateHandler.register(route);
        let params = GateHandler.getParams(protocol);
        if(params){
            checkMap.set(route, params);
        }
    }
    let handler = new GateHandler();
    handler.checkMap = checkMap;
    return  handler;
};