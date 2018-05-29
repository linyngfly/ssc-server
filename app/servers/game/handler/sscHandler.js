const ReqHandler = require('../../common/reqHandler');
const sscCmd = require('../../../cmd/sscCmd');
const omelo = require('omelo');

class SscHandler extends ReqHandler{
    constructor(){
        super(omelo.app.entry);
    }
}

module.exports = function () {
    let req = sscCmd.request;
    let checkMap = new Map();
    for(let k of Object.keys(req)){
        let route = req[k].route.split('.')[2];
        let protocol = req[k].msg;
        SscHandler.register(route);
        let params = SscHandler.getParams(protocol);
        if(params){
            checkMap.set(route, params);
        }
    }
    let handler = new SscHandler();
    handler.checkMap = checkMap;
    return new SscHandler();
};


