const omelo = require('omelo');
const ERROR_OBJ = require('../../consts/error_code').ERROR_OBJ;

class ReqHandler {
    constructor(entry) {
        this._entry = entry;
    }

    static register(name) {
        let prototype = ReqHandler.prototype;
        prototype[name] = function (msg, session, next) {
            msg.uid = msg.uid || session.uid;
            this.request(name, msg, session, next);
        };
    }

    request(route, msg, session, next) {
        try{
            this._entry.request(route, msg, session, (err, result)=>{
                this.response(err, result, next);
            });
        }catch (err){
            this.response(err, null, next);
        }
    }

    response(err, result, next) {
        if (err) {
            utils.invokeCallback(next, null, {Error:err});
            return;
        }
        if (result) {
            utils.invokeCallback(next, null, result || {Error:ERROR_OBJ.OK});
        } else {
            utils.invokeCallback(next, null, {Error:ERROR_OBJ.OK});
        }
    }
}

module.exports = ReqHandler;