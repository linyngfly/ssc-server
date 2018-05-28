const ReqHandler = require('../../common/reqHandler');
const gateCmd = require('../../../cmd/gateCmd');

class GateHandler extends ReqHandler{}

module.exports = function () {
    let req = gateCmd.request;
    for(let k of Object.keys(req)){
        GateHandler.register(req[k].route.split('.')[2]);
    }
    return  new GateHandler();
};