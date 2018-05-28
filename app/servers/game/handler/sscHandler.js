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
    for(let k of Object.keys(req)){
        SscHandler.register(req[k].route.split('.')[2]);
    }
    return new SscHandler();
};


