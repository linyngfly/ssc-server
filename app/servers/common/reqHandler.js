const ERROR_OBJ = require('../../consts/error_code').ERROR_OBJ;

class ReqHandler {
    constructor(entry) {
        this._entry = entry;
    }

    static register(route) {
        let prototype = ReqHandler.prototype;
        prototype[route] = async function (msg, session, next) {
            msg.uid = msg.uid || session.uid;
            try{
                let resp = await this._entry.request(route, msg, session);
                utils.invokeCallback(next, null, resp || {Error:ERROR_OBJ.OK});
            }catch (err){
                utils.invokeCallback(next, null, {Error:err});
            }
        };
    }
}

module.exports = ReqHandler;